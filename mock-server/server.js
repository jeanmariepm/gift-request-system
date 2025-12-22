require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment configuration
const GIFTS_APP_URLS = {
  local: process.env.GIFTS_APP_LOCAL_URL || 'http://localhost:3000',
  development: process.env.GIFTS_APP_DEV_URL || 'https://instant-jmariada-2544-jeanmarie-mariadassous-projects.vercel.app',
  production: process.env.GIFTS_APP_PROD_URL || 'https://instant-sigma-drab.vercel.app'
};

const ACCESS_TOKENS = {
  local: {
    user: process.env.USER_TOKEN_LOCAL || 'gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    admin: process.env.ADMIN_TOKEN_LOCAL || 'gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6'
  },
  development: {
    user: process.env.USER_TOKEN_DEV || 'gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    admin: process.env.ADMIN_TOKEN_DEV || 'gift_admin_dev_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6'
  },
  production: {
    user: process.env.USER_TOKEN_PROD || 'gift_access_prod_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    admin: process.env.ADMIN_TOKEN_PROD || 'gift_admin_prod_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4'
  }
};

// Helper function to get Gifts App URL
function getGiftsAppUrl(env) {
  return GIFTS_APP_URLS[env] || GIFTS_APP_URLS.local;
}

// Helper function to get access token
function getAccessToken(env, type) {
  return ACCESS_TOKENS[env]?.[type] || ACCESS_TOKENS.local[type];
}

// Routes

// Serve main page with no-cache headers
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve other static files
app.use(express.static('public'));

// User login - server-to-server
app.post('/login/user', async (req, res) => {
  const { environment, userId, userName, userEmail, country, recipientName, recipientEmail, recipientUsername } = req.body;
  
  console.log('🔐 User login request:', {
    environment,
    userId,
    userName,
    giftsAppUrl: getGiftsAppUrl(environment)
  });
  
  try {
    const giftsAppUrl = getGiftsAppUrl(environment);
    const token = getAccessToken(environment, 'user');
    
    // Server-to-server call to Gifts App
    const response = await fetch(`${giftsAppUrl}/api/user/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        userName,
        userEmail: userEmail || `${userId}@company.com`,
        country,
        recipientName,
        recipientEmail,
        recipientUsername
      })
    });
    
    const data = await response.json();
    
    console.log('✅ Gifts App response:', {
      status: response.status,
      success: data.success,
      hasLoginToken: !!data.loginToken
    });
    
    if (response.ok && data.success) {
      // Return the full redirect URL to the Gifts App
      res.json({
        success: true,
        redirectUrl: `${giftsAppUrl}${data.redirectUrl}`
      });
    } else {
      console.error('❌ Authentication failed:', data.error);
      res.status(response.status).json({
        success: false,
        error: data.error || 'Authentication failed'
      });
    }
  } catch (error) {
    console.error('❌ Error connecting to Gifts App:', error);
    res.status(500).json({
      success: false,
      error: `Failed to connect to Gifts App: ${error.message}`
    });
  }
});

// Admin login - server-to-server
app.post('/login/admin', async (req, res) => {
  const { environment } = req.body;
  
  console.log('🔐 Admin login request:', {
    environment,
    giftsAppUrl: getGiftsAppUrl(environment)
  });
  
  try {
    const giftsAppUrl = getGiftsAppUrl(environment);
    const token = getAccessToken(environment, 'admin');
    
    // Server-to-server call to Gifts App
    const response = await fetch(`${giftsAppUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    const data = await response.json();
    
    console.log('✅ Gifts App response:', {
      status: response.status,
      success: data.success,
      hasLoginToken: !!data.loginToken
    });
    
    if (response.ok && data.success) {
      // Return the full redirect URL to the Gifts App
      res.json({
        success: true,
        redirectUrl: `${giftsAppUrl}${data.redirectUrl}`
      });
    } else {
      console.error('❌ Authentication failed:', data.error);
      res.status(response.status).json({
        success: false,
        error: data.error || 'Authentication failed'
      });
    }
  } catch (error) {
    console.error('❌ Error connecting to Gifts App:', error);
    res.status(500).json({
      success: false,
      error: `Failed to connect to Gifts App: ${error.message}`
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    giftsAppUrls: GIFTS_APP_URLS
  });
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🎁  Gifts App Mock Server                           ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Configured Gifts App URLs:');
  console.log(`   • Local:       ${GIFTS_APP_URLS.local}`);
  console.log(`   • Development: ${GIFTS_APP_URLS.development}`);
  console.log(`   • Production:  ${GIFTS_APP_URLS.production}`);
  console.log('');
  console.log('🔒 Security: Bearer tokens are stored on server');
  console.log('   Tokens are NEVER exposed to the browser');
  console.log('');
  console.log('📖 Open http://localhost:' + PORT + ' to get started');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully');
  process.exit(0);
});

