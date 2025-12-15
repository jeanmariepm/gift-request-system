/**
 * Access Token Validation
 * 
 * Validates that requests come from authorized sources (main app)
 * by checking for a valid access token
 */

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2'

export function validateAccessToken(token: string | null): boolean {
  if (!token) {
    return false
  }
  
  return token === ACCESS_TOKEN
}

export function getAccessToken(): string {
  return ACCESS_TOKEN
}

