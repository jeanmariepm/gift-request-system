# Gift Request System

A Next.js web application for managing gift requests with admin approval workflow. Users can submit gift requests that are stored with a "Pending" status, and administrators can review and update the status to "Processed".

## Features

### User Features
- 📝 Submit gift requests with pre-filled user information
- 🔗 Access via link from main application (no separate authentication)
- 📊 View all personal submissions and their status
- ✅ Receive confirmation after successful submission
- 📱 Fully responsive design

### Admin Features
- 🔐 Secure admin login with username/password
- 📋 View all submissions from all users
- 🔄 Change submission status (Pending → Processed)
- 📈 Dashboard with statistics
- 🔍 Filter submissions by status
- 👁️ View detailed submission information

## Tech Stack

- **Frontend**: Next.js 14 (React 18) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Custom CSS
- **Deployment**: Vercel-ready configuration
- **Authentication**: Simple cookie-based admin sessions

## Getting Started

### Quick Demo

Want to see how it works? Check out the **Mock Main App** in the `/mockapp` folder!

```bash
# Open the mock app in your browser
open mockapp/index.html
```

This demonstrates how your main application would integrate with the Gift Request System.

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud-hosted)
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gifts_db?schema=public"

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password-here"

# Session Secret (generate a random string)
SESSION_SECRET="your-secret-key-here"
```

3. **Initialize the database:**

```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### For End Users

Users access the application via a URL with query parameters from your main app:

```
https://your-domain.com/?userId=123&userName=John%20Doe&userEmail=john@example.com&companyName=Acme%20Corp&department=Sales
```

**Required Parameters:**
- `userId` - Unique user identifier from your main app
- `userName` - User's full name
- `userEmail` - User's email address

**Optional Parameters:**
- `companyName` - Company name (displayed as read-only)
- `department` - Department name (displayed as read-only)
- Any other parameters passed to `readOnlyData` JSON field

### For Administrators

1. Navigate to `/admin`
2. Login with configured credentials
3. View and manage all submissions
4. Update submission status

## Database Schema

The `Submission` model includes:

- User information (userId, userName, userEmail)
- Read-only data from main app (stored as JSON)
- User inputs (giftType, recipientName, message, quantity)
- Status tracking (status, processedAt, processedBy)
- Timestamps (createdAt, updatedAt)

## Deployment to Vercel

### Step 1: Prepare Your Database

You'll need a PostgreSQL database. Recommended options:

**Option A: Vercel Postgres (Easiest)**
1. Go to your Vercel project
2. Go to Storage tab
3. Create a Postgres database
4. Vercel will automatically set `DATABASE_URL`

**Option B: Neon (Free Tier)**
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

**Option C: Supabase (Free Tier)**
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database

### Step 2: Deploy to Vercel

1. **Push your code to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

2. **Deploy on Vercel:**

- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure environment variables:
  - `DATABASE_URL` - Your PostgreSQL connection string
  - `ADMIN_USERNAME` - Your admin username
  - `ADMIN_PASSWORD` - Your admin password
  - `SESSION_SECRET` - A random secure string

3. **Deploy:**

Click "Deploy" and wait for the build to complete.

4. **Initialize Database:**

After deployment, run database migrations:

```bash
npx prisma db push
```

Or use Vercel CLI:

```bash
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

### Step 3: Configure Your Main App

Update your main application to link to the deployed URL:

```javascript
const giftRequestUrl = `https://your-app.vercel.app/?userId=${user.id}&userName=${encodeURIComponent(user.name)}&userEmail=${encodeURIComponent(user.email)}&companyName=${encodeURIComponent(company.name)}&department=${encodeURIComponent(user.department)}`
```

## Pricing

### Vercel
- **Free Tier**: Sufficient for small teams (100GB bandwidth/month)
- **Pro Tier**: $20/month (starts when you exceed free limits)
- Automatic scaling based on usage

### Database Options
- **Vercel Postgres**: Pay as you go (starts free)
- **Neon**: Free tier with 0.5GB storage
- **Supabase**: Free tier with 500MB storage

## API Endpoints

### User Endpoints

- `POST /api/submissions` - Create new submission
- `GET /api/submissions?userId={id}` - Get user's submissions

### Admin Endpoints

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/submissions` - Get all submissions (requires auth)
- `PATCH /api/admin/submissions/[id]` - Update submission status (requires auth)

## Security Notes

1. **Admin Password**: Change the default admin password immediately
2. **Session Secret**: Use a strong random string for SESSION_SECRET
3. **Database**: Use SSL in production (add `?sslmode=require` to DATABASE_URL)
4. **User Data**: This app assumes users are authenticated in your main app

## Customization

### Adding Form Fields

1. Update `prisma/schema.prisma` to add new fields
2. Run `npx prisma db push` to update database
3. Update the form in `app/page.tsx`
4. Update API route in `app/api/submissions/route.ts`
5. Update display tables in submission views

### Changing Gift Types

Edit the dropdown options in `app/page.tsx`:

```typescript
<option value="Your Type">Your Type</option>
```

### Styling

All styles are in `app/globals.css`. The design uses a purple gradient theme with modern UI components.

## Development

### Project Structure

```
/app
  /api
    /submissions          # User submission endpoints
    /admin               # Admin endpoints
  /admin                 # Admin pages
  /my-submissions        # User submission list page
  page.tsx              # Main form page
  layout.tsx            # Root layout
  globals.css           # Global styles
/lib
  prisma.ts             # Prisma client
  auth.ts               # Admin authentication
/prisma
  schema.prisma         # Database schema
```

### Running Tests

Currently no tests are configured. To add tests:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if database allows external connections
- For local development, ensure PostgreSQL is running

### Build Errors on Vercel

- Make sure all environment variables are set
- Check build logs for specific errors
- Verify Node.js version compatibility

### Admin Login Not Working

- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
- Clear browser cookies and try again
- Verify password was changed from default

## Support

For issues or questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Documentation](https://vercel.com/docs)

## License

MIT License - feel free to use this for your projects!

