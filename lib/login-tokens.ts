import jwt from 'jsonwebtoken'

const LOGIN_TOKEN_SECRET = process.env.SESSION_SECRET || 'fallback-secret-change-in-production'
const LOGIN_TOKEN_EXPIRATION = '5m' // Short-lived: 5 minutes

interface UserLoginData {
  userId: string
  userName: string
  userEmail: string
  readOnlyData?: any
  formPrefill?: any
}

interface AdminLoginData {
  type: 'admin'
}

/**
 * Create a temporary login token for server-to-server authentication
 * This token can be exchanged for a session cookie by the user's browser
 */
export function createUserLoginToken(userData: UserLoginData): string {
  return jwt.sign(
    {
      ...userData,
      type: 'user_login',
      authenticated: true
    },
    LOGIN_TOKEN_SECRET,
    { expiresIn: LOGIN_TOKEN_EXPIRATION }
  )
}

export function createAdminLoginToken(): string {
  return jwt.sign(
    {
      type: 'admin_login',
      authenticated: true
    },
    LOGIN_TOKEN_SECRET,
    { expiresIn: LOGIN_TOKEN_EXPIRATION }
  )
}

/**
 * Verify and decode a login token
 * Returns the user/admin data if valid, null if invalid or expired
 */
export function verifyLoginToken(token: string): any | null {
  try {
    const decoded = jwt.verify(token, LOGIN_TOKEN_SECRET) as any
    
    // Check if it's a login token (not a session token)
    if (decoded.type !== 'user_login' && decoded.type !== 'admin_login') {
      return null
    }
    
    return decoded
  } catch (error) {
    console.error('Login token verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

