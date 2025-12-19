// Database URL - configured per Vercel environment
// Preview environment has DATABASE_URL pointing to dev database
// Production environment has DATABASE_URL pointing to prod database
export function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not configured');
  } else {
    console.log('🗄️ Using database:', dbUrl.substring(0, 30) + '...');
  }
  
  return dbUrl;
}

