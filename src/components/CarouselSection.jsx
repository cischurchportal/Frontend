import { useState, useEffect } from 'react'
import MediaModal from './MediaModal'

function CarouselSection() {
  const [carousels, setCarousels] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState(null)

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

  const handleMediaClick = (media) => {
    setSelectedMedia(media)
  }

  const closeModal = () => {
    setSelectedMedia(null)
  }

  if (loading) {
    return (
      <section style={{ marginTop: '40px', textAlign: 'center' }}>
        <div>Loading carousels...</div>
      </section>
    )
  }

  if (!carousels || carousels.length === 0) {
    return null
  }

  return (
    <>
      <section style={{ marginTop: '40px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#333',
          fontSize: '2rem'
        }}>
          📸 Church Life Gallery
        </h2>
        
        {carousels.map(carousel => (
          <div key={carousel.id} style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              color: '#667eea',
              marginBottom: '10px',
              fontSize: '1.5rem'
            }}>
              {carousel.name}
            </h3>
            
            {carousel.description && (
              <p style={{
                color: '#666',
                marginBottom: '20px',
                fontSize: '0.95rem'
              }}>
                {carousel.description}
              </p>
            )}
            
            {carousel.media && carousel.media.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                {carousel.media.map(media => (
                  <div 
                    key={media.id} 
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => handleMediaClick(media)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    {media.media_type === 'image' ? (
                      <img 
                        src={media.file_path} 
                        alt={media.title}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '150px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <video 
                          src={media.file_path}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          muted
                        />
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          borderRadius: '50%',
                          width: '50px',
                          height: '50px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.5rem'
                        }}>
                          ▶️
                        </div>
                      </div>
                    )}
                    
                    {/* Media Info Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      color: 'white',
                      padding: '20px 10px 10px',
                      fontSize: '0.85rem'
                    }}>
                      <h4 style={{
                        margin: '0 0 5px 0',
                        fontSize: '0.9rem'
                      }}>
                        {media.title}
                      </h4>
                      {media.description && (
                        <p style={{
                          margin: 0,
                          fontSize: '0.75rem',
                          opacity: 0.9
                        }}>
                          {media.description.length > 50 
                            ? `${media.description.substring(0, 50)}...` 
                            : media.description
                          }
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                textAlign: 'center',
                color: '#666',
                fontStyle: 'italic'
              }}>
                No media available for this gallery
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Media Modal */}
      {selectedMedia && (
        <MediaModal 
          media={selectedMedia} 
          onClose={closeModal} 
        />
      )}
    </>
  )
}

export default CarouselSection