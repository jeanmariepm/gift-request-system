# 🎁 Standalone Mock Server - Quick Start

The standalone mock server is a **secure testing tool** that demonstrates proper server-to-server integration with the Gifts App.

## 🔒 Key Difference from Old Mock App

| Feature | Old Mock App (docs/index.html) | New Mock Server |
|---------|--------------------------------|-----------------|
| **Location** | Deployed with Gifts App | Standalone (local only) |
| **Tokens** | ❌ Visible in browser | ✅ Secure on server |
| **API Calls** | ❌ From browser | ✅ Server-to-server |
| **Production Ready** | ❌ Testing pattern only | ✅ Demonstrates real integration |

---

## 🚀 Quick Start (2 minutes)

### 1. Navigate to Mock Server
```bash
cd mock-server
```

### 2. Install Dependencies (first time only)
```bash
npm install
```

### 3. Configure (first time only)
```bash
# Copy environment template
cp env.example .env

# Edit .env if needed (optional - defaults work)
```

### 4. Start Server
```bash
npm start
```

### 5. Open Browser
Open: http://localhost:3001

---

## 🧪 Testing Scenarios

### Test Against Local Gifts App

**Terminal 1 - Start Gifts App:**
```bash
cd /Users/jmpm/intobridge/gifts
npm run dev
```

**Terminal 2 - Start Mock Server:**
```bash
cd /Users/jmpm/intobridge/gifts/mock-server
npm start
```

**Browser:**
1. Open http://localhost:3001
2. Select "Local" environment
3. Login as user or admin

### Test Against Development (Vercel Preview)

**Terminal - Start Mock Server:**
```bash
cd /Users/jmpm/intobridge/gifts/mock-server
npm start
```

**Browser:**
1. Open http://localhost:3001
2. Select "Development" environment
3. Login as user or admin

### Test Against Production (Vercel)

**Terminal - Start Mock Server:**
```bash
cd /Users/jmpm/intobridge/gifts/mock-server
npm start
```

**Browser:**
1. Open http://localhost:3001
2. Select "Production" environment
3. Login as user or admin

---

## 📁 File Locations

```
/Users/jmpm/intobridge/gifts/
├── mock-server/              ← Standalone mock server (NEW)
│   ├── package.json
│   ├── server.js
│   ├── .env                  ← Your configuration
│   ├── env.example           ← Template
│   ├── public/
│   │   └── index.html        ← Frontend UI
│   └── README.md             ← Full documentation
│
├── docs/index.html           ← Old mock app (still works, but exposes tokens)
└── SERVER_INTEGRATION.md     ← Production integration guide
```

---

## 🔑 How It Works

### Old Pattern (Client-Side - Insecure)
```
Browser → POST /api/user/login (Bearer token visible in JS!)
        ← Set-Cookie: session
```
❌ **Problem**: Anyone can view page source and steal Bearer token

### New Pattern (Server-Side - Secure)
```
Browser → POST /login/user (to mock server, no tokens!)
Mock Server → POST /api/user/login (Bearer token secret!)
            ← Login token
Mock Server → Redirect browser with login token
Browser → GET /api/exchange-token?loginToken=...
        ← Set-Cookie: session
```
✅ **Solution**: Bearer tokens never leave the server

---

## 🎯 When to Use Each

### Use Standalone Mock Server When:
- ✅ Testing server-to-server integration locally
- ✅ Learning how production apps should integrate
- ✅ Demonstrating secure authentication
- ✅ Developing/debugging integration code

### Use Old Mock App (docs/index.html) When:
- ✅ Quick browser-based testing
- ✅ You don't care about token security (dev only!)
- ✅ Testing from GitHub Pages

### Use Production Integration When:
- ✅ Real application deployment
- ✅ Production traffic
- ✅ Enterprise applications
- ✅ See `/SERVER_INTEGRATION.md` for code examples

---

## 📊 Comparison

| Aspect | Old Mock App | New Mock Server | Production App |
|--------|--------------|-----------------|----------------|
| **Runs** | Browser only | Node.js server | Your backend |
| **Tokens** | Client-side | Server-side | Server-side |
| **Security** | ❌ Exposed | ✅ Secure | ✅ Secure |
| **Pattern** | Testing only | Real pattern | Real pattern |
| **Deployment** | GitHub Pages | Local only | Your infra |

---

## 🛑 Important Notes

1. **Mock server is for local testing only** - Don't deploy it
2. **Tokens in .env are still sensitive** - Don't commit .env
3. **Old mock app still works** - Backward compatible
4. **New changes required in Gifts App** - Login token system added

---

## 🔧 Troubleshooting

**Port 3001 already in use?**
```bash
# Change port in .env
PORT=3002
```

**Can't connect to local Gifts App?**
```bash
# Make sure Gifts App is running
cd /Users/jmpm/intobridge/gifts
npm run dev
```

**Authentication fails?**
```bash
# Check tokens in .env match Gifts App environment variables
# Verify you're using correct environment (local/dev/prod)
```

---

## 📚 Additional Documentation

- **Mock Server Details**: `/mock-server/README.md`
- **Production Integration**: `/SERVER_INTEGRATION.md`
- **Gifts App**: Main README.md

---

## ✅ Summary

The standalone mock server:
- ✅ Runs separately from Gifts App
- ✅ Uses secure server-to-server authentication
- ✅ Demonstrates production patterns
- ✅ Works with local, dev, and prod environments
- ✅ Keeps Bearer tokens on server (never in browser)

This is the **correct way** to integrate with the Gifts App! 🎯

