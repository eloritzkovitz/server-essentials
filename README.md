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

## API Overview

### Communicator

- `rabbitMQService.requestRPC(requestQueue, responseQueue, payload, callback)`
- `rabbitMQService.publishNotification(queue, payload)`

### Middleware

- `authenticate`: Express middleware for JWT authentication.
- `requireAdmin`: Express middleware for admin role check.
- `upload`: Express middleware for file uploads.

### Utilities

#### Auth
- `generateOtp()`: Generate OTP and expiration.
- `sendOtpMail(to, otp, subject)`: Send OTP via email.
- `createToken(payload)`: Create JWT token.
- `verifyToken(token)`: Verify JWT token.

#### Date
- `formatDate(date)`: Format date to string.
- `addMinutes(date, minutes)`: Add minutes to date.
- `diffInMinutes(date1, date2)`: Difference in minutes.

#### Files
- `fileService`: File handling helpers.

#### Logging
- `logger`: Simple logging utility.

#### Messaging
- `sendFcmHttpV1({ token, notification, ... })`: Send Firebase Cloud Message.

#### Validation
- `isValidEmail(email)`: Validate email address.
- `isValidPhone(phone)`: Validate phone number.
- `isStrongPassword(password)`: Check password strength.

## Folder Structure

```
server-essentials/
│
├── communicator/
│   └── rabbitMQService.ts
├── config/
│   └── config.ts
├── middleware/
│   ├── auth.ts
│   └── upload.ts
├── utils/
│   ├── auth/
│   │   ├── otpService.ts
│   │   └── tokenService.ts
│   ├── date/
│   │   └── dateFormatting.ts
│   ├── files/
│   │   └── fileService.ts
│   ├── logging/
│   │   └── logger.ts
│   ├── messaging/
│   │   └── firebaseMessaging.ts
│   └── validation/
│       └── validation.ts
└── index.ts
```

## License

MIT

## Contributing

Feel free to open issues or submit pull requests for improvements