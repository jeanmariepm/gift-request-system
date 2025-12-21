import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Admin session API called')
    
    const isAuth = await isAdminAuthenticated()
    console.log('Admin authenticated:', isAuth)

    if (!isAuth) {
      console.log('No admin session - returning 401')
      return NextResponse.json({ error: 'No admin session found' }, { status: 401 })
    }
    
    return NextResponse.json({
      authenticated: true
    })
  } catch (error) {
    console.error('Error reading admin session:', error)
    return NextResponse.json({ error: 'Failed to read session' }, { status: 500 })
  }
}



