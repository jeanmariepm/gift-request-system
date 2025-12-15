import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's submissions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }
  
  try {
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
    const { userId, userName, userEmail, readOnlyData, giftType, recipientUsername, recipientName, message } = body
    
    // Validate required fields
    if (!userId || !userName || !giftType || !recipientUsername || !recipientName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Use a default email if not provided
    const finalUserEmail = userEmail || `${userId}@company.com`
    
    const submission = await prisma.submission.create({
      data: {
        userId,
        userName,
        userEmail: finalUserEmail,
        readOnlyData: readOnlyData || {},
        giftType,
        recipientUsername,
        recipientName,
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

