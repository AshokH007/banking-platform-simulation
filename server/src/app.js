const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');

const app = express();

// Middleware
app.use(helmet());

// Dynamic CORS Configuration
const rawFrontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = [
    rawFrontendUrl,
    // Add protocol versions for CORS matching
    rawFrontendUrl && !rawFrontendUrl.startsWith('http') ? `https://${rawFrontendUrl}` : null,
    rawFrontendUrl && !rawFrontendUrl.startsWith('http') ? `http://${rawFrontendUrl}` : null,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check exact match or hostname match
        const isAllowed = allowedOrigins.some(ao => ao === origin || origin.includes(ao));

        if (isAllowed || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.warn(`[CORS Denied] Origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'FinTech Banking Platform API',
        environment: 'Production',
        status: 'Operational',
        documentation: 'https://github.com/AshokH007/banking-platform-simulation',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            account: '/api/account'
        }
    });
});

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
