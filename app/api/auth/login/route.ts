import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const REQUIRED_ACCESS_TOKEN = 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2'
const REQUIRED_ADMIN_TOKEN = 'admin_access_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'

// Allowed origins for CORS - can be configured via environment variable
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:8000',           // Local development (Python server)
      'http://localhost:8080',           // Alternative local port
      'http://127.0.0.1:8000',          // Localhost via IP
      // Add your production portal domain when deploying:
      // 'https://company-portal.com',
      // 'https://intranet.yourcompany.com',
    ]

// Get CORS headers based on request origin
function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Check if origin is allowed
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin)
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Credentials': 'true',
  }
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request)
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: NextRequest) {
  // Get CORS headers based on request origin
  const corsHeaders = getCorsHeaders(request)

  try {
    const body = await request.json()
    const { token, adminToken, userId, userName, userEmail, env } = body

    // Handle user authentication
    if (token) {
      // Validate user token
      if (token !== REQUIRED_ACCESS_TOKEN) {
        return NextResponse.json(
          { error: 'Invalid access token' }, 
          { status: 401, headers: corsHeaders }
        )
      }

      // Validate required fields
      if (!userId || !userName) {
        return NextResponse.json(
          { error: 'Missing required fields' }, 
          { status: 400, headers: corsHeaders }
        )
      }

      // Set secure HTTP-only cookie with user session data
      const sessionData = {
        userId,
        userName,
        userEmail: userEmail || `${userId}@company.com`,
        env: env || 'production',
        authenticated: true
      }

      const cookieStore = await cookies()
      cookieStore.set('user_session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/'
      })

      return NextResponse.json(
        { success: true, redirectTo: '/' },
        { headers: corsHeaders }
      )
    }

    // Handle admin authentication
    if (adminToken) {
      // Validate admin token
      if (adminToken !== REQUIRED_ADMIN_TOKEN) {
        return NextResponse.json(
          { error: 'Invalid admin token' }, 
          { status: 401, headers: corsHeaders }
        )
      }

      // Set secure HTTP-only cookie for admin session
      const cookieStore = await cookies()
      cookieStore.set('admin_session', JSON.stringify({ 
        authenticated: true,
        env: env || 'production'
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      })

      return NextResponse.json(
        { success: true, redirectTo: '/admin/dashboard' },
        { headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { error: 'No valid authentication provided' }, 
      { status: 400, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' }, 
      { status: 500, headers: corsHeaders }
    )
  }
}

