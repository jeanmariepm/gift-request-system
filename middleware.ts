import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const REQUIRED_ACCESS_TOKEN = (process.env.USER_ACCESS_TOKEN || '').trim()
const REQUIRED_ADMIN_TOKEN = (process.env.ADMIN_ACCESS_TOKEN || '').trim()

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API Route Protection
  if (pathname.startsWith('/api/')) {
    // Admin API routes - require admin token or session
    if (pathname.startsWith('/api/admin/')) {
      const adminToken = request.headers.get('x-admin-token')
      const adminSession = request.cookies.get('admin_session')
      
      if (!adminToken && !adminSession) {
        return NextResponse.json({ error: 'Admin token required' }, { status: 401 })
      }
      
      if (adminToken && adminToken !== REQUIRED_ADMIN_TOKEN) {
        return NextResponse.json({ error: 'Invalid admin token' }, { status: 401 })
      }
    }
    
    // User API routes - require user token or session
    if (pathname.startsWith('/api/submissions')) {
      const userToken = request.headers.get('x-user-token')
      const userSession = request.cookies.get('user_session')
      
      if (!userToken && !userSession) {
        return NextResponse.json({ error: 'User token required' }, { status: 401 })
      }
      
      if (userToken && userToken !== REQUIRED_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Invalid user token' }, { status: 401 })
      }
      
      // Validate session if no token provided
      if (!userToken && userSession) {
        try {
          const sessionData = JSON.parse(userSession.value)
          if (!sessionData.authenticated) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
          }
        } catch {
          return NextResponse.json({ error: 'Invalid session format' }, { status: 401 })
        }
      }
    }
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
      const response = NextResponse.redirect(new URL('/admin/access-denied', request.url))
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/my-submissions',
    '/admin/:path*',
    '/api/submissions/:path*',
    '/api/admin/:path*'
  ]
}

