import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ErrorPopup from '../components/ErrorPopup'

function Gallery() {
  const [carousels, setCarousels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    fetchCarousels()
  }, [])

  const fetchCarousels = async () => {
    try {
      const response = await fetch('/api/carousels/')
      const data = await response.json()
      if (data.success) {
        const carouselsList = data.data?.carousels || data.data || []
        setCarousels(carouselsList)
        setError('')
      } else {
        setError('Failed to load gallery')
      }
    } catch (error) {
      console.error('Error fetching carousels:', error)
      setError('Connection error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getAllMedia = () => {
    const allMedia = []
    if (!Array.isArray(carousels)) return allMedia
    
    carousels.forEach(carousel => {
      if (carousel.media && Array.isArray(carousel.media) && carousel.media.length > 0) {
        carousel.media.forEach(media => {
          allMedia.push({
            ...media,
            carouselTitle: carousel.name || 'Untitled',
            carouselCategory: carousel.category || 'general',
            caption: media.title || media.caption || 'Untitled'
          })
        })
      }
    })
    return allMedia
  }

  const getCategories = () => {
    const categories = new Set()
    if (!Array.isArray(carousels)) return ['all']
    
    carousels.forEach(carousel => {
      if (carousel.category) {
        categories.add(carousel.category)
      }
    })
    return ['all', ...Array.from(categories)]
  }

  const filteredMedia = () => {
    const allMedia = getAllMedia()
    if (activeCategory === 'all') {
      return allMedia
    }
    return allMedia.filter(media => media.carouselCategory === activeCategory)
  }

  const openLightbox = (media) => {
    setSelectedMedia(media)
  }

  const closeLightbox = () => {
    setSelectedMedia(null)
  }

  if (loading) {
    return <Loader fullScreen message="Loading gallery..." />
  }

  const mediaItems = filteredMedia()
  const categories = getCategories()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {error && <ErrorPopup message={error} type="error" onClose={() => setError('')} />}
      
      {/* Top Info Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #00a8e8 0%, #0077b6 100%)',
        color: 'white',
        padding: '12px 0',
        fontSize: '0.9rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>✝️</span>
            <span>DEAR BELOVED, WELCOME TO GOD'S HOUSE!</span>
          </div>
        </div>
      </div>

      <Header />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="fade-in-up" style={{
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '20px',
              animation: 'scaleIn 0.8s ease forwards'
            }}>
              📸
            </div>
            <h1 style={{ 
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '15px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              letterSpacing: '1px'
            }}>
              Our Gallery
            </h1>
            <p style={{ 
              fontSize: '1.3rem',
              opacity: 0.95,
              fontWeight: '500',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              maxWidth: '700px',
              margin: '0 auto 20px'
            }}>
              Moments of faith, fellowship, and celebration
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              fontSize: '1.1rem',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <span style={{ opacity: 0.9 }}>HOME</span>
              <span style={{ fontSize: '1.5rem' }}>›</span>
              <span style={{ fontWeight: 'bold' }}>GALLERY</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 20px' }}>
        {/* Category Filter */}
        <div className="fade-in-up" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '60px',
          flexWrap: 'wrap'
        }}>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="fade-in"
              style={{
                padding: '14px 32px',
                border: 'none',
                borderRadius: '30px',
                background: activeCategory === category 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'white',
                color: activeCategory === category ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '700',
                boxShadow: activeCategory === category 
                  ? '0 8px 24px rgba(102, 126, 234, 0.4)' 
                  : '0 4px 16px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize',
                letterSpacing: '0.5px',
                animationDelay: `${index * 0.05}s`,
                opacity: 0
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== category) {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== category) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
                }
              }}
            >
              {category === 'all' ? '🌟 All' : `📁 ${category}`}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {mediaItems.length === 0 ? (
          <div className="fade-in-up" style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📷</div>
            <h3 style={{ 
              fontSize: '2rem',
              marginBottom: '15px',
              color: '#333',
              fontWeight: '700'
            }}>
              No media found
            </h3>
            <p style={{ 
              color: '#666',
              fontSize: '1.1rem'
            }}>
              Check back later for updates!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {mediaItems.map((media, index) => (
              <div
                key={media.id || index}
                className="card-hover fade-in-up"
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0
                }}
                onClick={() => openLightbox(media)}
              >
                {/* Media Preview */}
                <div style={{
                  width: '100%',
                  height: '280px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#f0f0f0'
                }}>
                  {media.media_type === 'image' ? (
                    <img
                      src={media.file_path}
                      alt={media.caption || 'Gallery image'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="280"%3E%3Crect fill="%23ddd" width="320" height="280"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#000',
                      position: 'relative'
                    }}>
                      <video
                        src={media.file_path}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '70px',
                        height: '70px',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                      }}>
                        ▶️
                      </div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {media.media_type === 'image' ? '📷' : '🎥'}
                  </div>
                </div>

                {/* Caption */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    fontSize: '1.1rem',
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: '700',
                    lineHeight: '1.4'
                  }}>
                    {media.caption || 'Untitled'}
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem',
                    color: '#667eea',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    📁 {media.carouselTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              color: 'white',
              fontSize: '2.5rem',
              cursor: 'pointer',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              fontWeight: '300'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
              e.currentTarget.style.transform = 'rotate(90deg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              e.currentTarget.style.transform = 'rotate(0deg)'
            }}
          >
            ×
          </button>

          {/* Media Content */}
          <div
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'scaleIn 0.4s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.media_type === 'image' ? (
              <img
                src={selectedMedia.file_path}
                alt={selectedMedia.caption}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }}
              />
            ) : (
              <video
                src={selectedMedia.file_path}
                controls
                autoPlay
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }}
              />
            )}
            
            {/* Caption */}
            {selectedMedia.caption && (
              <div style={{
                marginTop: '30px',
                color: 'white',
                textAlign: 'center',
                maxWidth: '700px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '25px 35px',
                borderRadius: '16px'
              }}>
                <h3 style={{ 
                  fontSize: '1.6rem', 
                  marginBottom: '10px',
                  fontWeight: '700'
                }}>
                  {selectedMedia.caption}
                </h3>
                <p style={{ 
                  fontSize: '1.05rem', 
                  opacity: 0.9,
                  fontWeight: '500'
                }}>
                  📁 {selectedMedia.carouselTitle}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Gallery
