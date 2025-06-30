const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;
require('dotenv').config();
const userAuthRoutes = require("./Routes/userAuthRoutes");
const profileRoutes = require("./Routes/profileRoutes");
const communityRoutes = require("./Routes/communityRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const coachRoutes = require("./Routes/coachRoutes");

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(cors({
    origin: 'http://localhost:5173',  // Ensure your frontend URL is correct
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Add COOP and COEP headers for Google OAuth compatibility
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// Routes
app.use("/api/users", userAuthRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/coach", coachRoutes);

// MongoDB Connection
const URI = process.env.MONGODB_URL;
mongoose.connect(URI).then(() => {
    console.log('MongoDB Connected...');
}).catch(err => {
    console.log('MongoDB Connection Error:', err);
});

// Initialize Socket Service
const handleSocket = require('./Services/socketService');
handleSocket(io);

server.listen(PORT, () => {
    console.log('Server Running On PORT', PORT);
});

module.exports = { app, io };
