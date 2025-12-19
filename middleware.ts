import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
    '/admin/:path*'
  ]
}

