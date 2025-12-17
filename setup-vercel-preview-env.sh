#!/bin/bash

# Script to set up environment variables for Vercel Preview (dev branch)
# This configures the dev tokens for the preview deployment

echo "🔧 Setting up Vercel Preview Environment Variables..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Set USER_ACCESS_TOKEN for Preview
echo "📝 Setting USER_ACCESS_TOKEN for Preview environment..."
echo "gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2" | vercel env add USER_ACCESS_TOKEN preview

# Set ADMIN_ACCESS_TOKEN for Preview
echo ""
echo "📝 Setting ADMIN_ACCESS_TOKEN for Preview environment..."
echo "admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" | vercel env add ADMIN_ACCESS_TOKEN preview

# Set NODE_ENV for Preview
echo ""
echo "📝 Setting NODE_ENV for Preview environment..."
echo "development" | vercel env add NODE_ENV preview

echo ""
echo "✅ Preview environment variables configured!"
echo ""
echo "Next steps:"
echo "1. Trigger a new deployment: vercel --prod=false"
echo "2. Or push a commit to trigger automatic deployment"
echo ""
echo "Note: DATABASE_URL may need to be set separately if not already configured."

