# CORS Configuration Guide

## Overview

Cross-Origin Resource Sharing (CORS) is a security feature that controls which domains can access the Gifts App API. This is necessary because the Mock App (company portal) and the Gifts App run on different origins.

## How CORS Works

When the browser detects a cross-origin request (e.g., from `https://company-portal.com` to `https://gifts-app.vercel.app`), it:

1. **Sends a preflight request** (OPTIONS) to check if the origin is allowed
2. **Checks the response headers** for `Access-Control-Allow-Origin`
3. **Blocks or allows the actual request** based on the response

## Current Configuration

**File**: `/app/api/auth/login/route.ts`

### Default Allowed Origins (Development)

```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:8000',      // Local Python server
  'http://localhost:8080',      // Alternative local port
  'http://127.0.0.1:8000',      // Localhost via IP
]
```

### Dynamic Origin Validation

The code now includes a `getCorsHeaders()` function that:
- Reads the `origin` header from incoming requests
- Checks if it's in the `ALLOWED_ORIGINS` list
- Returns appropriate CORS headers

## Production Configuration

### Option 1: Environment Variable (Recommended)

Set the `ALLOWED_ORIGINS` environment variable on Vercel:

```bash
# In Vercel Dashboard → Settings → Environment Variables
ALLOWED_ORIGINS=https://company-portal.com,https://intranet.yourcompany.com,http://localhost:8000
```

This allows you to:
- Configure different origins for different environments (dev/staging/prod)
- Update origins without code changes
- Keep sensitive domain information out of the codebase

### Option 2: Hardcode in Source

Edit `/app/api/auth/login/route.ts` and add your production domains:

```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:8000',           // Local development
  'https://company-portal.com',      // Production portal
  'https://portal.staging.com',      // Staging environment
  'https://intranet.yourcompany.com' // Internal portal
]
```

## Testing from Another Machine

### Scenario: Testing on Local Network

If you want to test the mock app from another computer on your network:

**1. Find your local IP address:**
```bash
# On Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Example output: 192.168.1.100
```

**2. Add this IP to ALLOWED_ORIGINS:**
```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:8000',
  'http://192.168.1.100:8000',  // Your machine's local IP
]
```

**3. Start both servers:**
```bash
# Terminal 1: Next.js (Gifts App)
npm run dev

# Terminal 2: Python server (Mock App)
cd docs && python3 -m http.server 8000
```

**4. Access from another machine:**
```
http://192.168.1.100:8000/index.html
```

## Security Best Practices

### ✅ DO:
- Use specific origins (not wildcards) in production
- Use environment variables for production domains
- Test CORS configuration before deploying
- Use HTTPS for all production origins
- Keep `Access-Control-Allow-Credentials: true` for cookie support

### ❌ DON'T:
- Use `Access-Control-Allow-Origin: *` with credentials
- Allow all origins in production
- Store production domains in public repositories
- Mix HTTP and HTTPS origins unnecessarily

## Troubleshooting

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause**: The origin is not in the `ALLOWED_ORIGINS` list

**Solution**: Add the origin to the allowed list or environment variable

### Error: "CORS policy: The value of 'Access-Control-Allow-Origin' is not equal to the supplied origin"

**Cause**: The origin header doesn't match any allowed origin

**Solution**: 
1. Check the exact origin in the browser console
2. Add it to `ALLOWED_ORIGINS` (including protocol and port)
3. Restart the dev server or redeploy

### Error: "Credentials flag is true, but Access-Control-Allow-Credentials is not"

**Cause**: Cookie credentials are being sent, but CORS doesn't allow it

**Solution**: Ensure `'Access-Control-Allow-Credentials': 'true'` is in the response headers

## Production Deployment Checklist

- [ ] Set `ALLOWED_ORIGINS` environment variable in Vercel
- [ ] Test authentication from production portal domain
- [ ] Verify cookies are being set correctly
- [ ] Check browser console for CORS errors
- [ ] Update mock app `VERCEL_URL` to production URL
- [ ] Deploy mock app to production domain (if applicable)
- [ ] Remove development origins from production environment

## Example: Complete Production Setup

### 1. Vercel Environment Variables
```
ALLOWED_ORIGINS=https://portal.company.com,https://hr.company.com
DATABASE_URL=postgresql://...
```

### 2. Mock App Configuration (docs/index.html)
```javascript
const VERCEL_URL = 'https://gifts-app.vercel.app';
```

### 3. Deploy Both Apps
```bash
# Gifts App (Next.js)
vercel --prod

# Mock App (static HTML)
# Deploy to portal.company.com
```

## Same-Origin Alternative (No CORS Needed)

**Best Solution for Production**: Deploy the mock app to the same domain as the Gifts App using a reverse proxy or subdirectory:

```
https://company-portal.com/gifts      → Gifts App
https://company-portal.com/simulator  → Mock App
```

This eliminates CORS entirely because both apps share the same origin!

## Need Help?

If you encounter CORS issues:
1. Check the browser console for the exact error message
2. Verify the origin matches exactly (including protocol and port)
3. Ensure the server has been restarted after configuration changes
4. Test with curl to isolate browser-specific issues:

```bash
curl -X OPTIONS http://localhost:3000/api/auth/login \
  -H "Origin: http://localhost:8000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

