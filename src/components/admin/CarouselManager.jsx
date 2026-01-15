import { useState, useEffect } from 'react'

function CarouselManager() {
  const [carousels, setCarousels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCarousel, setEditingCarousel] = useState(null)
  const [message, setMessage] = useState('')
  const [selectedCarousel, setSelectedCarousel] = useState(null)
  const [showMediaForm, setShowMediaForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'events',
    is_active: true
  })

  const [mediaFormData, setMediaFormData] = useState({
    title: '',
    description: '',
    media_type: 'image',
    file: null
  })

  useEffect(() => {
    fetchCarousels()
  }, [])

  const fetchCarousels = async () => {
    try {
      const response = await fetch('/api/carousels/')
      const data = await response.json()
      if (data.success) {
        setCarousels(data.data.carousels)
      }
    } catch (error) {
      console.error('Error fetching carousels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const url = editingCarousel 
        ? `/api/carousels/${editingCarousel.id}`
        : '/api/carousels/'
      
      const method = editingCarousel ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setMessage(`Carousel ${editingCarousel ? 'updated' : 'created'} successfully!`)
        fetchCarousels()
        resetForm()
      } else {
        setMessage('Error saving carousel')
      }
    } catch (error) {
      console.error('Error saving carousel:', error)
      setMessage('Error saving carousel')
    }
  }

  const handleMediaSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!mediaFormData.file) {
      setMessage('Please select a file to upload')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', mediaFormData.file)
      formDataToSend.append('title', mediaFormData.title)
      formDataToSend.append('description', mediaFormData.description)
      formDataToSend.append('media_type', mediaFormData.media_type)

      const response = await fetch(`/api/carousels/${selectedCarousel.id}/upload`, {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Media uploaded successfully!')
        fetchCarousels()
        resetMediaForm()
      } else {
        setMessage('Error uploading media')
      }
    } catch (error) {
      console.error('Error uploading media:', error)
      setMessage('Error uploading media')
    }
  }

  const handleEdit = (carousel) => {
    setEditingCarousel(carousel)
    setFormData({
      name: carousel.name || '',
      description: carousel.description || '',
      category: carousel.category || 'events',
      is_active: carousel.is_active !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (carouselId) => {
    if (!confirm('Are you sure you want to delete this carousel and all its media?')) return

    try {
      const response = await fetch(`/api/carousels/${carouselId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Carousel deleted successfully!')
        fetchCarousels()
      } else {
        setMessage('Error deleting carousel')
      }
    } catch (error) {
      console.error('Error deleting carousel:', error)
      setMessage('Error deleting carousel')
    }
  }

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      const response = await fetch(`/api/carousels/media/${mediaId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Media deleted successfully!')
        fetchCarousels()
      } else {
        setMessage('Error deleting media')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      setMessage('Error deleting media')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'events',
      is_active: true
    })
    setEditingCarousel(null)
    setShowForm(false)
  }

  const resetMediaForm = () => {
    setMediaFormData({
      title: '',
      description: '',
      media_type: 'image',
      file: null
    })
    setShowMediaForm(false)
    setSelectedCarousel(null)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMediaChange = (field, value) => {
    setMediaFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Auto-detect media type based on file
      const isVideo = file.type.startsWith('video/')
      setMediaFormData(prev => ({
        ...prev,
        file: file,
        media_type: isVideo ? 'video' : 'image'
      }))
    }
  }

  if (loading) {
    return <div>Loading carousels...</div>
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>📸 Carousel Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add New Carousel'}
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
            {editingCarousel ? 'Edit Carousel' : 'Add New Carousel'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Carousel Name *:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  placeholder="e.g., Christmas Celebration 2024"
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
                  Description:
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  placeholder="Brief description of this carousel..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Category:
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="events">Events</option>
                    <option value="ministry">Ministry</option>
                    <option value="outreach">Outreach</option>
                    <option value="worship">Worship</option>
                    <option value="general">General</option>
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingCarousel ? 'Update Carousel' : 'Add Carousel'}
                </button>
                <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Media Upload Form */}
      {showMediaForm && selectedCarousel && (
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          border: '2px solid #2196f3'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#1976d2' }}>
            Add Media to "{selectedCarousel.name}"
          </h3>

          <form onSubmit={handleMediaSubmit}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Select File *:
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                  Supported formats: JPG, PNG, GIF, MP4, MOV, AVI
                </small>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Title *:
                  </label>
                  <input
                    type="text"
                    value={mediaFormData.title}
                    onChange={(e) => handleMediaChange('title', e.target.value)}
                    required
                    placeholder="e.g., Christmas Morning Service"
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
                    Media Type:
                  </label>
                  <select
                    value={mediaFormData.media_type}
                    onChange={(e) => handleMediaChange('media_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Description:
                </label>
                <textarea
                  value={mediaFormData.description}
                  onChange={(e) => handleMediaChange('description', e.target.value)}
                  rows={2}
                  placeholder="Brief description of this media..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  Upload Media
                </button>
                <button type="button" onClick={resetMediaForm} className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Carousels List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {carousels.map(carousel => (
          <div key={carousel.id} style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '15px'
            }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{carousel.name}</h4>
                {carousel.description && (
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                    {carousel.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
                  <span style={{
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'capitalize'
                  }}>
                    {carousel.category}
                  </span>
                  <span style={{ 
                    color: carousel.is_active ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {carousel.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span style={{ color: '#666' }}>
                    {carousel.media ? carousel.media.length : 0} media files
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => {
                    setSelectedCarousel(carousel)
                    setShowMediaForm(true)
                  }}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  + Add Media
                </button>
                <button
                  onClick={() => handleEdit(carousel)}
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
                  onClick={() => handleDelete(carousel.id)}
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

            {/* Media Grid */}
            {carousel.media && carousel.media.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '10px',
                marginTop: '15px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                {carousel.media.map(media => (
                  <div key={media.id} style={{
                    position: 'relative',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    border: '1px solid #ddd'
                  }}>
                    {media.media_type === 'image' ? (
                      <img 
                        src={media.file_path} 
                        alt={media.title}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100px',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '2rem'
                      }}>
                        ▶️
                      </div>
                    )}
                    
                    <div style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px'
                    }}>
                      <button
                        onClick={() => handleDeleteMedia(media.id)}
                        style={{
                          backgroundColor: 'rgba(220, 53, 69, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div style={{
                      padding: '5px',
                      fontSize: '0.7rem',
                      color: '#333'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                        {media.title}
                      </div>
                      <div style={{ color: '#666' }}>
                        {media.media_type === 'image' ? '📷' : '🎥'} {media.media_type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {carousels.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No carousels found. Add your first carousel using the form above.
        </div>
      )}
    </div>
  )
}

export default CarouselManager