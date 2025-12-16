import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma'
import { getDatabaseUrl } from '@/lib/db-selector'

// GET - Fetch user's submissions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const env = searchParams.get('env')
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }
  
  try {
    // Get appropriate database based on environment
    const dbUrl = getDatabaseUrl(env)
    const prisma = getPrismaClient(dbUrl)
    
    const submissions = await prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

// POST - Create new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, userEmail, giftType, recipientUsername, recipientName, recipientEmail, message, env } = body
    
    // Validate required fields (recipientUsername is now optional)
    if (!userId || !userName || !giftType || !recipientName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Use a default email if not provided
    const finalUserEmail = userEmail || `${userId}@company.com`
    
    // Get appropriate database based on environment
    const dbUrl = getDatabaseUrl(env)
    const prisma = getPrismaClient(dbUrl)
    
    const submission = await prisma.submission.create({
      data: {
        userId,
        userName,
        userEmail: finalUserEmail,
        recipientName,
        recipientEmail: recipientEmail || null,
        recipientUsername: recipientUsername || null,
        giftType,
        message: message || null,
        status: 'Pending'
      }
    })
    
    return NextResponse.json({ success: true, submission }, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}

