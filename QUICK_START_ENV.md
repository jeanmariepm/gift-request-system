# 🚀 Quick Start: Environment Variables

This is the **fastest way** to manage environment variables from the command line.

---

## ⚡ 3-Step Setup

### 1. Edit Your Environment Files

```bash
# For Preview/Development (already configured)
nano env.preview

# For Production (requires your database URL and tokens)
nano env.production
```

### 2. Run the Sync Script

```bash
# Sync to Vercel Preview (dev branch)
./sync-env-to-vercel.sh preview

# Sync to Vercel Production (with confirmation)
./sync-env-to-vercel.sh production

# Sync all environments at once
./sync-env-to-vercel.sh all
```

### 3. Done! ✅

The script automatically:
- ✅ Reads all variables from your env file
- ✅ Pushes them to Vercel
- ✅ Updates existing variables
- ✅ Shows success/error messages

---

## 📝 Environment File Format

Simple `KEY=VALUE` format:

```bash
# Comments are ignored
DATABASE_URL="postgresql://user:pass@host:5432/db"
USER_ACCESS_TOKEN="gift_access_dev_..."
ADMIN_ACCESS_TOKEN="admin_access_dev_..."
NODE_ENV="development"
```

---

## 🎯 Common Commands

```bash
# Sync Preview environment
./sync-env-to-vercel.sh preview

# Sync Production (asks for confirmation)
./sync-env-to-vercel.sh production

# Sync Development environment
./sync-env-to-vercel.sh development

# Sync all (Preview → Development → Production)
./sync-env-to-vercel.sh all

# Verify what's in Vercel
vercel env ls

# Pull current Vercel env to local file
vercel env pull .env.vercel.preview
```

---

## 🔐 Security Checklist

Before syncing to production:

- [ ] Updated `DATABASE_URL` with production database
- [ ] Generated unique production tokens: `openssl rand -hex 32`
- [ ] Updated `USER_ACCESS_TOKEN` in `env.production`
- [ ] Updated `ADMIN_ACCESS_TOKEN` in `env.production`
- [ ] Updated mock app production tokens in `docs/index.html`
- [ ] Backed up `env.production` in secure password manager

---

## 📚 Full Documentation

For detailed information, see:
- **`ENV_SYNC_GUIDE.md`** - Complete guide with examples
- **`ENVIRONMENT_SETUP.md`** - Security architecture
- **`SETUP_INSTRUCTIONS.md`** - Manual setup alternative

---

## ✅ Already Completed

- ✅ Preview environment synced with dev tokens
- ✅ Production environment synced with dev tokens (temporary!)
- ✅ DATABASE_URL set for Preview
- ✅ All required variables configured

---

## ⚠️ Important Notes

1. **Production currently uses dev tokens** - Generate unique ones!
2. **env.production is tracked in Git** - Contains example values only
3. **Never commit real production secrets** - Use .gitignore if needed
4. **Test in Preview** before syncing to Production

---

## 🐛 Troubleshooting

**Script not executable?**
```bash
chmod +x sync-env-to-vercel.sh
```

**Variables not taking effect?**
```bash
# Verify they're set
vercel env ls

# Trigger new deployment
vercel --prod=false  # For preview
vercel --prod        # For production
```

**Need to see current values?**
```bash
vercel env pull .env.vercel.preview
cat .env.vercel.preview
```

---

That's it! The script handles everything else automatically. 🎉

