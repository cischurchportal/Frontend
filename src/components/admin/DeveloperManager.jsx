import { useState, useEffect } from 'react'
import ErrorPopup from '../ErrorPopup'
import Loader from '../Loader'

function DeveloperManager() {
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchDevelopers()
  }, [])

  const fetchDevelopers = async () => {
    try {
      const response = await fetch('/api/developers/')
      const data = await response.json()
      if (data.success) {
        setDevelopers(data.data)
      } else {
        setMessage('Failed to load developers')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error fetching developers:', error)
      setMessage('Error loading developers: ' + error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (developer) => {
    setEditingId(developer.id)
    setEditForm(developer)
    setShowAddForm(false)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
    setShowAddForm(false)
  }

  const handleAdd = () => {
    setShowAddForm(true)
    setEditingId(null)
    setEditForm({
      name: '',
      role: '',
      image: '',
      order: developers.length + 1,
      is_active: true
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    
    try {
      const url = editingId 
        ? `/api/developers/${editingId}` 
        : '/api/developers/'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage(editingId ? 'Developer updated successfully!' : 'Developer added successfully!')
        setMessageType('success')
        setEditingId(null)
        setEditForm({})
        setShowAddForm(false)
        fetchDevelopers()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to save developer')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Save error:', error)
      setMessage('Error saving developer: ' + error.message)
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (developerId) => {
    if (!confirm('Are you sure you want to delete this developer?')) return
    
    try {
      const response = await fetch(`/api/developers/${developerId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('Developer deleted successfully!')
        setMessageType('success')
        fetchDevelopers()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to delete developer')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage('Error deleting developer: ' + error.message)
      setMessageType('error')
    }
  }

  const handleImageUpload = async (e) => {
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
        setMessage('Image uploaded successfully!')
        setMessageType('success')
        setTimeout(() => setMessage(''), 3000)
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
    return <Loader message="Loading developers..." />
  }

  return (
    <div>
      {message && <ErrorPopup message={message} type={messageType} onClose={() => setMessage('')} />}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0 }}>👨‍💻 Developer Team Manager</h2>
        <button
          onClick={handleAdd}
          className="btn btn-primary"
        >
          + Add Developer
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '30px',
          border: '2px solid #667eea'
        }}>
          <h3 style={{ marginBottom: '20px' }}>
            {editingId ? 'Edit Developer' : 'Add New Developer'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name:
                </label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                  Role:
                </label>
                <input
                  type="text"
                  value={editForm.role || ''}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
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
                  Display Order:
                </label>
                <input
                  type="number"
                  value={editForm.order || 1}
                  onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) })}
                  min="1"
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
                  Status:
                </label>
                <select
                  value={editForm.is_active ? 'true' : 'false'}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'true' })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Profile Image:
                </label>
                {editForm.image && (
                  <img
                    src={editForm.image}
                    alt="Preview"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      marginBottom: '10px',
                      border: '3px solid #667eea'
                    }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving...' : (editingId ? 'Update' : 'Add')} Developer
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
        </div>
      )}

      {/* Developers List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {developers.map((dev) => (
          <div
            key={dev.id}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: dev.is_active ? '2px solid #667eea' : '2px solid #ddd'
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 15px',
              border: '3px solid #667eea'
            }}>
              <img
                src={dev.image}
                alt={dev.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="40"%3E👤%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
            <h3 style={{ marginBottom: '5px', fontSize: '1.1rem' }}>{dev.name}</h3>
            <p style={{ color: '#667eea', marginBottom: '10px', fontSize: '0.9rem' }}>{dev.role}</p>
            <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '15px' }}>
              Order: {dev.order} | {dev.is_active ? '✓ Active' : '✗ Inactive'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => handleEdit(dev)}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '8px 15px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dev.id)}
                style={{
                  fontSize: '0.85rem',
                  padding: '8px 15px',
                  border: '1px solid #e74c3c',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  color: '#e74c3c',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeveloperManager
