import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma'
import { getDatabaseUrl } from '@/lib/db-selector'

// PUT - Update a submission (for user edits of pending items)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { giftType, recipientUsername, recipientName, recipientEmail, message, env } = body
    const { id } = params
    
    // Validate required fields
    if (!giftType || !recipientName || !recipientEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get appropriate database based on environment
    const dbUrl = getDatabaseUrl(env)
    const prisma = getPrismaClient(dbUrl)
    
    // First, check if the submission exists and is pending
    const existingSubmission = await prisma.submission.findUnique({
      where: { id }
    })
    
    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
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
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const env = searchParams.get('env') || 'production'
    const { id } = params
    
    // Get appropriate database based on environment
    const dbUrl = getDatabaseUrl(env)
    const prisma = getPrismaClient(dbUrl)
    
    // First, check if the submission exists and is pending
    const existingSubmission = await prisma.submission.findUnique({
      where: { id }
    })
    
    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
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

