import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Load access tokens from environment variables
// IMPORTANT: Trim to remove trailing newlines that Vercel CLI adds
const REQUIRED_ACCESS_TOKEN = (process.env.USER_ACCESS_TOKEN || '').trim()
const REQUIRED_ADMIN_TOKEN = (process.env.ADMIN_ACCESS_TOKEN || '').trim()

if (!REQUIRED_ACCESS_TOKEN || !REQUIRED_ADMIN_TOKEN) {
  console.error('WARNING: Access tokens not configured. Set USER_ACCESS_TOKEN and ADMIN_ACCESS_TOKEN environment variables.')
}

// Handle browser preflight requests (allow any origin - security enforced by token validation)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

export async function POST(request: NextRequest) {
  // Allow cross-origin requests from any origin
  const corsHeaders = {
    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
  }

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

