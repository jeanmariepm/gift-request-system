# Cross-Origin Access

## Why These Headers Exist

Browsers automatically enforce Cross-Origin Resource Sharing (CORS) when the mock app (e.g., `http://localhost:8000`) makes requests to the Gifts App (e.g., `http://localhost:3000`). 

The Gifts App sends `Access-Control-Allow-Origin` headers to tell the browser: "Yes, allow this request."

## Security

Security is **NOT** enforced by CORS. It's enforced by:
- ✅ **Token validation** - Every request must have a valid token
- ✅ **HTTP-only cookies** - Session data not accessible via JavaScript  
- ✅ **SameSite cookies** - CSRF protection

The headers just tell browsers to allow the request. The token validation actually secures it.

## Current Configuration

The Gifts App allows requests from **any origin** (any domain, any port, any machine).

**File**: `/app/api/auth/login/route.ts`

```typescript
// Reflect the requesting origin back (allows any origin)
'Access-Control-Allow-Origin': request.headers.get('origin') || '*'
```

This means it works from:
- Any localhost port
- Any machine on your network  
- Any production domain
- No configuration needed ✨

## Testing from Another Machine

Find your IP address:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example: 192.168.1.100
```

Access from another machine:
```
http://192.168.1.100:8000/index.html
```

It works automatically. No configuration needed.

