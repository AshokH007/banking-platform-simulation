const { pool } = require('../db');
const { comparePassword, generateToken } = require('../utils/security');

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Bad Request', message: 'Email and password are required' });
    }

    try {
        // 1. Find user in banking schema
        const userResult = await pool.query('SELECT * FROM banking.users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            // Return 401 for generic invalid credentials
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
        }

        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ error: 'Forbidden', message: 'Account is not active' });
        }

        // 2. Check password
        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
        }

        // 3. Generate Token
        const token = generateToken(user);
        const decoded = require('jsonwebtoken').decode(token); // Get exp for DB

        // 4. Store Token in banking schema
        await pool.query(
            'INSERT INTO banking.auth_tokens (user_id, token, expires_at) VALUES ($1, $2, to_timestamp($3))',
            [user.id, token, decoded.exp]
        );

        // 5. Response
        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                customer_id: user.customer_id
            }
        });

    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const token = req.token; // Attached by auth middleware
        // Revoke token in banking schema
        await pool.query('UPDATE banking.auth_tokens SET revoked = true WHERE token = $1', [token]);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { login, logout };
