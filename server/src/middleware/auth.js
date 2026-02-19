const { verifyToken } = require('../utils/security');
const { pool } = require('../db');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
        }

        // Check if token is revoked in banking DB
        const result = await pool.query(
            'SELECT revoked FROM banking.auth_tokens WHERE token = $1',
            [token]
        );

        if (result.rows.length === 0 || result.rows[0].revoked) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Token is revoked or invalid' });
        }

        // Attach user info to request
        req.user = decoded;
        req.token = token; // Useful for logout
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Authentication service failed' });
    }
};

module.exports = authenticate;
