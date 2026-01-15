import { useState, useEffect } from 'react'

function CelebrationManager() {
  const [celebrations, setCelebrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCelebration, setEditingCelebration] = useState(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    member_name: '',
    celebration_type: 'birthday',
    date: new Date().toISOString().split('T')[0],
    age: '',
    years_married: '',
    message: '',
    is_active: true
  })

  useEffect(() => {
    fetchCelebrations()
  }, [])

  const fetchCelebrations = async () => {
    try {
      const response = await fetch('/api/church/celebrations/upcoming?days=30')
      const data = await response.json()
      if (data.success) {
        setCelebrations(data.data.celebrations)
      }
    } catch (error) {
      console.error('Error fetching celebrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const celebrationData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        years_married: formData.years_married ? parseInt(formData.years_married) : null
      }

      const url = editingCelebration 
        ? `/api/church/celebrations/${editingCelebration.id}`
        : '/api/church/celebrations'
      
      const method = editingCelebration ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(celebrationData)
      })

      const data = await response.json()
      if (data.success) {
        setMessage(`Celebration ${editingCelebration ? 'updated' : 'created'} successfully!`)
        fetchCelebrations()
        resetForm()
      } else {
        setMessage('Error saving celebration')
      }
    } catch (error) {
      console.error('Error saving celebration:', error)
      setMessage('Error saving celebration')
    }
  }

  const handleEdit = (celebration) => {
    setEditingCelebration(celebration)
    setFormData({
      member_name: celebration.member_name || '',
      celebration_type: celebration.celebration_type || 'birthday',
      date: celebration.date || new Date().toISOString().split('T')[0],
      age: celebration.age || '',
      years_married: celebration.years_married || '',
      message: celebration.message || '',
      is_active: celebration.is_active !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (celebrationId) => {
    if (!confirm('Are you sure you want to delete this celebration?')) return

    try {
      const response = await fetch(`/api/church/celebrations/${celebrationId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setMessage('Celebration deleted successfully!')
        fetchCelebrations()
      } else {
        setMessage('Error deleting celebration')
      }
    } catch (error) {
      console.error('Error deleting celebration:', error)
      setMessage('Error deleting celebration')
    }
  }

  const resetForm = () => {
    setFormData({
      member_name: '',
      celebration_type: 'birthday',
      date: new Date().toISOString().split('T')[0],
      age: '',
      years_married: '',
      message: '',
      is_active: true
    })
    setEditingCelebration(null)
    setShowForm(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getCelebrationIcon = (type) => {
    switch (type) {
      case 'birthday': return '🎂'
      case 'wedding_anniversary': return '💒'
      case 'baptism': return '✝️'
      case 'confirmation': return '🕊️'
      default: return '🎉'
    }
  }

  const getCelebrationColor = (type) => {
    switch (type) {
      case 'birthday': return '#ff6b6b'
      case 'wedding_anniversary': return '#4ecdc4'
      case 'baptism': return '#45b7d1'
      case 'confirmation': return '#96ceb4'
      default: return '#667eea'
    }
  }

  if (loading) {
    return <div>Loading celebrations...</div>
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>🎉 Celebration Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add New Celebration'}
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
            {editingCelebration ? 'Edit Celebration' : 'Add New Celebration'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Member Name *:
                  </label>
                  <input
                    type="text"
                    value={formData.member_name}
                    onChange={(e) => handleChange('member_name', e.target.value)}
                    required
                    placeholder="e.g., John Smith or David & Ruth Wilson"
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
                    Celebration Type *:
                  </label>
                  <select
                    value={formData.celebration_type}
                    onChange={(e) => handleChange('celebration_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="birthday">Birthday</option>
                    <option value="wedding_anniversary">Wedding Anniversary</option>
                    <option value="baptism">Baptism</option>
                    <option value="confirmation">Confirmation</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Date *:
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  />
                </div>

                {formData.celebration_type === 'birthday' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Age:
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      min="1"
                      max="120"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>
                )}

                {formData.celebration_type === 'wedding_anniversary' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Years Married:
                    </label>
                    <input
                      type="number"
                      value={formData.years_married}
                      onChange={(e) => handleChange('years_married', e.target.value)}
                      min="1"
                      max="80"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  </div>
                )}

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

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Celebration Message:
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={3}
                  placeholder="A special message for this celebration..."
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
                  {editingCelebration ? 'Update Celebration' : 'Add Celebration'}
                </button>
                <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Celebrations List */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {celebrations.map(celebration => (
          <div key={celebration.id} style={{
            backgroundColor: 'white',
            border: `2px solid ${getCelebrationColor(celebration.celebration_type)}`,
            borderRadius: '10px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '60px 1fr auto',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              textAlign: 'center'
            }}>
              {getCelebrationIcon(celebration.celebration_type)}
            </div>

            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{celebration.member_name}</h4>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', marginBottom: '10px' }}>
                <span style={{
                  color: getCelebrationColor(celebration.celebration_type),
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {celebration.celebration_type.replace('_', ' ')}
                  {celebration.age && ` - ${celebration.age} years old`}
                  {celebration.years_married && ` - ${celebration.years_married} years married`}
                </span>
                <span style={{ color: '#666' }}>
                  📅 {new Date(celebration.date).toLocaleDateString()}
                </span>
              </div>
              {celebration.message && (
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                  {celebration.message}
                </p>
              )}
              <div style={{ marginTop: '10px' }}>
                <span style={{ 
                  color: celebration.is_active ? '#28a745' : '#dc3545',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}>
                  {celebration.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <button
                onClick={() => handleEdit(celebration)}
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
                onClick={() => handleDelete(celebration.id)}
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

      {celebrations.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No celebrations found. Add your first celebration using the form above.
        </div>
      )}
    </div>
  )
}

export default CelebrationManager