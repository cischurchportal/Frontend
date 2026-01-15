function PriestSection({ priests }) {
  if (!priests || priests.length === 0) {
    return null
  }

  return (
    <section style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '50px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
    }}>
      {/* Header */}
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '50px',
        fontSize: '2.2rem',
        fontWeight: '700',
        color: '#2c3e50'
      }}>
        Our <span style={{ color: '#667eea' }}>Pastors</span>
      </h2>
      
      {/* Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {priests.map((priest, index) => (
          <div 
            key={priest.id} 
            style={{
              textAlign: 'center',
              animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`,
              opacity: 0
            }}
          >
            {/* Priest Image */}
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto 20px',
              overflow: 'hidden',
              border: '4px solid #667eea',
              backgroundColor: '#f5f5f5',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
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
