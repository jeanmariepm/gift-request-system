import { NextRequest, NextResponse } from 'next/server'
import { setAdminSession } from '@/lib/auth'

// Admin access token - IMPORTANT: Trim to remove trailing newlines
const REQUIRED_ADMIN_TOKEN = (process.env.ADMIN_ACCESS_TOKEN || '').trim()

export async function POST(request: NextRequest) {
  try {
    const { adminToken } = await request.json()
    
    if (!adminToken) {
      return NextResponse.json({ error: 'Admin token required' }, { status: 400 })
    }
    
    if (adminToken !== REQUIRED_ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Invalid admin token' }, { status: 401 })
    }
    
    // Admin token is valid - set session
    await setAdminSession()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

