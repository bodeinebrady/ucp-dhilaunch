import { useNavigate } from 'react-router-dom'

// Top global navigation strip — 1:1 with ucp-self's NavBar.
// A light translucent bar whose back link returns to the case-study index.
// Kept in-flow (not position:fixed) since it sits above DHI's sticky Navbar.

export default function ProtoBar({ label }) {
  const navigate = useNavigate()

  return (
    <div style={{
      height: 44,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(11,11,15,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
    }}>
      {/* Back link — returns to the case-study index */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: "'Fira Mono', monospace",
          fontSize: 11,
          fontWeight: 500,
          color: 'rgba(11,11,15,0.4)',
          letterSpacing: '0.02em',
          transition: 'color 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(11,11,15,0.8)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(11,11,15,0.4)'}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Case Study
      </button>

      {/* Current context label */}
      {label && (
        <span style={{
          fontFamily: "'Fira Mono', monospace",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(11,11,15,0.25)',
        }}>
          {label}
        </span>
      )}
    </div>
  )
}
