const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const globalErrorHandler = require('./middleware/errorMiddleware');
const AppError = require('./utils/AppError');

// Routes
const apiRoutes = require('./routes/apiRoutes');
const zobotRoutes = require('./routes/zobotRoutes');

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. Rate Limiting (Prevent Brute Force)
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// 3. CORS
app.use(cors());

// 4. Body Parser
app.use(express.json({ limit: '10kb' }));

// 5. Data Sanitization against NoSQL query injection
// app.use(mongoSanitize());

// 6. Compression
app.use(compression());

// 7. Routes
app.use('/api', apiRoutes);
app.use('/api/webhook', zobotRoutes);

// 8. 404 Handler
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 9. Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
