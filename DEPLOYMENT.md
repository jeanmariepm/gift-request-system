# Deployment Guide - Step by Step

This guide will walk you through deploying your Gift Request System to Vercel.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com)
- [ ] Git installed on your computer
- [ ] Project code ready

## Step 1: Set Up Database (Choose One Option)

### Option A: Vercel Postgres (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com) and login
2. Click "Storage" in the sidebar
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name (e.g., "gifts-db")
6. Select region closest to your users
7. Click "Create"
8. **Important**: Copy the connection string starting with `postgres://` - you'll need this later

**Pricing**: Free to start, pay-as-you-go after limits

### Option B: Neon (Good Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Click "Create Project"
4. Choose project name and region
5. Click "Create Project"
6. Copy the connection string from the dashboard
7. **Important**: Make sure to get the pooled connection string

**Pricing**: Free tier includes 0.5GB storage

### Option C: Supabase (Alternative Free Option)

1. Go to [supabase.com](https://supabase.com)
2. Sign up for free account
3. Click "New Project"
4. Fill in project details and set strong password
5. Wait for project to provision (~2 minutes)
6. Go to Settings → Database
7. Copy the connection string (URI format)
8. Replace `[YOUR-PASSWORD]` with your database password

**Pricing**: Free tier includes 500MB storage

## Step 2: Initialize Git Repository

Open terminal in your project folder:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Gift Request System"
```

## Step 3: Push to GitHub

1. Go to [github.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it (e.g., "gift-requests")
4. **Do NOT** initialize with README (we already have files)
5. Click "Create repository"
6. Copy the commands shown and run them:

```bash
git remote add origin https://github.com/YOUR-USERNAME/gift-requests.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### 4.1 Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### 4.2 Configure Project

1. **Framework Preset**: Should auto-detect "Next.js"
2. **Root Directory**: Leave as `./`
3. **Build Command**: Leave default (`next build`)
4. **Output Directory**: Leave default (`.next`)

### 4.3 Add Environment Variables

Click "Environment Variables" and add these:

| Name | Value | Example |
|------|-------|---------|
| `DATABASE_URL` | Your database connection string | `postgres://user:pass@host/db` |
| `ADMIN_USERNAME` | Your admin username | `admin` |
| `ADMIN_PASSWORD` | Your secure admin password | `MySecurePass123!` |
| `SESSION_SECRET` | A random secure string | `your-random-string-here` |

**To generate SESSION_SECRET**, use this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll see a success message with your URL!

## Step 5: Initialize Database Schema

After successful deployment:

### Method A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link to your project:
```bash
vercel link
```

4. Pull environment variables:
```bash
vercel env pull .env.local
```

5. Initialize database:
```bash
npx prisma generate
npx prisma db push
```

### Method B: Using Local Connection

If you have the database URL:

1. Create `.env.local` file:
```env
DATABASE_URL="your-database-url-here"
```

2. Run migration:
```bash
npx prisma generate
npx prisma db push
```

## Step 6: Test Your Deployment

### Test User Form

Visit your deployed URL with parameters:
```
https://your-app.vercel.app/?userId=test123&userName=Test%20User&userEmail=test@example.com&companyName=Test%20Co&department=IT
```

You should see:
- ✅ Form with pre-filled user information
- ✅ Read-only section showing user details
- ✅ Gift request input fields
- ✅ Submit button

### Test Admin Panel

1. Go to: `https://your-app.vercel.app/admin`
2. Login with your `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. You should see the admin dashboard

### Submit Test Form

1. Fill out a test gift request
2. Click "Submit Request"
3. You should see confirmation
4. Go to admin panel and verify submission appears
5. Try changing status from "Pending" to "Processed"

## Step 7: Configure Your Main App

Update your main application to link to the new deployment:

```javascript
// Example: Generate link in your main app
function generateGiftRequestLink(user) {
  const baseUrl = 'https://your-app.vercel.app'
  const params = new URLSearchParams({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    companyName: user.company,
    department: user.department
  })
  
  return `${baseUrl}?${params.toString()}`
}
```

## Troubleshooting

### Build Failed

**Check Vercel build logs for errors:**
- Missing environment variables?
- TypeScript errors?
- Dependency issues?

**Common fixes:**
```bash
# Update dependencies
npm update

# Rebuild locally to test
npm run build
```

### Database Connection Failed

**Verify DATABASE_URL:**
- Check for typos
- Ensure password is URL-encoded (replace special chars)
- For special characters: use URL encoding
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `!` becomes `%21`

**Test connection:**
```bash
# Install Prisma Studio
npx prisma studio
```

### Can't Access Admin Panel

**Check:**
- Environment variables are set correctly
- Admin password doesn't have special characters causing issues
- Clear browser cookies
- Try incognito/private browsing mode

### Form Not Showing Data

**Verify URL parameters:**
- All required params present: `userId`, `userName`, `userEmail`
- Parameters are URL-encoded (spaces as `%20`)
- No typos in parameter names

## Monitoring and Maintenance

### View Logs

In Vercel dashboard:
1. Go to your project
2. Click "Logs" tab
3. Filter by "Errors" to see issues

### Update Environment Variables

1. Go to project settings
2. Click "Environment Variables"
3. Update value
4. Redeploy (Vercel → Deployments → click "..." → Redeploy)

### Database Backups

**Vercel Postgres:**
- Automatic backups in paid plan
- Export manually: Project → Storage → Backups

**Neon:**
- Automatic backups included
- Export: Dashboard → your project → Export

**Supabase:**
- Automatic backups in dashboard
- Settings → Database → Database backups

## Scaling

### When You Exceed Free Tier

Vercel will email you. You can:
1. Upgrade to Pro ($20/month)
2. Optimize to reduce bandwidth
3. Add caching

### Database Growth

Monitor your database size:
- Clean old submissions periodically
- Archive processed requests
- Implement pagination in admin panel

## Cost Estimates

### Small Usage (0-100 submissions/month)
- Vercel: Free
- Database: Free (all options)
- **Total: $0/month**

### Medium Usage (100-1000 submissions/month)
- Vercel: Free - $20/month
- Database: Free - $10/month
- **Total: $0-30/month**

### High Usage (1000+ submissions/month)
- Vercel: $20/month
- Database: $10-50/month
- **Total: $30-70/month**

## Next Steps

After successful deployment:

1. **Security:**
   - [ ] Change admin password from default
   - [ ] Enable 2FA on Vercel account
   - [ ] Review database security settings

2. **Testing:**
   - [ ] Test all form fields
   - [ ] Test admin workflow
   - [ ] Test on mobile devices

3. **Documentation:**
   - [ ] Document admin credentials securely
   - [ ] Train admin users
   - [ ] Create user guide if needed

4. **Monitoring:**
   - [ ] Set up Vercel analytics (optional)
   - [ ] Monitor error logs weekly
   - [ ] Check database usage monthly

## Support Resources

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Prisma Docs**: [prisma.io/docs](https://www.prisma.io/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**🎉 Congratulations!** Your Gift Request System is now live!

Your deployment URLs:
- **User Form**: `https://your-app.vercel.app/`
- **Admin Panel**: `https://your-app.vercel.app/admin`
- **User Submissions**: `https://your-app.vercel.app/my-submissions`

