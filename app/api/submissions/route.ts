import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma'
import { getDatabaseUrl } from '@/lib/db-selector'

// GET - Fetch user's submissions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }
  
  try {
    // Get database URL (configured per Vercel environment)
    const dbUrl = getDatabaseUrl()
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
    const { userId, userName, userEmail, giftType, recipientUsername, recipientName, recipientEmail, message, readOnlyData } = body
    
    // Validate required fields (recipientUsername is optional, recipientEmail is required)
    if (!userId || !userName || !giftType || !recipientName || !recipientEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Validate message length
    if (message && message.length > 1000) {
      return NextResponse.json({ error: 'Message must be 1000 characters or less' }, { status: 400 })
    }
    
    // Use a default email if not provided
    const finalUserEmail = userEmail || `${userId}@company.com`
    
    // Get database URL (configured per Vercel environment)
    const dbUrl = getDatabaseUrl()
    const prisma = getPrismaClient(dbUrl)
    
    // Format readOnlyData properly for JSON storage
    let formattedReadOnlyData = null
    if (readOnlyData && Object.keys(readOnlyData).length > 0) {
      formattedReadOnlyData = readOnlyData
    }
    
    const submission = await prisma.submission.create({
      data: {
        userId,
        userName,
        userEmail: finalUserEmail,
        recipientName,
        recipientEmail,
        recipientUsername: recipientUsername || null,
        giftType,
        message: message || null,
        status: 'Pending',
        readOnlyData: formattedReadOnlyData
      }
    })
    
    return NextResponse.json({ success: true, submission }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating submission:', error)
    // Return more detailed error message for debugging
    const errorMessage = error?.message || 'Failed to create submission'
    return NextResponse.json({ 
      error: 'Failed to create submission',
      details: errorMessage 
    }, { status: 500 })
  }
}

