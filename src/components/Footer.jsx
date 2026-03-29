import { useState } from 'react'
import DevelopersModal from './DevelopersModal'
import { useAppContext } from '../context/AppContext'

function Footer() {
  const { churchSettings } = useAppContext()
  const [showDevelopersModal, setShowDevelopersModal] = useState(false)

  const footerSections = [
    {
      title: 'Location',
      icon: '📍',
      content: churchSettings?.address || 'Church Address',
      color: '#667eea'
    },
    {
      title: 'Phone',
      icon: '📞',
      content: churchSettings?.phone || 'Phone Number',
      color: '#f39c12'
    },
    {
      title: 'Email',
      icon: '✉️',
      content: churchSettings?.email || 'Email Address',
      color: '#e74c3c'
    }
  ]

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      color: 'white',
      padding: 'clamp(40px, 6vw, 60px) 20px 30px',
      marginTop: '60px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        left: '-50px',
        width: '200px',
        height: '200px',
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        right: '-50px',
        width: '250px',
        height: '250px',
        background: 'rgba(118, 75, 162, 0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />

      <DevelopersModal 
        isOpen={showDevelopersModal} 
        onClose={() => setShowDevelopersModal(false)} 
      />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {footerSections.map((section, index) => (
            <div 
              key={section.title}
              className="fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                opacity: 0
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: section.color,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {section.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  {section.title}
                </h3>
              </div>
              <p style={{ 
                opacity: 0.9,
                lineHeight: '1.6',
                fontSize: '0.95rem',
                paddingLeft: '0'
              }}>
                {section.content}
              </p>
            </div>
          ))}

          {/* Connect With Us */}
          <div 
            className="fade-in-up"
            style={{
              animationDelay: '0.3s',
              opacity: 0
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#27ae60',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                🌐
              </div>
              <h3 style={{ 
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: 0
              }}>
                Connect With Us
              </h3>
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              paddingLeft: '0'
            }}>
              <a 
                href="#" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'white',
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  padding: '7px 14px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span>📘</span>
                <span>Facebook</span>
              </a>
              <a 
                href="#" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'white',
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  padding: '7px 14px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span>📺</span>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          margin: '30px 0'
        }} />

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          opacity: 0.9,
          fontSize: '0.95rem'
        }}>
          <p style={{ marginBottom: '10px' }}>
            Copyright ©{new Date().getFullYear()} All rights reserved
          </p>
          <p>
            Developed with ❤️ by{' '}
            <span 
              onClick={() => setShowDevelopersModal(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1.05rem',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Youth Boys
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
