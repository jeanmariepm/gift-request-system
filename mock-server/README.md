# 🎁 Gifts App Mock Server

A **standalone, secure mock server** for testing the Gifts App with **server-to-server authentication**. This mock server keeps Bearer tokens on the server-side, never exposing them to the browser.

## 🔒 Security Features

- ✅ **Bearer tokens stored on server** - Never sent to browser
- ✅ **Server-to-server API calls** - Mock server calls Gifts App backend
- ✅ **Temporary login tokens** - Short-lived, single-use tokens
- ✅ **Production-ready pattern** - Demonstrates secure integration

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd mock-server
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` to configure URLs and tokens:

```bash
# Mock Server Configuration
PORT=3001

# Gifts App URLs
GIFTS_APP_LOCAL_URL=http://localhost:3000
GIFTS_APP_DEV_URL=https://instant-jmariada-2544-jeanmarie-mariadassous-projects.vercel.app
GIFTS_APP_PROD_URL=https://instant-sigma-drab.vercel.app

# Bearer Tokens (KEEP SECRET!)
USER_TOKEN_LOCAL=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
ADMIN_TOKEN_LOCAL=gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6
# ... etc
```

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3001`

### 4. Open in Browser

Open your browser to: http://localhost:3001

---

## 📋 How It Works

### Authentication Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │         │ Mock Server │         │  Gifts App  │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │  1. Submit Form       │                       │
       ├──────────────────────>│                       │
       │                       │                       │
       │                       │  2. POST /api/user/login
       │                       │            │                       │     (Bearer token in header)
       │                       ├──────────────────────>│
       │                       │                       │
       │                       │  3. Return login token│
       │                       │<──────────────────────┤
       │                       │                       │
       │  4. Redirect with     │                       │
       │     login token       │                       │
       │<──────────────────────┤                       │
       │                       │                       │
       │  5. GET /api/exchange-token                  │
       │     ?loginToken=...                          │
       ├────────────────────────────────────────────>│
       │                       │                       │
       │  6. Set session cookie│                       │
       │     + Redirect to /   │                       │
       │<────────────────────────────────────────────┤
       │                       │                       │
       │  7. Access Gifts App  │                       │
       │     (with session)    │                       │
       ├────────────────────────────────────────────>│
       │                       │                       │
```

### Key Points

1. **Browser → Mock Server**: User submits form with user data
2. **Mock Server → Gifts App**: Server-to-server API call with Bearer token
3. **Gifts App → Mock Server**: Returns temporary login token (5 min expiry)
4. **Mock Server → Browser**: Redirects user to Gifts App with login token
5. **Browser → Gifts App**: Exchanges login token for session cookie
6. **Browser**: Now has valid session, can use Gifts App

---

## 🧪 Testing Different Environments

The mock server can test against three environments:

### Local (localhost:3000)

For testing with the Gifts App running locally:

```bash
# In one terminal - Start Gifts App
cd /Users/jmpm/intobridge/gifts
npm run dev

# In another terminal - Start Mock Server
cd /Users/jmpm/intobridge/gifts/mock-server
npm start

# Open browser
# Select "Local" environment
```

### Development (Vercel Preview)

For testing against the Vercel Preview deployment:

```bash
# Just start Mock Server
cd /Users/jmpm/intobridge/gifts/mock-server
npm start

# Open browser
# Select "Development" environment
```

### Production (Vercel)

For testing against the Vercel Production deployment:

```bash
# Just start Mock Server
cd /Users/jmpm/intobridge/gifts/mock-server
npm start

# Open browser
# Select "Production" environment
```

---

## 📂 Project Structure

```
mock-server/
├── package.json          # Dependencies
├── server.js             # Express server with API routes
├── env.example           # Environment variable template
├── .env                  # Your configuration (create this, gitignored)
├── public/
│   └── index.html        # Frontend UI
└── README.md             # This file
```

---

## 🔌 API Endpoints

### POST /login/user

Authenticate a user and get redirect URL to Gifts App.

**Request:**
```json
{
  "environment": "production",
  "userId": "emp12345",
  "userName": "John Doe",
  "userEmail": "john@company.com",
  "country": "USA",
  "recipientName": "Jane",
  "recipientEmail": "jane@email.com",
  "recipientUsername": "janed"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://gifts-app.com/api/exchange-token?loginToken=..."
}
```

### POST /login/admin

Authenticate an admin and get redirect URL to Gifts App.

**Request:**
```json
{
  "environment": "production"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://gifts-app.com/api/exchange-token?loginToken=..."
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "environment": "development",
  "giftsAppUrls": {
    "local": "http://localhost:3000",
    "development": "https://...",
    "production": "https://..."
  }
}
```

---

## 🛡️ Security Best Practices

### ✅ DO:

- Keep `.env` file private (never commit to git)
- Store Bearer tokens as environment variables
- Use HTTPS for production Gifts App URLs
- Rotate tokens regularly
- Use different tokens for each environment

### ❌ DON'T:

- Don't hardcode tokens in client-side code
- Don't expose tokens in browser console logs
- Don't share tokens in public repositories
- Don't use production tokens for development

---

## 🐛 Troubleshooting

### Server won't start

**Error**: `Error: Cannot find module 'express'`

**Solution**: Install dependencies
```bash
npm install
```

### Can't connect to Gifts App

**Error**: `ECONNREFUSED` or `Failed to connect`

**Solution**:
1. Check if Gifts App is running (for local testing)
2. Verify URLs in `.env` are correct
3. Check your internet connection (for dev/prod testing)

### Authentication fails

**Error**: `Invalid access token`

**Solution**:
1. Verify Bearer tokens in `.env` match Gifts App environment variables
2. Check environment selection matches (don't use prod token with dev URL)

### Login token expired

**Error**: `Invalid or expired login token`

**Solution**:
- Login tokens expire in 5 minutes
- Don't bookmark or save redirect URLs
- Always start fresh from the mock server

---

## 🚫 What's NOT Included

This mock server does NOT:

- Store user data persistently
- Include user authentication (it's a mock/test app)
- Deploy to production (local use only)
- Replace real production integrations

---

## 📖 Integration Guide

For real production integration guidance, see:
- `/SERVER_INTEGRATION.md` in the main Gifts App directory

This mock server demonstrates the **server-to-server pattern** that production apps should use.

---

## 📝 Notes

- **Port 3001**: Mock server runs on port 3001 to avoid conflicts with Gifts App (port 3000)
- **No Database**: Mock server is stateless, doesn't store anything
- **For Testing Only**: This is a development/testing tool, not for production use
- **Tokens Visible**: Tokens are visible in server logs (for debugging), but never sent to browser

---

## 🎯 Use Cases

This mock server is perfect for:

- ✅ Testing Gifts App integration locally
- ✅ Demonstrating secure server-to-server auth
- ✅ Development and debugging
- ✅ Learning how production apps should integrate

This mock server is NOT for:

- ❌ Production use
- ❌ Public deployment
- ❌ End-user access

---

## 📞 Support

For issues or questions:
1. Check the main Gifts App documentation
2. Review `/SERVER_INTEGRATION.md` for integration patterns
3. Check console logs for debugging information

---

## 📜 License

MIT - This is a testing tool for the Gifts App project.

