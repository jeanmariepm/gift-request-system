# Deploy Mock Server (CLI Only - No Dashboard Setup)

## 🚀 Deploy to Vercel (Recommended)

### One-Time Setup

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login
```

### Deploy

```bash
# Navigate to mock-server directory
cd mock-server

# Deploy (follow prompts)
vercel

# Or deploy to production directly
vercel --prod
```

### Set Environment Variables (via CLI)

```bash
# Set tokens for all environments
vercel env add USER_TOKEN_LOCAL
# Paste: gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
# Select: Production, Preview, Development (all)

vercel env add ADMIN_TOKEN_LOCAL
# Paste: gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6
# Select: Production, Preview, Development (all)

vercel env add USER_TOKEN_DEV
# Paste: gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
# Select: Production, Preview, Development (all)

vercel env add ADMIN_TOKEN_DEV
# Paste: gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6
# Select: Production, Preview, Development (all)

vercel env add USER_TOKEN_PROD
# Paste: gift_access_prod_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
# Select: Production, Preview, Development (all)

vercel env add ADMIN_TOKEN_PROD
# Paste: gift_admin_prod_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
# Select: Production, Preview, Development (all)

# Redeploy to apply environment variables
vercel --prod
```

**Your mock server will be live at:** `https://your-project-name.vercel.app`

---

## 🔧 Deploy to Railway (Alternative)

Railway is great for Node.js apps and requires zero dashboard setup.

### Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project in mock-server directory
cd mock-server
railway init

# Link to new project
railway link
```

### Deploy

```bash
# Deploy
railway up

# Set environment variables (one command each)
railway variables set USER_TOKEN_LOCAL=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
railway variables set ADMIN_TOKEN_LOCAL=gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6
railway variables set USER_TOKEN_DEV=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
railway variables set ADMIN_TOKEN_DEV=gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6
railway variables set USER_TOKEN_PROD=gift_access_prod_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
railway variables set ADMIN_TOKEN_PROD=gift_admin_prod_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
railway variables set GIFTS_APP_LOCAL_URL=http://localhost:3000
railway variables set GIFTS_APP_DEV_URL=https://instant-jmariada-2544-jeanmarie-mariadassous-projects.vercel.app
railway variables set GIFTS_APP_PROD_URL=https://instant-sigma-drab.vercel.app
```

**Your mock server will be live at:** `https://your-project.railway.app`

---

## 🐳 Deploy to Fly.io (For Docker Fans)

Fly.io is CLI-first and great for apps that need persistent servers.

### Setup

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Or on Mac:
brew install flyctl

# Login
fly auth login

# Initialize (creates fly.toml)
cd mock-server
fly launch --no-deploy
```

### Deploy

```bash
# Set environment variables
fly secrets set USER_TOKEN_LOCAL=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
fly secrets set ADMIN_TOKEN_LOCAL=gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6
fly secrets set USER_TOKEN_DEV=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
fly secrets set ADMIN_TOKEN_DEV=gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6
fly secrets set USER_TOKEN_PROD=gift_access_prod_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
fly secrets set ADMIN_TOKEN_PROD=gift_admin_prod_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
fly secrets set GIFTS_APP_LOCAL_URL=http://localhost:3000
fly secrets set GIFTS_APP_DEV_URL=https://instant-jmariada-2544-jeanmarie-mariadassous-projects.vercel.app
fly secrets set GIFTS_APP_PROD_URL=https://instant-sigma-drab.vercel.app

# Deploy
fly deploy
```

**Your mock server will be live at:** `https://your-app.fly.dev`

---

## 📊 Comparison

| Platform | CLI Deploy | Env Vars via CLI | Free Tier | Best For |
|----------|------------|------------------|-----------|----------|
| **Vercel** | ✅ `vercel` | ✅ `vercel env add` | Yes | Serverless, already using it |
| **Railway** | ✅ `railway up` | ✅ `railway variables set` | Yes | Full Node.js apps |
| **Fly.io** | ✅ `fly deploy` | ✅ `fly secrets set` | Yes | Long-running servers |

---

## 🎯 Recommendation

**Use Vercel** since:
- You're already using it for the main app
- Simple serverless deployment
- One command: `vercel`
- Already configured with `vercel.json`

---

## 📝 After Deployment

Once deployed, update `docs/index.html` to redirect to:
```
https://your-mock-server.vercel.app
```

Or create a simple landing page that links to both:
- Local: `http://localhost:3001`
- Remote: `https://your-mock-server.vercel.app`

