import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Load access tokens from environment variables
// Separate tokens for dev and production environments
const REQUIRED_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN || ''
const REQUIRED_ADMIN_TOKEN = process.env.ADMIN_ACCESS_TOKEN || ''

if (!REQUIRED_ACCESS_TOKEN || !REQUIRED_ADMIN_TOKEN) {
  console.error('WARNING: Access tokens not configured. Set USER_ACCESS_TOKEN and ADMIN_ACCESS_TOKEN environment variables.')
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Handle user access token flow - support both GET (legacy) and POST (secure)
  if (pathname === '/auth/login') {
    // New secure POST endpoint
    if (request.method === 'POST') {
      // We'll handle POST in an API route instead
      return NextResponse.next()
    }
  }

  // Legacy GET method (for backward compatibility during transition)
  if (pathname === '/' && searchParams.has('token')) {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const userName = searchParams.get('userName')
    const userEmail = searchParams.get('userEmail')
    const env = searchParams.get('env') || 'production'

    // Debug logging
    console.log('User token validation:', {
      receivedToken: token?.substring(0, 30) + '...',
      receivedTokenLength: token?.length,
      expectedToken: REQUIRED_ACCESS_TOKEN?.substring(0, 30) + '...',
      expectedTokenLength: REQUIRED_ACCESS_TOKEN?.length,
      matches: token === REQUIRED_ACCESS_TOKEN
    })

    // Validate token
    if (token !== REQUIRED_ACCESS_TOKEN) {
      // Invalid token - redirect to access denied
      console.log('Token validation failed - redirecting to access denied')
      const response = NextResponse.redirect(new URL('/access-denied', request.url))
      return response
    }
    console.log('Token validation succeeded')

    // Valid token - store user data in secure cookie and redirect to clean URL
    if (userId && userName) {
      const response = NextResponse.redirect(new URL('/', request.url))
      
      // Set secure HTTP-only cookie with user session data
      const sessionData = {
        userId,
        userName,
        userEmail: userEmail || `${userId}@company.com`,
        env,
        authenticated: true
      }
      
      response.cookies.set('user_session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/'
      })
      
      return response
    }
  }

  // Handle admin access token flow
  if (pathname === '/admin' && searchParams.has('adminToken')) {
    const adminToken = searchParams.get('adminToken')
    const env = searchParams.get('env') || 'production'

    console.log('Admin token validation:', { 
      receivedToken: adminToken?.substring(0, 20) + '...', 
      isValid: adminToken === REQUIRED_ADMIN_TOKEN 
    })

    // Validate admin token
    if (adminToken !== REQUIRED_ADMIN_TOKEN) {
      // Invalid token - redirect to access denied
      console.log('Invalid admin token - redirecting to access denied')
      const response = NextResponse.redirect(new URL('/admin/access-denied', request.url))
      return response
    }

    // Valid token - store admin session and redirect to dashboard
    console.log('Valid admin token - setting cookie and redirecting to dashboard')
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url))
    
    // Set secure HTTP-only cookie for admin session
    const sessionData = { authenticated: true, env }
    response.cookies.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    })
    
    console.log('Admin cookie set:', sessionData)
    
    return response
  }

  // Check if user has valid session for protected routes
  if (pathname === '/' || pathname === '/my-submissions') {
    const userSession = request.cookies.get('user_session')
    
    if (!userSession) {
      const response = NextResponse.redirect(new URL('/access-denied', request.url))
      return response
    }
  }

  // Check if admin has valid session for admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin' && pathname !== '/admin/access-denied') {
    const adminSession = request.cookies.get('admin_session')
    
    if (!adminSession) {
      const response = NextResponse.redirect(new URL('/admin', request.url))
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/my-submissions',
    '/admin/:path*'
  ]
}

