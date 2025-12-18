import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAndClearDatabase() {
  try {
    console.log('📊 Checking production database...')
    console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // First, count the submissions
    const count = await prisma.submission.count()
    console.log(`\nFound ${count} submission(s) in the database`)
    
    if (count > 0) {
      // Show a few samples
      const samples = await prisma.submission.findMany({
        take: 5,
        select: {
          id: true,
          userName: true,
          recipientName: true,
          createdAt: true,
          status: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      console.log('\nSample submissions:')
      samples.forEach((sub, i) => {
        console.log(`${i + 1}. ${sub.userName} -> ${sub.recipientName} (${sub.status}) - ${sub.createdAt.toISOString()}`)
      })
      
      console.log('\n🗑️  Deleting all submissions...')
      const result = await prisma.submission.deleteMany({})
      console.log(`✅ Successfully deleted ${result.count} submission(s)`)
      console.log('Database is now empty!')
    } else {
      console.log('✅ Database is already empty!')
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndClearDatabase()

