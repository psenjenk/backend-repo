-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('agent', 'client', 'admin')),
  balance DECIMAL(15, 2) DEFAULT 0.00,
  password_hash VARCHAR(255) NOT NULL,
  kyc_status VARCHAR(20) DEFAULT 'pending'
);

-- Ledger table
CREATE TABLE ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'transfer', 'withdrawal')),
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Agent deposits table
CREATE TABLE agent_deposits (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  method VARCHAR(20) CHECK (method IN ('cash', 'bank_transfer')),
  verified BOOLEAN DEFAULT FALSE
);