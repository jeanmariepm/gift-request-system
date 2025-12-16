# Environment Setup Guide

## 🌍 Environments

This project uses two separate environments:

### 1. Development (Local)
- **Purpose**: Testing and development
- **Database**: Separate development database on Neon
- **Config**: `.env.local` file
- **Access**: Only you

### 2. Production (Vercel)
- **Purpose**: Live application
- **Database**: Production database on Neon
- **Config**: Vercel environment variables
- **Access**: End users

---

## 📝 Setup Instructions

### Initial Setup

#### 1. Create Development Database

**Option A: New Neon Database**
1. Go to https://console.neon.tech
2. Create a new project: "gifts-dev"
3. Copy the connection string

**Option B: Local SQLite (for quick testing)**
```bash
# Use SQLite for local dev
DATABASE_URL="file:./dev.db"
```

#### 2. Configure Local Environment

Edit `.env.local` with your dev database URL:
```bash
DATABASE_URL="postgresql://user:pass@host/gifts_dev?sslmode=require"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
SESSION_SECRET="dev-secret-12345"
NEXT_PUBLIC_ACCESS_TOKEN="gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2"
NEXT_PUBLIC_ADMIN_ACCESS_TOKEN="admin_access_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

#### 3. Initialize Development Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to dev database
npx prisma db push

# (Optional) Seed with test data
npx prisma db seed
```

#### 4. Verify Production is Separate

**Vercel Environment Variables** (already set):
- `DATABASE_URL` → Production Neon database
- `ADMIN_USERNAME` → admin
- `ADMIN_PASSWORD` → admin123
- `SESSION_SECRET` → (your production secret)
- `NEXT_PUBLIC_ACCESS_TOKEN` → (your token)
- `NEXT_PUBLIC_ADMIN_ACCESS_TOKEN` → (your admin token)

---

## 🚀 Usage

### Local Development
```bash
# Uses .env.local (dev database)
npm run dev
```

### Production (Vercel)
```bash
# Uses Vercel environment variables (prod database)
git push
# Vercel auto-deploys
```

### Test Production Build Locally
```bash
# Uses .env.production.local or .env.local
npm run build
npm start
```

---

## 🔍 Verify Separation

### Check which database you're using:
```bash
# In your app code (for debugging)
console.log('Database:', process.env.DATABASE_URL?.substring(0, 30) + '...')
```

### Common Issues:

**Problem**: Local dev using production database
**Solution**: Check `.env.local` exists and has correct DATABASE_URL

**Problem**: Vercel using wrong database
**Solution**: Check Vercel dashboard → Project → Settings → Environment Variables

---

## 📊 Database Management

### View Dev Database:
```bash
npx prisma studio
```

### Reset Dev Database:
```bash
npx prisma db push --force-reset
```

### Backup Production Database:
Use Neon's built-in backup feature in the dashboard

---

## 🔐 Security

- ✅ `.env.local` is in `.gitignore` (not committed)
- ✅ Production secrets are in Vercel (encrypted)
- ✅ Never commit database URLs or secrets to git

---

## 📁 File Priority (Next.js)

Next.js loads environment variables in this order:

1. `.env.local` (highest priority, gitignored)
2. `.env.production.local` (production build, gitignored)
3. `.env.development.local` (development, gitignored)
4. `.env.production` (production, can be committed)
5. `.env.development` (development, can be committed)
6. `.env` (lowest priority, can be committed)

For this project:
- **Development**: Uses `.env.local`
- **Production**: Uses Vercel environment variables

