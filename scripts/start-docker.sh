#!/bin/bash

echo "🎁 Gift Request System - Docker Setup"
echo "====================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "🐳 Starting services..."

# Use development compose file for local testing
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

echo "🎉 Services started!"
echo ""
echo "📝 Access URLs:"
echo "   • Main App: http://localhost:3000"
echo "   • Admin Panel: http://localhost:3000/admin"
echo ""
echo "🔑 Test URLs (with tokens):"
echo "   • User Access: http://localhost:3000/?token=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2&userId=123&userName=John%20Doe&userEmail=john@test.com"
echo "   • Admin Access: http://localhost:3000/admin?adminToken=admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
echo ""
echo "🗄️  Database: PostgreSQL running on localhost:5432"
echo "   • Username: postgres"
echo "   • Password: password"
echo "   • Database: gifts_dev"