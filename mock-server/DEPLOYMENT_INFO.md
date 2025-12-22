# Mock Server Deployment Information

## 🌐 Live Deployment

**URL:** https://gifts-mock-server.vercel.app

**Deployment Date:** December 21, 2025

**Platform:** Vercel (Separate App)

---

## 📦 What Was Deployed

The mock server has been deployed as a **standalone Vercel application**, separate from the main Gifts App. This allows for:

- Independent testing without affecting the main app
- Secure server-side token management
- Testing against multiple Gifts App environments

---

## 🔐 Environment Variables

All environment variables have been set via Vercel CLI:

| Variable | Environments | Status |
|----------|--------------|--------|
| `USER_TOKEN_LOCAL` | Production, Preview, Development | ✅ Set |
| `ADMIN_TOKEN_LOCAL` | Production, Preview, Development | ✅ Set |
| `USER_TOKEN_DEV` | Production, Preview, Development | ✅ Set |
| `ADMIN_TOKEN_DEV` | Production, Preview, Development | ✅ Set |
| `USER_TOKEN_PROD` | Production, Preview, Development | ✅ Set |
| `ADMIN_TOKEN_PROD` | Production, Preview, Development | ✅ Set |

**URLs configured in `vercel.json`:**
- Local: `http://localhost:3000`
- Development: `https://instant-jmariada-2544-jeanmarie-mariadassous-projects.vercel.app`
- Production: `https://instant-sigma-drab.vercel.app`

---

## 🔗 Access Points

### For End Users
- **Live URL:** https://gifts-mock-server.vercel.app
- **Docs redirect:** Both `/docs/index.html` and `/public/docs/index.html` now redirect to the live mock server

### For Developers
- **Local:** `cd mock-server && npm start` → http://localhost:3001
- **Repository:** `/Users/jmpm/intobridge/gifts/mock-server/`

---

## 🚀 Deployment Commands Used

```bash
# Initial deployment
cd mock-server
vercel --yes

# Set environment variables (repeated for each variable and environment)
printf "token_value" | vercel env add VARIABLE_NAME production
printf "token_value" | vercel env add VARIABLE_NAME preview
printf "token_value" | vercel env add VARIABLE_NAME development

# Redeploy to apply environment variables
vercel --prod
```

---

## 📊 Deployment URLs

| Type | URL |
|------|-----|
| **Production** | https://gifts-mock-server.vercel.app |
| **Latest Build** | https://gifts-mock-server-fxub82qu3-jeanmarie-mariadassous-projects.vercel.app |
| **Alt URLs** | https://gifts-mock-server-jeanmarie-mariadassous-projects.vercel.app |
| | https://gifts-mock-server-jmariada-2544-jeanmarie-mariadassous-projects.vercel.app |

---

## 🔄 How to Update

### Update Code
```bash
cd mock-server
vercel --prod
```

### Update Environment Variables
```bash
# Add or update a variable
printf "new_value" | vercel env add VARIABLE_NAME production

# List all variables
vercel env ls

# Remove a variable
vercel env rm VARIABLE_NAME production
```

### View Logs
```bash
vercel logs gifts-mock-server.vercel.app
```

---

## 🧪 Testing

### Test User Login
1. Visit https://gifts-mock-server.vercel.app
2. Select an environment (Local/Development/Production)
3. Switch to "User Login" tab
4. Fill in user details
5. Click "Login as User"
6. You'll be redirected to the Gifts App with a login token

### Test Admin Login
1. Visit https://gifts-mock-server.vercel.app
2. Select an environment
3. Switch to "Admin Login" tab
4. Click "Login as Admin"
5. You'll be redirected to the Gifts App admin dashboard

---

## 📝 Files Modified

1. **`vercel.json`** - Added Vercel configuration for deployment
2. **`.vercelignore`** - Added files to exclude from deployment
3. **`DEPLOY.md`** - Created deployment guide
4. **`README.md`** - Updated with live deployment URL
5. **`/docs/index.html`** - Updated to redirect to live mock server
6. **`/public/docs/index.html`** - Updated to redirect to live mock server
7. **`DEPLOYMENT_INFO.md`** - This file

---

## 🛡️ Security Notes

- All Bearer tokens are stored as **encrypted environment variables** in Vercel
- Tokens are **never exposed** to the browser
- The mock server makes **server-to-server API calls** to the Gifts App
- Login tokens are **short-lived** (5 minutes) and **single-use**

---

## 📞 Troubleshooting

### Mock server not working?
- Check deployment status: https://vercel.com/jeanmarie-mariadassous-projects/gifts-mock-server
- View logs: `vercel logs gifts-mock-server.vercel.app`
- Verify environment variables: `vercel env ls`

### Can't authenticate?
- Verify tokens in environment variables match the Gifts App's expected tokens
- Check that the correct environment is selected (Local/Dev/Prod)
- Ensure the Gifts App URLs in `vercel.json` are correct

### Need to redeploy?
```bash
cd mock-server
vercel --prod
```

---

## 📚 Additional Resources

- **Mock Server README:** `/mock-server/README.md`
- **Deployment Guide:** `/mock-server/DEPLOY.md`
- **Server Integration Guide:** `/SERVER_INTEGRATION.md`
- **Vercel Project:** https://vercel.com/jeanmarie-mariadassous-projects/gifts-mock-server

---

**Deployment Status:** ✅ Active and Running

