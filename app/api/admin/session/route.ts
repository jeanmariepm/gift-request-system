import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get('admin_session')

    if (!adminSession) {
      return NextResponse.json({ error: 'No admin session found' }, { status: 401 })
    }

    const sessionData = JSON.parse(adminSession.value)
    
    return NextResponse.json({
      authenticated: sessionData.authenticated,
      env: sessionData.env
    })
  } catch (error) {
    console.error('Error reading admin session:', error)
    return NextResponse.json({ error: 'Failed to read session' }, { status: 500 })
  }
}



