const jwt = require('jsonwebtoken');
const UserAuth = require('../Models/userAuthModel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        const user = await UserAuth.findById(decoded.userId).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        req.user = user; 
        next();
    } 
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
