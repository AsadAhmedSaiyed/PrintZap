require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for MVP, restrict in Prod
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/printzap')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('🔌 New Client Connected:', socket.id);

    // Shop Identification (Shop joins its personal room)
    socket.on('join_shop', (shopId) => {
        socket.join(shopId);
        console.log(`Shop ${shopId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

// Make io accessible in routes
app.set('io', io);

// Routes Placeholder
app.use('/api/webhook', require('./routes/webhookRoutes'));
app.use('/api', require('./routes/shopRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
