import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import ErrorPopup from '../components/ErrorPopup'

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage('Login successful! Redirecting...')
        setMessageType('success')
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        localStorage.setItem('isAdminLoggedIn', 'true')
        
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1000)
      } else {
        setMessage(data.detail || 'Login failed. Please check your credentials.')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Connection error. Please check if the server is running.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
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

      {message && <ErrorPopup message={message} type={messageType} onClose={() => setMessage('')} />}
      
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="fade-in-up" style={{
          maxWidth: '480px',
          width: '100%',
          padding: '50px 45px',
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Element */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />

          {/* Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            fontSize: '2.5rem',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            🔐
          </div>

          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '10px',
            fontSize: '2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Admin Login
          </h2>
          
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '35px',
            fontSize: '0.95rem'
          }}>
            Access the church management dashboard
          </p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                color: '#333',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem'
                }}>
                  👤
                </span>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your username"
                  style={{
                    width: '100%',
                    padding: '14px 15px 14px 45px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: loading ? '#f5f5f5' : 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                color: '#333',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem'
                }}>
                  🔒
                </span>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '14px 15px 14px 45px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: loading ? '#f5f5f5' : 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ 
                width: '100%', 
                marginBottom: '20px',
                opacity: loading ? 0.7 : 1,
                fontSize: '1.05rem',
                padding: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span>Logging in...</span>
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span>Login to Dashboard</span>
                  <span>→</span>
                </span>
              )}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <Link 
              to="/" 
              style={{ 
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#764ba2'
                e.currentTarget.style.transform = 'translateX(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#667eea'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
              color: '#667eea',
              fontWeight: '700'
            }}>
              <span>ℹ️</span>
              <span>Default Credentials</span>
            </div>
            <div style={{ paddingLeft: '28px' }}>
              <strong>Username:</strong> admin<br />
              <strong>Password:</strong> password123
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default AdminLogin
