# Server Essentials

A collection of reusable utilities, middleware, and services for Node.js server projects.  
This package helps you quickly add common server functionality such as authentication, messaging, file handling, logging, and more.

## Features

- **Communicator:** RabbitMQ service for messaging and RPC.
- **Configuration:** Centralized config loader.
- **Middleware:** JWT authentication and file upload for Express.
- **Utilities:**
  - **Auth:** OTP generation/email, token management.
  - **Date:** Date formatting and manipulation.
  - **Files:** File handling helpers.
  - **Logging:** Simple logger.
  - **Messaging:** Firebase Cloud Messaging sender.
  - **Validation:** Input validation helpers.

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

## API Documentation

Full API documentation is available in the [`docs`](docs) folder and can be viewed online via [GitHub Pages](https://eloritzkovitz.github.io/server-essentials/).

## License

MIT
