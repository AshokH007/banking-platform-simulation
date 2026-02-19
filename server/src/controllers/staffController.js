const db = require('../db');
const bcrypt = require('bcryptjs');

/**
 * Onboard a new customer
 */
exports.createCustomer = async (req, res) => {
    const { fullName, email, initialDeposit } = req.body;

    if (!fullName || !email) {
        return res.status(400).json({ message: 'Full name and email are required' });
    }

    try {
        // Generate random credentials
        const customerId = 'CUST' + Math.floor(1000 + Math.random() * 9000);
        const accountNum = 'ACC-' + Math.floor(100 + Math.random() * 899) + '-' + Math.floor(100 + Math.random() * 899);
        const defaultPass = await bcrypt.hash('SecurePass123', 12);

        const result = await db.pool.query(`
            INSERT INTO banking.users (customer_id, account_number, full_name, email, password_hash, balance, role)
            VALUES ($1, $2, $3, $4, $5, $6, 'CLIENT')
            RETURNING id, customer_id, account_number, full_name, email
        `, [customerId, accountNum, fullName, email, defaultPass, initialDeposit || 0]);

        // Log the initial deposit if any
        if (initialDeposit > 0) {
            await db.pool.query(`
                INSERT INTO banking.transactions (receiver_id, amount, type, reference, status)
                VALUES ($1, $2, 'DEPOSIT', 'Initial Bank Deposit', 'COMPLETED')
            `, [result.rows[0].id, initialDeposit]);
        }

        res.status(201).json({
            message: 'Customer created successfully',
            user: result.rows[0],
            defaultPassword: 'SecurePass123'
        });
    } catch (err) {
        console.error('Customer creation failed:', err.message);
        if (err.message.includes('unique constraint')) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Failed to create customer' });
    }
};

/**
 * Inject funds into a customer account
 */
exports.depositFunds = async (req, res) => {
    const { accountNumber, amount, reference } = req.body;

    if (!accountNumber || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid deposit details' });
    }

    try {
        const userRes = await db.pool.query('SELECT id FROM banking.users WHERE account_number = $1', [accountNumber]);

        if (userRes.rows.length === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const userId = userRes.rows[0].id;

        // Perform Deposit
        await db.pool.query('UPDATE banking.users SET balance = balance + $1 WHERE id = $2', [amount, userId]);

        // Log Transaction
        await db.pool.query(`
            INSERT INTO banking.transactions (receiver_id, amount, type, reference, status)
            VALUES ($1, $2, 'DEPOSIT', $3, 'COMPLETED')
        `, [userId, amount, reference || 'Staff Deposit']);

        res.status(200).json({ message: 'Funds deposited successfully' });
    } catch (err) {
        console.error('Deposit failed:', err.message);
        res.status(500).json({ message: 'Deposit failed' });
    }
};

/**
 * List all users (Directory)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.pool.query(`
            SELECT id, customer_id, account_number, full_name, email, balance, role, status, created_at 
            FROM banking.users 
            WHERE role = 'CLIENT'
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};
