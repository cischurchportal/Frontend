import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

function Header() {
  const location = useLocation()
  const { churchSettings } = useAppContext()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

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
            gap: '10px',
            transition: 'transform 0.3s ease',
            flex: 1,
            minWidth: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {churchSettings?.church_logo && (
            <img 
              src={churchSettings.church_logo} 
              alt="Church Logo" 
              style={{ 
                height: isMobile ? '38px' : scrolled ? '45px' : '55px',
                flexShrink: 0,
                transition: 'height 0.3s ease',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          )}
          <span style={{ 
            fontSize: isMobile ? '1rem' : scrolled ? '1.2rem' : '1.4rem',
            fontWeight: '700', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'font-size 0.3s ease',
            letterSpacing: '0.5px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {churchSettings?.church_name || 'St.Patricks Co-Cathedral Church'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              gap: '8px',
              margin: 0,
              padding: 0
            }}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      color: location.pathname === item.path ? 'white' : '#2c3e50',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: location.pathname === item.path 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'transparent',
                      transition: 'all 0.25s ease'
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
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              flexShrink: 0
            }}
            aria-label="Toggle menu"
          >
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#2c3e50',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }} />
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#2c3e50',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              opacity: menuOpen ? 0 : 1
            }} />
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: '#2c3e50',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
            }} />
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobile && menuOpen && (
        <nav style={{
          backgroundColor: 'white',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          padding: '12px 20px 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    color: location.pathname === item.path ? 'white' : '#2c3e50',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: location.pathname === item.path 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
