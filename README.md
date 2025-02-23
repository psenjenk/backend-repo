# Payment System Backend

A self-contained payment system for agent-client money transfers.

## Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/backend-repo.git

Install dependencies:

bash
Copy
npm install
Database setup:

Create a PostgreSQL database.

Run the SQL scripts in sql/setup.sql.

Environment variables:

Rename .env.example to .env and update credentials.

Start the server:

bash

npm run dev

API Endpoints
POST /api/auth/register: Register a user (agent/client/admin).

POST /api/auth/login: Login and get a JWT token.

POST /api/agent/transfer: Transfer funds (agents only).

POST /api/admin/approve-deposit: Approve agent deposits (admins only).

Copy

---

### **How to Use**
1. Run `npm install` to install dependencies.
2. Set up PostgreSQL using the `sql/setup.sql` script.
3. Update `.env` with your credentials.
4. Start the server with `npm run dev`.

This repository includes all core functionalities for your custom payment system. Let me know if you need further refinements! 🚀