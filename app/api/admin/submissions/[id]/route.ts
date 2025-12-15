import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/auth'

// PATCH - Update submission status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { id } = await params
    const { status, processedBy } = await request.json()
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }
    
    const submission = await prisma.submission.update({
      where: { id },
      data: {
        status,
        processedAt: status === 'Processed' ? new Date() : null,
        processedBy: status === 'Processed' ? processedBy : null
      }
    })
    
    return NextResponse.json({ success: true, submission })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}

