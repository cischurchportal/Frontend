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
      <section>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '55px',
            height: '55px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            flexShrink: 0
          }}>
            📸
          </div>
          <div>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: '800',
              color: '#2c3e50',
              margin: 0
            }}>
              Church Life Gallery
            </h2>
            <p style={{ margin: 0, color: '#999', fontSize: '0.95rem', fontWeight: '500' }}>
              Moments of faith and fellowship
            </p>
          </div>
        </div>
        
        {carousels.map((carousel, ci) => (
          <div key={carousel.id} style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 35px)',
            marginBottom: '25px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
            animation: `fadeInUp 0.5s ease forwards ${ci * 0.1}s`,
            opacity: 0
          }}>
            {/* Decorative blob */}
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '120px', height: '120px',
              background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)',
              borderRadius: '50%', filter: 'blur(30px)'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  flexShrink: 0
                }} />
                <h3 style={{
                  color: '#2c3e50',
                  margin: 0,
                  fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                  fontWeight: '700'
                }}>
                  {carousel.name}
                </h3>
              </div>
              
              {carousel.description && (
                <p style={{
                  color: '#888',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  paddingLeft: '18px'
                }}>
                  {carousel.description}
                </p>
              )}
            </div>
            
            {carousel.media && carousel.media.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
                gap: '12px'
              }}>
                {carousel.media.map(media => (
                  <div 
                    key={media.id} 
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      aspectRatio: '4/3'
                    }}
                    onClick={() => handleMediaClick(media, carousel.media)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {media.media_type === 'image' ? (
                      <img 
                        src={media.file_path} 
                        alt={media.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    ) : (() => {
                      const videoId = media.file_path.split('/embed/')[1]
                      return (
                        <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#111' }}>
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={media.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(255,0,0,0.88)',
                            borderRadius: '50%',
                            width: '44px', height: '44px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '1.1rem',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                          }}>
                            ▶
                          </div>
                        </div>
                      )
                    })()}
                    
                    {/* Hover overlay with title */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                      color: 'white',
                      padding: '24px 10px 10px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      lineHeight: '1.3'
                    }}>
                      {media.title}
                    </div>

                    {/* Type badge */}
                    <div style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(6px)',
                      borderRadius: '6px',
                      padding: '3px 7px',
                      fontSize: '0.7rem',
                      color: 'white',
                      fontWeight: '700'
                    }}>
                      {media.media_type === 'image' ? '📷' : '🎥'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '40px 20px',
                color: '#bbb', fontStyle: 'italic', fontSize: '0.95rem'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🖼️</div>
                No media available for this gallery
              </div>
            )}
          </div>
        ))}
      </section>

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