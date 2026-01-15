import { useState, useEffect } from 'react'

function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/church/announcements')
      const data = await response.json()
      if (data.success) {
        setAnnouncements(data.data.announcements)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const url = editingAnnouncement 
        ? `/api/church/announcements/${editingAnnouncement.id}`
        : '/api/church/announcements'
      
      const method = editingAnnouncement ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setMessage(`Announcement ${editingAnnouncement ? 'updated' : 'created'} successfully!`)
        fetchAnnouncements()
        resetForm()
      } else {
        setMessage('Error saving announcement')
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
      setMessage('Error saving announcement')
    }
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      type: announcement.type || 'general',
      priority: announcement.priority || 'medium',
      start_date: announcement.start_date || new Date().toISOString().split('T')[0],
      end_date: announcement.end_date || '',
      is_active: announcement.is_active !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (announcementId) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const response = await fetch(`/api/church/announcements/${announcementId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Announcement deleted successfully!')
        fetchAnnouncements()
      } else {
        setMessage('Error deleting announcement')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      setMessage('Error deleting announcement')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      is_active: true
    })
    setEditingAnnouncement(null)
    setShowForm(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545'
      case 'medium': return '#ffc107'
      case 'low': return '#28a745'
      default: return '#6c757d'
    }
  }

  if (loading) {
    return <div>Loading announcements...</div>
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>📢 Announcement Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add New Announcement'}
        </button>
      </div>

      {message && (
        <div style={{
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      {showForm && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginBottom: '20px' }}>
            {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Title *:
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Content *:
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Type:
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="general">General</option>
                    <option value="event">Event</option>
                    <option value="registration">Registration</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Priority:
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                    />
                    <span style={{ fontWeight: 'bold' }}>Active</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Start Date:
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    End Date (optional):
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange('end_date', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingAnnouncement ? 'Update Announcement' : 'Add Announcement'}
                </button>
                <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {announcements.map(announcement => (
          <div key={announcement.id} style={{
            backgroundColor: 'white',
            border: `2px solid ${getPriorityColor(announcement.priority)}`,
            borderRadius: '10px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '10px'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{announcement.title}</h4>
                <p style={{ margin: '0 0 15px 0', color: '#666', lineHeight: '1.5' }}>
                  {announcement.content}
                </p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: '#888' }}>
                  <span style={{
                    backgroundColor: getPriorityColor(announcement.priority),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase'
                  }}>
                    {announcement.priority}
                  </span>
                  <span style={{
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'capitalize'
                  }}>
                    {announcement.type}
                  </span>
                  <span>Start: {announcement.start_date}</span>
                  {announcement.end_date && <span>End: {announcement.end_date}</span>}
                  <span style={{ 
                    color: announcement.is_active ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {announcement.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '15px' }}>
                <button
                  onClick={() => handleEdit(announcement)}
                  style={{
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No announcements found. Add your first announcement using the form above.
        </div>
      )}
    </div>
  )
}

export default AnnouncementManager