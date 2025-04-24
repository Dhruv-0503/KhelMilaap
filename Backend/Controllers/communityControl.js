/* const Community = require('../Models/communityModel');
const UserProfile = require('../Models/profileModel');
const Message = require('../Models/messageModel');
const User = require('../Models/userAuthModel');

const communityControl = {

    createCommunity: async (req, res) => {
        try {
            const { name, description } = req.body;
            const userId = req.user.id;

            // Create new community
            const newCommunity = new Community({
                name,
                description,
                leader: userId,
                members: [userId]
            });

            await newCommunity.save();

            // Update the UserProfile model, add the community to the user's profile
            await UserProfile.findOneAndUpdate(
                { userId: userId },
                { $push: { communities: newCommunity._id } }
            );

            res.status(201).json({ message: 'Community created successfully', community: newCommunity });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    joinCommunity: async (req, res) => {
        try {
            const { userId, communityId } = req.body;

            const community = await Community.findById(communityId);
            if (!community) return res.status(404).json({ message: 'Community not found' });

            // Ensure the user is not already a member
            if (community.members.includes(userId)) {
                return res.status(400).json({ message: 'You are already a member' });
            }

            // Add user to community's members
            community.members.push(userId);
            await community.save();

            // Add community to user's profile communities array
            await UserProfile.findOneAndUpdate(
                { userId: userId },
                { $push: { communities: communityId } }
            );

            res.status(200).json({ message: 'Joined community successfully', community });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    sendMessage: async (req, res) => {
        try {
            const { communityId, sender, text, image } = req.body;

            // Check if a message entry exists for the community
            let messageEntry = await Message.findOne({ communityId: communityId });

            if (!messageEntry) {
                // If no entry exists, create a new one
                messageEntry = new Message({
                    communityId,
                    messages: [{ sender, text, image, timestamp: new Date() }]
                });
            } else {
                // If entry exists, push the new message to the messages array
                messageEntry.messages.push({ sender, text, image, timestamp: new Date() });
            }

            await messageEntry.save();

            res.status(201).json({ message: 'Message sent successfully', messageEntry });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    getCommunityMessages: async (req, res) => {
        try {
            const { communityId } = req.params;

            const messageEntry = await Message.findOne({ communityId: communityId })

            if (!messageEntry || messageEntry.messages.length === 0) {
                return res.status(404).json({ message: 'No messages found for this community' });
            }

            res.status(200).json({ messages: messageEntry.messages });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    getCommunityDetails: async (req, res) => {
        try {
            const { communityId } = req.params;
    
            // Fetch community details
            const community = await Community.findById(communityId)
            .populate({
                path : 'leader',
                select : 'profileId',
                populate:{
                    path: 'profileId',
                    select : 'name avatar'
                } 
            })
            .populate({
                path : 'members',
                select : 'profileId',
                populate:{
                    path: 'profileId',
                    select : 'name avatar'
                } 
            })
    
            if (!community) {
                return res.status(404).json({ message: 'Community not found' });
            }
    
            // Fetch messages separately from Message model
            const messages = await Message.find({ communityId })
            .populate({
                path: 'messages.sender',
                select : 'profileId', // 1. Populate the sender in each message
                populate: {
                    path: 'profileId', // 2. Populate the profileId in the sender (profileId is a reference to UserProfiles)
                    select: 'name avatar' // 3. Select only the name from the profileId
                }
            })
    
            res.status(200).json({ community, messages });
        } 
        catch (error) {
            res.status(500).json({ msg : error.message});
        }
    },

    updateCommunity: async (req, res) => {
        try {
            const { communityId } = req.params;
            const updates = req.body;

            const updatedCommunity = await Community.findByIdAndUpdate(
                communityId,
                { $set: updates },
                { new: true, runValidators: true }
            );

            if (!updatedCommunity) {
                return res.status(404).json({ message: 'Community not found' });
            }

            res.status(200).json({ message: 'Community updated successfully', updatedCommunity });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    leaveCommunity: async (req, res) => {
        try {
            const { userId, communityId } = req.body;

            const community = await Community.findById(communityId);
            if (!community) return res.status(404).json({ message: 'Community not found' });

            // Ensure the user is a member of the community
            if (!community.members.includes(userId)) {
                return res.status(400).json({ message: 'You are not a member of this community' });
            }

            // Remove user from community's members
            community.members.pull(userId);
            await community.save();

            // Remove community from user's profile
            await UserProfile.findOneAndUpdate(
                { userId: userId },
                { $pull: { communities: communityId } }
            );

            res.status(200).json({ message: 'Left the community successfully', community });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    deleteCommunity: async (req, res) => {
        try {
            const { communityId } = req.params;
            const userId = req.user.id;

            const community = await Community.findById(communityId);
    
            if (!community) {
                return res.status(404).json({ message: 'Community not found' });
            }
 
            if (community.leader.toString() !== userId) {
                return res.status(403).json({ message: 'You are not authorized to delete this community' });
            }
  
            await Community.findByIdAndDelete(communityId);

            await UserProfiles.updateMany(
                { communities: communityId },
                { $pull: { communities: communityId } }
            );
  
            await User.updateMany(
                { communities: communityId },
                { $pull: { communities: communityId } }
            );
   
            await Message.deleteMany({ communityId });
    
            res.status(200).json({ message: 'Community deleted successfully and removed from all users & profiles' });
        } 
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
    

};

module.exports = communityControl;
 */

const Community = require('../Models/communityModel');
const UserProfile = require('../Models/profileModel');
const Message = require('../Models/messageModel');

const communityControl = {

    // Create Community
    createCommunity: async (req, res) => {
        try {
            const { name, description } = req.body;
            const userId = req.user.id;

            const newCommunity = new Community({
                name,
                description,
                leader: userId,
                members: [userId]
            });

            await newCommunity.save();

            await UserProfile.findOneAndUpdate(
                { userId },
                { $push: { communities: newCommunity._id } }
            );

            res.status(201).json({ message: 'Community created successfully', community: newCommunity });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    // Join Community
    joinCommunity: async (req, res) => {
        try {
            const {communityId} = req.body;
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
                    select : 'profileId',
                    populate: { path: 'profileId', select: 'name avatar' }
                })
                .populate({
                    path: 'members',
                    select : 'profileId',
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
            const {communityId} = req.body;
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
