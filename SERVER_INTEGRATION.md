# Server-to-Server Integration Guide

This guide explains how to integrate your production application with the Gifts App using secure server-to-server authentication.

## Overview

The Gifts App supports two integration modes:

1. **Client-Side Mode** (for testing/mock app): Cookies set directly in API response
2. **Server-Side Mode** (for production): Uses temporary login tokens that are exchanged for session cookies

## Why Server-Side Mode?

When your **backend** calls the Gifts App API, any cookies in the response are sent to your server, not the user's browser. Server-side mode solves this by:

1. Your server gets a temporary login token (5-minute expiration)
2. Your server redirects the user with this token
3. The user's browser exchanges the token for a session cookie
4. The user now has a valid session in the Gifts App

---

## Integration Steps

### Step 1: Store Bearer Tokens Securely

Store these environment variables on your server (never in client code):

```bash
# For user authentication
GIFTS_USER_TOKEN=gift_access_prod_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6

# For admin authentication
GIFTS_ADMIN_TOKEN=gift_admin_prod_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
```

### Step 2: Call Login API

**User Login:**
```http
POST https://gifts-app.com/api/user/login
Authorization: Bearer {GIFTS_USER_TOKEN}
Content-Type: application/json

{
  "userId": "emp12345",
  "userName": "John Doe",
  "userEmail": "john@company.com",
  "country": "USA",           // Optional: read-only data
  "recipientName": "Jane",    // Optional: pre-fill form
  "recipientEmail": "jane@email.com",
  "recipientUsername": "janed"
}
```

**Response:**
```json
{
  "success": true,
  "loginToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "redirectUrl": "/api/exchange-token?loginToken=eyJhbGciOiJIUz..."
}
```

### Step 3: Redirect User to Gifts App

Redirect the user's browser to the `redirectUrl` from the response:

```
https://gifts-app.com/api/exchange-token?loginToken=eyJhbGciOiJIUz...
```

The exchange endpoint will:
- Validate the login token
- Set the session cookie in the user's browser
- Redirect to the appropriate page (home or admin dashboard)

---

## Code Examples

### Node.js/Express

```javascript
const express = require('express');
const fetch = require('node-fetch');

app.get('/request-gift', async (req, res) => {
    const user = req.session.user; // Your app's session
    
    try {
        const response = await fetch(
            'https://gifts-app.com/api/user/login',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.GIFTS_USER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email,
                    country: user.country
                })
            }
        );
        
        const data = await response.json();
        
        if (data.success) {
            // Redirect user to exchange endpoint
            res.redirect(`https://gifts-app.com${data.redirectUrl}`);
        } else {
            res.status(401).send('Authentication failed');
        }
    } catch (error) {
        console.error('Gifts App integration error:', error);
        res.status(500).send('Failed to connect to Gifts App');
    }
});
```

### Python/Flask

```python
import requests
import os
from flask import redirect

@app.route('/request-gift')
def request_gift():
    user = get_current_user()
    
    response = requests.post(
        'https://gifts-app.com/api/user/login',
        headers={
            'Authorization': f'Bearer {os.environ["GIFTS_USER_TOKEN"]}',
            'Content-Type': 'application/json'
        },
        json={
            'userId': user['id'],
            'userName': user['name'],
            'userEmail': user['email'],
            'country': user['country']
        }
    )
    
    if response.ok:
        data = response.json()
        return redirect(f'https://gifts-app.com{data["redirectUrl"]}')
    else:
        return "Authentication failed", 401
