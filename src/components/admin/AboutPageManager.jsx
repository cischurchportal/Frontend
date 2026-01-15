import { useState, useEffect } from 'react'
import ErrorPopup from '../ErrorPopup'
import Loader from '../Loader'

function AboutPageManager() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about/')
      const data = await response.json()
      if (data.success) {
        // Ensure images array exists and has 4 slots
        const images = data.data.images || []
        while (images.length < 4) {
          images.push('')
        }
        setAboutData({ ...data.data, images })
      } else {
        setMessage('Failed to load about page data')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
      setMessage('Error loading about page data: ' + error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/about/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('About page updated successfully!')
        setMessageType('success')
        setEditMode(false)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to update about page')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Update error:', error)
      setMessage('Error updating about page: ' + error.message)
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e, index) => {
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
        const newImages = [...(aboutData.images || [])]
        // Ensure array has enough slots
        while (newImages.length <= index) {
          newImages.push('')
        }
        newImages[index] = data.file_path
        setAboutData({ ...aboutData, images: newImages })
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
    return <Loader message="Loading about page data..." />
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
        <h2 style={{ margin: 0 }}>📄 About Page Manager</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="btn btn-primary"
        >
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Page Title:
          </label>
          <input
            type="text"
            value={aboutData?.title || ''}
            onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
            disabled={!editMode}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Church History:
          </label>
          <textarea
            value={aboutData?.history || ''}
            onChange={(e) => setAboutData({ ...aboutData, history: e.target.value })}
            disabled={!editMode}
            rows={15}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Church Images (4 images):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} style={{
                border: '2px dashed #ddd',
                borderRadius: '5px',
                padding: '10px',
                textAlign: 'center'
              }}>
                {aboutData?.images?.[index] ? (
                  <div>
                    <img
                      src={aboutData.images[index]}
                      alt={`Church ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '5px',
                        marginBottom: '10px'
                      }}
                    />
                    {editMode && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        style={{ fontSize: '0.9rem' }}
                      />
                    )}
                  </div>
                ) : (
                  editMode && (
                    <div>
                      <p style={{ color: '#999', marginBottom: '10px' }}>No image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        style={{ fontSize: '0.9rem' }}
                      />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {editMode && (
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </form>
    </div>
  )
}

export default AboutPageManager
