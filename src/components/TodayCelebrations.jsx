function TodayCelebrations({ celebrations }) {
  const getCelebrationIcon = (type) => {
    switch (type) {
      case 'birthday': return '🎂'
      case 'wedding_anniversary': return '💒'
      case 'baptism': return '✝️'
      case 'confirmation': return '🕊️'
      default: return '🎉'
    }
  }

  const getCelebrationColor = (type) => {
    switch (type) {
      case 'birthday': return '#e74c3c'
      case 'wedding_anniversary': return '#27ae60'
      case 'baptism': return '#667eea'
      case 'confirmation': return '#f39c12'
      default: return '#764ba2'
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '25px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, rgba(243, 156, 18, 0.1) 0%, rgba(230, 126, 34, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(30px)'
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '45px',
          height: '45px',
          background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 4px 12px rgba(243, 156, 18, 0.3)'
        }}>
          🎉
        </div>
        <h3 style={{ 
          fontSize: '1.3rem',
          fontWeight: '800',
          color: '#2c3e50',
          margin: 0
        }}>
          Today's Celebrations
        </h3>
      </div>
      
      {!celebrations || celebrations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '30px 20px',
          color: '#999',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎊</div>
          <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
            No celebrations today
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          position: 'relative',
          zIndex: 1
        }}>
          {celebrations.map((celebration, index) => (
            <div 
              key={celebration.id} 
              className="card-hover"
              style={{
                border: `2px solid ${getCelebrationColor(celebration.celebration_type)}`,
                borderRadius: '14px',
                padding: '18px',
                background: `linear-gradient(135deg, ${getCelebrationColor(celebration.celebration_type)}05 0%, ${getCelebrationColor(celebration.celebration_type)}10 100%)`,
                animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`,
                opacity: 0
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: getCelebrationColor(celebration.celebration_type),
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  marginRight: '12px',
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${getCelebrationColor(celebration.celebration_type)}40`
                }}>
                  {getCelebrationIcon(celebration.celebration_type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    color: '#2c3e50',
                    margin: '0 0 4px 0',
                    fontSize: '1.05rem',
                    fontWeight: '700'
                  }}>
                    {celebration.member_name}
                  </h4>
                  
                  <p style={{
                    color: getCelebrationColor(celebration.celebration_type),
                    margin: 0,
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                    fontWeight: '700'
                  }}>
                    {celebration.celebration_type.replace('_', ' ')}
                    {celebration.age && ` • ${celebration.age} years`}
                    {celebration.years_married && ` • ${celebration.years_married} years`}
                  </p>
                </div>
              </div>
              
              {celebration.message && (
                <p style={{
                  color: '#666',
                  margin: 0,
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  lineHeight: '1.5',
                  paddingLeft: '52px'
                }}>
                  💭 {celebration.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TodayCelebrations