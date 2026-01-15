import { useState, useEffect } from 'react'

function PriestManager() {
  const [priests, setPriests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPriest, setEditingPriest] = useState(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    image: '',
    imageFile: null,
    bio: '',
    ordination_year: '',
    specializations: '',
    contact_email: '',
    is_active: true,
    display_order: 1
  })

  useEffect(() => {
    fetchPriests()
  }, [])

  const fetchPriests = async () => {
    try {
      const response = await fetch('/api/church/priests')
      const data = await response.json()
      if (data.success) {
        setPriests(data.data.priests)
      }
    } catch (error) {
      console.error('Error fetching priests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      let imagePath = formData.image

      // If a new image file is selected, upload it first
      if (formData.imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('file', formData.imageFile)
        imageFormData.append('type', 'priest')
        imageFormData.append('name', formData.name.replace(/\s+/g, '_').toLowerCase())

        const uploadResponse = await fetch('/api/upload/priest-image', {
          method: 'POST',
          body: imageFormData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imagePath = uploadData.file_path
        } else {
          setMessage('Error uploading image')
          return
        }
      }

      // Convert specializations string to array
      const priestData = {
        ...formData,
        image: imagePath,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
        ordination_year: formData.ordination_year ? parseInt(formData.ordination_year) : null
      }

      // Remove imageFile from the data sent to the API
      delete priestData.imageFile

      const url = editingPriest 
        ? `/api/church/priests/${editingPriest.id}`
        : '/api/church/priests'
      
      const method = editingPriest ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(priestData)
      })

      const data = await response.json()
      if (data.success) {
        setMessage(`Priest ${editingPriest ? 'updated' : 'created'} successfully!`)
        fetchPriests()
        resetForm()
      } else {
        setMessage('Error saving priest')
      }
    } catch (error) {
      console.error('Error saving priest:', error)
      setMessage('Error saving priest')
    }
  }

  const handleEdit = (priest) => {
    setEditingPriest(priest)
    setFormData({
      name: priest.name || '',
      title: priest.title || '',
      image: priest.image || '',
      imageFile: null,
      bio: priest.bio || '',
      ordination_year: priest.ordination_year || '',
      specializations: priest.specializations ? priest.specializations.join(', ') : '',
      contact_email: priest.contact_email || '',
      is_active: priest.is_active !== false,
      display_order: priest.display_order || 1
    })
    setShowForm(true)
  }

  const handleDelete = async (priestId) => {
    if (!confirm('Are you sure you want to delete this priest?')) return

    try {
      const response = await fetch(`/api/church/priests/${priestId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Priest deleted successfully!')
        fetchPriests()
      } else {
        setMessage('Error deleting priest')
      }
    } catch (error) {
      console.error('Error deleting priest:', error)
      setMessage('Error deleting priest')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      image: '',
      imageFile: null,
      bio: '',
      ordination_year: '',
      specializations: '',
      contact_email: '',
      is_active: true,
      display_order: 1
    })
    setEditingPriest(null)
    setShowForm(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return <div>Loading priests...</div>
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>👨‍💼 Priest Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add New Priest'}
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
            {editingPriest ? 'Edit Priest' : 'Add New Priest'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Name *:
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
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
                    Title *:
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., Senior Pastor, Associate Pastor"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Priest Photo:
                </label>
                
                {/* Current Image Display */}
                {formData.image && (
                  <div style={{ marginBottom: '10px' }}>
                    <img 
                      src={formData.image} 
                      alt="Current priest photo"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #ddd'
                      }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '5px 0' }}>
                      Current photo
                    </p>
                  </div>
                )}
                
                {/* File Upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setFormData(prev => ({ ...prev, imageFile: file }))
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    marginBottom: '5px'
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                  {formData.imageFile 
                    ? `Selected: ${formData.imageFile.name}` 
                    : 'Choose a new photo to upload (JPG, PNG, GIF)'
                  }
                </small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Biography:
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={3}
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
                    Ordination Year:
                  </label>
                  <input
                    type="number"
                    value={formData.ordination_year}
                    onChange={(e) => handleChange('ordination_year', e.target.value)}
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
                    value={formData.display_order}
                    onChange={(e) => handleChange('display_order', parseInt(e.target.value))}
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
                    value={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.value === 'true')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Contact Email:
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
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
                  Specializations (comma-separated):
                </label>
                <input
                  type="text"
                  value={formData.specializations}
                  onChange={(e) => handleChange('specializations', e.target.value)}
                  placeholder="Biblical Studies, Pastoral Care, Youth Ministry"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingPriest ? 'Update Priest' : 'Add Priest'}
                </button>
                <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Priests List */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {priests.map(priest => (
          <div key={priest.id} style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '100px 1fr auto',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {priest.image ? (
                <img 
                  src={priest.image} 
                  alt={priest.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span style={{ fontSize: '2rem' }}>👤</span>
              )}
            </div>

            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{priest.name}</h4>
              <p style={{ margin: '0 0 5px 0', color: '#667eea', fontWeight: 'bold' }}>{priest.title}</p>
              {priest.bio && (
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                  {priest.bio.length > 100 ? `${priest.bio.substring(0, 100)}...` : priest.bio}
                </p>
              )}
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: '#888' }}>
                {priest.ordination_year && <span>Ordained: {priest.ordination_year}</span>}
                <span>Order: {priest.display_order}</span>
                <span style={{ 
                  color: priest.is_active ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {priest.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <button
                onClick={() => handleEdit(priest)}
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
                onClick={() => handleDelete(priest.id)}
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
        ))}
      </div>

      {priests.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No priests found. Add your first priest using the form above.
        </div>
      )}
    </div>
  )
}

export default PriestManager