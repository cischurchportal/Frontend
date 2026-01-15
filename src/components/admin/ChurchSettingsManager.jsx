import { useState, useEffect } from 'react'

function ChurchSettingsManager() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [dioceseLogoFile, setDioceseLogoFile] = useState(null)
  const [churchLogoFile, setChurchLogoFile] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/church/settings')
      const data = await response.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage('Error loading church settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      let updatedSettings = { ...settings }

      // Upload diocese logo if selected
      if (dioceseLogoFile) {
        const logoFormData = new FormData()
        logoFormData.append('file', dioceseLogoFile)
        logoFormData.append('logo_type', 'diocese')

        const uploadResponse = await fetch('/api/upload/church-logo', {
          method: 'POST',
          body: logoFormData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          updatedSettings.diocese_logo = uploadData.file_path
        }
      }

      // Upload church logo if selected
      if (churchLogoFile) {
        const logoFormData = new FormData()
        logoFormData.append('file', churchLogoFile)
        logoFormData.append('logo_type', 'church')

        const uploadResponse = await fetch('/api/upload/church-logo', {
          method: 'POST',
          body: logoFormData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          updatedSettings.church_logo = uploadData.file_path
        }
      }

      const response = await fetch('/api/church/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings)
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Church settings updated successfully!')
        setSettings(data.data)
        setDioceseLogoFile(null)
        setChurchLogoFile(null)
      } else {
        setMessage('Error updating settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage('Error updating settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return <div>Loading church settings...</div>
  }

  if (!settings) {
    return <div>No church settings found</div>
  }

  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>⛪ Church Settings</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Church Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Church Name:
            </label>
            <input
              type="text"
              value={settings.church_name || ''}
              onChange={(e) => handleChange('church_name', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Address:
            </label>
            <textarea
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Contact Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phone:
              </label>
              <input
                type="tel"
                value={settings.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email:
              </label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {/* Website and Established Year */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Website:
              </label>
              <input
                type="url"
                value={settings.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Established Year:
              </label>
              <input
                type="number"
                value={settings.established_year || ''}
                onChange={(e) => handleChange('established_year', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {/* Logo Management */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Logo Management</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Diocese Logo */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Diocese Logo:
                </label>
                
                {settings.diocese_logo && (
                  <div style={{ marginBottom: '10px' }}>
                    <img 
                      src={settings.diocese_logo} 
                      alt="Diocese logo"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        backgroundColor: 'white'
                      }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '5px 0' }}>
                      Current diocese logo
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setDioceseLogoFile(file)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '0.9rem'
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                  {dioceseLogoFile 
                    ? `Selected: ${dioceseLogoFile.name}` 
                    : 'Choose new diocese logo'
                  }
                </small>
              </div>

              {/* Church Logo */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Church Logo:
                </label>
                
                {settings.church_logo && (
                  <div style={{ marginBottom: '10px' }}>
                    <img 
                      src={settings.church_logo} 
                      alt="Church logo"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        backgroundColor: 'white'
                      }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '5px 0' }}>
                      Current church logo
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setChurchLogoFile(file)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '0.9rem'
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                  {churchLogoFile 
                    ? `Selected: ${churchLogoFile.name}` 
                    : 'Choose new church logo'
                  }
                </small>
              </div>
            </div>

            <p style={{ 
              fontSize: '0.85rem', 
              color: '#666', 
              marginTop: '15px',
              fontStyle: 'italic'
            }}>
              Upload new logo files to replace the current ones. Supported formats: JPG, PNG, GIF, SVG
            </p>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '20px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'Saving...' : 'Save Church Settings'}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
              color: message.includes('successfully') ? '#155724' : '#721c24',
              marginTop: '10px'
            }}>
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default ChurchSettingsManager