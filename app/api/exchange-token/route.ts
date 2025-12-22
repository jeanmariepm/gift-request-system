import { NextRequest, NextResponse } from 'next/server'
import { verifyLoginToken } from '@/lib/login-tokens'
import { createUserToken, createAdminToken } from '@/lib/auth'

/**
 * Exchange a temporary login token for a session cookie
 * This endpoint is used in server-to-server integrations where:
 * 1. Backend calls /api/user/login or /api/admin/login
 * 2. Backend gets a loginToken
 * 3. Backend redirects user to /api/exchange-token?loginToken=xxx
 * 4. User's browser calls this endpoint to exchange token for cookie
 * 5. User is redirected to the app with session cookie set
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const loginToken = searchParams.get('loginToken')
    
    if (!loginToken) {
      return NextResponse.json(
        { error: 'Login token is required' },
        { status: 400 }
      )
    }
    
    // Verify and decode the login token
    const tokenData = verifyLoginToken(loginToken)
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired login token' },
        { status: 401 }
      )
    }
    
    // Check token type and create appropriate session
    if (tokenData.type === 'user_login') {
      // Create user session JWT
      const sessionToken = createUserToken(
        tokenData.userId,
        tokenData.userName,
        tokenData.userEmail,
        tokenData.readOnlyData,
        tokenData.formPrefill
      )
      
      // Set session cookie and redirect to home
      const response = NextResponse.redirect(new URL('/', request.url))
      
      response.cookies.set('user_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Can use 'lax' now since it's same-origin
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/'
      })
      
      return response
      
    } else if (tokenData.type === 'admin_login') {
      // Create admin session JWT
      const sessionToken = createAdminToken()
      
      // Set session cookie and redirect to admin dashboard
      const response = NextResponse.redirect(new URL('/admin/dashboard', request.url))
      
      response.cookies.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/'
      })
      
      return response
      
    } else {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json(
      { error: 'Failed to exchange token' },
      { status: 500 }
    )
  }
}

