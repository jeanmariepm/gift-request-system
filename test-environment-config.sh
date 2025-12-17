#!/bin/bash

echo "========================================="
echo "  Environment Configuration Test"
echo "========================================="
echo ""

# Read the HTML file and extract environment URLs
echo "Checking environment URL configuration in mock app..."
echo ""

# Extract URLs from ENVIRONMENT_URLS object
local_url=$(grep -A 3 "ENVIRONMENT_URLS = {" /Users/jmpm/intobridge/gifts/docs/index.html | grep "local:" | sed "s/.*'\(.*\)'.*/\1/")
dev_url=$(grep -A 3 "ENVIRONMENT_URLS = {" /Users/jmpm/intobridge/gifts/docs/index.html | grep "development:" | sed "s/.*'\(.*\)'.*/\1/" | head -1)
prod_url=$(grep -A 3 "ENVIRONMENT_URLS = {" /Users/jmpm/intobridge/gifts/docs/index.html | grep "production:" | sed "s/.*'\(.*\)'.*/\1/")

echo "📍 Configured Environment URLs:"
echo "   💻 Local:       $local_url"
echo "   🔧 Development: $dev_url"
echo "   🚀 Production:  $prod_url"
echo ""

# Test Local environment
echo "Testing Local environment..."
if curl -s -f "$local_url/api/session" > /dev/null 2>&1; then
    echo "   ✅ Local environment reachable"
else
    echo "   ⚠️  Local environment not responding (server may not be running)"
fi
echo ""

# Test Development environment  
echo "Testing Development environment..."
if echo "$dev_url" | grep -q "vercel.app"; then
    echo "   🔧 Development URL configured: $dev_url"
    if curl -s -f -m 5 "$dev_url" > /dev/null 2>&1; then
        echo "   ✅ Development environment reachable"
    else
        echo "   ⏳ Development environment not yet deployed or not reachable"
        echo "      (This is normal if Vercel preview hasn't finished deploying)"
    fi
else
    echo "   ⚠️  Development URL needs to be updated with actual Vercel preview URL"
fi
echo ""

# Test Production environment
echo "Testing Production environment..."
if curl -s -f -m 5 "$prod_url" > /dev/null 2>&1; then
    echo "   ✅ Production environment reachable"
else
    echo "   ⚠️  Production environment not reachable"
fi
echo ""

echo "========================================="
echo "  Configuration Test Complete"
echo "========================================="
echo ""
echo "📝 Summary:"
echo "   - Mock app has 3 environment options configured"
echo "   - Each environment points to a different Gifts App URL"
echo "   - JavaScript dynamically switches URLs based on selection"
echo ""
echo "🎯 Next Steps:"
echo "   1. Wait for Vercel preview deployment to complete"
echo "   2. Update development URL in docs/index.html"
echo "   3. Test authentication flows in all 3 environments"
echo ""

