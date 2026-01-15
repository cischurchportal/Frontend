function ServiceTimings({ services }) {
  if (!services || services.length === 0) {
    return null
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'worship': return '⛪'
      case 'bible_study': return '📖'
      case 'prayer': return '🙏'
      case 'youth': return '👥'
      default: return '📅'
    }
  }

  const getServiceColor = (serviceType) => {
    switch (serviceType) {
      case 'worship': return '#667eea'
      case 'bible_study': return '#f39c12'
      case 'prayer': return '#27ae60'
      case 'youth': return '#e74c3c'
      default: return '#764ba2'
    }
  }

  const groupServicesByDay = (services) => {
    const grouped = {}
    services.forEach(service => {
      const day = service.day_of_week
      if (!grouped[day]) {
        grouped[day] = []
      }
      grouped[day].push(service)
    })
    return grouped
  }

  const groupedServices = groupServicesByDay(services)
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <section style={{
      backgroundColor: 'white',
      borderRadius: '24px',
      padding: '50px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '250px',
        height: '250px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '50px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          🕐
        </div>
        <div>
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#2c3e50',
            margin: 0,
            lineHeight: '1.2'
          }}>
            Service Timings
          </h2>
          <p style={{
            margin: 0,
            color: '#999',
            fontSize: '1.05rem',
            fontWeight: '600'
          }}>
            Join us in worship and fellowship
          </p>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '25px',
        position: 'relative',
        zIndex: 1
      }}>
        {dayOrder.map((day, dayIndex) => {
          if (!groupedServices[day]) return null
          
          return (
            <div 
              key={day} 
              className="card-hover"
              style={{
                border: '2px solid rgba(102, 126, 234, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
                animation: `fadeInUp 0.5s ease forwards ${dayIndex * 0.1}s`,
                opacity: 0
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '18px 25px',
                fontWeight: '800',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>📅</span>
                <span>{day}</span>
              </div>
              
              <div style={{ padding: '25px' }}>
                {groupedServices[day].map((service, index) => (
                  <div 
                    key={service.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '18px',
                      marginBottom: index < groupedServices[day].length - 1 ? '25px' : '0',
                      paddingBottom: index < groupedServices[day].length - 1 ? '25px' : '0',
                      borderBottom: index < groupedServices[day].length - 1 ? '2px solid rgba(102, 126, 234, 0.1)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: getServiceColor(service.service_type),
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      flexShrink: 0,
                      boxShadow: `0 6px 20px ${getServiceColor(service.service_type)}40`
                    }}>
                      {getServiceIcon(service.service_type)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        color: '#2c3e50',
                        margin: '0 0 8px 0',
                        fontSize: '1.2rem',
                        fontWeight: '800'
                      }}>
                        {service.service_name}
                      </h4>
                      
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '15px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(102, 126, 234, 0.08)',
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}>
                          <span style={{ fontSize: '1rem' }}>🕐</span>
                          <span style={{
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            color: '#667eea'
                          }}>
                            {formatTime(service.time)}
                          </span>
                        </div>
                        
                        {service.duration_minutes && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(243, 156, 18, 0.08)',
                            padding: '6px 12px',
                            borderRadius: '20px'
                          }}>
                            <span style={{ fontSize: '1rem' }}>⏱️</span>
                            <span style={{
                              fontSize: '0.95rem',
                              fontWeight: '700',
                              color: '#f39c12'
                            }}>
                              {service.duration_minutes} mins
                            </span>
                          </div>
                        )}
                        
                        {service.location && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(39, 174, 96, 0.08)',
                            padding: '6px 12px',
                            borderRadius: '20px'
                          }}>
                            <span style={{ fontSize: '1rem' }}>📍</span>
                            <span style={{
                              fontSize: '0.95rem',
                              fontWeight: '700',
                              color: '#27ae60'
                            }}>
                              {service.location}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {service.preacher && (
                        <p style={{
                          margin: '8px 0 0 0',
                          fontSize: '0.9rem',
                          color: '#667eea',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>👨‍💼</span>
                          <span>Preacher: {service.preacher}</span>
                        </p>
                      )}
                      
                      {service.description && (
                        <p style={{
                          margin: '8px 0 0 0',
                          fontSize: '0.9rem',
                          color: '#666',
                          fontStyle: 'italic',
                          lineHeight: '1.6'
                        }}>
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ServiceTimings