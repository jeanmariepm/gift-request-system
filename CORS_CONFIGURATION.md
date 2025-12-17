# CORS Configuration Guide

## Overview

Cross-Origin Resource Sharing (CORS) is a security feature that controls which domains can access the Gifts App API. This is necessary because the Mock App (company portal) and the Gifts App run on different origins.

## Security Model

The Gifts App's security is enforced through:
1. ✅ **Token validation** - Every request must include a valid access token
2. ✅ **HTTP-only cookies** - Session data is not accessible via JavaScript
3. ✅ **SameSite cookies** - Protection against CSRF attacks

Because authentication is enforced at the token level, CORS restrictions can be relaxed.

## How CORS Works

When the browser detects a cross-origin request (e.g., from `https://company-portal.com` to `https://gifts-app.vercel.app`), it:

1. **Sends a preflight request** (OPTIONS) to check if the origin is allowed
2. **Checks the response headers** for `Access-Control-Allow-Origin`
3. **Blocks or allows the actual request** based on the response

## Current Configuration

**File**: `/app/api/auth/login/route.ts`

### Default: Allow All Origins ✨

```typescript
const ALLOWED_ORIGINS = null  // null = allow all origins

function getCorsHeaders(request) {
  // Allow all origins by reflecting the request origin
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
  }
}
```

**This means**:
- ✅ Works from any machine (localhost, local network IP, remote server)
- ✅ Works on any port (8000, 8080, 3000, etc.)
- ✅ No configuration needed for testing or deployment
- ✅ Security is enforced by token validation, not CORS

### Optional: Restrict to Specific Origins

If you want to restrict access to specific domains, set the `ALLOWED_ORIGINS` environment variable:

```bash
# In Vercel Dashboard or .env.local
ALLOWED_ORIGINS=https://portal.company.com,https://intranet.company.com
```

The code will automatically switch to restricted mode when this variable is set.

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

With the default configuration (all origins allowed), testing from another machine is simple:

**1. Find your local IP address:**
```bash
# On Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows
ipconfig

# Example output: 192.168.1.100
```

**2. Start both servers:**
```bash
# Terminal 1: Next.js (Gifts App)
npm run dev

# Terminal 2: Python server (Mock App)
cd docs && python3 -m http.server 8000
```

**3. Access from another machine:**
```
http://192.168.1.100:8000/index.html
```

**That's it!** No configuration changes needed. ✨

The mock app will automatically connect to your Next.js server, and CORS will allow the request from any origin.

## Security Best Practices

### ✅ DO:
- ✅ **Rely on token validation** - This is your primary security layer
- ✅ **Use HTTP-only cookies** - Already implemented for session storage
- ✅ **Use HTTPS in production** - For the Gifts App and company portal
- ✅ **Keep tokens secret** - Never expose them in client-side code
- ✅ **Rotate tokens regularly** - Change `REQUIRED_ACCESS_TOKEN` periodically
- ✅ **Monitor authentication logs** - Track failed authentication attempts

### 🔒 Why Allowing All Origins is Safe:

**Without Token**: CORS blocked ❌  
**With Invalid Token**: Authentication fails ❌  
**With Valid Token**: Authentication succeeds ✅  

The token is the gatekeeper, not CORS.

### 🎯 When to Restrict Origins:

You might want to set `ALLOWED_ORIGINS` if:
- Compliance requirements mandate origin restrictions
- You want defense-in-depth (multiple security layers)
- You want to prevent specific domains from attempting authentication
- Your security policy requires explicit allowlists

### ❌ DON'T:
- ❌ Expose tokens in URLs (we use POST body ✅)
- ❌ Store tokens in localStorage (we use HTTP-only cookies ✅)
- ❌ Commit production tokens to git
- ❌ Use the same tokens for dev and production
- ❌ Share tokens across different applications

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

