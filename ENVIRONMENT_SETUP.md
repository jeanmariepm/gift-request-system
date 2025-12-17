# Environment Setup Guide

This document explains how to configure environment variables for secure deployment across different environments.

## Security Architecture

The Gifts App uses **environment-specific access tokens** and **separate databases** for each environment:

- **Local/Development**: Uses dev tokens and dev database
- **Production**: Uses production tokens and production database

**Critical**: Production tokens should NEVER be accessible from local or development environments.

---

## Required Environment Variables

### 1. DATABASE_URL
PostgreSQL connection string for the database.

**Local/Development**:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/gifts_dev?schema=public"
```

**Production** (Set in Vercel):
```bash
DATABASE_URL="postgresql://prod_user:prod_pass@prod-host:5432/gifts_prod?schema=public"
```

### 2. USER_ACCESS_TOKEN
Token for user authentication to access the Gifts App.

**Local/Development**:
```bash
USER_ACCESS_TOKEN="gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2"
```

**Production** (Set in Vercel):
```bash
USER_ACCESS_TOKEN="gift_access_prod_<GENERATE_UNIQUE_32_CHAR_STRING>"
```

### 3. ADMIN_ACCESS_TOKEN
Token for admin authentication to access the Admin Panel.

**Local/Development**:
```bash
ADMIN_ACCESS_TOKEN="admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

**Production** (Set in Vercel):
```bash
ADMIN_ACCESS_TOKEN="admin_access_prod_<GENERATE_UNIQUE_32_CHAR_STRING>"
```

### 4. NODE_ENV
Environment identifier.

```bash
NODE_ENV="development"  # or "production"
```

---

## Setup Instructions

### Local Development Setup

1. **Copy the example file**:
   ```bash
   cp env.example .env.local
   ```

2. **Generate secure tokens** (optional, dev tokens provided):
   ```bash
   # Generate User Access Token
   echo "USER_ACCESS_TOKEN=\"gift_access_dev_$(openssl rand -hex 32)\""
   
   # Generate Admin Access Token
   echo "ADMIN_ACCESS_TOKEN=\"admin_access_dev_$(openssl rand -hex 32)\""
   ```

3. **Update `.env.local`** with your local database URL and tokens.

4. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

### Production Setup (Vercel)

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add the following environment variables** for **Production**:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `DATABASE_URL` | Your production PostgreSQL connection string | Production |
   | `USER_ACCESS_TOKEN` | Unique production user token | Production |
   | `ADMIN_ACCESS_TOKEN` | Unique production admin token | Production |
   | `NODE_ENV` | `production` | Production |

3. **Generate unique production tokens**:
   ```bash
   # Run locally to generate tokens, then copy to Vercel
   openssl rand -hex 32
   openssl rand -hex 32
   ```

4. **IMPORTANT**: 
   - Production tokens must be **different** from dev tokens
   - Never commit production tokens to Git
   - Never use production tokens in local development

### Development Environment Setup (Vercel Preview)

For the Vercel Preview environment (`dev` branch):

1. **Add environment variables** for **Preview**:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `DATABASE_URL` | Your dev PostgreSQL connection string | Preview |
   | `USER_ACCESS_TOKEN` | Dev user token (same as local) | Preview |
   | `ADMIN_ACCESS_TOKEN` | Dev admin token (same as local) | Preview |
   | `NODE_ENV` | `development` | Preview |

2. **Use the same dev tokens** as local development for consistency.

---

## Mock App Configuration

The mock app (`docs/index.html`) needs to know the correct tokens to authenticate with the Gifts App.

### Token Configuration in Mock App

The mock app has **separate tokens** for each environment:

```javascript
const ACCESS_TOKENS = {
    dev: {
        user: 'gift_access_dev_...',
        admin: 'admin_access_dev_...'
    },
    prod: {
        user: 'gift_access_prod_...',
        admin: 'admin_access_prod_...'
    }
};
```

### For Production Deployment

When deploying the mock app for production use:

1. **Update the production tokens** in `docs/index.html`
2. **Deploy the mock app** separately (not in the same repo/deployment)
3. **Secure the mock app** with appropriate access controls

---

## Security Best Practices

✅ **DO**:
- Use different tokens for dev and production
- Use different databases for dev and production
- Store production secrets only in Vercel dashboard
- Generate tokens using cryptographically secure methods
- Rotate tokens periodically

❌ **DON'T**:
- Never commit `.env`, `.env.local`, or `.env.production` to Git
- Never use production tokens in local development
- Never share production tokens via insecure channels
- Never hardcode tokens in the codebase

---

## Verifying Your Setup

### Local Environment

```bash
# Check if tokens are loaded
npm run dev

# Look for these warnings in the console
# ✓ Tokens loaded successfully (no warnings)
# ✗ If you see "WARNING: Access tokens not configured", check your .env.local
```

### Production Environment

1. Deploy to Vercel
2. Check deployment logs for any token warnings
3. Test authentication from the mock app
4. Verify you can access both user and admin interfaces

---

## Troubleshooting

### "Invalid or missing access token" error

**Cause**: Token mismatch between mock app and Gifts App.

**Solution**:
1. Check that environment variables are set in Vercel
2. Verify the mock app is using the correct token for the environment
3. Ensure the environment selector in the mock app matches the deployment

### "Access Denied" after successful login

**Cause**: Cookie not being set properly (cross-origin issue).

**Solution**:
1. For remote environments (Dev/Prod), the app uses direct URL navigation
2. Ensure the middleware is running and validating tokens
3. Check browser console for cookie-related errors

### Database connection errors

**Cause**: Invalid or missing `DATABASE_URL`.

**Solution**:
1. Verify the connection string format is correct
2. Ensure the database server is accessible from the deployment environment
3. Check that the database exists and has the correct schema

---

## Questions?

If you encounter issues or need clarification, refer to:
- `SECURITY_IMPLEMENTATION.md` - Security architecture details
- `README.md` - General project setup
- Vercel documentation on environment variables
