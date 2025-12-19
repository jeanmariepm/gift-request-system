import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma'
import { getDatabaseUrl } from '@/lib/db-selector'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Fetch all submissions for admin
export async function GET(request: NextRequest) {
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // Get database URL (configured per Vercel environment)
    const dbUrl = getDatabaseUrl()
    const prisma = getPrismaClient(dbUrl)
    
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

