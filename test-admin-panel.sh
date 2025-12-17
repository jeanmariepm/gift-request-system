#!/bin/bash

echo "========================================="
echo "  Admin Panel End-to-End Test"
echo "========================================="
echo ""

BASE_URL="http://localhost:3000"
ADMIN_TOKEN="admin_access_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

echo "Step 1: Navigate to /admin with token (simulating mock app link)"
echo "URL: $BASE_URL/admin?adminToken=$ADMIN_TOKEN&env=development"
echo ""

# Follow redirects and save cookies
response=$(curl -s -L -c /tmp/admin_test_cookies.txt -w "\nFINAL_URL:%{url_effective}\nHTTP_CODE:%{http_code}\n" \
  "$BASE_URL/admin?adminToken=$ADMIN_TOKEN&env=development")

final_url=$(echo "$response" | grep "FINAL_URL:" | cut -d: -f2-)
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)

echo "Final URL: $final_url"
echo "HTTP Code: $http_code"
echo ""

if [[ "$final_url" == *"/admin/dashboard"* ]] && [ "$http_code" == "200" ]; then
  echo "✅ Successfully redirected to admin dashboard"
else
  echo "❌ Did not reach admin dashboard"
  echo "Response preview:"
  echo "$response" | head -20
fi
echo ""

echo "Step 2: Check if admin_session cookie was set"
if grep -q "admin_session" /tmp/admin_test_cookies.txt; then
  echo "✅ admin_session cookie found:"
  grep "admin_session" /tmp/admin_test_cookies.txt
else
  echo "❌ admin_session cookie not found"
  cat /tmp/admin_test_cookies.txt
fi
echo ""

echo "Step 3: Verify session API with the cookie"
session_check=$(curl -s -b /tmp/admin_test_cookies.txt "$BASE_URL/api/admin/session")
echo "Session API Response: $session_check"
echo ""

if echo "$session_check" | grep -q "authenticated"; then
  echo "✅ Admin session verified successfully"
else
  echo "❌ Admin session verification failed"
fi
echo ""

echo "Step 4: Access admin dashboard page directly (with cookie)"
dashboard_response=$(curl -s -b /tmp/admin_test_cookies.txt -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/admin/dashboard")
http_code=$(echo "$dashboard_response" | grep "HTTP_CODE:" | cut -d: -f2)

echo "Dashboard HTTP Code: $http_code"

if [ "$http_code" == "200" ]; then
  echo "✅ Admin dashboard page loads successfully"
  
  # Check if page contains expected content
  if echo "$dashboard_response" | grep -q "Admin Dashboard\|All Gift Requests"; then
    echo "✅ Dashboard contains expected content"
  else
    echo "⚠️  Dashboard loaded but content may not be correct"
  fi
else
  echo "❌ Failed to load admin dashboard"
fi
echo ""

# Cleanup
rm -f /tmp/admin_test_cookies.txt

echo "========================================="
echo "  Test Complete"
echo "========================================="

