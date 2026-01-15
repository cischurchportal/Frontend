import { useState, useEffect } from 'react'

function ServiceTimingManager() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    service_name: '',
    day_of_week: 'Sunday',
    time: '09:00',
    duration_minutes: 90,
    preacher: '',
    service_type: 'worship',
    language: 'English',
    location: '',
    description: '',
    is_active: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/church/service-timings')
      const data = await response.json()
      if (data.success) {
        setServices(data.data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const serviceData = {
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes)
      }

      const url = editingService 
        ? `/api/church/service-timings/${editingService.id}`
        : '/api/church/service-timings'
      
      const method = editingService ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      })

      const data = await response.json()
      if (data.success) {
        setMessage(`Service ${editingService ? 'updated' : 'created'} successfully!`)
        fetchServices()
        resetForm()
      } else {
        setMessage('Error saving service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      setMessage('Error saving service')
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      service_name: service.service_name || '',
      day_of_week: service.day_of_week || 'Sunday',
      time: service.time || '09:00',
      duration_minutes: service.duration_minutes || 90,
      preacher: service.preacher || '',
      service_type: service.service_type || 'worship',
      language: service.language || 'English',
      location: service.location || '',
      description: service.description || '',
      is_active: service.is_active !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/church/service-timings/${serviceId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Service deleted successfully!')
        fetchServices()
      } else {
        setMessage('Error deleting service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      setMessage('Error deleting service')
    }
  }

  const resetForm = () => {
    setFormData({
      service_name: '',
      day_of_week: 'Sunday',
      time: '09:00',
      duration_minutes: 90,
      preacher: '',
      service_type: 'worship',
      language: 'English',
      location: '',
      description: '',
      is_active: true
    })
    setEditingService(null)
    setShowForm(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'worship': return '⛪'
      case 'bible_study': return '📖'
      case 'prayer': return '🙏'
      case 'youth': return '👥'
      default: return '📅'
    }
  }

  if (loading) {
    return <div>Loading service timings...</div>
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>🕐 Service Timing Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add New Service'}
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
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Service Name *:
                  </label>
                  <input
                    type="text"
                    value={formData.service_name}
                    onChange={(e) => handleChange('service_name', e.target.value)}
                    required
                    placeholder="e.g., Sunday Morning Worship"
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
                    Day of Week *:
                  </label>
                  <select
                    value={formData.day_of_week}
                    onChange={(e) => handleChange('day_of_week', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Time *:
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
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
                    Duration (minutes):
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => handleChange('duration_minutes', e.target.value)}
                    min="15"
                    max="300"
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
                    Service Type:
                  </label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => handleChange('service_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="worship">Worship</option>
                    <option value="bible_study">Bible Study</option>
                    <option value="prayer">Prayer</option>
                    <option value="youth">Youth</option>
                    <option value="special">Special Event</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Preacher:
                  </label>
                  <input
                    type="text"
                    value={formData.preacher}
                    onChange={(e) => handleChange('preacher', e.target.value)}
                    placeholder="e.g., Rev. Dr. John Matthew"
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
                    Location:
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g., Main Sanctuary"
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
                  Language:
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  placeholder="e.g., English, Tamil, Hindi"
                  style={{
                    width: '200px',
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
                  placeholder="Brief description of the service..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                  />
                  <span style={{ fontWeight: 'bold' }}>Active</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
                <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {services.map(service => (
          <div key={service.id} style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '60px 1fr auto',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              textAlign: 'center'
            }}>
              {getServiceIcon(service.service_type)}
            </div>

            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{service.service_name}</h4>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                <span><strong>{service.day_of_week}</strong> at <strong>{formatTime(service.time)}</strong></span>
                {service.duration_minutes && <span>({service.duration_minutes} mins)</span>}
                {service.location && <span>📍 {service.location}</span>}
              </div>
              {service.preacher && (
                <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#667eea', fontWeight: 'bold' }}>
                  Preacher: {service.preacher}
                </p>
              )}
              {service.description && (
                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                  {service.description}
                </p>
              )}
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
                <span style={{
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  textTransform: 'capitalize'
                }}>
                  {service.service_type.replace('_', ' ')}
                </span>
                <span style={{
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {service.language}
                </span>
                <span style={{ 
                  color: service.is_active ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <button
                onClick={() => handleEdit(service)}
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
                onClick={() => handleDelete(service.id)}
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

      {services.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No service timings found. Add your first service using the form above.
        </div>
      )}
    </div>
  )
}

export default ServiceTimingManager