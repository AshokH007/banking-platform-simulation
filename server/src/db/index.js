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
    rejectUnauthorized: false, // Standard for many managed PostgreSQL services
  } : {
    rejectUnauthorized: false // Keep consistent with seed logic which requires it even locally for Aiven
  }
});

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
