import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD 
  ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
  : bcrypt.hashSync('changeme123', 10)

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  console.log('🔍 Login attempt:', { 
    providedUsername: username, 
    expectedUsername: ADMIN_USERNAME,
    providedPassword: password,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    adminPasswordValue: process.env.ADMIN_PASSWORD
  })
  
  if (username !== ADMIN_USERNAME) {
    console.log('❌ Username mismatch')
    return false
  }
  
  const isValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
  console.log('🔐 Password check result:', isValid)
  return isValid
}

export async function setAdminSession() {
  (await cookies()).set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = (await cookies()).get('admin_session')
  return session?.value === 'authenticated'
}

export async function clearAdminSession() {
  (await cookies()).delete('admin_session')
}

