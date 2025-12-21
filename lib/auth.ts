import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD 
  ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
  : bcrypt.hashSync('changeme123', 10)

// JWT Secret for signing cookies
const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret-change-in-production'

// JWT Token expiration
const TOKEN_EXPIRATION = '8h'

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) {
    return false
  }
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
}

export async function setAdminSession(env: string = 'production') {
  (await cookies()).set('admin_session', JSON.stringify({
    authenticated: true,
    env
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = (await cookies()).get('admin_session')
  if (!session) return false
  
  try {
    // Verify JWT signature
    const decoded = jwt.verify(session.value, JWT_SECRET) as any
    return decoded.authenticated === true && decoded.type === 'admin'
  } catch (error) {
    console.error('Admin JWT verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}

export interface UserAuthResult {
  authenticated: boolean
  userId?: string
  userName?: string
  userEmail?: string
}

export async function isUserAuthenticated(): Promise<UserAuthResult> {
  const session = (await cookies()).get('user_session')
  if (!session) return { authenticated: false }
  
  try {
    // Verify JWT signature
    const decoded = jwt.verify(session.value, JWT_SECRET) as any
    
    if (decoded.authenticated === true && decoded.type === 'user' && decoded.userId) {
      return {
        authenticated: true,
        userId: decoded.userId,
        userName: decoded.userName,
        userEmail: decoded.userEmail
      }
    }
  } catch (error) {
    console.error('User JWT verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return { authenticated: false }
  }
  
  return { authenticated: false }
}

export async function clearAdminSession() {
  (await cookies()).delete('admin_session')
}

// Helper function to create signed JWT for admin
export function createAdminToken(): string {
  return jwt.sign(
    { 
      authenticated: true,
      type: 'admin'
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  )
}

// Helper function to create signed JWT for user
export function createUserToken(userId: string, userName: string, userEmail: string, readOnlyData?: any, formPrefill?: any): string {
  return jwt.sign(
    {
      authenticated: true,
      type: 'user',
      userId,
      userName,
      userEmail,
      readOnlyData: readOnlyData || {},
      formPrefill: formPrefill || {}
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  )
}

