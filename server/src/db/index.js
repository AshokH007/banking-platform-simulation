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
  console.log('📦 Checking Production Schema...');
  try {
    // 1. Schema
    await pool.query('CREATE SCHEMA IF NOT EXISTS banking');

    // 2. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banking.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id VARCHAR(20) UNIQUE NOT NULL,
        account_number VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
        status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Auth Tokens Table
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

    console.log('✅ Database Schema Synchronized.');
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
