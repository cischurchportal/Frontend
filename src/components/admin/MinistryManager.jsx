import { useState, useEffect } from 'react'
import ErrorPopup from '../ErrorPopup'
import Loader from '../Loader'

function MinistryManager() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMinistries()
  }, [])

  const fetchMinistries = async () => {
    try {
      const response = await fetch('/api/ministries/')
      const data = await response.json()
      if (data.success) {
        setMinistries(data.data)
      } else {
        setMessage('Failed to load ministries')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error fetching ministries:', error)
      setMessage('Error loading ministries: ' + error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ministry) => {
    setEditingId(ministry.id)
    setEditForm(ministry)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    
    try {
      const response = await fetch(`/api/ministries/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('Ministry updated successfully!')
        setMessageType('success')
        setEditingId(null)
        setEditForm({})
        fetchMinistries()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to update ministry')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Update error:', error)
      setMessage('Error updating ministry: ' + error.message)
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e, ministryId) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setMessage('Uploading image...')
    setMessageType('info')

    try {
      const response = await fetch('/api/upload/', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setEditForm({ ...editForm, image: data.file_path })
        setMessage('Image uploaded successfully! Remember to click "Save Changes" to persist.')
        setMessageType('success')
        setTimeout(() => setMessage(''), 5000)
      } else {
        setMessage('Error uploading image: ' + (data.message || 'Unknown error'))
        setMessageType('error')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage('Error uploading image: ' + error.message)
      setMessageType('error')
    }
  }

  if (loading) {
    return <Loader message="Loading ministries..." />
  }

  return (
    <div>
      {message && <ErrorPopup message={message} type={messageType} onClose={() => setMessage('')} />}
      
      <h2 style={{ marginBottom: '30px' }}>🙏 Ministry Manager</h2>

      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
          color: message.includes('success') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {ministries.map((ministry) => (
          <div
            key={ministry.id}
            style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              border: editingId === ministry.id ? '2px solid #667eea' : '1px solid #ddd'
            }}
          >
            {editingId === ministry.id ? (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Ministry Name:
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Time:
                    </label>
                    <input
                      type="text"
                      value={editForm.time || ''}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Description:
                    </label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Contact Phone:
                    </label>
                    <input
                      type="text"
                      value={editForm.contact_phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Contact Email:
                    </label>
                    <input
                      type="email"
                      value={editForm.contact_email || ''}
                      onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Ministry Image:
                    </label>
                    {editForm.image && (
                      <img
                        src={editForm.image}
                        alt={editForm.name}
                        style={{
                          width: '200px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '5px',
                          marginBottom: '10px'
                        }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, ministry.id)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    style={{ opacity: saving ? 0.7 : 1 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '10px', color: '#333' }}>{ministry.name}</h3>
                    {ministry.time && (
                      <p style={{ color: '#f39c12', marginBottom: '10px' }}>
                        <strong>Time:</strong> {ministry.time}
                      </p>
                    )}
                    <p style={{ color: '#666', marginBottom: '10px' }}>{ministry.description}</p>
                    {ministry.contact_phone && (
                      <p style={{ color: '#333', fontSize: '0.9rem' }}>
                        📞 {ministry.contact_phone}
                      </p>
                    )}
                    {ministry.contact_email && (
                      <p style={{ color: '#333', fontSize: '0.9rem' }}>
                        ✉️ {ministry.contact_email}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                    {ministry.image && (
                      <img
                        src={ministry.image}
                        alt={ministry.name}
                        style={{
                          width: '150px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '5px'
                        }}
                      />
                    )}
                    <button
                      onClick={() => handleEdit(ministry)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.9rem' }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MinistryManager
