function Loader({ fullScreen = false, message = 'Loading...' }) {
  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(10px)'
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  }

  return (
    <div style={containerStyle}>
      {/* Animated Cross Icon */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        marginBottom: '30px'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '3rem',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          ✝️
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>

      <p style={{ 
        marginTop: '10px', 
        color: fullScreen ? 'white' : '#667eea',
        fontSize: '1.2rem',
        fontWeight: '600',
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease',
        textShadow: fullScreen ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
      }}>
        {message}
      </p>

      {/* Loading Dots */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '20px'
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: fullScreen ? 'white' : '#667eea',
              animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
              opacity: 0.8
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: translateY(0);
          }
          40% { 
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  )
}

export default Loader
