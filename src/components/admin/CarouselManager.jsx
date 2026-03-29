import { useState, useEffect, useRef } from 'react'
import { compressImage } from '../../utils/compressImage'

// Status for each queued image file
// { file, name, size, status: 'pending'|'compressing'|'uploading'|'done'|'error', progress: 0-100, url, error }

function CarouselManager() {
  const [carousels, setCarousels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCarousel, setEditingCarousel] = useState(null)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedCarousel, setSelectedCarousel] = useState(null)
  const [showMediaForm, setShowMediaForm] = useState(false) // 'image' | 'video' | false

  // Multi-image queue
  const [imageQueue, setImageQueue] = useState([]) // array of file status objects
  const [batchTitle, setBatchTitle] = useState('')
  const [batchDescription, setBatchDescription] = useState('')
  const fileInputRef = useRef(null)

  // Video form
  const [videoForm, setVideoForm] = useState({ title: '', description: '', youtube_url: '' })
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoMessage, setVideoMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '', description: '', category: 'events', is_active: true
  })

  useEffect(() => { fetchCarousels() }, [])

  const fetchCarousels = async () => {
    try {
      const response = await fetch('/api/carousels/')
      const data = await response.json()
      if (data.success) setCarousels(data.data.carousels)
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
      const url = editingCarousel ? `/api/carousels/${editingCarousel.id}` : '/api/carousels/'
      const method = editingCarousel ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
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
      setMessage('Error saving carousel')
    }
  }

  // ── Multi-image upload ──────────────────────────────────────────────
  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const newItems = files.map(file => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending', // pending | compressing | uploading | done | error
      error: null,
      url: null,
      preview: URL.createObjectURL(file)
    }))
    setImageQueue(prev => [...prev, ...newItems])
    // reset input so same files can be re-added if needed
    e.target.value = ''
  }

  const removeFromQueue = (id) => {
    setImageQueue(prev => {
      const item = prev.find(i => i.id === id)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return prev.filter(i => i.id !== id)
    })
  }

  const updateQueueItem = (id, patch) => {
    setImageQueue(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  }

  const uploadSingleImage = async (item) => {
    updateQueueItem(item.id, { status: 'compressing' })
    let compressed
    try {
      compressed = await compressImage(item.file)
    } catch {
      compressed = item.file
    }

    updateQueueItem(item.id, { status: 'uploading' })
    const fd = new FormData()
    fd.append('file', compressed)
    fd.append('title', batchTitle || item.name.replace(/\.[^.]+$/, ''))
    fd.append('description', batchDescription)
    fd.append('media_type', 'image')

    try {
      const res = await fetch(`/api/carousels/${selectedCarousel.id}/upload`, {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      if (data.success) {
        updateQueueItem(item.id, { status: 'done', url: data.data?.file_path })
      } else {
        updateQueueItem(item.id, { status: 'error', error: data.message || 'Upload failed' })
      }
    } catch (err) {
      updateQueueItem(item.id, { status: 'error', error: err.message })
    }
  }

  const handleBatchUpload = async () => {
    const pending = imageQueue.filter(i => i.status === 'pending' || i.status === 'error')
    if (!pending.length) return
    setUploading(true)
    // Upload sequentially to avoid overwhelming the server
    for (const item of pending) {
      await uploadSingleImage(item)
    }
    setUploading(false)
    fetchCarousels()
  }

  const allDone = imageQueue.length > 0 && imageQueue.every(i => i.status === 'done')
  const hasPending = imageQueue.some(i => i.status === 'pending' || i.status === 'error')
  const isProcessing = imageQueue.some(i => i.status === 'compressing' || i.status === 'uploading')

  const resetImageForm = () => {
    imageQueue.forEach(i => { if (i.preview) URL.revokeObjectURL(i.preview) })
    setImageQueue([])
    setBatchTitle('')
    setBatchDescription('')
    setShowMediaForm(false)
    setSelectedCarousel(null)
  }

  // ── Video upload ────────────────────────────────────────────────────
  const handleVideoSubmit = async (e) => {
    e.preventDefault()
    setVideoMessage('')
    if (!videoForm.youtube_url.trim()) { setVideoMessage('Please enter a YouTube URL'); return }
    setVideoUploading(true)
    try {
      const res = await fetch(`/api/carousels/${selectedCarousel.id}/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoForm)
      })
      const data = await res.json()
      if (data.success) {
        setVideoMessage('YouTube video added successfully!')
        fetchCarousels()
        setTimeout(() => {
          setVideoForm({ title: '', description: '', youtube_url: '' })
          setVideoMessage('')
          setShowMediaForm(false)
          setSelectedCarousel(null)
        }, 1200)
      } else {
        setVideoMessage(data.detail || data.message || 'Error adding video')
      }
    } catch (err) {
      setVideoMessage('Error: ' + err.message)
    } finally {
      setVideoUploading(false)
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
      const res = await fetch(`/api/carousels/${carouselId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) { setMessage('Carousel deleted successfully!'); fetchCarousels() }
      else setMessage('Error deleting carousel')
    } catch { setMessage('Error deleting carousel') }
  }

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Are you sure you want to delete this media?')) return
    try {
      const res = await fetch(`/api/carousels/media/${mediaId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) { setMessage('Media deleted successfully!'); fetchCarousels() }
      else setMessage('Error deleting media')
    } catch { setMessage('Error deleting media') }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', category: 'events', is_active: true })
    setEditingCarousel(null)
    setShowForm(false)
  }

  if (loading) return <div>Loading carousels...</div>

  // ── Status badge helper ─────────────────────────────────────────────
  const StatusBadge = ({ status, error }) => {
    const map = {
      pending:     { bg: '#e9ecef', color: '#495057', label: 'Pending' },
      compressing: { bg: '#fff3cd', color: '#856404', label: '⚙️ Compressing…' },
      uploading:   { bg: '#cce5ff', color: '#004085', label: '⬆️ Uploading…' },
      done:        { bg: '#d4edda', color: '#155724', label: '✅ Done' },
      error:       { bg: '#f8d7da', color: '#721c24', label: '❌ Failed' },
    }
    const s = map[status] || map.pending
    return (
      <span style={{
        fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px',
        borderRadius: '10px', backgroundColor: s.bg, color: s.color,
        whiteSpace: 'nowrap'
      }}>
        {status === 'error' && error ? `❌ ${error}` : s.label}
      </span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>📸 Carousel Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ Add New Carousel'}
        </button>
      </div>

      {message && (
        <div style={{
          padding: '10px', borderRadius: '5px', marginBottom: '20px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      {/* Carousel create/edit form */}
      {showForm && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e9ecef' }}>
          <h3 style={{ marginBottom: '20px' }}>{editingCarousel ? 'Edit Carousel' : 'Add New Carousel'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Carousel Name *:</label>
                <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  required placeholder="e.g., Christmas Celebration 2024"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
                <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  rows={3} placeholder="Brief description..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
                  <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <option value="events">Events</option>
                    <option value="ministry">Ministry</option>
                    <option value="outreach">Outreach</option>
                    <option value="worship">Worship</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
                    <input type="checkbox" checked={formData.is_active}
                      onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))} />
                    <span style={{ fontWeight: 'bold' }}>Active</span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">{editingCarousel ? 'Update Carousel' : 'Add Carousel'}</button>
                <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Multi-image upload panel ── */}
      {showMediaForm === 'image' && selectedCarousel && (
        <div style={{ backgroundColor: '#e3f2fd', padding: '24px', borderRadius: '10px', marginBottom: '30px', border: '2px solid #2196f3' }}>
          <h3 style={{ marginBottom: '4px', color: '#1976d2' }}>📷 Upload Images to "{selectedCarousel.name}"</h3>
          <p style={{ margin: '0 0 20px', color: '#555', fontSize: '0.9rem' }}>
            Select multiple images at once — each one will be compressed and uploaded individually with live status.
          </p>

          {/* Shared title / description */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Title (applied to all) *:
              </label>
              <input type="text" value={batchTitle} onChange={e => setBatchTitle(e.target.value)}
                placeholder="e.g., Christmas Service 2024"
                style={{ width: '100%', padding: '9px', border: '1px solid #90caf9', borderRadius: '5px' }} />
              <small style={{ color: '#666', fontSize: '0.75rem' }}>Leave blank to use each filename as title.</small>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>Description:</label>
              <input type="text" value={batchDescription} onChange={e => setBatchDescription(e.target.value)}
                placeholder="Optional description"
                style={{ width: '100%', padding: '9px', border: '1px solid #90caf9', borderRadius: '5px' }} />
            </div>
          </div>

          {/* Drop zone / file picker */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#1976d2'; e.currentTarget.style.background = '#bbdefb' }}
            onDragLeave={e => { e.currentTarget.style.borderColor = '#90caf9'; e.currentTarget.style.background = '#e3f2fd' }}
            onDrop={e => {
              e.preventDefault()
              e.currentTarget.style.borderColor = '#90caf9'
              e.currentTarget.style.background = '#e3f2fd'
              const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
              if (!files.length) return
              const newItems = files.map(file => ({
                id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
                file, name: file.name, size: file.size,
                status: 'pending', error: null, url: null,
                preview: URL.createObjectURL(file)
              }))
              setImageQueue(prev => [...prev, ...newItems])
            }}
            style={{
              border: '2px dashed #90caf9', borderRadius: '8px', padding: '30px',
              textAlign: 'center', cursor: 'pointer', background: '#e3f2fd',
              transition: 'all 0.2s', marginBottom: '16px'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📁</div>
            <div style={{ fontWeight: '700', color: '#1976d2', marginBottom: '4px' }}>Click to select images or drag & drop here</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>JPG, PNG, GIF, WebP — multiple files supported — auto-compressed before upload</div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFilesSelected} style={{ display: 'none' }} />

          {/* File queue list */}
          {imageQueue.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: '#1976d2', fontSize: '0.95rem' }}>
                  {imageQueue.length} image{imageQueue.length !== 1 ? 's' : ''} queued
                  {' · '}{imageQueue.filter(i => i.status === 'done').length} done
                  {imageQueue.some(i => i.status === 'error') && ` · ${imageQueue.filter(i => i.status === 'error').length} failed`}
                </span>
                <button onClick={() => {
                  imageQueue.forEach(i => { if (i.preview) URL.revokeObjectURL(i.preview) })
                  setImageQueue([])
                }} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}>
                  Clear all
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                {imageQueue.map(item => (
                  <div key={item.id} style={{
                    display: 'grid', gridTemplateColumns: '56px 1fr auto',
                    gap: '12px', alignItems: 'center',
                    background: item.status === 'done' ? '#f0fff4' : item.status === 'error' ? '#fff5f5' : 'white',
                    border: `1px solid ${item.status === 'done' ? '#c3e6cb' : item.status === 'error' ? '#f5c6cb' : '#dee2e6'}`,
                    borderRadius: '8px', padding: '10px'
                  }}>
                    {/* Thumbnail */}
                    <div style={{ width: '56px', height: '42px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                      <img src={item.preview} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {(item.status === 'compressing' || item.status === 'uploading') && (
                        <div style={{
                          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{
                            width: '18px', height: '18px',
                            border: '2px solid rgba(255,255,255,0.4)',
                            borderTop: '2px solid white',
                            borderRadius: '50%', display: 'inline-block',
                            animation: 'spin 0.8s linear infinite'
                          }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
                        <StatusBadge status={item.status} error={item.error} />
                      </div>
                    </div>

                    {/* Remove button (only when not actively processing) */}
                    {item.status !== 'compressing' && item.status !== 'uploading' && (
                      <button onClick={() => removeFromQueue(item.id)}
                        style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: '0 4px' }}
                        title="Remove">×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleBatchUpload}
              disabled={!hasPending || isProcessing}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (!hasPending || isProcessing) ? 0.6 : 1 }}
            >
              {isProcessing && (
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
              )}
              {isProcessing
                ? `Uploading ${imageQueue.filter(i => i.status === 'uploading' || i.status === 'compressing').length} image(s)…`
                : allDone
                  ? '✅ All uploaded'
                  : `⬆️ Upload ${imageQueue.filter(i => i.status === 'pending' || i.status === 'error').length} image(s)`}
            </button>
            <button onClick={() => fileInputRef.current?.click()} disabled={isProcessing}
              style={{ padding: '10px 16px', border: '2px solid #2196f3', borderRadius: '5px', background: 'white', color: '#2196f3', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem' }}>
              + Add more
            </button>
            <button onClick={resetImageForm} disabled={isProcessing}
              className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }}>
              {allDone ? 'Done' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* ── Video upload panel ── */}
      {showMediaForm === 'video' && selectedCarousel && (
        <div style={{ backgroundColor: '#fff8e1', padding: '24px', borderRadius: '10px', marginBottom: '30px', border: '2px solid #ff9800' }}>
          <h3 style={{ marginBottom: '20px', color: '#e65100' }}>🎥 Add YouTube Video to "{selectedCarousel.name}"</h3>
          <form onSubmit={handleVideoSubmit}>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>YouTube URL *:</label>
                <input type="url" value={videoForm.youtube_url}
                  onChange={e => setVideoForm(p => ({ ...p, youtube_url: e.target.value }))}
                  required placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #ffcc80', borderRadius: '5px' }} />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>Watch, share, or embed URLs all work.</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Title *:</label>
                <input type="text" value={videoForm.title}
                  onChange={e => setVideoForm(p => ({ ...p, title: e.target.value }))}
                  required placeholder="e.g., Sunday Sermon — Dec 2024"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ffcc80', borderRadius: '5px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Description:</label>
                <textarea value={videoForm.description}
                  onChange={e => setVideoForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} placeholder="Optional description"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ffcc80', borderRadius: '5px', resize: 'vertical' }} />
              </div>
              {videoMessage && (
                <div style={{
                  padding: '8px 12px', borderRadius: '5px', fontSize: '0.9rem',
                  backgroundColor: videoMessage.includes('successfully') ? '#d4edda' : '#f8d7da',
                  color: videoMessage.includes('successfully') ? '#155724' : '#721c24'
                }}>{videoMessage}</div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={videoUploading}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ff9800', display: 'flex', alignItems: 'center', gap: '8px', opacity: videoUploading ? 0.7 : 1 }}>
                  {videoUploading && <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
                  {videoUploading ? 'Adding…' : '🎥 Add Video'}
                </button>
                <button type="button" onClick={() => { setShowMediaForm(false); setSelectedCarousel(null); setVideoForm({ title: '', description: '', youtube_url: '' }); setVideoMessage('') }}
                  className="btn" style={{ backgroundColor: '#6c757d', color: 'white' }} disabled={videoUploading}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Carousels list ── */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {carousels.map(carousel => (
          <div key={carousel.id} style={{ backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{carousel.name}</h4>
                {carousel.description && <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>{carousel.description}</p>}
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
                  <span style={{ backgroundColor: '#e9ecef', color: '#495057', padding: '2px 8px', borderRadius: '12px', textTransform: 'capitalize' }}>{carousel.category}</span>
                  <span style={{ color: carousel.is_active ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>{carousel.is_active ? 'Active' : 'Inactive'}</span>
                  <span style={{ color: '#666' }}>{carousel.media ? carousel.media.length : 0} media files</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                <button onClick={() => { setSelectedCarousel(carousel); setShowMediaForm('image'); setImageQueue([]); setBatchTitle(''); setBatchDescription('') }}
                  style={{ backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  📷 Add Images
                </button>
                <button onClick={() => { setSelectedCarousel(carousel); setShowMediaForm('video'); setVideoForm({ title: '', description: '', youtube_url: '' }); setVideoMessage('') }}
                  style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  🎥 Add Video
                </button>
                <button onClick={() => handleEdit(carousel)}
                  style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(carousel.id)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Delete
                </button>
              </div>
            </div>

            {/* Media grid */}
            {carousel.media && carousel.media.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                {carousel.media.map(media => (
                  <div key={media.id} style={{ position: 'relative', borderRadius: '5px', overflow: 'hidden', backgroundColor: 'white', border: '1px solid #ddd' }}>
                    {media.media_type === 'image' ? (
                      <img src={media.file_path} alt={media.title} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100px', backgroundColor: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', flexDirection: 'column', gap: '4px' }}>
                        <span>▶</span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>YouTube</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                      <button onClick={() => handleDeleteMedia(media.id)}
                        style={{ backgroundColor: 'rgba(220,53,69,0.85)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ×
                      </button>
                    </div>
                    <div style={{ padding: '5px', fontSize: '0.7rem', color: '#333' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{media.title}</div>
                      <div style={{ color: '#666' }}>{media.media_type === 'image' ? '📷' : '🎥'} {media.media_type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {carousels.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
          No carousels found. Add your first carousel using the form above.
        </div>
      )}
    </div>
  )
}

export default CarouselManager