```

### PHP

```php
<?php
function redirectToGiftsApp($user) {
    $giftsUrl = 'https://gifts-app.com/api/user/login';
    $token = getenv('GIFTS_USER_TOKEN');
    
    $data = array(
        'userId' => $user['id'],
        'userName' => $user['name'],
        'userEmail' => $user['email'],
        'country' => $user['country']
    );
    
    $options = array(
        'http' => array(
            'header'  => "Content-Type: application/json\r\n" .
                         "Authorization: Bearer {$token}\r\n",
            'method'  => 'POST',
            'content' => json_encode($data)
        )
    );
    
    $context  = stream_context_create($options);
    $result = file_get_contents($giftsUrl, false, $context);
    $response = json_decode($result);
    
    if ($response->success) {
        header("Location: https://gifts-app.com{$response->redirectUrl}");
        exit();
    } else {
        http_response_code(401);
        echo "Authentication failed";
    }
}
?>
```

### Java/Spring Boot

```java
@GetMapping("/request-gift")
public ResponseEntity<?> redirectToGifts(Principal principal) {
    User user = userService.findByUsername(principal.getName());
    
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + giftsUserToken);
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    Map<String, String> requestBody = new HashMap<>();
    requestBody.put("userId", user.getId());
    requestBody.put("userName", user.getName());
    requestBody.put("userEmail", user.getEmail());
    requestBody.put("country", user.getCountry());
    
    HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
    
    ResponseEntity<Map> response = restTemplate.exchange(
        "https://gifts-app.com/api/user/login",
        HttpMethod.POST,
        entity,
        Map.class
    );
    
    if (response.getStatusCode().is2xxSuccessful()) {
        String redirectUrl = (String) response.getBody().get("redirectUrl");
        return ResponseEntity
            .status(HttpStatus.FOUND)
            .location(URI.create("https://gifts-app.com" + redirectUrl))
            .build();
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
    }
}
```

---

## Admin Integration

For admin access, use the admin endpoint:

```http
POST https://gifts-app.com/api/admin/login
Authorization: Bearer {GIFTS_ADMIN_TOKEN}
Content-Type: application/json

{}
```

The flow is identical - you get a login token, redirect the user, and they get a session cookie.

---

## Security Features

### Login Token Properties
- **Short-lived**: 5-minute expiration
- **Single-use**: Can only be exchanged once
- **JWT-signed**: Cannot be forged without SESSION_SECRET
- **Type-specific**: User tokens cannot be used for admin access

### Session Cookie Properties
- **HttpOnly**: Not accessible via JavaScript
- **Secure**: Only sent over HTTPS
- **SameSite**: Lax (same-origin after token exchange)
- **Long-lived**: 8-hour expiration

### Bearer Token Security
- **Server-only**: Never exposed to client-side code
- **Environment-specific**: Different tokens for dev/prod
- **Validated**: Every API call validates token signature

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/user/login` | POST | User authentication (returns login token) |
| `/api/admin/login` | POST | Admin authentication (returns login token) |
| `/api/exchange-token` | GET | Exchange login token for session cookie |

---

## Troubleshooting

**Q: User redirected but not authenticated**  
A: Make sure you're redirecting the user's browser to the full `redirectUrl` returned by the login API

**Q: "Invalid or expired login token"**  
A: Login tokens expire in 5 minutes. Ensure immediate redirect after getting token.

**Q: CORS errors**  
A: Server-to-server calls don't have CORS issues. Only client-side calls do.

**Q: Bearer token exposed in client code**  
A: Never call the login API from client-side code in production. Always server-to-server.

---

## Testing Server-to-Server Mode

You can test with curl:

```bash
# Step 1: Get login token (server-side)
curl -X POST 'https://gifts-app.com/api/user/login' \
  -H 'Authorization: Bearer gift_access_prod_...' \
  -H 'Content-Type: application/json' \
  -d '{"userId":"test", "userName":"Test User"}'

# Response: { "success": true, "loginToken": "...", "redirectUrl": "/api/exchange-token?loginToken=..." }

# Step 2: Visit exchange URL in browser
# Open browser to: https://gifts-app.com/api/exchange-token?loginToken=...
# You'll be redirected with session cookie set
```

---

## Migration from Mock App Pattern

If you're currently using the mock app pattern:

**Before (client-side - insecure for production):**
```javascript
// ❌ Token exposed in browser
fetch('/api/user/login', {
    headers: { 'Authorization': 'Bearer token_visible_to_users' }
});
```

**After (server-side - secure):**
```javascript
// ✅ Token stays on server
app.get('/gift-request', async (req, res) => {
    const response = await fetch('/api/user/login', {
        headers: { 'Authorization': `Bearer ${process.env.TOKEN}` }
    });
    const data = await response.json();
    res.redirect(data.redirectUrl);
});
```

---

## Support

For questions or issues with server-to-server integration, contact your Gifts App administrator.

