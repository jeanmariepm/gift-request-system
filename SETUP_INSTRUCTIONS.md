# 🚀 Setup Instructions - Action Required

## ⚠️ IMPORTANT: Environment Variables Need to be Configured

Your codebase has been updated to use **environment variables** for access tokens instead of hardcoded values. This is a critical security improvement!

---

## 📋 What You Need to Do Now

### 1. Local Development Setup

Create a `.env.local` file in the project root with these dev tokens:

```bash
# Copy and paste this into .env.local
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/gifts_dev?schema=public"
USER_ACCESS_TOKEN="gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2"
ADMIN_ACCESS_TOKEN="admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
NODE_ENV="development"
```

**Note**: Update the `DATABASE_URL` with your actual local PostgreSQL credentials.

### 2. Vercel Production Environment Setup

#### Step A: Generate New Production Tokens

Run these commands locally to generate **unique production tokens**:

```bash
# Generate production user token
echo "USER_ACCESS_TOKEN=\"gift_access_prod_$(openssl rand -hex 32)\""

# Generate production admin token
echo "ADMIN_ACCESS_TOKEN=\"admin_access_prod_$(openssl rand -hex 32)\""
```

#### Step B: Add to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production** environment:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `DATABASE_URL` | Your production PostgreSQL URL | Use your prod database |
| `USER_ACCESS_TOKEN` | `gift_access_prod_<generated>` | From Step A |
| `ADMIN_ACCESS_TOKEN` | `admin_access_prod_<generated>` | From Step A |
| `NODE_ENV` | `production` | Literal string |

5. Click **Save**

### 3. Vercel Preview (Dev Branch) Environment Setup

For your `dev` branch deployments:

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add these variables for **Preview** environment:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `DATABASE_URL` | Your dev PostgreSQL URL | Separate from prod! |
| `USER_ACCESS_TOKEN` | `gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2` | Same as local |
| `ADMIN_ACCESS_TOKEN` | `admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` | Same as local |
| `NODE_ENV` | `development` | Literal string |

3. Click **Save**

### 4. Update Mock App Production Tokens

When deploying the mock app for **production** use:

1. Open `docs/index.html`
2. Find the `ACCESS_TOKENS` object (around line 521)
3. Update the **prod tokens** with your generated production tokens:

```javascript
const ACCESS_TOKENS = {
    dev: {
        user: 'gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2',
        admin: 'admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
    },
    prod: {
        user: 'gift_access_prod_YOUR_GENERATED_USER_TOKEN',     // ← Update this
        admin: 'admin_access_prod_YOUR_GENERATED_ADMIN_TOKEN'   // ← Update this
    }
};
```

### 5. Redeploy to Vercel

After setting the environment variables, trigger a new deployment:

```bash
# Either push a new commit
git commit --allow-empty -m "Trigger redeploy with new env vars"
git push origin main

# OR use Vercel CLI
vercel --prod
```

---

## ✅ Verification Checklist

- [ ] Created `.env.local` file for local development
- [ ] Generated unique production tokens
- [ ] Added all environment variables to Vercel (Production)
- [ ] Added all environment variables to Vercel (Preview)
- [ ] Updated mock app production tokens
- [ ] Redeployed to Vercel
- [ ] Tested local environment (`npm run dev`)
- [ ] Tested production environment (access from mock app)
- [ ] Tested development environment (Vercel preview)

---

## 🔒 Security Benefits

✅ **Before**: Tokens hardcoded in source code (visible to anyone with repo access)
✅ **After**: Tokens stored as environment variables (secure, per-environment)

✅ **Before**: Same tokens for dev and production (security risk)
✅ **After**: Separate tokens for each environment (enhanced security)

✅ **Before**: Production database accessible from local dev (risky)
✅ **After**: Separate databases for dev and production (data isolation)

---

## 📚 Additional Resources

- **Detailed Guide**: See `ENVIRONMENT_SETUP.md`
- **Security Architecture**: See `SECURITY_IMPLEMENTATION.md`
- **Environment Variables**: See `env.example`

---

## 🆘 Troubleshooting

### Local development not working

**Error**: "WARNING: Access tokens not configured"

**Solution**: 
1. Ensure `.env.local` exists in the project root
2. Verify it contains all required variables
3. Restart the dev server (`npm run dev`)

### Production deployment not working

**Error**: "Invalid or missing access token"

**Solution**:
1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure all variables are set for "Production" environment
3. Redeploy the application
4. Check deployment logs for errors

### Mock app can't connect

**Error**: "Access Denied" or "Invalid token"

**Solution**:
1. Verify you selected the correct environment (Local/Dev/Prod)
2. Ensure the mock app tokens match the Gifts App environment
3. For production, update the prod tokens in `docs/index.html`

---

## 📞 Need Help?

Refer to the comprehensive guides:
- `ENVIRONMENT_SETUP.md` - Full setup instructions
- `README.md` - General project documentation
- `SECURITY_IMPLEMENTATION.md` - Security architecture details

