'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
  const userId = searchParams.get('userId')
  
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

