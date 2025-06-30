import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    connect() {
        if (this.socket && this.isConnected) {
            return this.socket;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found for socket connection');
            return null;
        }

        this.socket = io('http://localhost:5000', {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            this.isConnected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.isConnected = false;
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    joinChat(chatData) {
        if (this.socket && this.isConnected) {
            this.socket.emit('joinChat', chatData);
        }
    }

    sendMessage(messageData) {
        if (this.socket && this.isConnected) {
            this.socket.emit('sendMessage', messageData);
        }
    }

    onReceiveMessage(callback) {
        if (this.socket) {
            this.socket.on('receiveMessage', callback);
        }
    }

    onMessageSent(callback) {
        if (this.socket) {
            this.socket.on('messageSent', callback);
        }
    }

    onUserTyping(callback) {
        if (this.socket) {
            this.socket.on('userTyping', callback);
        }
    }

    onUserStopTyping(callback) {
        if (this.socket) {
            this.socket.on('userStopTyping', callback);
        }
    }

    onError(callback) {
        if (this.socket) {
            this.socket.on('error', callback);
        }
    }

    emitTyping(chatId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('typing', { chatId });
        }
    }

    emitStopTyping(chatId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('stopTyping', { chatId });
        }
    }

    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }
}

const socketService = new SocketService();
export default socketService; 