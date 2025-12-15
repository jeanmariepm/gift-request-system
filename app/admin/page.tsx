'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Auto-login if credentials passed via URL (for mock app integration)
  useEffect(() => {
    const autoLogin = searchParams.get('auto')
    const urlUsername = searchParams.get('u')
    const urlPassword = searchParams.get('p')
    
    if (autoLogin === 'true' && urlUsername && urlPassword) {
      setUsername(urlUsername)
      setPassword(urlPassword)
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

  return (
    <div className="container">
      <h1>🔐 Admin Login</h1>
      
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2>Administrator Access</h2>
        
        {isLoading && searchParams.get('auto') === 'true' && (
          <div className="alert alert-info">
            Logging you in automatically...
          </div>
        )}
        
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

