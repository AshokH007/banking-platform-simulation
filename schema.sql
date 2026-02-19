-- Enable UUID extension (public schema usually, or banking if allow)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dedicated schema
CREATE SCHEMA IF NOT EXISTS banking;

-- Users Table in banking schema
CREATE TABLE IF NOT EXISTS banking.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(20) UNIQUE NOT NULL, -- Bank issued, immutable
    account_number VARCHAR(20) UNIQUE NOT NULL, -- Bank issued, immutable
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Auth Tokens Table in banking schema
CREATE TABLE IF NOT EXISTS banking.auth_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES banking.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    UNIQUE(token)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_banking_auth_tokens_token ON banking.auth_tokens(token);
CREATE INDEX IF NOT EXISTS idx_banking_users_email ON banking.users(email);
