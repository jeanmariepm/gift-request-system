# Dual Vercel Deployment Guide (Dev + Prod)

This guide explains how to set up two separate Vercel deployments for development and production environments.

## 🎯 Goal

- **Production**: Live environment for end users
- **Development**: Testing environment with separate database

## 📋 Steps to Create Development Deployment

### Step 1: Create Second Vercel Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository: `jeanmariepm/gift-request-system`
4. Configure the project:
   - **Project Name**: `gift-request-system-dev` (or similar)
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: Leave default
   - **Output Directory**: Leave default

### Step 2: Configure Development Environment Variables

In the new project settings, add these environment variables:

```bash
# Development Database
DATABASE_URL=postgresql://neondb_owner:npg_ol6eIBzVwL5X@ep-late-glitter-ad0d3195-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Session Secret
SESSION_SECRET=dev-secret-key-12345

# Access Tokens (same as production)
NEXT_PUBLIC_ACCESS_TOKEN=gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
NEXT_PUBLIC_ADMIN_ACCESS_TOKEN=admin_access_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Set for**: Production, Preview, Development (all three)

### Step 3: Deploy

Click **"Deploy"** and wait for the build to complete.

Your development deployment will be available at:
```
https://gift-request-system-dev.vercel.app
```

### Step 4: Update Mock App URLs

Once you have your dev deployment URL, update `docs/index.html`:

```javascript
const ENVIRONMENTS = {
    production: {
        giftSystem: 'https://instant-jeanmarie-mariadassous-projects.vercel.app',
        adminPanel: 'https://instant-jeanmarie-mariadassous-projects.vercel.app/admin'
    },
    development: {
        giftSystem: 'https://gift-request-system-dev.vercel.app',  // ← Update this
        adminPanel: 'https://gift-request-system-dev.vercel.app/admin'  // ← Update this
    }
};
```

Commit and push the changes.

---

## 🔄 Deployment Workflow

### Automatic Deployment

Both environments auto-deploy when you push to `main`:

```bash
git push
```

- **Production**: `instant-jeanmarie-mariadassous-projects.vercel.app`
- **Development**: `gift-request-system-dev.vercel.app`

### Branch-Based Deployment (Optional)

To deploy only to dev on certain branches:

1. Create a `dev` branch:
   ```bash
   git checkout -b dev
   ```

2. In Vercel dev project settings:
   - Go to **Settings** → **Git**
   - Set **Production Branch**: `dev`

3. Now:
   - Pushing to `main` → Updates production only
   - Pushing to `dev` → Updates development only

---

## 🌍 Using the Environment Selector

### Mock App

Users can now select their environment on the portal login page:

1. Go to the mock app: `https://jeanmariepm.github.io/gift-request-system/`
2. See **"🌍 Environment"** dropdown
3. Choose:
   - **🚀 Production** - Live environment
   - **🔧 Development** - Testing environment
4. Login to the portal
5. All links will now point to the selected environment

### Selection Persistence

The environment choice is saved in localStorage and persists across sessions until changed.

---

## 📊 Database Separation

| Environment | Vercel Project | Database | URL |
|------------|---------------|----------|-----|
| **Production** | `instant` | Prod Neon DB | `instant-jeanmarie...vercel.app` |
| **Development** | `gift-request-system-dev` | Dev Neon DB | `gift-request-system-dev.vercel.app` |

---

## 🔐 Environment Variables Summary

### Production Project (`instant`)
- `DATABASE_URL` → Production database
- All other vars → Production values

### Development Project (`gift-request-system-dev`)
- `DATABASE_URL` → Development database
- All other vars → Development values (can be same or different)

---

## 🧪 Testing

### Test Development:
1. Select **"🔧 Development"** in mock app
2. Login and submit a test request
3. Check **dev database** on Neon
4. Production remains untouched ✅

### Test Production:
1. Select **"🚀 Production"** in mock app
2. Login and submit a request
3. Check **prod database** on Neon
4. Development remains untouched ✅

---

## 🚨 Important Notes

- Both deployments are public (unless you upgrade to Vercel Pro)
- Use different database for each environment
- Environment selector remembers last choice
- Mock app on GitHub Pages can access both environments
- Keep access tokens the same across environments (or use different ones for extra security)

---

## 📱 Quick Reference

### URLs to Update After Dev Deployment

1. `docs/index.html` - ENVIRONMENTS object
2. Commit and push to GitHub
3. GitHub Pages will auto-update

### Vercel Dashboards

- **Production**: https://vercel.com/jeanmarie-mariadassous-projects/instant
- **Development**: https://vercel.com/jeanmarie-mariadassous-projects/gift-request-system-dev

---

## ✅ Verification Checklist

- [ ] Development Vercel project created
- [ ] Dev environment variables configured
- [ ] Dev deployment successful
- [ ] Mock app updated with dev URL
- [ ] GitHub Pages shows environment selector
- [ ] Can switch between environments
- [ ] Dev requests go to dev database
- [ ] Prod requests go to prod database

