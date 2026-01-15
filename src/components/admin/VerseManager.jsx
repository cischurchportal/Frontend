import { useState, useEffect } from 'react'

function VerseManager() {
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVerse, setEditingVerse] = useState(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    verse: '',
    reference: '',
    commentary: '',
    is_active: true
  })

  useEffect(() => {
    fetchTodayVerse()
  }, [])

  const fetchTodayVerse = async () => {
    try {
      const response = await fetch('/api/church/verse-of-day')
      const data = await response.json()
      if (data.success && data.data) {
        setVerses([data.data])
      } else {
        setVerses([])
      }
    } catch (error) {
      console.error('Error fetching verse:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const url = editingVerse 
        ? `/api/church/verse-of-day/${editingVerse.id}`
        : '/api/church/verse-of-day'
      
      const method = editingVerse ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setMessage(`Verse ${editingVerse ? 'updated' : 'created'} successfully!`)
        fetchTodayVerse()
        resetForm()
      } else {
        setMessage('Error saving verse')
      }
    } catch (error) {
      console.error('Error saving verse:', error)
      setMessage('Error saving verse')
    }
  }

  const handleEdit = (verse) => {
    setEditingVerse(verse)
    setFormData({
      date: verse.date || new Date().toISOString().split('T')[0],
      verse: verse.verse || '',
      reference: verse.reference || '',
      commentary: verse.commentary || '',
      is_active: verse.is_active !== false
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      verse: '',
      reference: '',
      commentary: '',
      is_active: true
    })
    setEditingVerse(null)
    setShowForm(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return <div>Loading verse of the day...</div>
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>📖 Verse of the Day</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : verses.length > 0 ? 'Update Today\'s Verse' : '+ Add Today\'s Verse'}
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
            {editingVerse ? 'Edit Verse' : 'Add New Verse'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px' }}>
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
                    width: '200px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Bible Verse *:
                </label>
                <textarea
                  value={formData.verse}
                  onChange={(e) => handleChange('verse', e.target.value)}
                  rows={4}
                  required
                  placeholder="Enter the Bible verse text..."
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Reference *:
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  required
                  placeholder="e.g., John 3:16, Psalm 23:1"
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
                  Commentary/Reflection:
                </label>
                <textarea
                  value={formData.commentary}
                  onChange={(e) => handleChange('commentary', e.target.value)}
                  rows={3}
                  placeholder="Add a brief reflection or commentary on the verse..."
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
                  {editingVerse ? 'Update Verse' : 'Add Verse'}
                </button>
                <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Current Verse Display */}
      {verses.length > 0 ? (
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #667eea',
          borderRadius: '10px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '20px' }}>Current Verse of the Day</h3>
          
          <blockquote style={{
            fontSize: '1.2rem',
            fontStyle: 'italic',
            color: '#333',
            margin: '0 0 15px 0',
            lineHeight: '1.6'
          }}>
            "{verses[0].verse}"
          </blockquote>
          
          <p style={{
            fontWeight: 'bold',
            color: '#667eea',
            fontSize: '1rem',
            marginBottom: '15px'
          }}>
            - {verses[0].reference}
          </p>
          
          {verses[0].commentary && (
            <p style={{
              color: '#666',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              borderLeft: '4px solid #667eea'
            }}>
              {verses[0].commentary}
            </p>
          )}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={() => handleEdit(verses[0])}
              className="btn btn-primary"
              style={{ backgroundColor: '#17a2b8' }}
            >
              Edit This Verse
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontStyle: 'italic',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px'
        }}>
          No verse of the day found. Add today's verse using the form above.
        </div>
      )}
    </div>
  )
}

export default VerseManager