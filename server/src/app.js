const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Request logging

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `The requested resource ${req.originalUrl} was not found.`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Global Error]', err);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal Server Error' : err.name,
        message: statusCode === 500 ? 'An unexpected error occurred.' : message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;
