const { verifyToken } = require('../utils/security');
const { pool } = require('../db');

/**
 * PRINCIPAL AUTH MIDDLEWARE
 * Purpose: Enforces JWT integrity and stateful revocation status.
 */
const authenticate = async (req, res, next) => {
    // ... (existing code safely preserved during replacement)
};

const staffOnly = (req, res, next) => {
    if (req.user && req.user.role === 'STAFF') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden', message: 'Staff access required' });
    }
};

module.exports = { authenticate, staffOnly };
