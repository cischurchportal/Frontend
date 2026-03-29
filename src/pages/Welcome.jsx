import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import PriestSection from '../components/PriestSection'
import VerseOfDay from '../components/VerseOfDay'
import Announcements from '../components/Announcements'
import ServiceTimings from '../components/ServiceTimings'
import TodayCelebrations from '../components/TodayCelebrations'
import CarouselSection from '../components/CarouselSection'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ErrorPopup from '../components/ErrorPopup'
import { useAppContext } from '../context/AppContext'

function Welcome() {
  const { homeData, carousels, loading } = useAppContext()
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loading) {
    return <Loader fullScreen message="Loading church information..." />
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <ErrorPopup message={error} type="error" onClose={() => setError('')} />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'pulse 2s ease-in-out infinite' }}>⛪</div>
          <h2 style={{ color: '#721c24', marginBottom: '15px', fontSize: '2rem', textAlign: 'center' }}>
            Unable to Load Page
          </h2>
          <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center', maxWidth: '500px' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">🔄 Retry</button>
        </div>
      </div>
    )
  }

  const churchSettings = homeData?.church_settings
  const priests = homeData?.priests || []
  const verseOfDay = homeData?.verse_of_day
  const announcements = homeData?.announcements || []
  const serviceTimings = homeData?.service_timings || []
  const todayCelebrations = homeData?.today_celebrations || []

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top Info Bar with Admin Login */}
      <div style={{
        background: 'linear-gradient(135deg, #00a8e8 0%, #0077b6 100%)',
        color: 'white',
        padding: '10px 0',
        fontSize: '0.85rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            fontWeight: '600',
            letterSpacing: '0.3px',
            fontSize: isMobile ? '0.75rem' : '0.85rem'
          }}>
            <span style={{ fontSize: '1rem' }}>✝️</span>
            <span>{isMobile ? "WELCOME TO GOD'S HOUSE!" : "DEAR BELOVED, WELCOME TO GOD'S HOUSE!"}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {!isMobile && (
              <>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  fontSize: '0.8rem'
                }}>
                  <span>📍</span>
                  <span>{churchSettings?.address || 'Church Address'}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  fontSize: '0.8rem'
                }}>
                  <span>📞</span>
                  <span>{churchSettings?.phone || '(0461) 2902788'}</span>
                </div>
              </>
            )}
            {/* Admin Login Button */}
            <Link 
              to="/admin" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.25)',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '0.8rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.35)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span>🔐</span>
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      <Header />

      {/* Hero Header Section */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: isMobile ? '50px 0' : '80px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
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
          {/* Diocese Logo */}
          {churchSettings?.diocese_logo && (
            <div className="fade-in" style={{ marginBottom: '20px' }}>
              <img 
                src={churchSettings.diocese_logo} 
                alt="Diocese Logo" 
                style={{ 
                  height: isMobile ? '70px' : '100px',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                  animation: 'scaleIn 0.8s ease forwards'
                }} 
              />
            </div>
          )}
          
          {/* Church Name */}
          <h1 className="fade-in-up" style={{ 
            fontSize: isMobile ? '1.8rem' : '3.5rem', 
            marginBottom: '15px',
            fontWeight: '900',
            textShadow: '0 4px 16px rgba(0,0,0,0.25)',
            letterSpacing: isMobile ? '0.5px' : '1.5px',
            lineHeight: '1.15',
            padding: isMobile ? '0 10px' : '0'
          }}>
            {churchSettings?.church_name || 'CSI ALL SAINTS CHURCH'}
          </h1>
          
          {churchSettings?.address && (
            <p className="fade-in" style={{ 
              fontSize: isMobile ? '0.95rem' : '1.3rem', 
              opacity: 0.95,
              fontWeight: '500',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              maxWidth: '800px',
              margin: '0 auto 20px',
              padding: isMobile ? '0 15px' : '0',
              animationDelay: '0.2s'
            }}>
              📍 {churchSettings.address}
            </p>
          )}

          {/* Quick Action Buttons */}
          <div className="fade-in" style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '20px',
            padding: isMobile ? '0 15px' : '0',
            animationDelay: '0.4s'
          }}>
            {[
              { href: '#services', icon: '🕐', label: 'Service Times' },
              { href: '/ministries', icon: '🙏', label: 'Join a Ministry' },
              { href: '/contact', icon: '📞', label: 'Contact Us' }
            ].map((btn) => (
              <a 
                key={btn.label}
                href={btn.href} 
                style={{
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.25)',
                  color: 'white',
                  padding: isMobile ? '10px 18px' : '14px 28px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: isMobile ? '0.85rem' : '1rem',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#667eea'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content - Optimized Layout */}
      <div className="container" style={{ padding: isMobile ? '30px 15px' : '60px 20px' }}>
        
        {/* Priority Section 1: Verse of the Day - Full Width, Most Important */}
        {verseOfDay && (
          <div style={{ marginBottom: '40px' }}>
            <VerseOfDay verse={verseOfDay} />
          </div>
        )}

        {/* Priority Section 2: Priests Carousel - Full Width, Large & Prominent */}
        {priests.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <PriestSection priests={priests} />
          </div>
        )}

        {/* Priority Section 3: Service Timings - Full Width */}
        {serviceTimings.length > 0 && (
          <div id="services" style={{ marginBottom: '40px' }}>
            <ServiceTimings services={serviceTimings} />
          </div>
        )}

        {/* Priority Section 4: Announcements & Celebrations */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', 
          gap: '30px',
          alignItems: 'start',
          marginBottom: '40px'
        }}>
          {/* Left Column: Announcements */}
          <div>
            {announcements.length > 0 && (
              <Announcements announcements={announcements} />
            )}
          </div>

          {/* Right Sidebar: Celebrations */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: '120px' }}>
            <TodayCelebrations celebrations={todayCelebrations} />
          </div>
        </div>

        {/* Priority Section 5: Gallery/Carousels - Full Width */}
        <CarouselSection carousels={carousels} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Welcome
