const Message = require('../Models/messageModel');

const handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('sendMessage', async (data) => {
            try {
                const message = await Message.findById(data.chatId);
                if (message) {
                    message.messages.push({
                        sender: data.senderId,
                        text: data.text
                    });
                    await message.save();

                    io.emit('receiveMessage', data);
                }
            } catch (err) {
                console.error('Message Error:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = handleSocket;
