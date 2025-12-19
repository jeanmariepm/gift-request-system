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
    console.log('🔍 Admin fetching submissions...')
    
    // Get database URL (configured per Vercel environment)
    const dbUrl = getDatabaseUrl()
    console.log('📊 Database URL retrieved:', dbUrl ? 'Yes' : 'No')
    
    if (!dbUrl) {
      console.error('❌ No DATABASE_URL configured')
      return NextResponse.json({ 
        error: 'Database not configured',
        details: 'DATABASE_URL environment variable is missing'
      }, { status: 500 })
    }
    
    const prisma = getPrismaClient(dbUrl)
    console.log('✅ Prisma client created')
    
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' }
    })
    console.log(`✅ Found ${submissions.length} submissions`)
    
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('❌ Error fetching submissions:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      error: 'Failed to fetch submissions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

