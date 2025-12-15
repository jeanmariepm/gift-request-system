import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/auth'

// GET - Fetch all submissions for admin
export async function GET() {
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    // Parse readOnlyData back to JSON
    const submissionsWithParsedData = submissions.map(sub => ({
      ...sub,
      readOnlyData: JSON.parse(sub.readOnlyData as string)
    }))
    
    return NextResponse.json({ submissions: submissionsWithParsedData })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

