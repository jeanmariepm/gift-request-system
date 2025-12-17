'use client'

import Logo from '@/app/components/Logo'

export default function AccessDeniedPage() {
  return (
    <div className="container">
      <Logo />
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ color: '#e53e3e' }}>Access Denied</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          This application can only be accessed through the authorized company portal.
        </p>
        <div style={{ background: '#fff5f5', padding: '1rem', borderRadius: '8px', border: '1px solid #feb2b2' }}>
          <p style={{ color: '#742a2a', fontSize: '0.875rem' }}>
            <strong>Error:</strong> Invalid or missing access token
          </p>
          <p style={{ color: '#742a2a', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Please contact your system administrator if you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  )
}



