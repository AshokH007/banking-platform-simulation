# Professional B2C Banking Platform Simulation

A high-fidelity simulation of a consumer banking platform, engineered to replicate the architecture and security constraints of real fintech systems.

## Architecture & Security

### Schema Isolation
This application operates within a **dedicated `banking` schema** in a shared PostgreSQL database. This ensures strict isolation from other applications (e.g., legacy systems) co-located in the same database instance.
- **Namespace**: `banking.*`
- **Tables**: `banking.users`, `banking.auth_tokens`

### Authentication Model
- **Stateless API, Stateful Session**: Uses JWTs for request signing, but maintains server-side state in `banking.auth_tokens` to enable immediate revocation (Global Logout).
- **Token Policies**: 
  - Short-lived access tokens (15m).
  - Rotated logic (not fully implemented in sim, but supported by schema).

### Security features
- **Immutable Identifiers**: Customer IDs and Account Numbers are system-generated and immutable.
- **Read-Only Balance**: Balance modifications are strictly controlled via transaction logs (future scope), currently exposed as read-only.

## Setup Instructions

### 1. Database Configuration
Ensure your PostgreSQL connection string has permissions to create schemas.
Update `server/.env`:
```env
DATABASE_URL=postgres://user:password@host:port/dbname?sslmode=require
```

### 2. Backend Initialization
```bash
cd server
npm install
node src/scripts/seed.js # Creates 'banking' schema and demo user
npm run dev
```

### 3. Frontend Initialization
```bash
cd client
npm install
npm run dev
```

## Internal Testing Credentials
- **User**: `demo@example.com`
- **Pass**: `password123`
