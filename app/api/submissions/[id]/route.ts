import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma'
import { getDatabaseUrl } from '@/lib/db-selector'
import { isUserAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// PUT - Update a submission (for user edits of pending items)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate user session
  const userAuth = await isUserAuthenticated()
  if (!userAuth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { giftType, recipientUsername, recipientName, recipientEmail, message } = body
    const { id } = await params
    
    // Validate required fields
    if (!giftType || !recipientName || !recipientEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Validate message length
    if (message && message.length > 1000) {
      return NextResponse.json({ error: 'Message must be 1000 characters or less' }, { status: 400 })
    }
    
    // Get database URL (configured per Vercel environment)
    const dbUrl = getDatabaseUrl()
    const prisma = getPrismaClient(dbUrl)
    
    // First, check if the submission exists and is pending
    const existingSubmission = await prisma.submission.findUnique({
      where: { id }
    })
    
    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    
    // Verify user owns this submission
    if (existingSubmission.userId !== userAuth.userId) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own submissions' }, { status: 403 })
    }
    
    if (existingSubmission.status !== 'Pending') {
      return NextResponse.json({ error: 'Only pending submissions can be edited' }, { status: 400 })
    }
    
    // Update the submission
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        giftType,
        recipientUsername: recipientUsername || null,
        recipientName,
        recipientEmail,
        message: message || null,
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json({ success: true, submission: updatedSubmission })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}

// DELETE - Delete a submission (only pending items can be deleted)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate user session
  const userAuth = await isUserAuthenticated()
  if (!userAuth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { id } = await params
    
    // Get database URL (configured per Vercel environment)
    const dbUrl = getDatabaseUrl()
    const prisma = getPrismaClient(dbUrl)
    
    // First, check if the submission exists and is pending
    const existingSubmission = await prisma.submission.findUnique({
      where: { id }
    })
    
    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    
    // Verify user owns this submission
    if (existingSubmission.userId !== userAuth.userId) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own submissions' }, { status: 403 })
    }
    
    if (existingSubmission.status !== 'Pending') {
      return NextResponse.json({ error: 'Only pending submissions can be deleted' }, { status: 400 })
    }
    
    // Delete the submission
    await prisma.submission.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true, message: 'Submission deleted successfully' })
  } catch (error) {
    console.error('Error deleting submission:', error)
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
  }
}

