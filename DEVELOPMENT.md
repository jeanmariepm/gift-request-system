# Development Guide

## Quick Start

### Using Docker (Recommended)

```bash
# Start the application
make up

# Stop the application
make down

# Clean everything
make clean
```

### Using npm directly

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start PostgreSQL (required)
# Update DATABASE_URL in .env.local

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

## Access URLs

### User Access
```
http://localhost:3000/?token=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2&userId=123&userName=John%20Doe&userEmail=john@test.com
```

**Parameters:**
- `token` - User access token (required)
- `userId` - Unique user ID (required)
- `userName` - User's full name (required)
- `userEmail` - User's email (required)

### Admin Access
```
http://localhost:3000/admin?adminToken=admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Parameters:**
- `adminToken` - Admin access token (required)

## Development Tokens

**User Token:** `gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2`
**Admin Token:** `admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

## Database Access

When using Docker:
- **Host:** localhost
- **Port:** 5432
- **Username:** postgres
- **Password:** password
- **Database:** gifts_dev

```bash
# Connect via command line
make db-shell
```

## Make Commands

- `make up` - Start application with Docker
- `make down` - Stop containers
- `make build` - Build containers
- `make clean` - Clean containers and volumes
- `make logs` - Show application logs
- `make shell` - Open shell in app container
- `make db-shell` - Open PostgreSQL shell
- `make help` - Show all commands

## Testing Flow

1. Start the application: `make up`
2. Access user interface with the user URL above
3. Submit a gift request
4. Access admin interface with the admin URL above
5. Review and process the submission

## Environment Variables

Development environment uses these tokens:
```env
USER_ACCESS_TOKEN=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
ADMIN_ACCESS_TOKEN=admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123
```

## Troubleshooting

### Access Denied
Make sure you're using the correct tokens in the URLs above.

### Database Connection Issues
Ensure PostgreSQL is running and accessible on port 5432.

### Docker Issues
```bash
make clean  # Clean everything
make up     # Start fresh
```