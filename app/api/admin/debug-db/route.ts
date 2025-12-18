import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/auth'

// GET - Check database connection and count records
export async function GET() {
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const count = await prisma.submission.count()
    const dbUrl = process.env.DATABASE_URL
    
    // Get a few sample records
    const samples = await prisma.submission.findMany({
      take: 3,
      select: {
        id: true,
        userName: true,
        recipientName: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ 
      count,
      dbUrlPrefix: dbUrl ? dbUrl.substring(0, 50) + '...' : 'not set',
      samples
    })
  } catch (error) {
    console.error('Error checking database:', error)
    return NextResponse.json({ error: 'Failed to check database' }, { status: 500 })
  }
}

