import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ErrorPopup from '../components/ErrorPopup'

function About() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about/')
      const data = await response.json()
      if (data.success) {
        setAboutData(data.data)
        setError('')
      } else {
        setError('Failed to load about page data')
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
      setError('Connection error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader fullScreen message="Loading about page..." />
  }

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
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
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
              📖
            </div>
            <h1 style={{ 
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '15px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              letterSpacing: '1px'
            }}>
              {aboutData?.title || 'About Our Church'}
            </h1>
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
              <span style={{ fontWeight: 'bold' }}>ABOUT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '50px',
          alignItems: 'start'
        }}>
          {/* History Text - Left Side */}
          <div className="fade-in-up" style={{
            backgroundColor: 'white',
            padding: '50px',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }} />
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '30px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}>
                📜
              </div>
              <h2 style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '2.2rem',
                fontWeight: '800',
                margin: 0
              }}>
                Our History
              </h2>
            </div>
            
            <div style={{ 
              lineHeight: '1.9', 
              color: '#555',
              fontSize: '1.08rem',
              whiteSpace: 'pre-line',
              position: 'relative',
              zIndex: 1
            }}>
              {aboutData?.history || 'Church history will be displayed here.'}
            </div>
          </div>

          {/* Images - Right Side */}
          <div className="fade-in-up" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            animationDelay: '0.2s',
            opacity: 0
          }}>
            {aboutData?.images && aboutData.images.length > 0 ? (
              aboutData.images.map((image, index) => (
                <div
                  key={index}
                  className="card-hover"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    aspectRatio: '1',
                    gridColumn: index === 0 ? 'span 2' : 'span 1',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <img
                    src={image}
                    alt={`Church ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EChurch Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '30px 15px 15px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    Church Image {index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: 'span 2',
                padding: '60px 40px',
                textAlign: 'center',
                color: '#999',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🖼️</div>
                <h3 style={{ marginBottom: '10px', color: '#666' }}>No images available</h3>
                <p>Images will be displayed here once uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="fade-in-up" style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          padding: '50px',
          borderRadius: '20px',
          textAlign: 'center',
          animationDelay: '0.4s',
          opacity: 0
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Join Our Community
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto 30px',
            lineHeight: '1.8'
          }}>
            We welcome everyone to be part of our church family. Come and experience the love of Christ with us.
          </p>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/contact" 
              className="btn btn-primary"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>📞</span>
              <span>Contact Us</span>
            </a>
            <a 
              href="/ministries" 
              className="btn btn-primary"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
              }}
            >
              <span>🙏</span>
              <span>Our Ministries</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default About
