import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ErrorPopup from '../components/ErrorPopup'

function Ministries() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMinistries()
  }, [])

  const fetchMinistries = async () => {
    try {
      const response = await fetch('/api/ministries/')
      const data = await response.json()
      if (data.success) {
        setMinistries(data.data)
        setError('')
      } else {
        setError('Failed to load ministries')
      }
    } catch (error) {
      console.error('Error fetching ministries:', error)
      setError('Connection error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader fullScreen message="Loading ministries..." />
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
              🙏
            </div>
            <h1 style={{ 
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '15px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              letterSpacing: '1px'
            }}>
              Our <span style={{ 
                background: 'linear-gradient(135deg, #f39c12 0%, #ffd700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Ministries</span>
            </h1>
            <p style={{ 
              fontSize: '1.3rem',
              opacity: 0.95,
              fontWeight: '500',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              maxWidth: '700px',
              margin: '0 auto 20px'
            }}>
              Follow and join with us in God's Works
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
              <span style={{ fontWeight: 'bold' }}>MINISTRIES</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 20px' }}>
        {ministries.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🙏</div>
            <h3 style={{ 
              fontSize: '2rem',
              marginBottom: '15px',
              color: '#333'
            }}>
              No Ministries Available
            </h3>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Check back later for ministry updates!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '40px'
          }}>
            {ministries.map((ministry, index) => (
              <div
                key={ministry.id}
                className="card-hover fade-in-up"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  position: 'relative'
                }}
              >
                {/* Ministry Image */}
                <div style={{ 
                  width: '100%',
                  height: '280px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src={ministry.image}
                    alt={ministry.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="280"%3E%3Crect fill="%23ddd" width="500" height="280"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EMinistry%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    🙏 Ministry
                  </div>
                </div>

                {/* Ministry Info */}
                <div style={{ 
                  padding: '35px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h2 style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '15px',
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    letterSpacing: '0.5px'
                  }}>
                    {ministry.name}
                  </h2>
                  
                  {ministry.time && (
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, rgba(243, 156, 18, 0.1) 0%, rgba(230, 126, 34, 0.1) 100%)',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      marginBottom: '20px',
                      width: 'fit-content'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>🕐</span>
                      <span style={{
                        color: '#f39c12',
                        fontWeight: '700',
                        fontSize: '0.95rem'
                      }}>
                        {ministry.time}
                      </span>
                    </div>
                  )}
                  
                  <p style={{ 
                    color: '#666',
                    lineHeight: '1.8',
                    marginBottom: '20px',
                    fontSize: '1.05rem',
                    flex: 1
                  }}>
                    {ministry.description}
                  </p>

                  {ministry.contact_phone && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                      borderRadius: '12px',
                      marginTop: 'auto'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }}>
                        📞
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#999',
                          fontWeight: '600',
                          marginBottom: '2px'
                        }}>
                          CONTACT
                        </div>
                        <div style={{
                          color: '#333',
                          fontWeight: '700',
                          fontSize: '1.05rem'
                        }}>
                          {ministry.contact_phone}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Ministries
