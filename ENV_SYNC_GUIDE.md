# Environment Variables Sync Guide

This guide explains how to manage environment variables across different Vercel environments using the automated sync tool.

## 📁 Environment Files

The project uses environment-specific files to manage configuration:

| File | Purpose | Vercel Environment |
|------|---------|-------------------|
| `env.example` | Template with instructions | N/A (documentation) |
| `env.preview` | Dev/Testing configuration | Preview & Development |
| `env.production` | Production configuration | Production |
| `.env.local` | Local development (not committed) | Local machine only |

---

## 🚀 Quick Start

### 1. Configure Your Environment Files

#### For Preview/Development (env.preview):
```bash
# Already configured with dev tokens
# Update DATABASE_URL if needed for your dev database
```

#### For Production (env.production):
```bash
# Edit env.production and replace:
# 1. DATABASE_URL with your production database
# 2. Generate unique production tokens:

openssl rand -hex 32  # Use for USER_ACCESS_TOKEN
openssl rand -hex 32  # Use for ADMIN_ACCESS_TOKEN
```

### 2. Sync to Vercel

The sync script reads your env files and pushes them to Vercel:

```bash
# Sync to Preview environment (dev branch)
./sync-env-to-vercel.sh preview

# Sync to Development environment
./sync-env-to-vercel.sh development

# Sync to Production (with confirmation prompt)
./sync-env-to-vercel.sh production

# Sync all environments at once
./sync-env-to-vercel.sh all
```

---

## 📋 Detailed Usage

### Initial Setup

1. **Make the script executable** (first time only):
   ```bash
   chmod +x sync-env-to-vercel.sh
   ```

2. **Edit environment files** with your actual values:
   ```bash
   # Edit Preview/Dev settings
   nano env.preview
   
   # Edit Production settings
   nano env.production
   ```

3. **Run the sync** for your target environment:
   ```bash
   ./sync-env-to-vercel.sh preview
   ```

### Updating Environment Variables

When you need to change environment variables:

1. **Edit the appropriate env file**:
   ```bash
   nano env.preview      # For dev/preview
   nano env.production   # For production
   ```

2. **Run the sync script** to update Vercel:
   ```bash
   ./sync-env-to-vercel.sh preview      # Updates preview
   ./sync-env-to-vercel.sh production   # Updates production
   ```

3. **Redeploy** (if needed):
   ```bash
   vercel --prod=false   # For preview deployment
   vercel --prod         # For production deployment
   ```

---

## 🔐 Security Best Practices

### DO ✅

- ✅ **Use different tokens** for dev and production
- ✅ **Keep `env.production` private** (don't share or commit)
- ✅ **Generate strong tokens** using `openssl rand -hex 32`
- ✅ **Use separate databases** for dev and production
- ✅ **Review changes** before syncing to production
- ✅ **Back up production tokens** in a secure password manager

### DON'T ❌

- ❌ Never commit `env.production` to Git (it's in .gitignore)
- ❌ Never use production tokens in development
- ❌ Never share tokens via insecure channels
- ❌ Never use the same DATABASE_URL for dev and production
- ❌ Never skip the confirmation prompt for production

---

## 🛠️ Script Features

### Automatic Conflict Resolution

The script automatically handles existing variables:
- If a variable exists, it removes and re-adds it with the new value
- No manual cleanup needed

### Safety Checks

- ✅ Verifies Vercel CLI is installed
- ✅ Confirms you're in the correct directory
- ✅ Requires confirmation for production syncs
- ✅ Validates env file exists before syncing
- ✅ Shows clear success/error messages

### Batch Operations

Sync all environments at once:
```bash
./sync-env-to-vercel.sh all
```

This will:
1. Sync `env.preview` → Vercel Preview
2. Sync `env.preview` → Vercel Development
3. Ask for confirmation
4. Sync `env.production` → Vercel Production (if confirmed)

---

## 📊 Verification

After syncing, verify your changes:

```bash
# List all environment variables
vercel env ls

# Pull environment variables to a local file (for verification)
vercel env pull .env.vercel.preview

# Check deployment logs
vercel logs
```

---

## 🐛 Troubleshooting

### Script fails with "Vercel CLI is not installed"

**Solution**:
```bash
npm install -g vercel
```

### Script fails with "Environment file not found"

**Solution**: Make sure you're running the script from the project root:
```bash
cd /path/to/project
./sync-env-to-vercel.sh preview
```

### Variables not taking effect after sync

**Solution**: Trigger a new deployment:
```bash
# For preview
vercel --prod=false

# For production
vercel --prod
```

### Permission denied error

**Solution**: Make the script executable:
```bash
chmod +x sync-env-to-vercel.sh
```

### "WARNING: Access tokens not configured" in deployment logs

**Solution**: 
1. Verify variables are set: `vercel env ls`
2. Check for typos in variable names (must be exact: `USER_ACCESS_TOKEN`, `ADMIN_ACCESS_TOKEN`)
3. Redeploy after setting variables

---

## 📚 Related Documentation

- **`SETUP_INSTRUCTIONS.md`** - Initial setup guide
- **`ENVIRONMENT_SETUP.md`** - Detailed security configuration
- **`env.example`** - Template with all variables explained
- **`SECURITY_IMPLEMENTATION.md`** - Security architecture

---

## 🔄 Workflow Examples

### Setting Up a New Environment

```bash
# 1. Edit the env file
nano env.preview

# 2. Sync to Vercel
./sync-env-to-vercel.sh preview

# 3. Deploy
vercel --prod=false

# 4. Test the deployment
# Open your preview URL and verify everything works
```

### Rotating Production Tokens

```bash
# 1. Generate new tokens
echo "USER_ACCESS_TOKEN=\"gift_access_prod_$(openssl rand -hex 32)\""
echo "ADMIN_ACCESS_TOKEN=\"admin_access_prod_$(openssl rand -hex 32)\""

# 2. Update env.production with new tokens
nano env.production

# 3. Update mock app with new production tokens
nano docs/index.html  # Update ACCESS_TOKENS.prod

# 4. Sync to Vercel
./sync-env-to-vercel.sh production

# 5. Deploy
vercel --prod

# 6. Test thoroughly before announcing
```

### Emergency Rollback

If you need to rollback:

```bash
# 1. Restore old values in env file
nano env.production  # Restore previous values

# 2. Sync to Vercel
./sync-env-to-vercel.sh production

# 3. Redeploy
vercel --prod
```

---

## 💡 Tips

1. **Use comments** in your env files to document what each variable is for
2. **Test in preview** before syncing to production
3. **Keep backups** of your production env file in a secure location
4. **Document changes** when you update production tokens
5. **Coordinate with team** before changing production variables

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review `ENVIRONMENT_SETUP.md` for detailed configuration
3. Verify your env files have the correct format (KEY=VALUE, no spaces)
4. Run `vercel env ls` to see what's actually set in Vercel
5. Check deployment logs with `vercel logs`

