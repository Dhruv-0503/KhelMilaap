const Community = require('../Models/communityModel');
const UserProfile = require('../Models/profileModel');
const Message = require('../Models/messageModel');
const upload = require('../Middleware/multer');
const path = require('path');

const communityControl = {

    // Create Community
    createCommunity: async (req, res) => {
        upload.single('avatar')(req, res, async (err) => {
            try {
                if (err) {
                    return res.status(500).json({ message: 'Error uploading avatar', error: err.message });
                }
                
                const { name, description, sport } = req.body;
                const userId = req.user.id;
                let avatarUrl = null;

                // If avatar is uploaded, save its path
                if (req.file) {
                    avatarUrl = req.file.path; // Path to the uploaded avatar
                }

                // Create a new community object with the provided data
                const newCommunity = new Community({
                    name,
                    description,
                    sport,
                    leader: userId,
                    members: [userId],
                    avatar: avatarUrl // Store the avatar path in the community document
                });

                // Save the new community to the database
                await newCommunity.save();

                // Add the new community to the user's profile
                await UserProfile.findOneAndUpdate(
                    { userId },
                    { $push: { communities: newCommunity._id } }
                );

                res.status(201).json({ message: 'Community created successfully', community: newCommunity });
            } catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
        });
    },

    // Get All Communities
    getAllCommunities: async (req, res) => {
        try {
            const userId = req.query.userId;
            const communities = await Community.find()
                .select('name description avatar sport members') // Only select fields needed for listing

            const formattedCommunities = communities.map(community => {
                const isJoin = community.members.includes(userId); // ✅ Check if userId is in members array

                return {
                    _id: community._id,
                    name: community.name,
                    avatar: community.avatar,
                    description: community.description,
                    sport: community.sport,
                    membersCount: community.members.length,
                    isJoin: isJoin
                };
            });

            res.status(200).json({ communities: formattedCommunities });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    // Join Community
    joinCommunity: async (req, res) => {
        try {
            const { communityId } = req.body;
            const userId = req.user.id;
            const community = await Community.findById(communityId);
            if (!community) return res.status(404).json({ message: 'Community not found' });

            if (community.members.includes(userId)) {
                return res.status(400).json({ message: 'You are already a member' });
            }

            community.members.push(userId);
            await community.save();

            await UserProfile.findOneAndUpdate(
                { userId },
                { $push: { communities: communityId } }
            );

            res.status(200).json({ message: 'Joined community successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    // Get Community Details with Messages
    getCommunityDetails: async (req, res) => {
        try {
            const { communityId } = req.params;

            const community = await Community.findById(communityId)
                .populate({
                    path: 'leader',
                    select: 'profileId',
                    populate: { path: 'profileId', select: 'name avatar' }
                })
                .populate({
                    path: 'members',
                    select: 'profileId',
                    populate: { path: 'profileId', select: 'name avatar' }
                });

            if (!community) {
                return res.status(404).json({ message: 'Community not found' });
            }

            const messages = await Message.find({ communityId })
                .populate({
                    path: 'messages.sender',
                    populate: { path: 'profileId', select: 'name avatar' }
                });

            res.status(200).json({ community, messages });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    // Leave Community
    leaveCommunity: async (req, res) => {
        try {
            const { communityId } = req.body;
            const userId = req.user.id;

            const community = await Community.findById(communityId);
            if (!community) return res.status(404).json({ message: 'Community not found' });

            if (!community.members.includes(userId)) {
                return res.status(400).json({ message: 'You are not a member' });
            }

            community.members.pull(userId);
            await community.save();

            await UserProfile.findOneAndUpdate(
                { userId },
                { $pull: { communities: communityId } }
            );

            res.status(200).json({ message: 'Left the community successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    // Delete Community (Only Leader Can Delete)
    deleteCommunity: async (req, res) => {
        try {
            const { communityId } = req.params;
            const userId = req.user.id;

            const community = await Community.findById(communityId);
            if (!community) return res.status(404).json({ message: 'Community not found' });

            if (community.leader.toString() !== userId) {
                return res.status(403).json({ message: 'You are not authorized to delete this community' });
            }

            await Community.findByIdAndDelete(communityId);

            await UserProfile.updateMany(
                { communities: communityId },
                { $pull: { communities: communityId } }
            );

            await Message.deleteMany({ communityId });

            res.status(200).json({ message: 'Community deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
};

module.exports = communityControl;
