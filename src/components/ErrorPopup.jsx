function ErrorPopup({ message, onClose, type = 'error' }) {
  if (!message) return null

  const colors = {
    error: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
    success: { bg: '#d4edda', text: '#155724', border: '#c3e6cb' },
    warning: { bg: '#fff3cd', text: '#856404', border: '#ffeaa7' },
    info: { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb' }
  }

  const color = colors[type] || colors.error

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      maxWidth: '400px',
      backgroundColor: color.bg,
      color: color.text,
      padding: '15px 20px',
      borderRadius: '8px',
      border: `1px solid ${color.border}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'start',
      gap: '10px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ flex: 1 }}>
        <strong style={{ display: 'block', marginBottom: '5px' }}>
          {type === 'error' && '❌ Error'}
          {type === 'success' && '✅ Success'}
          {type === 'warning' && '⚠️ Warning'}
          {type === 'info' && 'ℹ️ Info'}
        </strong>
        <div>{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: color.text,
            padding: '0',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      )}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default ErrorPopup
