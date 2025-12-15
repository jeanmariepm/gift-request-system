'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const REQUIRED_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN || 'gift_access_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2'

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

export default function MySubmissionsPage() {
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('token')
  const userId = searchParams.get('userId')
  
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Validate access token
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
          </div>
        </div>
      </div>
    )
  }

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
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!userId) {
    return (
      <div className="container">
        <div className="card">
          <h2>Invalid Access</h2>
          <p>User ID is required to view submissions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>📋 My Submissions</h1>
      
      <div className="card">
        <div className="header">
          <h2>Your Gift Requests</h2>
          <Link href={`/?userId=${userId}&userName=${searchParams.get('userName')}&userEmail=${searchParams.get('userEmail')}`}>
            <button className="btn btn-primary">
              + New Request
            </button>
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {isLoading ? (
          <p>Loading your submissions...</p>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>You haven't submitted any gift requests yet.</p>
            <Link href={`/?userId=${userId}&userName=${searchParams.get('userName')}&userEmail=${searchParams.get('userEmail')}`}>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Submit Your First Request
              </button>
            </Link>
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

