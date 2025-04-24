/* const Message = require('../Models/messageModel');

const chatController = {
    sendMessage: async (req, res) => {
        try {
            const { chatType, sender, receiver, text, communityId, coachId } = req.body;
            let chat;

            if (chatType === 'Community') {
                chat = await Message.findOne({ communityId });
            } else if (chatType === 'Coach') {
                chat = await Message.findOne({ coachId });
            } else {
                chat = await Message.findOne({
                    chatType: 'Personal',
                    participants: { $all: [sender, receiver] }
                });
            }

            if (!chat) {
                chat = new Message({
                    chatType,
                    participants: chatType === 'Community' ? [sender] : [sender, receiver],
                    communityId,
                    coachId
                });
            }

            chat.messages.push({ sender, text });
            await chat.save();

            res.status(200).json(chat);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    getMessages: async (req, res) => {
        try {
            const { chatType, communityId, coachId, sender, receiver } = req.body;
            let chat;

            if (chatType === 'Community') {
                chat = await Message.findOne({ communityId })
            } else if (chatType === 'Coach') {
                chat = await Message.findOne({ coachId })
            } else {
                chat = await Message.findOne({
                    chatType: 'Personal',
                    participants: { $all: [sender, receiver] }
                })
            }

            if (!chat) {
                return res.status(404).json({ msg: 'No Messages Found' });
            }

            res.status(200).json(chat);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = chatController;
 */

const Message = require('../Models/messageModel');
const { io } = require('../server'); // Import io from server.js

const chatController = {
    sendMessage: async (req, res) => {
        try {
            const { chatType, sender, receiver, text, communityId, coachId } = req.body;
            let chat;

            if (chatType === 'Community') {
                chat = await Message.findOne({ communityId });
            } else if (chatType === 'Coach') {
                chat = await Message.findOne({ coachId });
            } else {
                chat = await Message.findOne({
                    chatType: 'Personal',
                    participants: { $all: [sender, receiver] }
                });
            }

            if (!chat) {
                chat = new Message({
                    chatType,
                    participants: chatType === 'Community' ? [sender] : [sender, receiver],
                    communityId,
                    coachId
                });
            }

            const newMessage = { sender, text };
            chat.messages.push(newMessage);
            await chat.save();

            // Emit Socket Event
            io.emit('receiveMessage', newMessage);

            res.status(200).json(chat);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    getMessages: async (req, res) => {
        try {
            const { chatType, communityId, coachId, sender, receiver } = req.body;
            let chat;

            if (chatType === 'Community') {
                chat = await Message.findOne({ communityId })
                    .populate('messages.sender', 'name avatar');
            } else if (chatType === 'Coach') {
                chat = await Message.findOne({ coachId })
                    .populate('messages.sender', 'name avatar');
            } else {
                chat = await Message.findOne({
                    chatType: 'Personal',
                    participants: { $all: [sender, receiver] }
                }).populate('messages.sender', 'name avatar');
            }

            if (!chat) {
                return res.status(404).json({ msg: 'No Messages Found' });
            }

            res.status(200).json(chat);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = chatController;
