function PriestSection({ priests }) {
  if (!priests || priests.length === 0) {
    return null
  }

  return (
    <section style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: 'clamp(24px, 4vw, 50px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
    }}>
      {/* Header */}
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
        fontWeight: '700',
        color: '#2c3e50'
      }}>
        Our <span style={{ color: '#667eea' }}>Pastors</span>
      </h2>
      
      {/* Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: '30px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {priests.map((priest, index) => (
          <div 
            key={priest.id} 
            style={{
              textAlign: 'center',
              animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`,
              opacity: 0,
              padding: '20px 10px',
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)'
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(102,126,234,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Priest Image */}
            <div style={{
              width: 'min(180px, 60vw)',
              height: 'min(180px, 60vw)',
              margin: '0 auto 20px',
              overflow: 'hidden',
              borderRadius: '50%',
              border: '4px solid #667eea',
              backgroundColor: '#f5f5f5',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)'
            }}>
              {priest.image ? (
                <img 
                  src={priest.image} 
                  alt={priest.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  color: '#667eea'
                }}>
                  👤
                </div>
              )}
            </div>
            
            {/* Priest Info */}
            <h3 style={{ 
              color: '#2c3e50', 
              marginBottom: '5px',
              fontSize: '1.1rem',
              fontWeight: '700'
            }}>
              {priest.name}
            </h3>
            
            <p style={{ 
              color: '#667eea', 
              fontWeight: '600',
              marginBottom: '15px',
              fontSize: '0.9rem'
            }}>
              {priest.title}
            </p>
            
            {priest.bio && (
              <p style={{ 
                color: '#666', 
                fontSize: '0.85rem',
                lineHeight: '1.5',
                marginBottom: '15px'
              }}>
                {priest.bio}
              </p>
            )}
            
            {priest.specializations && priest.specializations.length > 0 && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: '6px',
                marginTop: '10px'
              }}>
                {priest.specializations.map((spec, idx) => (
                  <span key={idx} style={{
                    backgroundColor: '#f0f0f0',
                    color: '#666',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default PriestSection
