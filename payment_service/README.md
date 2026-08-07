# Payment Service

A simple payment microservice built with Node.js, Express, MongoDB, and Redis.

## Overview

This service provides account creation, balance lookup, and payment transaction handling with idempotency support.
It uses MongoDB for account and transaction storage, and Redis for idempotent transaction state management.

## Features

- Create accounts with initial balance
- Transfer money between accounts using atomic MongoDB transactions
- Idempotent transaction handling with Redis
- Balance lookup for a specific account
- Health-check endpoint

## Requirements

- Node.js 18+ (ES module support)
- npm
- MongoDB
- Redis

## Installation

1. Clone or open the `payment_service` folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following variables:

```env
PORT=3000
MONGO_URI=mongodb:URL
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

4. Start the service:

```bash
npm run dev
```

Or run production mode:

```bash
npm start
```

## Environment Variables

- `PORT` - HTTP port for the service
- `MONGO_URI` - MongoDB connection URI
- `REDIS_HOST` - Redis server hostname
- `REDIS_PORT` - Redis server port
- `REDIS_PASSWORD` - Redis password (optional)

## API Endpoints

### Health Check

- `GET /api/`
- Response: `payment service health check`

### Create Account

- `POST /api/create-account`
- Request body:
  - `username` (string) - account owner name
  - `amount` (number) - starting balance

Example:

```json
{
  "username": "alice",
  "amount": 1000
}
```

Success response:

```json
{
  "success": true,
  "message": "Account created",
  "account": {
    "_id": "...",
    "userName": "alice",
    "balance": 1000,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Transaction

- `POST /api/transaction`
- Request body:
  - `fromAccountId` (string) - sender account ID
  - `toAccountId` (string) - receiver account ID
  - `amount` (number) - transfer amount
  - `clientRequestId` (string) - unique idempotency key for the request

Example:

```json
{
  "fromAccountId": "64...",
  "toAccountId": "64...",
  "amount": 50,
  "clientRequestId": "txn-12345"
}
```

Success response:

```json
{
  "success": true,
  "message": "Transaction successful",
  "transaction": {
    "_id": "...",
    "fromAccount": "...",
    "toAccount": "...",
    "transferedAmount": 50,
    "status": "SUCCESS",
    "idempotencyKey": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Get Balance

- `GET /api/balance`
- Request body:
  - `accountId` (string) - account ID to fetch balance for

Example:

```json
{
  "accountId": "64..."
}
```

Success response:

```json
{
  "success": true,
  "message": "account detail fetched",
  "account": {
    "accounName": "alice",
    "balance": 950
  }
}
```

## Models

- `Account`
  - `userName` - string
  - `balance` - number

- `Transaction`
  - `fromAccount` - ObjectId reference
  - `toAccount` - ObjectId reference
  - `transferedAmount` - number
  - `status` - enum: `PENDING`, `SUCCESS`, `FAILED`, `ROLLED_BACK`
  - `idempotencyKey` - unique string

## Notes

- The transaction endpoint uses Redis to store an idempotency key and prevent duplicate processing.
- MongoDB transactions are used to ensure atomic withdraw-and-deposit behavior.
- The `balance` route currently expects `accountId` in the request body.
