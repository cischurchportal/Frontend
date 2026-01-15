function Announcements({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return null
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c'
      case 'medium': return '#f39c12'
      case 'low': return '#27ae60'
      default: return '#6c757d'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  return (
    <section style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
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
        background: 'linear-gradient(135deg, rgba(243, 156, 18, 0.1) 0%, rgba(230, 126, 34, 0.1) 100%)',
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
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: '0 8px 24px rgba(243, 156, 18, 0.3)'
        }}>
          📢
        </div>
        <h2 style={{ 
          fontSize: '2rem',
          fontWeight: '800',
          color: '#2c3e50',
          margin: 0
        }}>
          Announcements
        </h2>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {announcements.map((announcement, index) => (
          <div 
            key={announcement.id} 
            className="card-hover"
            style={{
              border: `3px solid ${getPriorityColor(announcement.priority)}`,
              borderRadius: '16px',
              padding: '25px',
              background: `linear-gradient(135deg, ${getPriorityColor(announcement.priority)}05 0%, ${getPriorityColor(announcement.priority)}10 100%)`,
              position: 'relative',
              overflow: 'hidden',
              animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`,
              opacity: 0
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: `${getPriorityColor(announcement.priority)}15`,
              borderRadius: '50%',
              filter: 'blur(30px)'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '12px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: getPriorityColor(announcement.priority),
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginRight: '15px',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${getPriorityColor(announcement.priority)}40`
              }}>
                {getPriorityIcon(announcement.priority)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <h3 style={{
                    color: '#2c3e50',
                    margin: 0,
                    fontSize: '1.3rem',
                    fontWeight: '700'
                  }}>
                    {announcement.title}
                  </h3>
                  <span style={{
                    background: getPriorityColor(announcement.priority),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    fontWeight: '800',
                    letterSpacing: '0.5px',
                    boxShadow: `0 2px 8px ${getPriorityColor(announcement.priority)}40`
                  }}>
                    {announcement.priority}
                  </span>
                </div>
                
                <p style={{
                  color: '#555',
                  margin: 0,
                  lineHeight: '1.7',
                  fontSize: '1.05rem'
                }}>
                  {announcement.content}
                </p>
                
                {announcement.type && (
                  <div style={{ marginTop: '12px' }}>
                    <span style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      textTransform: 'capitalize',
                      fontWeight: '700'
                    }}>
                      📌 {announcement.type}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Announcements