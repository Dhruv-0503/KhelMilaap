const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserAuth = require('../Models/userAuthModel');
const UserProfile = require('../Models/profileModel');
const { OAuth2Client } = require('google-auth-library'); 
require('dotenv').config();

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
});

const userAuthControl = {

    registerUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            let existingUser = await UserAuth.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'User already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);

            const newProfile = new UserProfile({ name, role});
            await newProfile.save();

            const newUser = new UserAuth({
                email,
                password: hashedPassword,
                profileId: newProfile._id
            });

            await newUser.save();
            
            newProfile.userId = newUser._id;
            await newProfile.save();

            res.status(201).json({ message: 'User registered successfully' });

        } 
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await UserAuth.findOne({ email });
            if (!user) return res.status(400).json({ message: 'Invalid email or password' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({ token, userId: user._id, profileId: user.profileId });

        } 
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    googleAuth: async (req, res) => {
        try {
            const { code } = req.body;
    
            if (!code) {
                return res.status(400).json({ message: 'Missing authorization code' });
            }
    
            let tokens;
            try {
                const response = await client.getToken({
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                });
                tokens = response.tokens;
            } catch (error) {
                console.error('Token exchange failed:', error.response?.data || error);
                return res.status(500).json({ message: 'Token exchange failed', error: error.message });
            }
    
            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
    
            const payload = ticket.getPayload();
            const { email, name, sub: googleId } = payload;
    
            if (!email || !googleId) {
                return res.status(400).json({ message: 'Invalid Google token payload' });
            }
    
            let user = await UserAuth.findOne({ email });
    
            if (!user) {
                const newProfile = new UserProfile({ name });
                await newProfile.save();
    
                user = new UserAuth({
                    email,
                    googleId,
                    profileId: newProfile._id,
                });
                await user.save();
            }
    
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
            res.status(200).json({
                token,
                userId: user._id,
                profileId: user.profileId,
                name,
                email,
            });
        } catch (error) {
            console.error('Google Auth Error:', error);
            res.status(500).json({ message: 'Google authentication failed', error: error.message });
        }
    },

    logoutUser: async (req, res) => {
        try {
            res.json({ message: 'Logged out successfully' });

        }
        catch (error) {
            res.status(500).json({ message: 'Logout failed', error });
        }
    }
}

module.exports = userAuthControl;
