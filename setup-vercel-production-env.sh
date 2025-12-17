#!/bin/bash

# Script to set up environment variables for Vercel Production
# Using DEV tokens for now - YOU SHOULD CHANGE THESE TO PRODUCTION TOKENS LATER!

echo "🔧 Setting up Vercel Production Environment Variables..."
echo ""
echo "⚠️  WARNING: Using DEV tokens for production!"
echo "⚠️  Generate unique production tokens later with: openssl rand -hex 32"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Set USER_ACCESS_TOKEN for Production
echo "📝 Setting USER_ACCESS_TOKEN for Production environment..."
echo "gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2" | vercel env add USER_ACCESS_TOKEN production

# Set ADMIN_ACCESS_TOKEN for Production
echo ""
echo "📝 Setting ADMIN_ACCESS_TOKEN for Production environment..."
echo "admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" | vercel env add ADMIN_ACCESS_TOKEN production

# Set NODE_ENV for Production
echo ""
echo "📝 Setting NODE_ENV for Production environment..."
echo "production" | vercel env add NODE_ENV production

echo ""
echo "✅ Production environment variables configured!"
echo ""
echo "⚠️  IMPORTANT: These are DEV tokens. For actual production, generate unique tokens:"
echo "   openssl rand -hex 32"
echo ""
echo "Next steps:"
echo "1. Trigger a new deployment: vercel --prod"
echo "2. Or the deployment should automatically use these variables"
echo ""

