'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const REQUIRED_ACCESS_TOKEN = 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2'

interface Submission {
  id: string
  giftType: string
  recipientUsername: string
  recipientName: string
  message: string | null
  status: string
  createdAt: string
  processedAt: string | null
  readOnlyData: any
}

export default function FormPage() {
  const searchParams = useSearchParams()
  
  // Get params from URL (passed from main app)
  const [accessToken] = useState(searchParams.get('token') || '')
  const [userId] = useState(searchParams.get('userId') || '')
  const [userName] = useState(searchParams.get('userName') || '')
  const [userEmail] = useState(searchParams.get('userEmail') || '')
  
  // Form inputs
  const [giftType, setGiftType] = useState('')
  const [recipientUsername, setRecipientUsername] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [message, setMessage] = useState('')
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  
  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true)
  const [submissionsError, setSubmissionsError] = useState('')

  useEffect(() => {
    if (userId) {
      fetchSubmissions()
    }
  }, [userId])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/submissions?userId=${userId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch submissions')
      }
      
      setSubmissions(data.submissions)
    } catch (err) {
      setSubmissionsError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoadingSubmissions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // Submit directly without review page
    await submitForm()
  }

  const submitForm = async () => {
    setError('')
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          giftType,
          recipientUsername,
          recipientName,
          message
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form')
      }
      
      setShowConfirmation(true)
      setShowForm(false)
      // Reset form
      setGiftType('')
      setRecipientUsername('')
      setRecipientName('')
      setMessage('')
      // Refresh submissions list
      fetchSubmissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }


  // Validate access token first
  if (!accessToken || accessToken !== REQUIRED_ACCESS_TOKEN) {
    return (
      <div className="container">
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

  if (!userId || !userName) {
    return (
      <div className="container">
        <div className="card">
          <h2>Invalid Access</h2>
          <p>This page must be accessed from the main application with valid user credentials.</p>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Missing parameters: userId or userName
          </p>
        </div>
      </div>
    )
  }

  // If showing form, render the form
  if (showForm && !showConfirmation) {
    return (
      <div className="container">
        <h1>🎁 Gift Request Form</h1>
        
        <div className="card">
          <button 
            onClick={() => setShowForm(false)}
            className="nav-link"
            style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
          >
            ← Back to My Requests
          </button>

          {/* Read-only section */}
          <div className="read-only-section">
            <h3>Your Information</h3>
            <div className="read-only-item">
              <strong>Name:</strong> {userName}
            </div>
            <div className="read-only-item">
              <strong>Email:</strong> {userEmail}
            </div>
          </div>

          <h2>Gift Request Details</h2>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="giftType">Gift Duration *</label>
              <select
                id="giftType"
                value={giftType}
                onChange={(e) => setGiftType(e.target.value)}
                required
              >
                <option value="">Select duration</option>
                <option value="One Month">One Month</option>
                <option value="Two Months">Two Months</option>
                <option value="Three Months">Three Months</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="recipientUsername">Recipient Username *</label>
              <input
                type="text"
                id="recipientUsername"
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
                placeholder="Enter recipient's username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipientName">Recipient Full Name *</label>
              <input
                type="text"
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient's full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={4}
              />
            </div>

            <div className="btn-group">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (showConfirmation) {
    return (
      <div className="container">
        <div className="card">
          <h2>✅ Submission Successful!</h2>
          <div className="alert alert-success">
            Your gift request has been submitted successfully and is now pending approval.
          </div>
          <div className="btn-group">
            <button 
              onClick={() => setShowConfirmation(false)}
              className="btn btn-primary"
            >
              Submit Another Request
            </button>
            <Link href={`/my-submissions?token=${accessToken}&userId=${userId}&userName=${userName}&userEmail=${userEmail}`}>
              <button className="btn btn-secondary">
                View My Submissions
              </button>
            </Link>
            <button 
              onClick={() => window.close()}
              className="btn btn-secondary"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Default view: Show submissions list
  return (
    <div className="container">
      <h1>🎁 My Gift Requests</h1>
      
      <div className="card">
        <div className="header">
          <div>
            <h2>Welcome, {userName}!</h2>
            <p className="subtitle">Manage your gift requests below</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              + New Request
            </button>
            <button 
              onClick={() => window.close()}
              className="btn btn-secondary"
            >
              Close Window
            </button>
          </div>
        </div>

        {submissionsError && (
          <div className="alert alert-error">
            {submissionsError}
          </div>
        )}

        {isLoadingSubmissions ? (
          <p>Loading your requests...</p>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#666' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No requests yet</h3>
            <p style={{ marginBottom: '2rem' }}>You haven't submitted any gift requests.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Submit Your First Request
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Recipient Username</th>
                  <th>Recipient Name</th>
                  <th>Status</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                    <td>{submission.giftType}</td>
                    <td>{submission.recipientUsername}</td>
                    <td>{submission.recipientName}</td>
                    <td>
                      <span className={`badge badge-${submission.status.toLowerCase()}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td>{submission.message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

