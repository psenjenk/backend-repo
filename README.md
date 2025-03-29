# Payment System Backend

A robust and secure payment system backend that facilitates money transfers between agents and clients, with administrative oversight.

## Features

- 🔐 Secure authentication with JWT
- 👥 Role-based access control (Agent, Client, Admin)
- 💰 Fund transfer capabilities
- 📊 Transaction ledger
- 🔄 Agent deposit management
- 🔍 KYC status tracking
- 💳 Balance management
- 🔒 Transaction safety with database transactions
- 📝 Comprehensive logging
- 🛡️ Rate limiting and security headers

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing
- dotenv for environment management
- cors for cross-origin resource sharing
- pg for PostgreSQL client

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Basic understanding of REST APIs and database operations

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/backend-repo.git
   cd backend-repo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   ```bash
   # Create a PostgreSQL database
   createdb payment_system

   # Run the setup script
   psql -d payment_system -f sql/setup.sql
   ```

4. **Environment Configuration**:
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

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "phone_number": "string",
    "role": "agent|client|admin",
    "password": "string"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "id": 1,
    "phone_number": "+1234567890",
    "role": "agent"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Invalid input data
  - 409 Conflict: Phone number already registered
  - 500 Internal Server Error: Server-side error

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "phone_number": "string",
    "password": "string"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "phone_number": "+1234567890",
      "role": "agent",
      "balance": 1000.00
    }
  }
  ```
- **Error Responses**:
  - 401 Unauthorized: Invalid credentials
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server-side error

### Agent Endpoints

#### Transfer Funds
- **POST** `/api/agent/transfer`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "recipient_phone": "string",
    "amount": number
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "transaction_id": "uuid_here",
    "new_balance": 900.00
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Invalid amount or insufficient funds
  - 401 Unauthorized: Invalid or missing token
  - 403 Forbidden: Not an agent
  - 404 Not Found: Recipient not found
  - 500 Internal Server Error: Server-side error

### Admin Endpoints

#### Approve Deposit
- **POST** `/api/admin/approve-deposit`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "agent_id": number,
    "amount": number,
    "method": "cash|bank_transfer"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "deposit": {
      "id": 1,
      "agent_id": 1,
      "amount": 1000.00,
      "method": "bank_transfer",
      "verified": true
    }
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Invalid input data
  - 401 Unauthorized: Invalid or missing token
  - 403 Forbidden: Not an admin
  - 404 Not Found: Agent not found
  - 500 Internal Server Error: Server-side error

## Database Schema

### Users Table
- `id`: SERIAL PRIMARY KEY
- `phone_number`: VARCHAR(15) UNIQUE
- `role`: VARCHAR(10)
- `balance`: DECIMAL(15,2)
- `password_hash`: VARCHAR(255)
- `kyc_status`: VARCHAR(20)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### Ledger Table
- `id`: UUID PRIMARY KEY
- `created_at`: TIMESTAMPTZ
- `type`: VARCHAR(20)
- `sender_id`: INTEGER
- `receiver_id`: INTEGER
- `amount`: DECIMAL(15,2)
- `status`: VARCHAR(20)
- `reference`: VARCHAR(100)
- `metadata`: JSONB

### Agent Deposits Table
- `id`: SERIAL PRIMARY KEY
- `agent_id`: INTEGER
- `amount`: DECIMAL(15,2)
- `method`: VARCHAR(20)
- `verified`: BOOLEAN
- `verified_at`: TIMESTAMPTZ
- `verified_by`: INTEGER
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Database transaction safety
- Input validation
- Environment variable protection
- Rate limiting
- Security headers
- SQL injection prevention
- XSS protection
- CORS configuration

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await for asynchronous operations

### Git Workflow
1. Create feature branch from development
2. Make atomic commits
3. Write meaningful commit messages
4. Update documentation as needed
5. Create pull request with description
6. Address review comments
7. Merge after approval

### Testing
- Write unit tests for new features
- Test edge cases and error scenarios
- Maintain test coverage above 80%
- Run tests before committing

## Troubleshooting

### Common Issues
1. **Database Connection**
   - Check PostgreSQL service is running
   - Verify database credentials in .env
   - Ensure database exists

2. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

3. **Transaction Failures**
   - Check database transaction logs
   - Verify sufficient balance
   - Check recipient existence

### Logging
- Application logs in `logs/` directory
- Database logs in PostgreSQL log file
- Error tracking with stack traces

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Pull Request Guidelines
- Include description of changes
- Add tests for new features
- Update documentation
- Follow code style guidelines
- Address all review comments

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
1. Check the [documentation](docs/)
2. Search existing [issues](issues/)
3. Create a new issue with:
   - Detailed description
   - Steps to reproduce
   - Expected behavior
   - Environment details

## Acknowledgments

- Express.js team for the amazing framework
- PostgreSQL team for the robust database
- All contributors who have helped shape this project
- Open source community for inspiration and tools