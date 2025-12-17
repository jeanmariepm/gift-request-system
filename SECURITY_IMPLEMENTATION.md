# Security Implementation: Token Validation via Middleware

## Overview

This document describes the enhanced security implementation that prevents sensitive data (tokens, user information) from being exposed in the browser's URL bar and DevTools.

## Problem

Previously, when users accessed the Gifts App from the mock app, all parameters including the access token were visible in the URL:
```
https://yourapp.vercel.app/?token=abc123&userId=emp123&userName=John&userEmail=john@company.com&env=production
```

This exposed sensitive information that could be:
- Copied and shared
- Visible in browser history
- Accessible via DevTools
- Logged by analytics tools

## Solution

We now use **Next.js Middleware** to:
1. Intercept requests with tokens in the URL
2. Validate tokens server-side
3. Store validated data in secure HTTP-only cookies
4. Redirect to clean URLs without parameters

## Implementation Details

### 1. Middleware (`middleware.ts`)

The middleware intercepts all requests and:

#### For User Access (`/` with `token` parameter):
- Validates the access token
- If valid: Stores user data in `user_session` cookie and redirects to clean `/`
- If invalid: Redirects to `/access-denied`

#### For Admin Access (`/admin` with `adminToken` parameter):
- Validates the admin token
- If valid: Stores admin session in `admin_session` cookie and redirects to `/admin/dashboard`
- If invalid: Redirects to `/admin/access-denied`

#### Session Protection:
- Checks for valid `user_session` cookie on protected user routes
- Checks for valid `admin_session` cookie on protected admin routes
- Redirects to appropriate access denied pages if sessions are missing

### 2. Secure Cookies

Cookies are set with these security properties:
- `httpOnly: true` - Not accessible via JavaScript (prevents XSS attacks)
- `secure: true` - Only transmitted over HTTPS in production
- `sameSite: 'lax'` - Protects against CSRF attacks
- `maxAge: 8 hours (users) / 24 hours (admins)` - Automatic expiration

### 3. Session API Endpoints

Since cookies are HTTP-only, client components can't access them directly. We created API routes:

#### `/api/session` (User Session)
- Reads `user_session` cookie
- Returns user data: userId, userName, userEmail, env
- Returns 401 if no session found

#### `/api/admin/session` (Admin Session)
- Reads `admin_session` cookie
- Returns admin data: authenticated, env
- Returns 401 if no session found

### 4. Updated Page Components

Pages now fetch session data from API endpoints instead of URL parameters:

```typescript
// OLD WAY (insecure)
const userId = searchParams.get('userId')
const token = searchParams.get('token')

// NEW WAY (secure)
const response = await fetch('/api/session')
const sessionData = await response.json()
const userId = sessionData.userId
```

## User Flow

### User Access Flow (Secure POST Method):
1. User clicks "Proceed to Gifts App" in mock app
2. **JavaScript sends POST request** to `/api/auth/login` with token in request body
3. Server validates token (token never appears in URL!)
4. Server creates secure HTTP-only session cookie
5. Server responds with redirect URL
6. JavaScript redirects browser to clean URL: `https://app.vercel.app/`
7. Page loads, fetches session from `/api/session`
8. User sees their data, URL is clean, no parameters ever visible

**Key Security Improvement:** Token travels in POST body, **never in URL**
- ✅ No browser history pollution
- ✅ No server access logs with tokens
- ✅ No Referer header leakage
- ✅ No screenshot/recording exposure

### Legacy GET Method (Backward Compatibility):
For transition period, GET method with URL parameters still works but is deprecated:
1. User clicks link: `https://app.vercel.app/?token=abc&userId=emp123&...`
2. Middleware intercepts, validates token
3. Middleware stores data in secure cookie
4. Middleware redirects to clean URL (but parameters were briefly visible)

### Admin Access Flow:
1. Admin clicks link in mock app: `https://app.vercel.app/admin?adminToken=xyz&env=production`
2. Middleware intercepts, validates admin token
3. Middleware stores data in secure cookie
4. Middleware redirects to: `https://app.vercel.app/admin/dashboard` (clean URL)
5. Dashboard loads, fetches session from `/api/admin/session`
6. Admin sees dashboard, but URL is clean

## Security Benefits

### POST Authentication (Recommended)
1. **Token Never in URL**: Travels in request body only
2. **No Browser History Pollution**: Clean URLs from the start
3. **No Server Log Exposure**: Tokens not logged in access logs
4. **No Referer Leakage**: Token not sent in Referer header
5. **No Visual Exposure**: Can't be screenshot or recorded
6. **HTTP-Only Cookies**: Cannot be accessed via JavaScript (XSS protection)
7. **Secure Transmission**: Cookies only sent over HTTPS in production
8. **CSRF Protection**: SameSite cookie attribute prevents cross-site requests
9. **Automatic Expiration**: Sessions expire after set time
10. **Server-Side Validation**: All validation happens server-side

### Comparison: POST vs GET

| Security Aspect | GET (Legacy) | POST (Secure) |
|----------------|--------------|---------------|
| Token in URL | ❌ Yes (briefly) | ✅ Never |
| Browser History | ❌ Contains token | ✅ Clean |
| Server Logs | ❌ Contains token | ✅ Clean |
| Referer Header | ❌ May leak token | ✅ No leakage |
| Screenshot Safe | ❌ No | ✅ Yes |
| Browser Extensions | ❌ Can intercept | ✅ Body only |
| Network Inspection | ❌ Visible | ⚠️ Visible in body |

## Testing

To test the security implementation:

1. **User Flow**: 
   - Access app from mock app
   - Check browser DevTools > Application > Cookies
   - Should see `user_session` cookie with `HttpOnly` flag
   - Check URL bar - should be clean with no parameters
   
2. **Admin Flow**:
   - Access admin panel from mock app
   - Check browser DevTools > Application > Cookies
   - Should see `admin_session` cookie with `HttpOnly` flag
   - Check URL bar - should be clean with no parameters

3. **Invalid Token**:
   - Try accessing with wrong token
   - Should redirect to access denied page

4. **No Session**:
   - Clear cookies
   - Try accessing `/` or `/admin/dashboard` directly
   - Should redirect to access denied pages

## Migration Notes

### What Changed:
- Added `middleware.ts` at project root
- Created `/api/session` and `/api/admin/session` endpoints
- Updated `app/page.tsx` to use session API
- Updated `app/admin/dashboard/page.tsx` to use session API
- Created `app/access-denied/page.tsx`
- Created `app/admin/access-denied/page.tsx`

### What Stayed the Same:
- Mock app URLs remain unchanged
- Token values remain unchanged
- Database operations remain unchanged
- User experience remains the same (just more secure)

## Environment Variables

No changes to environment variables needed. The same tokens are used:
- `NEXT_PUBLIC_ACCESS_TOKEN` (user access) - hard-coded in middleware
- `NEXT_PUBLIC_ADMIN_ACCESS_TOKEN` (admin access) - hard-coded in middleware

## Future Enhancements

Potential future improvements:
1. Move tokens to environment variables instead of hard-coding
2. Add token rotation mechanism
3. Add session refresh capability
4. Add audit logging for token validation attempts
5. Add rate limiting for failed authentication attempts

