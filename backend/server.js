const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config/config');
const logger = require('./utils/logger');
const app = require('./app');

// 1. Database Connection
mongoose.connect(config.mongo.uri)
    .then(() => logger.info('✅ MongoDB Connected'))
    .catch(err => {
        logger.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// 2. Server & Socket Setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Make io accessible globally via app
app.set('io', io);

io.on('connection', (socket) => {
    logger.info(`🔌 Client Connected: ${socket.id}`);

    socket.on('join_shop', (shopId) => {
        socket.join(shopId);
        logger.info(`Shop ${shopId} joined room`);
    });

    socket.on('disconnect', () => {
        // Disconnect logic
    });
});

// 3. Start Server
const PORT = config.port || 5000;
server.listen(PORT, () => {
    logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
});

// 4. Handle Unhandled Rejections
process.on('unhandledRejection', err => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
