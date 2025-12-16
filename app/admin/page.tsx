'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '../components/Logo'

// Admin access token (separate from user access token)
const REQUIRED_ADMIN_TOKEN = 'admin_access_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [accessDenied, setAccessDenied] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  // Check admin access token - no username/password needed
  useEffect(() => {
    const adminToken = searchParams.get('adminToken')
    
    if (!adminToken || adminToken !== REQUIRED_ADMIN_TOKEN) {
      setAccessDenied(true)
      setIsAuthenticating(false)
      return
    }

    // Admin token is valid - redirect to dashboard
    // Set admin session via API
    setAdminSession()
  }, [searchParams])
  
  const setAdminSession = async () => {
    try {
      const response = await fetch('/api/admin/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminToken: searchParams.get('adminToken') })
      })

      if (!response.ok) {
        setAccessDenied(true)
        setIsAuthenticating(false)
        return
      }

      // Session set successfully, redirect to dashboard
      router.push('/admin/dashboard')
    } catch (err) {
      setAccessDenied(true)
      setIsAuthenticating(false)
    }
  }

  if (accessDenied) {
    return (
      <div className="container">
        <Logo />
        
        <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
          <h1 style={{ color: '#e53e3e', marginBottom: '1rem' }}>🚫 Access Denied</h1>
          <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
            Admin access requires a valid admin token from the authorized company portal.
          </p>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
            Please contact your system administrator if you believe this is an error.
          </p>
        </div>
      </div>
    )
  }

  // Show authenticating screen
  return (
    <div className="container">
      <Logo />
      
      <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>🔓 Authenticating...</h1>
        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
          Verifying your admin access token.
        </p>
        <div style={{ margin: '2rem 0' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </div>
    </div>
  )
}

