import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get('admin_session')

    console.log('Admin session API called')
    console.log('Admin session cookie:', adminSession ? 'Found' : 'Not found')
    
    if (adminSession) {
      console.log('Admin session value:', adminSession.value)
    }

    if (!adminSession) {
      console.log('No admin session - returning 401')
      return NextResponse.json({ error: 'No admin session found' }, { status: 401 })
    }

    const sessionData = JSON.parse(adminSession.value)
    console.log('Admin session data parsed:', sessionData)
    
    return NextResponse.json({
      authenticated: sessionData.authenticated,
      env: sessionData.env
    })
  } catch (error) {
    console.error('Error reading admin session:', error)
    return NextResponse.json({ error: 'Failed to read session' }, { status: 500 })
  }
}



