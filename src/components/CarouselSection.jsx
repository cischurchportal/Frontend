import { useState } from 'react'
import MediaModal from './MediaModal'

function CarouselSection({ carousels = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [mediaList, setMediaList] = useState([])

  const handleMediaClick = (media, list) => {
    const idx = list.findIndex(m => m.id === media.id)
    setMediaList(list)
    setSelectedIndex(idx >= 0 ? idx : 0)
  }

  const closeModal = () => {
    setSelectedIndex(null)
    setMediaList([])
  }

  if (!carousels || carousels.length === 0) return null

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
                    onClick={() => handleMediaClick(media, carousel.media)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
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
                    ) : (() => {
                      const videoId = media.file_path.split('/embed/')[1]
                      return (
                        <div style={{
                          width: '100%',
                          height: '150px',
                          position: 'relative',
                          backgroundColor: '#000'
                        }}>
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={media.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(255,0,0,0.9)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.2rem'
                          }}>
                            ▶
                          </div>
                        </div>
                      )
                    })()}
                    
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
      {selectedIndex !== null && mediaList.length > 0 && (
        <MediaModal
          media={mediaList[selectedIndex]}
          mediaList={mediaList}
          onClose={closeModal}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  )
}

export default CarouselSection