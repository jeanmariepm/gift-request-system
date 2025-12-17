'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Logo from './components/Logo'

const REQUIRED_ACCESS_TOKEN = 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2'

interface Submission {
  id: string
  giftType: string
  recipientUsername: string
  recipientName: string
  recipientEmail: string | null
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
  const [env] = useState(searchParams.get('env') || 'production')
  
  // Form inputs
  const [giftType, setGiftType] = useState('')
  const [recipientUsername, setRecipientUsername] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
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
  
  // Editing state - to track which submission is being edited
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchSubmissions()
    }
  }, [userId])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/submissions?userId=${userId}&env=${env}`)
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

  const handleEditSubmission = (submission: Submission) => {
    // Populate form with submission data
    setEditingSubmissionId(submission.id)
    setGiftType(submission.giftType)
    setRecipientUsername(submission.recipientUsername || '')
    setRecipientName(submission.recipientName)
    setRecipientEmail(submission.recipientEmail || '')
    setMessage(submission.message || '')
    setShowForm(true)
  }

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this gift request? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/submissions/${submissionId}?env=${env}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete submission')
      }

      // Refresh the submissions list
      await fetchSubmissions()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred while deleting')
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
      let response
      
      if (editingSubmissionId) {
        // Update existing submission
        response = await fetch(`/api/submissions/${editingSubmissionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            giftType,
            recipientUsername,
            recipientName,
            recipientEmail,
            message,
            env
          })
        })
      } else {
        // Create new submission
        response = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            userName,
            userEmail,
            giftType,
            recipientUsername,
            recipientName,
            recipientEmail,
            message,
            env
          })
        })
      }
      
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
      setRecipientEmail('')
      setMessage('')
      setEditingSubmissionId(null)
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

  if (!userId || !userName) {
    return (
      <div className="container">
        <Logo />
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
        <Logo />
        
        <h1 className="page-title">{editingSubmissionId ? 'Edit Gift Request' : 'Gift Request Form'}</h1>
        
        <div className="card">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              <label htmlFor="recipientEmail">Recipient Email Address *</label>
              <input
                type="email"
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient's email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipientUsername">Recipient Username</label>
              <input
                type="text"
                id="recipientUsername"
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
                placeholder="Enter recipient's username (optional)"
              />
            </div>

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
              <label htmlFor="message">
                Message (Optional)
                <span style={{ float: 'right', fontSize: '0.875rem', color: message.length > 1000 ? '#e53e3e' : '#a0aec0' }}>
                  {message.length}/1000 characters
                </span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={4}
                maxLength={1000}
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
                onClick={() => {
                  setShowForm(false)
                  setEditingSubmissionId(null)
                  setGiftType('')
                  setRecipientUsername('')
                  setRecipientName('')
                  setRecipientEmail('')
                  setMessage('')
                }}
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
        <Logo />
        
        <div className="card confirmation-card">
          <h2 style={{ textAlign: 'center' }}>✅ Submission Successful!</h2>
          <div className="alert alert-success">
            Your gift request has been submitted successfully and is now pending approval.
          </div>
          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            📧 You will be notified via email when your reward is about to be processed. At that time, you will be asked to provide payment details to complete the transaction.
          </div>
          <div className="confirmation-buttons">
            <button 
              onClick={() => {
                setShowConfirmation(false)
                setShowForm(true)
              }}
              className="btn btn-primary"
            >
              Submit Another Request
            </button>
            <button 
              onClick={() => setShowConfirmation(false)}
              className="btn btn-secondary"
            >
              View My Submissions
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Default view: Show submissions list
  return (
    <div className="container">
      <Logo />
      
      <h1 className="page-title">My Gift Requests</h1>
      
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Hi, {userName}!</h2>
            <p className="subtitle">Manage your gift requests below:</p>
          </div>
          <div className="header-buttons">
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
              Close
            </button>
          </div>
        </div>

        {submissionsError && (
          <div className="alert alert-error">
            {submissionsError}
          </div>
        )}

        {isLoadingSubmissions ? (
          <p style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading your requests...</p>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No requests yet</h3>
            <p style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.9)' }}>You haven't submitted any gift requests.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Submit Your First Request
            </button>
          </div>
        ) : (
          <>
          {/* Desktop Table View */}
          <div className="table-container desktop-only">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Recipient Username</th>
                  <th>Recipient Name</th>
                  <th>Recipient Email</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => {
                  const isPending = submission.status === 'Pending'
                  
                  return (
                    <tr key={submission.id}>
                      <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                      <td>{submission.giftType}</td>
                      <td>{submission.recipientUsername || '-'}</td>
                      <td>{submission.recipientName}</td>
                      <td>{submission.recipientEmail || '-'}</td>
                      <td>
                        <span className={`badge badge-${submission.status.toLowerCase()}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td>{submission.message || '-'}</td>
                      <td>
                        {isPending && (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                              onClick={() => handleEditSubmission(submission)}
                              className="icon-button edit-icon"
                              title="Edit"
                              aria-label="Edit submission"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteSubmission(submission.id)}
                              className="icon-button delete-icon"
                              title="Delete"
                              aria-label="Delete submission"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-cards mobile-only">
            {submissions.map((submission) => {
              const isPending = submission.status === 'Pending'
              
              return (
                <div key={submission.id} className="mobile-card">
                  <div className="mobile-card-header">
                    <span className={`badge badge-${submission.status.toLowerCase()}`}>
                      {submission.status}
                    </span>
                    {isPending && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditSubmission(submission)}
                          className="icon-button edit-icon"
                          title="Edit"
                          aria-label="Edit submission"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSubmission(submission.id)}
                          className="icon-button delete-icon"
                          title="Delete"
                          aria-label="Delete submission"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mobile-card-field">
                    <label>Date:</label>
                    <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mobile-card-field">
                    <label>Duration:</label>
                    <span>{submission.giftType}</span>
                  </div>
                  
                  <div className="mobile-card-field">
                    <label>Recipient Name:</label>
                    <span>{submission.recipientName}</span>
                  </div>
                  
                  <div className="mobile-card-field">
                    <label>Recipient Email:</label>
                    <span>{submission.recipientEmail || '-'}</span>
                  </div>
                  
                  <div className="mobile-card-field">
                    <label>Recipient Username:</label>
                    <span>{submission.recipientUsername || '-'}</span>
                  </div>
                  
                  <div className="mobile-card-field">
                    <label>Message:</label>
                    <span>{submission.message || '-'}</span>
                  </div>
                </div>
              )
            })}
          </div>
          </>
        )}
      </div>
    </div>
  )
}

