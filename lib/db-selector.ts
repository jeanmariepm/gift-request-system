// Database selector based on runtime environment parameter
export function getDatabaseUrl(envParam?: string | null): string {
  // Default to production if no env parameter
  const env = envParam === 'development' ? 'development' : 'production';
  
  // Get the appropriate database URL from environment variables
  const dbUrl = env === 'development' 
    ? process.env.DATABASE_URL_DEV 
    : process.env.DATABASE_URL_PROD;
  
  // Fallback to single DATABASE_URL if specific ones aren't set
  return dbUrl || process.env.DATABASE_URL || '';
}

