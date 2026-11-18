# 🛠️ Brew Umber — Backend API & Notification Service

> Robust Node.js and Express 5 RESTful API engine providing database persistence, order lifecycle management, and automated SMTP email notification dispatching for the **Brew Umber** café application.

---

## Table of Contents

- [Overview](#overview)
- [Architecture & Directory Structure](#architecture--directory-structure)
- [Tech Stack](#tech-stack)
- [Database Schema & Models](#database-schema--models)
- [REST API Reference](#rest-api-reference)
- [Email Notification Engine](#email-notification-engine)
- [Environment Variables](#environment-variables)
- [Local Setup & Execution](#local-setup--execution)
- [Security & Best Practices](#security--best-practices)

---

## Overview

The `backend` service acts as the core transactional engine for the Brew Umber platform. It manages incoming order requests, validates customer and payment details, creates immutable records in MongoDB Atlas via Mongoose, and triggers real-time transactional confirmation emails to customers through Gmail SMTP via Nodemailer.

---

## Architecture & Directory Structure

```text
backend/
├── models/
│   └── order.js            # Mongoose schema and model definition for orders
├── utils/
│   └── sendemail.js        # Nodemailer SMTP transporter and email template
├── .env                    # Environment configuration (ignored by Git)
├── .gitignore              # Git ignore rules for node_modules and .env
├── package.json            # Node.js dependencies, scripts, and engine specs
├── README.md               # Backend-specific documentation
└── server.js               # Express server initialization, DB connection & routes
```

### Key Modules
- **`server.js`**: Application entry point. Boots Express, registers `cors()` and `express.json()` middlewares, establishes the Mongoose MongoDB connection, and defines the `/api/orders` endpoints.
- **`models/order.js`**: Defines the data model for café orders using an embedded document pattern to ensure invoice immutability.
- **`utils/sendemail.js`**: Configures an SSL Nodemailer transporter for Gmail and sends formatted confirmation emails with Order ID, customer name, and bill totals.

---

## Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>=18.0.0` | Server-side JavaScript runtime environment |
| **Express.js** | `^5.2.1` | Web framework for routing and middleware handling |
| **Mongoose** | `^9.10.3` | Object Data Modeling (ODM) library for MongoDB |
| **Nodemailer** | `^10.0.13` | SMTP email transport client for transactional receipts |
| **CORS** | `^2.8.6` | Middleware enabling cross-origin browser requests |
| **Dotenv** | `^18.0.5` | Zero-dependency environment variable loader |
| **Nodemon** | `^3.1.14` | Hot-reloading development daemon |

---

## Database Schema & Models

### `Order` Schema (`models/order.js`)

The `Order` model represents customer transactions. An embedded structure is used to capture line-item snapshots and fulfillment parameters at the moment of order placement.

```javascript
const orderSchema = new mongoose.Schema(
  {
    customer: {
      firstName: { type: String, required: true },
      lastName:  { type: String, required: true },
      email:     { type: String, required: true },
      phone:     { type: String, required: true },
    },
    orderType: {
      type: String,
      enum: ['store', 'home'],
      required: true,
    },
    address: {
      address: String,
      city: String,
      pinCode: String,
    },
    tableNumber: {
      type: String,
      default: null,
    },
    items: [
      {
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
    subtotal: { type: Number, required: true },
    tax:      { type: Number, required: true },
    delivery: { type: Number, required: true },
    total:    { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'cash'],
      required: true,
    },
    paymentStatus: {
      type: String,
      default: 'pending',
    },
    orderStatus: {
      type: String,
      default: 'placed',
    },
  },
  { timestamps: true }
)
```

#### Field Specifications:
- **`customer`**: Contact details required to process the order and dispatch the email confirmation.
- **`orderType`**: Restricts orders to either `'store'` (dine-in table service) or `'home'` (delivery).
- **`tableNumber`**: Required for `'store'` fulfillment to identify the customer's seating position.
- **`address`**: Required for `'home'` fulfillment to route delivery riders.
- **`paymentMethod`**: Accepts `'card'`, `'upi'`, or `'cash'`.
- **`paymentStatus`**: Set to `'paid'` for card/UPI and `'pending'` for Cash on Delivery.
- **`timestamps`**: Automatically tracks `createdAt` and `updatedAt` ISO timestamps.

---

## REST API Reference

### Base URL
- **Local:** `http://localhost:5000`
- **Production:** `https://brew-umber.onrender.com`

---

### 1. Create Order
- **Route:** `POST /api/orders`
- **Access:** Public
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "customer": {
    "firstName": "Devang",
    "lastName": "Rohilla",
    "email": "devang@example.com",
    "phone": "+91 98765 43210"
  },
  "orderType": "store",
  "address": null,
  "tableNumber": "4",
  "items": [
    {
      "title": "Cortado",
      "price": 220,
      "quantity": 1
    }
  ],
  "subtotal": 220,
  "tax": 11,
  "delivery": 0,
  "total": 231,
  "paymentMethod": "upi",
  "paymentStatus": "paid",
  "orderStatus": "placed"
}
```

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Order confirmed",
  "order": {
    "_id": "6720f1883a992bcda031b2e1",
    "customer": {
      "firstName": "Devang",
      "lastName": "Rohilla",
      "email": "devang@example.com",
      "phone": "+91 98765 43210"
    },
    "orderType": "store",
    "tableNumber": "4",
    "total": 231,
    "paymentMethod": "upi",
    "paymentStatus": "paid",
    "orderStatus": "placed",
    "createdAt": "2026-10-21T05:34:00.120Z",
    "updatedAt": "2026-10-21T05:34:00.120Z"
  }
}
```

#### Error Response (`500 Internal Server Error`):
```json
{
  "success": false,
  "message": "Validation error or database failure details"
}
```

---

### 2. Fetch All Orders
- **Route:** `GET /api/orders`
- **Access:** Open / Admin
- **Description:** Returns all orders sorted in descending order of creation (`createdAt: -1`).

#### Success Response (`200 OK`):
```json
[
  {
    "_id": "6720f1883a992bcda031b2e1",
    "customer": { ... },
    "items": [ ... ],
    "total": 231,
    "orderStatus": "placed",
    "createdAt": "2026-10-21T05:34:00.120Z"
  }
]
```

---

## Email Notification Engine

Automated order confirmations are handled via [`utils/sendemail.js`](file:///e:/MERN/Brew-Umber-main/backend/utils/sendemail.js) using Nodemailer configured for Gmail's SSL SMTP service (`smtp.gmail.com:465`).

### Features:
- **Responsive HTML & Plain-Text Templates**: Includes a branded HTML receipt matching the Brew Umber theme, detailing ordered items, quantities, subtotal, 5% tax, delivery charges, payment method, and dining/delivery instructions.
- **Fail-Safe & Non-Blocking**: If credentials are unset or email delivery encounters network issues, it logs diagnostics without interrupting the customer's checkout response.
- **Automated Password Sanitization**: Automatically removes spaces from 16-character Google App Passwords (`abcd efgh ijkl mnop` -> `abcdefghijklmnop`).
- **Connection Timeouts**: Explicit 10-15s timeouts prevent SMTP connection hangs from blocking server processes.
- **Verification Helper**: Exports `verifyEmailConfig()` to test SMTP credentials on demand.

---

## Environment Variables

Create a `.env` file in this directory (`backend/.env`):

```env
# HTTP Port for Express Server
PORT=5000

# MongoDB Connection String (Atlas or Local)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/brew-umber?retryWrites=true&w=majority

# Gmail SMTP Sender Account
EMAIL_USER=your_email@gmail.com

# Gmail 16-Character App Password (NOT your login password)
EMAIL_PASS=abcd efgh ijkl mnop
```

> [!TIP]
> To generate an App Password: Google Account → Security → 2-Step Verification → App passwords → Select "Mail" and "Other (Custom name)".

---

## Local Setup & Execution

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Ensure `backend/.env` exists and contains valid `MONGO_URI`, `EMAIL_USER`, and `EMAIL_PASS`.

### 3. Start Development Server
Run with Nodemon for live hot-reloading:
```bash
npm run dev
```

### 4. Start Production Server
```bash
npm start
```
The server will output:
```text
MongoDB connected
Server running on port 5000
```

---

## Security & Best Practices

1. **Environment Protection:** `.env` is ignored by Git in `.gitignore` to prevent secret leakage.
2. **Schema Sanitization:** Strict Mongoose enums (`orderType`, `paymentMethod`) filter unauthorized values.
3. **Graceful Fallbacks:** Email dispatch failures are isolated in `try/catch` blocks so they never cause checkout crashes for customers.
4. **CORS:** Configured via `cors()` middleware to facilitate seamless requests from Vite frontend origins.
