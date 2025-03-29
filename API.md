# Payment System API Documentation

## Overview

The Payment System API provides a secure and efficient way to handle financial transactions between agents and clients, with administrative oversight. This API supports user authentication, fund transfers, deposit management, and KYC verification.

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)
- [Development](#development)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/payment-system-api.git
cd payment-system-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=payment_system
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Initialize the database:
```bash
psql -d payment_system -f sql/setup.sql
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### API Documentation UI
Access the interactive API documentation at:
- Development: `http://localhost:3000/api-docs`
- Production: `https://api.paymentsystem.com/api-docs`

## Authentication

### JWT Authentication
The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **Agent**: Can transfer funds to clients
- **Client**: Can receive funds from agents
- **Admin**: Can approve deposits and manage KYC status

### Obtaining a Token
1. Register a new user:
```bash
POST /api/auth/register
{
  "phone_number": "+1234567890",
  "role": "agent",
  "password": "securePassword123"
}
```

2. Login to get a token:
```bash
POST /api/auth/login
{
  "phone_number": "+1234567890",
  "password": "securePassword123"
}
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "phone_number": "+1234567890",
  "role": "agent",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone_number": "+1234567890",
  "password": "securePassword123"
}
```

### Agent Endpoints

#### Transfer Funds
```http
POST /api/agent/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipient_phone": "+1234567890",
  "amount": 100.00
}
```

#### Get Transaction History
```http
GET /api/agent/transactions
Authorization: Bearer <token>
```

#### Get Balance
```http
GET /api/agent/balance
Authorization: Bearer <token>
```

### Admin Endpoints

#### Approve Deposit
```http
POST /api/admin/approve-deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "agent_id": 1,
  "amount": 1000.00,
  "method": "bank_transfer"
}
```

#### Get Pending Transactions
```http
GET /api/admin/pending-transactions
Authorization: Bearer <token>
```

#### Update KYC Status
```http
PATCH /api/admin/users/{userId}/kyc
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved"
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details (in development mode)"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Best Practices

### Security
1. Always use HTTPS in production
2. Keep JWT tokens secure and never expose them
3. Use strong passwords
4. Implement proper input validation
5. Follow the principle of least privilege

### Performance
1. Use appropriate HTTP methods
2. Implement caching where appropriate
3. Use pagination for large datasets
4. Optimize database queries

### Development
1. Follow the API versioning strategy
2. Write comprehensive tests
3. Document all changes
4. Use proper error handling
5. Follow the coding standards

## Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Code Formatting
```bash
npm run format
```

### Database Migrations
```bash
# Create a new migration
npm run migrate:create <migration-name>

# Run migrations
npm run migrate:up

# Rollback migrations
npm run migrate:down
```

## Support

For support and questions:
1. Check the [documentation](docs/)
2. Search existing [issues](issues/)
3. Create a new issue with:
   - Detailed description
   - Steps to reproduce
   - Expected behavior
   - Environment details

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details. 