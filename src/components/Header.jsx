import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Header() {
  const location = useLocation()
  const [churchSettings, setChurchSettings] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetchChurchSettings()
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchChurchSettings = async () => {
    try {
      const response = await fetch('/api/church/home')
      const data = await response.json()
      if (data.success) {
        setChurchSettings(data.data.church_settings)
      }
    } catch (error) {
      console.error('Error fetching church settings:', error)
    }
  }

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: '📖' },
    { path: '/ministries', label: 'Ministries', icon: '🙏' },
    { path: '/gallery', label: 'Gallery', icon: '📸' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ]

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: scrolled ? '12px 20px' : '18px 20px',
        transition: 'padding 0.3s ease'
      }}>
        {/* Logo and Church Name */}
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {churchSettings?.church_logo && (
            <img 
              src={churchSettings.church_logo} 
              alt="Church Logo" 
              style={{ 
                height: scrolled ? '45px' : '55px',
                transition: 'height 0.3s ease',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          )}
          <span style={{ 
            fontSize: scrolled ? '1.2rem' : '1.4rem',
            fontWeight: '700', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'font-size 0.3s ease',
            letterSpacing: '0.5px'
          }}>
            {churchSettings?.church_name || 'St.Patricks Co-Cathedral Church'}
          </span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '8px',
            margin: 0,
            padding: 0
          }}>
            {navItems.map((item, index) => (
              <li 
                key={item.path}
                style={{
                  animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`,
                  opacity: 0
                }}
              >
                <Link
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    color: location.pathname === item.path ? 'white' : '#2c3e50',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: location.pathname === item.path 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'transparent',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
