import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChurchSettingsManager from '../components/admin/ChurchSettingsManager'
import PriestManager from '../components/admin/PriestManager'
import VerseManager from '../components/admin/VerseManager'
import AnnouncementManager from '../components/admin/AnnouncementManager'
import ServiceTimingManager from '../components/admin/ServiceTimingManager'
import CelebrationManager from '../components/admin/CelebrationManager'
import CarouselManager from '../components/admin/CarouselManager'
import AboutPageManager from '../components/admin/AboutPageManager'
import MinistryManager from '../components/admin/MinistryManager'
import DeveloperManager from '../components/admin/DeveloperManager'
import Footer from '../components/Footer'
import Loader from '../components/Loader'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [adminUser, setAdminUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
    const user = localStorage.getItem('adminUser')
    
    if (!isLoggedIn || !user) {
      navigate('/admin')
      return
    }
    
    setAdminUser(JSON.parse(user))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn')
    localStorage.removeItem('adminUser')
    navigate('/')
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'church', label: '⛪ Church Settings', icon: '⛪' },
    { id: 'about', label: '📄 About Page', icon: '📄' },
    { id: 'priests', label: '👨‍💼 Priests', icon: '👨‍💼' },
    { id: 'ministries', label: '🙏 Ministries', icon: '🙏' },
    { id: 'developers', label: '👨‍💻 Developers', icon: '👨‍💻' },
    { id: 'verse', label: '📖 Verse of Day', icon: '📖' },
    { id: 'announcements', label: '📢 Announcements', icon: '📢' },
    { id: 'services', label: '🕐 Service Timings', icon: '🕐' },
    { id: 'celebrations', label: '🎉 Celebrations', icon: '🎉' },
    { id: 'carousels', label: '📸 Carousels', icon: '📸' }
  ]

  if (!adminUser) {
    return <Loader fullScreen message="Verifying credentials..." />
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              backdropFilter: 'blur(10px)'
            }}>
              🏛️
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.6rem',
                fontWeight: '800',
                letterSpacing: '0.5px'
              }}>
                Church Admin Dashboard
              </h1>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                opacity: 0.9,
                fontWeight: '500'
              }}>
                Manage your church content and settings
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px',
            background: 'rgba(255,255,255,0.15)',
            padding: '12px 20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>
                👤
              </div>
              <div>
                <div style={{ 
                  fontSize: '0.75rem',
                  opacity: 0.9,
                  fontWeight: '600'
                }}>
                  ADMIN
                </div>
                <div style={{ fontWeight: '700' }}>
                  {adminUser.first_name}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
          {/* Sidebar */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '25px',
            height: 'fit-content',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: '120px'
          }}>
            <h3 style={{ 
              marginBottom: '25px', 
              color: '#333',
              fontSize: '1.2rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>🧭</span>
              <span>Navigation</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="fade-in"
                  style={{
                    background: activeTab === tab.id 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#333',
                    border: 'none',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: activeTab === tab.id 
                      ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                      : 'none',
                    animationDelay: `${index * 0.03}s`,
                    opacity: 0
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.08)'
                      e.currentTarget.style.transform = 'translateX(5px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                  <span>{tab.label.replace(tab.icon + ' ', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="fade-in-up" style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            minHeight: '600px'
          }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'church' && <ChurchSettingsManager />}
            {activeTab === 'about' && <AboutPageManager />}
            {activeTab === 'priests' && <PriestManager />}
            {activeTab === 'ministries' && <MinistryManager />}
            {activeTab === 'developers' && <DeveloperManager />}
            {activeTab === 'verse' && <VerseManager />}
            {activeTab === 'announcements' && <AnnouncementManager />}
            {activeTab === 'services' && <ServiceTimingManager />}
            {activeTab === 'celebrations' && <CelebrationManager />}
            {activeTab === 'carousels' && <CarouselManager />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function OverviewTab() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [carouselStats, memberStats] = await Promise.all([
        fetch('/api/carousels/statistics').then(r => r.json()),
        fetch('/api/members/statistics').then(r => r.json())
      ])

      setStats({
        carousels: carouselStats.success ? carouselStats.data : {},
        members: memberStats.success ? memberStats.data : {}
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#666' }}>Loading statistics...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      icon: '📸',
      title: 'Carousels',
      value: stats?.carousels?.total_carousels || 0,
      color: '#667eea',
      bgColor: 'rgba(102, 126, 234, 0.1)'
    },
    {
      icon: '🖼️',
      title: 'Media Files',
      value: stats?.carousels?.total_media || 0,
      color: '#764ba2',
      bgColor: 'rgba(118, 75, 162, 0.1)'
    },
    {
      icon: '👥',
      title: 'Members',
      value: stats?.members?.total_members || 0,
      color: '#27ae60',
      bgColor: 'rgba(39, 174, 96, 0.1)'
    },
    {
      icon: '✅',
      title: 'Active Members',
      value: stats?.members?.active_members || 0,
      color: '#f39c12',
      bgColor: 'rgba(243, 156, 18, 0.1)'
    }
  ]

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '40px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
        }}>
          📊
        </div>
        <div>
          <h2 style={{ 
            margin: 0,
            fontSize: '2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Dashboard Overview
          </h2>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '0.95rem'
          }}>
            Quick insights and statistics
          </p>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className="card-hover fade-in-up"
            style={{
              background: card.bgColor,
              padding: '30px',
              borderRadius: '16px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: `2px solid ${card.color}20`,
              animationDelay: `${index * 0.1}s`,
              opacity: 0
            }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '15px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              {card.icon}
            </div>
            <h3 style={{ 
              color: card.color, 
              margin: '0 0 10px 0',
              fontSize: '0.9rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {card.title}
            </h3>
            <p style={{ 
              fontSize: '2.5rem', 
              margin: 0, 
              color: '#333',
              fontWeight: '800'
            }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '30px',
        border: '2px solid rgba(102, 126, 234, 0.1)'
      }}>
        <h3 style={{ 
          color: '#333', 
          marginBottom: '20px',
          fontSize: '1.3rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🚀</span>
          <span>Quick Actions</span>
        </h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => window.open('/', '_blank')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🌐</span>
            <span>View Website</span>
          </button>
          <button 
            className="btn btn-primary"
            style={{ 
              background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📊</span>
            <span>Generate Report</span>
          </button>
          <button 
            className="btn btn-primary"
            style={{ 
              background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>💾</span>
            <span>Backup Data</span>
          </button>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        border: '2px solid #e0e0e0'
      }}>
        <h3 style={{ 
          color: '#333', 
          marginBottom: '20px',
          fontSize: '1.3rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>ℹ️</span>
          <span>System Information</span>
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px'
        }}>
          {[
            { label: 'Database', value: 'JSON Files (Development)', icon: '💾' },
            { label: 'Storage', value: 'Local BLOB Storage', icon: '📁' },
            { label: 'Last Updated', value: new Date().toLocaleDateString(), icon: '📅' },
            { label: 'Version', value: '2.0.0', icon: '🔖' }
          ].map((item, index) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '15px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '12px'
              }}
            >
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
                {item.icon}
              </div>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#999',
                  fontWeight: '600',
                  marginBottom: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {item.label}
                </div>
                <div style={{
                  color: '#333',
                  fontWeight: '700',
                  fontSize: '0.95rem'
                }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard