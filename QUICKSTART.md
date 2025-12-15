# Quick Start Guide

Get your Gift Request System running in 5 minutes!

## Step 1: Install Dependencies (1 minute)

```bash
npm install
```

## Step 2: Set Up Environment Variables (2 minutes)

Create a `.env` file in the root directory:

```env
# Copy this and replace with your values

# Database - For local testing, use a local PostgreSQL instance
DATABASE_URL="postgresql://postgres:password@localhost:5432/gifts_db?schema=public"

# Admin Credentials - CHANGE THESE!
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="changeme123"

# Session Secret - Generate a random string
SESSION_SECRET="your-random-secret-key-here"
```

**Don't have PostgreSQL locally?** Use a free cloud database:
- [Neon](https://neon.tech) - Free PostgreSQL
- [Supabase](https://supabase.com) - Free PostgreSQL
- [ElephantSQL](https://www.elephantsql.com) - Free PostgreSQL

## Step 3: Initialize Database (1 minute)

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

Open your browser to test!

## Test URLs

### User Form (with sample data)
```
http://localhost:3000/?userId=user123&userName=John%20Doe&userEmail=john@example.com&companyName=Acme%20Corp&department=Engineering
```

### View User Submissions
```
http://localhost:3000/my-submissions?userId=user123
```

### Admin Login
```
http://localhost:3000/admin
```
- Username: `admin` (or what you set in .env)
- Password: `changeme123` (or what you set in .env)

## What to Do Next

1. ✅ Test submitting a gift request
2. ✅ Check the user submissions page
3. ✅ Login to admin panel and approve the request
4. 📝 Customize gift types in `app/page.tsx`
5. 🎨 Adjust styling in `app/globals.css`
6. 🚀 Deploy to Vercel (see DEPLOYMENT.md)

## Common Issues

### "Can't connect to database"
- Is PostgreSQL running?
- Is DATABASE_URL correct?
- Can you connect with `psql` or a database client?

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then `npm install`

### "Prisma client not generated"
- Run `npx prisma generate`
- Restart dev server

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

## Project Structure Quick Reference

```
/app
  page.tsx                    # Main form (user fills gift request)
  /my-submissions/page.tsx    # User views their submissions
  /admin/page.tsx            # Admin login
  /admin/dashboard/page.tsx  # Admin reviews/approves submissions
  /api/submissions/          # Form submission API
  /api/admin/               # Admin APIs
  
/lib
  prisma.ts                  # Database client
  auth.ts                    # Admin authentication
  
/prisma
  schema.prisma              # Database schema
```

## Customization Tips

### Change Form Fields

Edit `prisma/schema.prisma` → Add field → `npx prisma db push` → Update `app/page.tsx`

### Change Colors

Edit `app/globals.css` → Update gradient colors and theme

### Change Gift Types

Edit `app/page.tsx` → Find the select dropdown → Add/remove options

### Add Email Notifications

Install nodemailer or use service like SendGrid, add to API routes

## Need Help?

- Check README.md for detailed documentation
- See DEPLOYMENT.md for production deployment
- Review code comments for explanations

---

**🎉 You're all set! Start customizing and deploying your gift request system.**

