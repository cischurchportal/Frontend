function VerseOfDay({ verse }) {
  if (!verse) {
    return null
  }

  return (
    <section style={{
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      borderRadius: '24px',
      padding: '50px 40px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      border: '3px solid',
      borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '30px',
        position: 'relative',
        zIndex: 1
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
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          📖
        </div>
        <h2 style={{ 
          fontSize: '2.2rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          Verse of the Day
        </h2>
      </div>
      
      <blockquote style={{
        fontSize: '1.5rem',
        fontStyle: 'italic',
        color: '#2c3e50',
        textAlign: 'center',
        margin: '0 0 25px 0',
        lineHeight: '1.8',
        position: 'relative',
        zIndex: 1,
        fontWeight: '500',
        padding: '0 40px'
      }}>
        <span style={{
          fontSize: '4rem',
          color: '#667eea',
          position: 'absolute',
          left: '0',
          top: '-20px',
          opacity: 0.2,
          fontFamily: 'Georgia, serif'
        }}>
          "
        </span>
        {verse.verse}
        <span style={{
          fontSize: '4rem',
          color: '#764ba2',
          position: 'absolute',
          right: '0',
          bottom: '-30px',
          opacity: 0.2,
          fontFamily: 'Georgia, serif'
        }}>
          "
        </span>
      </blockquote>
      
      <p style={{
        textAlign: 'center',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '1.2rem',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        — {verse.reference}
      </p>
      
      {verse.commentary && (
        <div style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '1.05rem',
          fontStyle: 'italic',
          background: 'white',
          padding: '25px 30px',
          borderRadius: '16px',
          borderLeft: '5px solid #667eea',
          lineHeight: '1.7',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 1
        }}>
          💭 {verse.commentary}
        </div>
      )}
    </section>
  )
}

export default VerseOfDay