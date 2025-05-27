# Geez Editor – Backend

The **Geez Backend** is the API and real-time collaboration server for the **Geez collaborative document editor**. It handles user authentication, database interactions, and room-based WebSocket permissions using **Express.js**, **Mongoose**, and **Liveblocks server SDK**.

---

## Key Features

* Lightweight **Express.js** server with modular route handling
* Document and user data storage via **MongoDB** (with **Mongoose**)
* **JWT-based authentication** for secure access
* **Input validation** using `express-validator`
* Cross-origin support with `cors`
* Live collaboration room authorization with `@liveblocks/node`

---

## What I Implemented

### Server & Routing

* Set up a modular **Express.js** server with middleware-based routing
* Enabled **CORS** for communication with the frontend hosted on a different origin

### Document Management

* Built **REST APIs** to: Create, update, and fetch documents

### Authentication

* Used **JWT** to sign and verify tokens securely
* Implemented middleware to protect routes and check for authenticated users

### Liveblocks Integration

* Used `@liveblocks/node` to generate **collaboration tokens**
* Restricted room-level access based on user identity and room permissions
* Sent collaboration tokens to the frontend editor for Yjs CRDT sync

### Input Validation

* Used `express-validator` to validate and sanitize inputs for user and document routes

---

## Tech Stack

| Purpose          | Package / Tool          |
| ---------------- | ----------------------- |
| Server Framework | Express.js              |
| Realtime Auth    | @liveblocks/node        |
| DB ORM (ODM)     | Mongoose                |
| Authentication   | jsonwebtoken            |
| Input Validation | express-validator       |
| CORS Handling    | cors                    |
| Language         | JavaScript (ES Modules) |

---

## Getting Started

### Prerequisites

* Node.js >= 16
* MongoDB instance running locally or via Atlas

### Installation

```bash
git clone https://github.com/souviks22/geez-backend.git
npm install
```

### Configuration

Create a `.env` file at the root folder:

```env
PORT=4000
DB_URL=your_mongo_cluster
FRONTEND_URL=geez_frontend_domain
NEXTAUTH_SECRET=authentication_secret_key
LIVEBLOCKS_DEV_SECRET=your_liveblocks_dev_key
LIVEBLOCKS_PROD_SECRET=your_liveblocks_prod_key
JWT_EXPIRATION_TIME=jwt_token_age
```

### Running the Server

```bash
npm start
```

Server will start on `http://localhost:4000`.

---

## Liveblocks Collaboration Flow

1. Frontend requests a collaboration token
2. Server verifies JWT and identity
3. Server signs a Liveblocks auth token for that user/room
4. Frontend uses the token to sync via Yjs

---

## Learn More

* [Liveblocks Auth Docs](https://liveblocks.io/docs/authentication)
* [Express.js](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [JWT Auth Basics](https://jwt.io/)
* [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
