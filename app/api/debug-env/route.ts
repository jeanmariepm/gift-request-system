import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const userToken = process.env.USER_ACCESS_TOKEN || ''
  const adminToken = process.env.ADMIN_ACCESS_TOKEN || ''
  
  return NextResponse.json({
    userTokenLength: userToken.length,
    userTokenPreview: userToken.substring(0, 20) + '...',
    userTokenFull: userToken,
    userTokenHex: Buffer.from(userToken).toString('hex'),
    userTokenLastChar: userToken.charCodeAt(userToken.length - 1),
    userTokenLastCharHex: userToken.charCodeAt(userToken.length - 1).toString(16),
    adminTokenLength: adminToken.length,
    adminTokenPreview: adminToken.substring(0, 20) + '...',
    adminTokenLastChar: adminToken.charCodeAt(adminToken.length - 1),
    envKeys: Object.keys(process.env).filter(k => k.includes('TOKEN')),
    nodeEnv: process.env.NODE_ENV
  })
}

