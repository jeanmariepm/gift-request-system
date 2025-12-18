import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userSession = cookieStore.get('user_session')

    if (!userSession) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const sessionData = JSON.parse(userSession.value)
    
    return NextResponse.json({
      userId: sessionData.userId,
      userName: sessionData.userName,
      userEmail: sessionData.userEmail,
      env: sessionData.env,
      readOnlyData: sessionData.readOnlyData || {},
      formPrefill: sessionData.formPrefill || {},
      authenticated: sessionData.authenticated
    })
  } catch (error) {
    console.error('Error reading session:', error)
    return NextResponse.json({ error: 'Failed to read session' }, { status: 500 })
  }
}



