import { NextRequest, NextResponse } from 'next/server'
import { isUserAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userAuth = await isUserAuthenticated()

    if (!userAuth.authenticated) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Return the JWT decoded session data (no env parameter anymore)
    return NextResponse.json({
      userId: userAuth.userId,
      userName: userAuth.userName,
      userEmail: userAuth.userEmail,
      authenticated: userAuth.authenticated
    })
  } catch (error) {
    console.error('Error reading session:', error)
    return NextResponse.json({ error: 'Failed to read session' }, { status: 500 })
  }
}



