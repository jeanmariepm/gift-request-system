#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "  Gift App Authentication Flow Tests"
echo "========================================="
echo ""

BASE_URL="http://localhost:3000"
USER_TOKEN="gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2"
ADMIN_TOKEN="admin_access_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

# Test 1: User Authentication via POST
echo -e "${YELLOW}Test 1: User Authentication via POST API${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:8000" \
  -d '{
    "token": "'$USER_TOKEN'",
    "userId": "test123",
    "userName": "Test User",
    "userEmail": "test@company.com",
    "env": "development"
  }' \
  -c /tmp/user_cookies.txt)

http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
  echo -e "${GREEN}✓ User authentication successful${NC}"
  echo "  Response: $body"
else
  echo -e "${RED}✗ User authentication failed (HTTP $http_code)${NC}"
  echo "  Response: $body"
fi
echo ""

# Test 2: Verify user session was created
echo -e "${YELLOW}Test 2: Verify User Session${NC}"
session_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/session" \
  -b /tmp/user_cookies.txt)

http_code=$(echo "$session_response" | tail -n 1)
body=$(echo "$session_response" | sed '$d')

if [ "$http_code" == "200" ]; then
  echo -e "${GREEN}✓ User session verified${NC}"
  echo "  Session data: $body"
else
  echo -e "${RED}✗ User session verification failed (HTTP $http_code)${NC}"
  echo "  Response: $body"
fi
echo ""

# Test 3: Admin Authentication via GET (middleware)
echo -e "${YELLOW}Test 3: Admin Authentication via GET (Middleware)${NC}"
admin_response=$(curl -s -w "\n%{http_code}" -L \
  "$BASE_URL/admin?adminToken=$ADMIN_TOKEN&env=development" \
  -c /tmp/admin_cookies.txt)

http_code=$(echo "$admin_response" | tail -n 1)

if [ "$http_code" == "200" ]; then
  echo -e "${GREEN}✓ Admin authentication successful${NC}"
  echo "  Redirected to admin dashboard"
else
  echo -e "${RED}✗ Admin authentication failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 4: Verify admin session was created
echo -e "${YELLOW}Test 4: Verify Admin Session${NC}"
admin_session_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/admin/session" \
  -b /tmp/admin_cookies.txt)

http_code=$(echo "$admin_session_response" | tail -n 1)
body=$(echo "$admin_session_response" | sed '$d')

if [ "$http_code" == "200" ]; then
  echo -e "${GREEN}✓ Admin session verified${NC}"
  echo "  Session data: $body"
else
  echo -e "${RED}✗ Admin session verification failed (HTTP $http_code)${NC}"
  echo "  Response: $body"
fi
echo ""

# Test 5: Invalid user token
echo -e "${YELLOW}Test 5: Invalid User Token (Should Fail)${NC}"
invalid_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalid_token",
    "userId": "test123",
    "userName": "Test User"
  }')

http_code=$(echo "$invalid_response" | tail -n 1)
body=$(echo "$invalid_response" | sed '$d')

if [ "$http_code" == "401" ]; then
  echo -e "${GREEN}✓ Invalid token correctly rejected${NC}"
  echo "  Response: $body"
else
  echo -e "${RED}✗ Invalid token not properly rejected (HTTP $http_code)${NC}"
  echo "  Response: $body"
fi
echo ""

# Test 6: CORS headers
echo -e "${YELLOW}Test 6: CORS Headers (Allow Any Origin)${NC}"
cors_response=$(curl -s -i -X OPTIONS "$BASE_URL/api/auth/login" \
  -H "Origin: http://example.com:9999" \
  -H "Access-Control-Request-Method: POST" | grep -i "access-control")

if echo "$cors_response" | grep -q "access-control-allow-origin"; then
  echo -e "${GREEN}✓ CORS headers present${NC}"
  echo "$cors_response"
else
  echo -e "${RED}✗ CORS headers missing${NC}"
fi
echo ""

# Cleanup
rm -f /tmp/user_cookies.txt /tmp/admin_cookies.txt

echo "========================================="
echo "  Tests Complete"
echo "========================================="

