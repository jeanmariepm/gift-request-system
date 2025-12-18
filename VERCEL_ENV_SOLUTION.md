# Vercel Environment Variables - Trailing Newline Issue & Solution

## Problem

When using `vercel env add` to set environment variables via stdin, the Vercel CLI **always appends a trailing newline character (`\n`)** to the value, regardless of the input method used.

### What We Tried (That Didn't Work)

1. ❌ `echo -n "$value" | vercel env add KEY env`
2. ❌ `printf "%s" "$value" | vercel env add KEY env`  
3. ❌ `printf "%s" "$value" | tr -d '\n' | vercel env add KEY env`

All of these still resulted in a trailing `\n` being stored in Vercel.

### Evidence

When checking the environment variable:
```bash
$ vercel env pull .env.debug --environment=preview
$ cat .env.debug | grep "USER_ACCESS_TOKEN=" | od -c
```

Output showed:
```
0000000    U   S   E   R   _   A   C   C   E   S   S   _   T   O   K   E
0000020    N   =   g   i   f   t   _   a   c   c   e   s   s   _   d   e
0000040    v   _   d   7   f   8   e   9   a   0   b   1   c   2   d   3
0000060    e   4   f   5   a   6   b   7   c   8   d   9   e   0   f   1
0000100    a   2  \n                                                    <-- EXTRA NEWLINE!
```

## Solution

Since the Vercel CLI always adds the newline, the fix is to **trim the environment variables when reading them** in the application code.

### Implementation

**middleware.ts:**
```typescript
// Load access tokens from environment variables
// IMPORTANT: Trim to remove trailing newlines that Vercel CLI adds
const REQUIRED_ACCESS_TOKEN = (process.env.USER_ACCESS_TOKEN || '').trim()
const REQUIRED_ADMIN_TOKEN = (process.env.ADMIN_ACCESS_TOKEN || '').trim()
```

**app/api/auth/login/route.ts:**
```typescript
// IMPORTANT: Trim to remove trailing newlines that Vercel CLI adds
const REQUIRED_ACCESS_TOKEN = (process.env.USER_ACCESS_TOKEN || '').trim()
const REQUIRED_ADMIN_TOKEN = (process.env.ADMIN_ACCESS_TOKEN || '').trim()
```

### Why `.trim()` Works

- `.trim()` removes **all** leading and trailing whitespace characters, including:
  - Spaces
  - Tabs
  - Newlines (`\n`)
  - Carriage returns (`\r`)
- This ensures the token is exactly the expected length (48 characters)
- Works consistently across all environments (local, preview, production)

## Alternative Solutions (Not Recommended)

### 1. Use Vercel API Directly
Instead of the CLI, use the Vercel REST API to set environment variables:
```bash
curl -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "USER_ACCESS_TOKEN",
    "value": "your_token_value_without_newline",
    "type": "encrypted",
    "target": ["preview"]
  }'
```

**Pros:** Full control over the exact value  
**Cons:** More complex, requires API token management

### 2. Set Variables via Vercel Dashboard
Manually copy/paste values in the Vercel web interface.

**Pros:** Visual confirmation, no CLI issues  
**Cons:** Not automatable, tedious for multiple variables

## Recommendation

**Use the `.trim()` solution in application code.** This is:
- ✅ Simple and reliable
- ✅ Works with existing `sync-env-to-vercel.sh` script
- ✅ Doesn't require API tokens or manual dashboard work
- ✅ Handles any whitespace issues automatically
- ✅ No performance impact (trimming happens once at startup)

## Testing

To verify the fix is working:

### 1. Check Debug Endpoint (if still active)
```bash
curl https://your-deployment-url.vercel.app/api/debug-env | jq '{userTokenLength, userTokenFull}'
```

Expected output:
```json
{
  "userTokenLength": 48,
  "userTokenFull": "gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2"
}
```

(Note: Remove debug endpoint in production!)

### 2. Test Authentication
```bash
curl -I "https://your-deployment-url.vercel.app/?token=your_dev_token&env=development&userId=test&userName=Test&userEmail=test@example.com"
```

Expected: Should redirect to clean `/` URL (HTTP 307/302)

## Lessons Learned

1. **Vercel CLI has quirks** - The `vercel env add` command modifies input when reading from stdin
2. **Always test environment variables** - Use debug endpoints to verify exact values in production
3. **Trim is your friend** - When dealing with external systems, defensive string handling prevents subtle bugs
4. **Document platform-specific behavior** - Save future developers hours of debugging

## Related Files

- `middleware.ts` - Token validation and session management
- `app/api/auth/login/route.ts` - Authentication API endpoint
- `sync-env-to-vercel.sh` - Environment variable sync script
- `env.preview` - Preview environment variables template
- `env.production` - Production environment variables template

