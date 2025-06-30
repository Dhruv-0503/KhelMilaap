const Message = require('../Models/messageModel');
const User = require('../Models/userAuthModel');
const jwt = require('jsonwebtoken');

const handleSocket = (io) => {
    // Middleware for socket authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            socket.userId = decoded.userId;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id} (User ID: ${socket.userId})`);

        // Join user's personal room
        socket.join(`user_${socket.userId}`);

        // Join a specific chat room
        socket.on('joinChat', async (data) => {
            const { chatType, otherUserId, communityId, coachId } = data;
            let chatId;

            if (chatType === 'Personal') {
                // Create or find personal chat
                let chat = await Message.findOne({
                    chatType: 'Personal',
                    participants: { $all: [socket.userId, otherUserId], $size: 2 }
                });

                if (!chat) {
                    chat = new Message({
                        chatType: 'Personal',
                        participants: [socket.userId, otherUserId]
                    });
                    await chat.save();
                }
                chatId = chat._id;
            } else if (chatType === 'Community') {
                let chat = await Message.findOne({ communityId });
                if (!chat) {
                    chat = new Message({
                        chatType: 'Community',
                        participants: [socket.userId],
                        communityId
                    });
                    await chat.save();
                }
                chatId = chat._id;
            } else if (chatType === 'Coach') {
                let chat = await Message.findOne({ coachId });
                if (!chat) {
                    chat = new Message({
                        chatType: 'Coach',
                        participants: [socket.userId],
                        coachId
                    });
                    await chat.save();
                }
                chatId = chat._id;
            }

            socket.join(`chat_${chatId}`);
            socket.currentChatId = chatId;
            console.log(`User ${socket.userId} joined chat: ${chatId}`);
        });

        // Handle sending messages
        socket.on('sendMessage', async (data) => {
            try {
                const { text, chatType, receiverId, communityId, coachId } = data;
                
                let chat;
                if (chatType === 'Personal') {
                    chat = await Message.findOne({
                        chatType: 'Personal',
                        participants: { $all: [socket.userId, receiverId] }
                    });
                } else if (chatType === 'Community') {
                    chat = await Message.findOne({ communityId });
                } else if (chatType === 'Coach') {
                    chat = await Message.findOne({ coachId });
                }

                if (!chat) {
                    return socket.emit('error', { message: 'Chat not found' });
                }

                // Add message to chat, always set sender
                const newMessage = {
                    sender: socket.userId,
                    text: text,
                    timestamp: new Date(),
                    tempId: data.tempId || undefined
                };

                chat.messages.push(newMessage);
                await chat.save();

                // Manually construct the message object with sender details
                const user = await User.findById(socket.userId).select('name avatar').lean();
                const lastMessage = chat.messages[chat.messages.length - 1];

                const messageToEmit = {
                    ...lastMessage.toObject(),
                    sender: {
                        _id: user._id,
                        name: user.name,
                        avatar: user.avatar
                    }
                };

                io.to(`chat_${chat._id}`).emit('receiveMessage', {
                    chatId: chat._id,
                    message: messageToEmit,
                    chatType: chatType
                });

                socket.emit('messageSent', {
                    chatId: chat._id,
                    message: messageToEmit
                });

            } catch (err) {
                console.error('Message Error:', err);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle typing indicators
        socket.on('typing', (data) => {
            socket.to(`chat_${data.chatId}`).emit('userTyping', {
                userId: socket.userId,
                chatId: data.chatId
            });
        });

        socket.on('stopTyping', (data) => {
            socket.to(`chat_${data.chatId}`).emit('userStopTyping', {
                userId: socket.userId,
                chatId: data.chatId
            });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id} (User ID: ${socket.userId})`);
        });
    });
};

module.exports = handleSocket;
