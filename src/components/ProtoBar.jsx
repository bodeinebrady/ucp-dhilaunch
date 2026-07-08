import { useNavigate } from 'react-router-dom'

export default function ProtoBar({ label }) {
  const navigate = useNavigate()

  return (
    <div style={{
      height: 36,
      background: '#ffffff',
      borderBottom: '1px solid rgba(11,11,15,0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 24px',
      flexShrink: 0,
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#7d2eff',
          fontFamily: 'inherit',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Case Study
      </button>

      {label && (
        <>
          <div style={{ width: 1, height: 14, background: 'rgba(11,11,15,0.12)' }} />
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#7d2eff',
          }}>
            {label}
          </span>
        </>
      )}
    </div>
  )
}
