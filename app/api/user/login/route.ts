import { NextRequest, NextResponse } from 'next/server'
import { createUserToken } from '@/lib/auth'

// CORS headers to allow cross-origin requests with credentials
function getCorsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return NextResponse.json({}, { headers: getCorsHeaders(origin) })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)
  
  try {
    // Extract Bearer token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401, headers: corsHeaders }
      )
    }
    
    const token = authHeader.replace('Bearer ', '').trim()
    
    // Extract user data from POST body
    const body = await request.json()
    const { userId, userName, userEmail, country, recipientName, recipientEmail, recipientUsername } = body
    
    if (!userId || !userName) {
      return NextResponse.json(
        { error: 'userId and userName are required' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    // Get expected token (configured per Vercel environment)
    const expectedToken = (process.env.USER_ACCESS_TOKEN || '').trim()
    
    console.log('User token validation:', {
      receivedTokenLength: token.length,
      expectedTokenLength: expectedToken.length,
      matches: token === expectedToken
    })
    
    if (!expectedToken) {
      console.error('USER_ACCESS_TOKEN not configured')
      return NextResponse.json(
        { error: 'Token not configured for this environment' },
        { status: 500, headers: corsHeaders }
      )
    }
    
    if (token !== expectedToken) {
      console.log('Token validation failed')
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 401, headers: corsHeaders }
      )
    }
    
    console.log('Token validation succeeded')
    
    // Build session data for JWT
    const readOnlyData: any = {}
    if (country) {
      readOnlyData.country = country
    }
    
    const formPrefill: any = {}
    if (recipientName) formPrefill.recipientName = recipientName
    if (recipientEmail) formPrefill.recipientEmail = recipientEmail
    if (recipientUsername) formPrefill.recipientUsername = recipientUsername
    
    const finalUserEmail = userEmail || `${userId}@company.com`
    
    // Create signed JWT token
    const jwtToken = createUserToken(
      userId,
      userName,
      finalUserEmail,
      readOnlyData,
      Object.keys(formPrefill).length > 0 ? formPrefill : undefined
    )
    
    // Set HTTP-only cookie with JWT
    const response = NextResponse.json({ 
      success: true,
      redirectUrl: '/'
    }, { headers: corsHeaders })
    
    response.cookies.set('user_session', jwtToken, {
      httpOnly: true,
      secure: true, // Always secure (required for SameSite=none)
      sameSite: 'none', // Allow cross-origin cookie usage
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/'
    })
    
    return response
    
  } catch (error) {
    console.error('User login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500, headers: corsHeaders }
    )
  }
}
