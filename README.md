# Server Essentials

A collection of reusable utilities, middleware, and services for Node.js server projects.  
This package helps you quickly add common server functionality such as authentication, messaging, file handling, logging, and more.

## Features

### [Auth](src/auth/)
- JWT authentication middleware
- Role-based authorization
- OTP generation and email delivery
- Token management and refresh token verification
- Request helpers

### [Configuration](src/config/)
- Centralized config loader with environment variable support

### [Files](src/files/)
- File upload middleware for Express
- File handling helpers

### [Formatting](src/formatting/)
- Date formatting and manipulation
- Number formatting and manipulation
- String formatting and manipulation
- Helpers for masking emails/phones and formatting IDs/codes

### [Gateway](src/gateway/)
- Proxy middleware for API gateway scenarios

### [Logging](src/logging/)
- Winston-based logger with environment-aware configuration
- Colorized console and file logs in development
- JSON console logs in production/Docker
- HTTP request logging middleware
- Log helpers for error handling, request tracing, and masking sensitive data

### [Messaging](src/messaging/)
- RabbitMQ service for notifications and RPC
- Firebase Cloud Messaging sender

### [Server](src/server/)
- Health check, ping, and API info endpoints

### [Validation](src/validation/)
- Input validation helpers (email, phone, password, etc.)

## Installation

```bash
npm install @eloritzkovitz/server-essentials
```

## Usage

Import what you need from the package.

## Configuration

Set required environment variables in your `.env` file:

```env
# RabbitMQ
RABBITMQ_URL=amqp://localhost

# SMTP for OTP
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
SMTP_FROM=your@email.com

# JWT
TOKEN_SECRET=your_jwt_secret

# Firebase Messaging
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json
```

## Testing & Coverage

Run all tests and view coverage reports using [Jest](https://jestjs.io/):

```bash
npm test
npx jest --coverage
```

The coverage report will be generated in the `coverage/` folder (which is gitignored by default).

You can add or run tests for any module in the `test/` directory.  
Tests are organized to match the source code structure for easy maintenance.

## API Documentation

Full API documentation is available in the [`docs`](docs) folder and can be viewed online via [GitHub Pages](https://eloritzkovitz.github.io/server-essentials/).

## License

MIT
