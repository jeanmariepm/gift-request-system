# Security - Token-Based Access Control

The Gift Request System now uses token-based authentication to ensure it can **only** be accessed from authorized sources (your main application).

## 🔒 How It Works

### 1. Access Token

A secret token must be passed with every request:
```
gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
```

### 2. Token Validation

Every page validates the token before allowing access:
- ✅ Valid token → User can access the form
- ❌ Invalid/missing token → "Access Denied" error page

### 3. Where Token is Required

Token must be included in the URL for these pages:
- Main form page (`/`)
- My submissions page (`/my-submissions`)

## 🔐 Implementation

### Mock App (Already Configured)

The mock app automatically includes the token:

```javascript
const ACCESS_TOKEN = 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2';

// URL includes token
https://your-app.vercel.app/?token=gift_access_...&userId=123&userName=John...
```

### Your Main Application

To integrate into your real app, include the token in all URLs:

#### JavaScript/React Example

```javascript
const ACCESS_TOKEN = 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2';
const GIFT_SYSTEM_URL = 'https://instant-jeanmarie-mariadassous-projects.vercel.app';

function openGiftRequest(user) {
  const params = new URLSearchParams({
    token: ACCESS_TOKEN,  // ← Required!
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    companyName: user.company,
    department: user.department
  });
  
  window.open(`${GIFT_SYSTEM_URL}/?${params.toString()}`, '_blank');
}
```

#### PHP Example

```php
<?php
define('ACCESS_TOKEN', 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2');
define('GIFT_SYSTEM_URL', 'https://instant-jeanmarie-mariadassous-projects.vercel.app');

function getGiftRequestUrl($user) {
    $params = http_build_query([
        'token' => ACCESS_TOKEN,  // ← Required!
        'userId' => $user['id'],
        'userName' => $user['name'],
        'userEmail' => $user['email'],
        'companyName' => $user['company'],
        'department' => $user['department']
    ]);
    
    return GIFT_SYSTEM_URL . '/?' . $params;
}
?>
```

#### Python/Django Example

```python
ACCESS_TOKEN = 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2'
GIFT_SYSTEM_URL = 'https://instant-jeanmarie-mariadassous-projects.vercel.app'

def get_gift_request_url(user):
    params = {
        'token': ACCESS_TOKEN,  # ← Required!
        'userId': str(user.id),
        'userName': user.get_full_name(),
        'userEmail': user.email,
        'companyName': user.profile.company_name,
        'department': user.profile.department
    }
    
    return f"{GIFT_SYSTEM_URL}/?{urlencode(params)}"
```

## ⚠️ What Happens Without Token

If someone tries to access the gift system directly without the token:

```
https://instant-jeanmarie-mariadassous-projects.vercel.app/?userId=123&userName=Test
```

They will see:

```
🔒
Access Denied

This application can only be accessed through 
the authorized company portal.

Error: Invalid or missing access token
```

## 🔑 Token Management

### Current Token

```
gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2
```

### Where It's Stored

**In Your Environment:**
- `.env` file (local development)
- Vercel environment variables (production)

**In Your Main App:**
- Store as an environment variable or config constant
- **Never** expose in client-side code that users can view

### Changing the Token

To change the access token:

1. **Generate new token:**
   ```bash
   node -e "console.log('gift_access_' + require('crypto').randomBytes(24).toString('hex'))"
   ```

2. **Update .env:**
   ```bash
   NEXT_PUBLIC_ACCESS_TOKEN="your-new-token-here"
   ```

3. **Update Vercel:**
   ```bash
   echo "your-new-token-here" | vercel env add NEXT_PUBLIC_ACCESS_TOKEN production
   ```

4. **Update your main app** with the new token

5. **Update mock app** (`mockapp/index.html`)

6. **Redeploy:**
   ```bash
   vercel --prod
   ```

## 🛡️ Security Best Practices

### ✅ DO:
- Store the token as an environment variable
- Only include token in server-side code
- Use HTTPS (already enabled on Vercel)
- Keep the token secret
- Rotate the token periodically

### ❌ DON'T:
- Hardcode the token in client-side JavaScript (if possible)
- Share the token publicly
- Commit the actual token to Git (use .env)
- Use the same token across different environments

## 🧪 Testing Security

### Test 1: With Token (Should Work)
```
https://instant-jeanmarie-mariadassous-projects.vercel.app/?token=gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2&userId=123&userName=Test
```
✅ Should show the gift request form

### Test 2: Without Token (Should Fail)
```
https://instant-jeanmarie-mariadassous-projects.vercel.app/?userId=123&userName=Test
```
❌ Should show "Access Denied" error

### Test 3: Wrong Token (Should Fail)
```
https://instant-jeanmarie-mariadassous-projects.vercel.app/?token=wrong_token&userId=123&userName=Test
```
❌ Should show "Access Denied" error

## 📝 Integration Checklist

For your main application:

- [ ] Store ACCESS_TOKEN as environment variable
- [ ] Include token in all gift system URLs
- [ ] Test that links work with token
- [ ] Test that direct access fails without token
- [ ] Document token for your team
- [ ] Set up token rotation schedule (optional)

## 🔗 Example URLs

### Gift Request Form
```
https://instant-jeanmarie-mariadassous-projects.vercel.app/?token=gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2&userId=emp123&userName=John%20Doe&userEmail=john@company.com
```

### My Submissions
```
https://instant-jeanmarie-mariadassous-projects.vercel.app/my-submissions?token=gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2&userId=emp123
```

## ℹ️ Note

The admin panel (`/admin`) does NOT require the access token. It uses its own separate authentication system (username/password).

---

**Your gift request system is now secured with token-based access control!** 🔒

