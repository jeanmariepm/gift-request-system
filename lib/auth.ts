import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD 
  ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
  : bcrypt.hashSync('changeme123', 10)

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
    // Parse JSON session data (set by middleware)
    const sessionData = JSON.parse(session.value)
    return sessionData.authenticated === true
  } catch {
    // Fallback for old simple string format
    return session.value === 'authenticated'
  }
}

export async function clearAdminSession() {
  (await cookies()).delete('admin_session')
}

