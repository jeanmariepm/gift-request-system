import { NextRequest, NextResponse } from 'next/server'
import { createAdminLoginToken } from '@/lib/login-tokens'

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
    
    // Get expected token (configured per Vercel environment)
    const expectedToken = (process.env.ADMIN_ACCESS_TOKEN || '').trim()
    
    console.log('Admin token validation:', {
      receivedTokenLength: token.length,
      expectedTokenLength: expectedToken.length,
      matches: token === expectedToken
    })
    
    if (!expectedToken) {
      console.error('ADMIN_ACCESS_TOKEN not configured')
      return NextResponse.json(
        { error: 'Token not configured for this environment' },
        { status: 500, headers: corsHeaders }
      )
    }
    
    if (token !== expectedToken) {
      console.log('Token validation failed')
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 401, headers: corsHeaders }
      )
    }
    
    console.log('Token validation succeeded')
    
    // Create a temporary login token for server-to-server authentication
    const loginToken = createAdminLoginToken()
    
    return NextResponse.json({ 
      success: true,
      loginToken,
      redirectUrl: `/api/exchange-token?loginToken=${loginToken}`
    }, { headers: corsHeaders })
    
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500, headers: corsHeaders }
    )
  }
}
