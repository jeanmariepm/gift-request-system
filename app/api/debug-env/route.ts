import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const userToken = process.env.USER_ACCESS_TOKEN || ''
  const adminToken = process.env.ADMIN_ACCESS_TOKEN || ''
  
  return NextResponse.json({
    userTokenLength: userToken.length,
    userTokenPreview: userToken.substring(0, 20) + '...',
    userTokenHex: Buffer.from(userToken).toString('hex').substring(0, 60),
    adminTokenLength: adminToken.length,
    adminTokenPreview: adminToken.substring(0, 20) + '...',
    envKeys: Object.keys(process.env).filter(k => k.includes('TOKEN')),
    nodeEnv: process.env.NODE_ENV
  })
}

