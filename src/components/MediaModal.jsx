import { useEffect, useCallback } from 'react'

// NavBtn — left / right arrow
function NavBtn({ direction, onClick, disabled }) {
  const isLeft = direction === 'left'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'absolute',
        top: '50%',
        [isLeft ? 'left' : 'right']: '16px',
        transform: 'translateY(-50%)',
        background: disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
        border: 'none',
        color: disabled ? 'rgba(255,255,255,0.25)' : 'white',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        fontSize: '1.6rem',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
        zIndex: 10,
        userSelect: 'none'
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.32)' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
      aria-label={isLeft ? 'Previous' : 'Next'}
    >
      {isLeft ? '‹' : '›'}
    </button>
  )
}

/**
 * MediaModal
 *
 * Props:
 *   media      – current media object
 *   mediaList  – full array of media objects (optional; enables prev/next)
 *   onClose    – close handler
 *   onNavigate – (newIndex) => void  (optional; called when user navigates)
 */
function MediaModal({ media, mediaList = [], onClose, onNavigate }) {
  const currentIndex = mediaList.findIndex(m => m.id === media.id)
  const hasList = mediaList.length > 1
  const hasPrev = hasList && currentIndex > 0
  const hasNext = hasList && currentIndex < mediaList.length - 1

  const goPrev = useCallback(() => {
    if (hasPrev && onNavigate) onNavigate(currentIndex - 1)
  }, [hasPrev, onNavigate, currentIndex])

  const goNext = useCallback(() => {
    if (hasNext && onNavigate) onNavigate(currentIndex + 1)
  }, [hasNext, onNavigate, currentIndex])

  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', handle)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handle)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, goPrev, goNext])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000, padding: '20px'
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          border: 'none', color: 'white', fontSize: '2rem',
          width: '48px', height: '48px', borderRadius: '50%',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', zIndex: 11
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; e.currentTarget.style.transform = 'rotate(90deg)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'rotate(0deg)' }}
        aria-label="Close"
      >×</button>

      {/* Prev / Next */}
      {hasList && <NavBtn direction="left"  onClick={e => { e.stopPropagation(); goPrev() }} disabled={!hasPrev} />}
      {hasList && <NavBtn direction="right" onClick={e => { e.stopPropagation(); goNext() }} disabled={!hasNext} />}

      {/* Content */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          maxWidth: '90vw', maxHeight: '90vh', gap: '16px'
        }}
      >
        {media.media_type === 'image' ? (
          <img
            key={media.id}
            src={media.file_path}
            alt={media.title}
            style={{
              maxWidth: '100%', maxHeight: '75vh',
              objectFit: 'contain', borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          />
        ) : (
          <iframe
            key={media.id}
            src={`${media.file_path}?autoplay=1`}
            title={media.title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: '80vw', maxWidth: '900px',
              height: '45vw', maxHeight: '506px',
              border: 'none', borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          />
        )}

        {/* Caption + counter */}
        <div style={{
          color: 'white', textAlign: 'center',
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
          padding: '16px 28px', borderRadius: '12px',
          maxWidth: '700px', width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>
                {media.title || media.caption || 'Untitled'}
              </div>
              {(media.description || media.carouselTitle) && (
                <div style={{ fontSize: '0.88rem', opacity: 0.8 }}>
                  {media.carouselTitle && <span>📁 {media.carouselTitle}</span>}
                  {media.description && <span style={{ marginLeft: media.carouselTitle ? '12px' : 0 }}>{media.description}</span>}
                </div>
              )}
            </div>
            {hasList && (
              <div style={{ fontSize: '0.85rem', opacity: 0.7, whiteSpace: 'nowrap', fontWeight: '600' }}>
                {currentIndex + 1} / {mediaList.length}
              </div>
            )}
          </div>

          {/* Dot indicators */}
          {hasList && mediaList.length <= 20 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
              {mediaList.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => onNavigate && onNavigate(i)}
                  style={{
                    width: i === currentIndex ? '22px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.25s'
                  }}
                  aria-label={`Go to item ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaModal
