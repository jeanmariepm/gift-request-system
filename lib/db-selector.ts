// Database selector based on runtime environment parameter
export function getDatabaseUrl(envParam?: string | null): string {
  // Default to production if no env parameter
  const env = envParam === 'development' ? 'development' : 'production';
  
  // Get the appropriate database URL from environment variables
  const dbUrl = env === 'development' 
    ? process.env.DATABASE_URL_DEV   // Development database
    : process.env.DATABASE_URL;       // Production database (existing)
  
  console.log(`🗄️ Using ${env} database:`, dbUrl ? dbUrl.substring(0, 30) + '...' : 'not configured');
  
  return dbUrl || '';
}

