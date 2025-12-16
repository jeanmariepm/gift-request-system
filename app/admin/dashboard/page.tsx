'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '../../components/Logo'

interface Submission {
  id: string
  userId: string
  userName: string
  userEmail: string
  giftType: string
  recipientUsername: string
  recipientName: string
  recipientEmail: string | null
  message: string | null
  status: string
  createdAt: string
  processedAt: string | null
  processedBy: string | null
  readOnlyData: any
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Processed' | 'Cancelled'>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      
      if (response.status === 401) {
        router.push('/admin')
        return
      }
      
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

  const handleStatusChange = async (submissionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          processedBy: 'admin' // You could store admin username from login
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Refresh submissions
      fetchSubmissions()
      setSelectedSubmission(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleClose = () => {
    window.close()
  }

  const filteredSubmissions = filterStatus === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filterStatus)

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'Pending').length,
    processed: submissions.filter(s => s.status === 'Processed').length,
    cancelled: submissions.filter(s => s.status === 'Cancelled').length
  }

  return (
    <div className="container">
      <Logo />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Admin Dashboard</h1>
        <button 
          onClick={handleClose}
          className="btn btn-secondary"
        >
          Close
        </button>
      </div>
      
      <div className="card">
        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px', background: '#f7fafc', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#667eea' }}>{stats.total}</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Total</p>
          </div>
          <div style={{ flex: 1, minWidth: '180px', background: '#fef3c7', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#92400e' }}>{stats.pending}</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Pending</p>
          </div>
          <div style={{ flex: 1, minWidth: '180px', background: '#d1fae5', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#065f46' }}>{stats.processed}</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Processed</p>
          </div>
          <div style={{ flex: 1, minWidth: '180px', background: '#fed7d7', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#c53030' }}>{stats.cancelled}</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Cancelled</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: 600 }}>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '2px solid #e2e8f0' }}
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {isLoading ? (
          <p>Loading submissions...</p>
        ) : filteredSubmissions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No submissions found.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Duration</th>
                  <th>Recipient Username</th>
                  <th>Recipient Name</th>
                  <th>Recipient Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div>{submission.userName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>{submission.userEmail}</div>
                    </td>
                    <td>{submission.giftType}</td>
                    <td>{submission.recipientUsername}</td>
                    <td>{submission.recipientName}</td>
                    <td>{submission.recipientEmail || '-'}</td>
                    <td>
                      <span className={`badge badge-${submission.status.toLowerCase()}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="modal" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Submission Details</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>User Information</h3>
              <div className="read-only-item"><strong>Name:</strong> {selectedSubmission.userName}</div>
              <div className="read-only-item"><strong>Email:</strong> {selectedSubmission.userEmail}</div>
              {selectedSubmission.readOnlyData?.companyName && (
                <div className="read-only-item"><strong>Company:</strong> {selectedSubmission.readOnlyData.companyName}</div>
              )}
              {selectedSubmission.readOnlyData?.department && (
                <div className="read-only-item"><strong>Department:</strong> {selectedSubmission.readOnlyData.department}</div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Gift Details</h3>
              <div className="read-only-item"><strong>Duration:</strong> {selectedSubmission.giftType}</div>
              <div className="read-only-item"><strong>Recipient Username:</strong> {selectedSubmission.recipientUsername}</div>
              <div className="read-only-item"><strong>Recipient Name:</strong> {selectedSubmission.recipientName}</div>
              <div className="read-only-item"><strong>Recipient Email:</strong> {selectedSubmission.recipientEmail || 'Not provided'}</div>
              <div className="read-only-item"><strong>Message:</strong> {selectedSubmission.message || 'No message'}</div>
              <div className="read-only-item"><strong>Status:</strong> <span className={`badge badge-${selectedSubmission.status.toLowerCase()}`}>{selectedSubmission.status}</span></div>
              <div className="read-only-item"><strong>Submitted:</strong> {new Date(selectedSubmission.createdAt).toLocaleString()}</div>
              {selectedSubmission.processedAt && (
                <>
                  <div className="read-only-item"><strong>Processed:</strong> {new Date(selectedSubmission.processedAt).toLocaleString()}</div>
                  <div className="read-only-item"><strong>Processed By:</strong> {selectedSubmission.processedBy}</div>
                </>
              )}
            </div>

            <div className="btn-group">
              {selectedSubmission.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'Processed')}
                    className="btn btn-success"
                  >
                    ✓ Mark as Processed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'Cancelled')}
                    className="btn btn-danger"
                  >
                    ✕ Mark as Cancelled
                  </button>
                </>
              )}
              {selectedSubmission.status === 'Processed' && (
                <>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'Pending')}
                    className="btn btn-secondary"
                  >
                    ← Back to Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'Cancelled')}
                    className="btn btn-danger"
                  >
                    ✕ Mark as Cancelled
                  </button>
                </>
              )}
              {selectedSubmission.status === 'Cancelled' && (
                <button
                  onClick={() => handleStatusChange(selectedSubmission.id, 'Pending')}
                  className="btn btn-secondary"
                >
                  ← Reopen as Pending
                </button>
              )}
              <button
                onClick={() => setSelectedSubmission(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

