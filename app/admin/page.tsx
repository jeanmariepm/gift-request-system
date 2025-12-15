'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Hardcoded token for now (should match NEXT_PUBLIC_ACCESS_TOKEN in env)
const REQUIRED_ACCESS_TOKEN = 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)

  // Check access token and auto-login
  useEffect(() => {
    const token = searchParams.get('token')
    if (!token || token !== REQUIRED_ACCESS_TOKEN) {
      setAccessDenied(true)
      return
    }

    // Auto-login if credentials passed via URL (for mock app integration)
    const autoLogin = searchParams.get('auto')
    const urlUsername = searchParams.get('u')
    const urlPassword = searchParams.get('p')
    
    if (autoLogin === 'true' && urlUsername && urlPassword) {
      setUsername(urlUsername)
      setPassword(urlPassword)
      setIsLoading(true)
      // Automatically submit login
      performLogin(urlUsername, urlPassword)
    }
  }, [searchParams])

  const performLogin = async (user: string, pass: string) => {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    performLogin(username, password)
  }

  if (accessDenied) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
          <h1 style={{ color: '#e53e3e', marginBottom: '1rem' }}>🚫 Access Denied</h1>
          <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
            This page can only be accessed from the authorized company portal.
          </p>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
            Please contact your system administrator if you believe this is an error.
          </p>
        </div>
      </div>
    )
  }

  // If auto-login is happening, show loading screen instead of form
  if (isLoading && searchParams.get('auto') === 'true') {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>🔓 Logging you in...</h1>
          <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
            Please wait while we authenticate your access.
          </p>
          <div style={{ margin: '2rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>🔐 Admin Login</h1>
      
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2>Administrator Access</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

