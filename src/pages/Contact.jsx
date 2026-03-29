import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ErrorPopup from '../components/ErrorPopup'
import { useAppContext } from '../context/AppContext'

function Contact() {
  const { churchSettings, loading } = useAppContext()
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loading) {
    return <Loader fullScreen message="Loading contact information..." />
  }

  const contactCards = [
    {
      icon: '📍',
      title: 'Address',
      content: churchSettings?.address || 'Mattakadai, Near 1st Gate, Thoothukkudi, Tamilnadu, India.',
      color: '#667eea'
    },
    {
      icon: '📞',
      title: 'Contact Number',
      content: (
        <>
          <p style={{ marginBottom: '10px' }}>
            <strong>General</strong><br />
            {churchSettings?.phone || '(0461) 2902788'}
          </p>
          <p>
            <strong>For Prayer</strong><br />
            (0461) 2333966
          </p>
        </>
      ),
      color: '#f39c12'
    },
    {
      icon: '✉️',
      title: 'Email Address',
      content: churchSettings?.email || 'contact@stpatrickscocathedral.org',
      color: '#e74c3c'
    },
    {
      icon: '🌐',
      title: 'Website',
      content: (
        <>
          <p style={{ marginBottom: '15px' }}>
            {churchSettings?.website || 'www.stpatrickscocathedral.org'}
          </p>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(5px)'
              e.currentTarget.style.color = '#764ba2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)'
              e.currentTarget.style.color = '#667eea'
            }}
          >
            <span>📺</span>
            <span>Follow Our Youtube Channel</span>
            <span>→</span>
          </a>
        </>
      ),
      color: '#27ae60'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {error && <ErrorPopup message={error} type="error" onClose={() => setError('')} />}
      
      {/* Top Info Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #00a8e8 0%, #0077b6 100%)',
        color: 'white',
        padding: '10px 0',
        fontSize: '0.85rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
            <span>✝️</span>
            <span>{isMobile ? "WELCOME TO GOD'S HOUSE!" : "DEAR BELOVED, WELCOME TO GOD'S HOUSE!"}</span>
          </div>
        </div>
      </div>

      <Header />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: isMobile ? '50px 0' : '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="fade-in-up" style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '4rem', marginBottom: '15px' }}>📞</div>
            <h1 style={{ 
              fontSize: isMobile ? '2rem' : '3.5rem',
              fontWeight: '800',
              marginBottom: '10px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              padding: isMobile ? '0 10px' : '0'
            }}>
              Contact Us
            </h1>
            <p style={{ 
              fontSize: isMobile ? '1rem' : '1.3rem',
              opacity: 0.95,
              fontWeight: '500',
              maxWidth: '700px',
              margin: '0 auto 15px',
              padding: isMobile ? '0 15px' : '0'
            }}>
              We'd love to hear from you
            </p>
            <div style={{ display: 'flex', gap: '12px', fontSize: '1rem', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ opacity: 0.9 }}>HOME</span>
              <span style={{ fontSize: '1.5rem' }}>›</span>
              <span style={{ fontWeight: 'bold' }}>CONTACT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="container" style={{ padding: isMobile ? '30px 15px' : '80px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '20px',
          marginBottom: '50px'
        }}>
          {contactCards.map((card, index) => (
            <div
              key={card.title}
              className="card-hover fade-in-up"
              style={{
                backgroundColor: 'white',
                padding: '40px 30px',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '100px',
                height: '100px',
                background: `${card.color}15`,
                borderRadius: '50%',
                filter: 'blur(30px)'
              }} />
              
              <div style={{
                width: '76px',
                height: '76px',
                background: card.color,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 22px',
                fontSize: '2.2rem',
                boxShadow: `0 8px 24px ${card.color}40`,
                position: 'relative',
                zIndex: 1
              }}>
                {card.icon}
              </div>
              
              <h3 style={{ 
                color: '#333', 
                marginBottom: '20px',
                fontSize: '1.4rem',
                fontWeight: '700',
                position: 'relative',
                zIndex: 1
              }}>
                {card.title}
              </h3>
              
              <div style={{ 
                color: '#666', 
                lineHeight: '1.8',
                fontSize: '0.98rem',
                position: 'relative',
                zIndex: 1
              }}>
                {card.content}
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="fade-in-up" style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,0.12)'
        }}>
          <div style={{
            padding: 'clamp(24px, 4vw, 40px)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '15px'
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
                🗺️
              </div>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0
              }}>
                Find Us Here
              </h2>
            </div>
            <p style={{
              color: '#666',
              fontSize: '1.05rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Visit us at our location. We're always happy to welcome you!
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.8!2d78.1!3d8.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDgnMDAuMCJOIDc4wrAwNicwMC4wIkU!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height={isMobile ? '300' : '500'}
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Church Location"
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact
