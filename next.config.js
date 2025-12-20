/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make environment variables available to Edge Runtime (middleware)
  env: {
    USER_ACCESS_TOKEN: process.env.USER_ACCESS_TOKEN,
    ADMIN_ACCESS_TOKEN: process.env.ADMIN_ACCESS_TOKEN,
  },
  // Enable standalone output for Docker
  output: 'standalone',
}

module.exports = nextConfig

