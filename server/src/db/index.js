const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL is not defined in environment variables.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString ? connectionString.replace('?sslmode=require', '') : connectionString,
  ssl: isProduction ? {
    rejectUnauthorized: false,
  } : {
    rejectUnauthorized: false
  }
});

// Production Auto-Initialization
async function initializeDatabase() {
  console.log('📦 Initializing Production Database...');
  try {
    // 1. Extensions
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // 2. Schema
    await pool.query('CREATE SCHEMA IF NOT EXISTS banking');

    // 3. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banking.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id VARCHAR(20) UNIQUE NOT NULL,
        account_number VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'STAFF')),
        balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
        status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if role column exists (for migration of existing production DB)
    const roleColCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'banking' AND table_name = 'users' AND column_name = 'role'
    `);

    if (roleColCheck.rows.length === 0) {
      console.log('🔄 Migrating database: Adding role column...');
      await pool.query("ALTER TABLE banking.users ADD COLUMN role VARCHAR(20) DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'STAFF'))");
    }

    // 4. Auth Tokens Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banking.auth_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES banking.users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        revoked BOOLEAN DEFAULT FALSE,
        UNIQUE(token)
      )
    `);

    // 5. Transactions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banking.transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES banking.users(id),
        receiver_id UUID REFERENCES banking.users(id),
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        type VARCHAR(20) NOT NULL CHECK (type IN ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'BILL_PAY')),
        status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
        reference TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if BILL_PAY type exists in constraints
    try {
      await pool.query(`
        ALTER TABLE banking.transactions 
        DROP CONSTRAINT IF EXISTS transactions_type_check,
        ADD CONSTRAINT transactions_type_check CHECK (type IN ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'BILL_PAY'))
      `);
    } catch (e) {
      console.log('⚠️ Migration note: Transactions constraint update skipped or already applied.');
    }

    // 6. Loans Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banking.loans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES banking.users(id),
        amount NUMERIC(12, 2) NOT NULL,
        apr NUMERIC(5, 2) DEFAULT 5.50,
        term_months INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAID')),
        purpose TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Bills Table (Pre-seeded utilities)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banking.bills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES banking.users(id),
        biller_name VARCHAR(100) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID')),
        category VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Notifications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banking.notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES banking.users(id),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. Indices
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON banking.users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_customer_id ON banking.users(customer_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_transactions_sender ON banking.transactions(sender_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON banking.transactions(receiver_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_loans_user ON banking.loans(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_bills_user ON banking.bills(user_id)');

    // 6. Seed Default Users (Upsert pattern for reliable role provisioning)
    console.log('👤 Synchronizing production identities...');
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('SecurePass123', 12);

    // Ensure Client exists
    await pool.query(`
      INSERT INTO banking.users (customer_id, account_number, full_name, email, password_hash, balance, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
    `, ['CUST7742', 'ACC-921-008', 'John Doe', 'john@bank.com', hash, 25400.50, 'CLIENT']);

    // Ensure Staff exists
    await pool.query(`
      INSERT INTO banking.users (customer_id, account_number, full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
    `, ['EMP-101', 'OFFICE-MAIN', 'Bank Admin', 'admin@bank.com', hash, 'STAFF']);

    console.log('✅ Database Initialization & Role Sync Complete.');

    console.log('✅ Database Initialization Complete.');
  } catch (err) {
    console.error('❌ Database Initialization Failed:', err.message);
  }
}

// Trigger initialization
if (isProduction) {
  initializeDatabase();
}

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    if (!isProduction) {
      console.log('Database connected successfully:', res.rows[0].now);
    }
  }
});

module.exports = {
  query: (text, params) => {
    if (!isProduction) {
      // Simple logging for dev
      console.log(`[DB] Executing: ${text}`, params);
    }
    return pool.query(text, params);
  },
  pool,
};
