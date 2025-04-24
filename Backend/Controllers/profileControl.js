const UserProfile = require('../Models/profileModel');
const UserAuth = require('../Models/userAuthModel');
const upload = require('../Middleware/multer');
const fs = require('fs');
const path = require('path');


const profileControl = {

    getProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const requesterId = req.user?.id; // You should have this from auth middleware

            const profile = await UserProfile.findOne({ userId })
                .populate('communities', 'name avatar')
                .populate({
                    path: 'coaches',
                    select: 'name avatar'
                })
                .populate({
                    path: 'following',
                    select: 'name avatar'
                })
                .populate({
                    path: 'followers',
                    select: 'name avatar'
                });

            if (!profile) return res.status(404).json({ message: 'Profile not found' });

            let result = profile.toObject();

            // 🧠 Hide sensitive stuff if profile is private and requester is not the owner
            const isOwner = requesterId === String(profile.userId);
            if (!profile.isPublic && !isOwner) {
                delete result.communities;
                delete result.coaches;
                delete result.posts; // Assuming you link posts somewhere
            }

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.params.id;

            // Handle avatar file upload (if any)
            upload.single('avatar')(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error uploading file', error: err.message });
                }

                const {
                    name,
                    bio,
                    sports,
                    location,
                    facebook,
                    instagram,
                    twitter,
                    achievements
                } = req.body;

                // Parse achievements to array if it's a string
                const parsedAchievements = achievements ? JSON.parse(achievements) : [];

                // Find the user profile first
                const userProfile = await UserProfile.findOne({ userId });

                if (!userProfile) {
                    return res.status(404).json({ message: 'Profile not found' });
                }

                // Prepare the update object, but only update non-empty fields
                const updates = {};

                if (name) updates.name = name;
                if (bio) updates.bio = bio;
                if (location) updates.location = location;
                if (sports && Array.isArray(sports)) updates.sports = sports;

                // Handle social links
                const socialLinks = {};
                if (facebook) socialLinks.facebook = facebook;
                if (instagram) socialLinks.instagram = instagram;
                if (twitter) socialLinks.twitter = twitter;
                if (Object.keys(socialLinks).length > 0) updates.socialLinks = socialLinks;

                // If new achievements are provided, append them to the existing ones
                if (parsedAchievements && Array.isArray(parsedAchievements)) {
                    const updatedAchievements = [...userProfile.achievements, ...parsedAchievements];
                    updates.achievements = updatedAchievements;
                }

                // If an avatar is uploaded, add it to the updates object
                if (req.file) {
                    updates.avatar = req.file.path;  // Store the file path (you can also use the filename)
                }

                // Update the profile in the database
                const updatedProfile = await UserProfile.findOneAndUpdate(
                    { userId },
                    { $set: updates },
                    { new: true, runValidators: true }
                );

                if (!updatedProfile) {
                    return res.status(404).json({ message: 'Profile not found' });
                }

                res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    uploadProfileImage: async (req, res) => {
        try {
            const userId = req.user.id;

            // Check if image was uploaded
            if (!req.file) {
                return res.status(400).json({ message: "No image uploaded" });
            }

            const imageUrl = `/uploads/${req.file.filename}`; // Save as relative path

            const profile = await UserProfile.findOne({ userId });
            if (!profile) return res.status(404).json({ message: "Profile not found" });

            profile.images.push(imageUrl); // Push to 'images' array
            await profile.save();

            res.status(200).json({
                message: "Image uploaded and saved to profile successfully",
                imageUrl,
                images: profile.images,
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },

    deletePost: async (req, res) => {
        const { userId } = req.params;
        const { imageUrl } = req.body;

        try {
            const profile = await UserProfile.findOneAndUpdate(
                { userId: userId },
                { $pull: { images: imageUrl } },
                { new: true }
            );

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            const filePath = path.join(__dirname, '..', 'public', 'uploads', imageUrl.replace('/uploads/', ''));

            // Delete the image file from the server
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete image file:', err);
                    return res.status(500).json({ message: 'Error deleting image file' });
                }

                console.log('Image file deleted successfully!');
            });

            res.status(200).json({ message: 'Image removed successfully', profile });
        } catch (error) {
            console.error('Error deleting image:', error);
            res.status(500).json({ message: 'Failed to delete image' });
        }
    },

    deleteProfile: async (req, res) => {
        try {
            const userId = req.params.id;

            const deletedProfile = await UserProfile.findOneAndDelete({ _id: userId });

            if (!deletedProfile) return res.status(404).json({ message: 'Profile not found' });

            await UserAuth.findOneAndDelete({ profileId: userId });

            res.status(200).json({ message: 'Profile and user account deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    buildConnection: async (req, res) => {
        try {
            const { targetUserId } = req.body;
            const userId = req.user.id;

            if (userId === targetUserId) {
                return res.status(400).json({ message: 'You cannot follow yourself' });
            }

            const userProfile = await UserProfile.findOne({ userId: userId });
            const targetProfile = await UserProfile.findOne({ userId: targetUserId });

            if (!userProfile || !targetProfile) {
                return res.status(404).json({ message: 'One or both users not found' });
            }

            const isFollowing = userProfile.following?.includes(targetUserId);

            if (isFollowing) {
                // Unfollow Logic
                userProfile.following.pull(targetUserId);
                targetProfile.followers.pull(userId);
                await userProfile.save();
                await targetProfile.save();
                return res.status(200).json({ message: 'Unfollowed successfully' });
            }

            // Follow Logic
            userProfile.following.push(targetUserId);
            targetProfile.followers.push(userId);
            await userProfile.save();
            await targetProfile.save();

            res.status(200).json({ message: 'Followed successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getFollowers: async (req, res) => {
        try {
            const userId = req.params.id;
            const profile = await UserProfile.findOne({ userId: userId })
                .populate({
                    path: 'followers',
                    select: 'profileId',
                    populate: {
                        path: 'profileId',
                        select: 'name avatar'
                    }
                });

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            res.status(200).json({ followers: profile.followers });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getFollowing: async (req, res) => {
        try {
            const userId = req.params.id;
            const profile = await UserProfile.findOne({ userId: userId })
                .populate({
                    path: 'following',
                    select: 'profileId',
                    populate: {
                        path: 'profileId',
                        select: 'name avatar'
                    }
                });

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            res.status(200).json({ following: profile.following });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

}
module.exports = profileControl;
