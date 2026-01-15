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

function Welcome() {
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const response = await fetch('/api/church/home')
      const data = await response.json()
      if (data.success) {
        setHomeData(data.data)
        setError('')
      } else {
        setError('Failed to load church data')
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
      setError('Connection error. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

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
          <div style={{
            fontSize: '5rem',
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            ⛪
          </div>
          <h2 style={{ 
            color: '#721c24', 
            marginBottom: '15px',
            fontSize: '2rem',
            textAlign: 'center'
          }}>
            Unable to Load Page
          </h2>
          <p style={{ 
            color: '#666', 
            marginBottom: '30px',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            {error}
          </p>
          <button 
            onClick={fetchHomeData}
            className="btn btn-primary"
          >
            🔄 Retry
          </button>
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
        padding: '12px 0',
        fontSize: '0.9rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 999
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <span>📍</span>
              <span>{churchSettings?.address || 'Church Address'}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <span>📞</span>
              <span>{churchSettings?.phone || '(0461) 2902788'}</span>
            </div>
            {/* Admin Login Button - Small in Top Right */}
            <Link 
              to="/admin" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.25)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '0.85rem',
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
        padding: '80px 0',
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
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Diocese Logo */}
          {churchSettings?.diocese_logo && (
            <div className="fade-in" style={{ marginBottom: '30px' }}>
              <img 
                src={churchSettings.diocese_logo} 
                alt="Diocese Logo" 
                style={{ 
                  height: '100px',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                  animation: 'scaleIn 0.8s ease forwards'
                }} 
              />
            </div>
          )}
          
          {/* Church Name */}
          <h1 className="fade-in-up" style={{ 
            fontSize: '4rem', 
            marginBottom: '20px',
            fontWeight: '900',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            letterSpacing: '2px',
            lineHeight: '1.2'
          }}>
            {churchSettings?.church_name || 'CSI ALL SAINTS CHURCH'}
          </h1>
          
          {churchSettings?.address && (
            <p className="fade-in" style={{ 
              fontSize: '1.3rem', 
              opacity: 0.95,
              fontWeight: '500',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              maxWidth: '800px',
              margin: '0 auto 30px',
              animationDelay: '0.2s'
            }}>
              📍 {churchSettings.address}
            </p>
          )}

          {/* Quick Action Buttons */}
          <div className="fade-in" style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '30px',
            animationDelay: '0.4s'
          }}>
            <a 
              href="#services" 
              style={{
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.25)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
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
              <span>🕐</span>
              <span>Service Times</span>
            </a>
            <a 
              href="/ministries" 
              style={{
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.25)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
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
              <span>🙏</span>
              <span>Join a Ministry</span>
            </a>
            <a 
              href="/contact" 
              style={{
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.25)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
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
              <span>📞</span>
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content - Optimized Layout */}
      <div className="container" style={{ padding: '60px 20px' }}>
        
        {/* Priority Section 1: Verse of the Day - Full Width, Most Important */}
        {verseOfDay && (
          <div className="fade-in-up" style={{ 
            marginBottom: '50px',
            animationDelay: '0.1s',
            opacity: 0
          }}>
            <VerseOfDay verse={verseOfDay} />
          </div>
        )}

        {/* Priority Section 2: Priests Carousel - Full Width, Large & Prominent */}
        {priests.length > 0 && (
          <div className="fade-in-up" style={{ 
            marginBottom: '50px',
            animationDelay: '0.2s', 
            opacity: 0 
          }}>
            <PriestSection priests={priests} />
          </div>
        )}

        {/* Priority Section 3: Service Timings - Full Width */}
        {serviceTimings.length > 0 && (
          <div id="services" className="fade-in-up" style={{ 
            marginBottom: '50px',
            animationDelay: '0.4s',
            opacity: 0
          }}>
            <ServiceTimings services={serviceTimings} />
          </div>
        )}

        {/* Priority Section 4: Two Column Layout - Announcements & Celebrations */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 380px', 
          gap: '40px',
          alignItems: 'start',
          marginBottom: '50px'
        }}>
          {/* Left Column: Announcements */}
          <div>
            {announcements.length > 0 && (
              <div className="fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                <Announcements announcements={announcements} />
              </div>
            )}
          </div>

          {/* Right Sidebar: Celebrations */}
          <div style={{ 
            position: 'sticky',
            top: '120px'
          }}>
            <div className="fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <TodayCelebrations celebrations={todayCelebrations} />
            </div>
          </div>
        </div>

        {/* Priority Section 5: Gallery/Carousels - Full Width */}
        <div className="fade-in-up" style={{ 
          animationDelay: '0.6s',
          opacity: 0
        }}>
          <CarouselSection />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Welcome
