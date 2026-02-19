const { verifyToken } = require('../utils/security');
const { pool } = require('../db');

/**
 * PRINCIPAL AUTH MIDDLEWARE
 * Purpose: Enforces JWT integrity and stateful revocation status.
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Auth required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid session' });
        }

        // Layer 2: Stateful Revocation Check
        const result = await pool.query(
            'SELECT revoked, expires_at FROM banking.auth_tokens WHERE token = $1',
            [token]
        );

        if (result.rows.length === 0 || result.rows[0].revoked) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Session revoked' });
        }

        // Check soft expiry (DB side)
        if (new Date(result.rows[0].expires_at) < new Date()) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Session expired' });
        }

        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        console.error('[AUTH ERROR]', error.message);
        res.status(500).json({ error: 'Internal Error', message: 'Security service unavailable' });
    }
};

module.exports = authenticate;
