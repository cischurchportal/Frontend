import { useEffect } from 'react'

function MediaModal({ media, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={handleBackdropClick}
    >
      <div style={{
        position: 'relative',
        maxWidth: '90vw',
        maxHeight: '90vh',
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        {/* Media Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}>
          {media.media_type === 'image' ? (
            <img 
              src={media.file_path} 
              alt={media.title}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                backgroundColor: '#f0f0f0'
              }}
            />
          ) : (
            <video 
              src={media.file_path}
              controls
              autoPlay
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                backgroundColor: '#000'
              }}
            />
          )}

          {/* Media Info */}
          <div style={{
            padding: '20px',
            backgroundColor: 'white'
          }}>
            <h3 style={{
              margin: '0 0 10px 0',
              color: '#333',
              fontSize: '1.3rem'
            }}>
              {media.title}
            </h3>
            
            {media.description && (
              <p style={{
                margin: '0 0 10px 0',
                color: '#666',
                lineHeight: '1.5'
              }}>
                {media.description}
              </p>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontSize: '0.85rem',
              color: '#888'
            }}>
              <span>
                Type: {media.media_type === 'image' ? '📷 Image' : '🎥 Video'}
              </span>
              
              {media.created_at && (
                <span>
                  Added: {new Date(media.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaModal