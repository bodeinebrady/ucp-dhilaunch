import { Search } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function DockerLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#1d63ed" />
      <path d="M8 18h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path d="M8 15h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path d="M11 12h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path d="M24 16.5c.5-1.5-.5-3-2-3.5-.5-1.5-2-2-3.5-1.5 0 0-.5-1-2-1-.5 0-1 .2-1.4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function NavTab({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        cursor: 'pointer',
        fontSize: '0.9375rem',
        fontWeight: active ? 600 : 400,
        color: active ? '#fff' : 'rgba(255,255,255,0.7)',
        borderBottom: active ? '2px solid #fff' : '2px solid transparent',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {label}
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const onCatalog = location.pathname.startsWith('/catalog')

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'linear-gradient(90deg, #1d63ed 0%, #7d2eff 100%)',
      color: '#ffffff',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        minHeight: 64,
      }}>
        {/* Left — logo + nav tabs */}
        <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, height: 64, gap: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
              cursor: 'pointer',
              marginRight: 32,
            }}
            onClick={() => navigate('/')}
          >
            <DockerLogo />
            <span style={{ fontSize: '0.9375rem', fontWeight: 680, letterSpacing: '-0.01em', color: '#fff' }}>
              Docker Hub
            </span>
          </div>

          <NavTab label="Explore" active={onCatalog} onClick={() => navigate('/catalog')} />
          <NavTab label="My Hub" active={false} onClick={() => {}} />
        </div>

        {/* Center — search */}
        <div style={{ width: 480, margin: '0 24px', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 6,
            padding: '0 12px',
            height: 36,
            gap: 8,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}>
            <Search size={16} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search Docker Hub…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.875rem',
                color: '#fff',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Right — auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 100,
            padding: '0 8px',
            height: 20,
            fontSize: '0.6875rem',
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            projectsteam
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 28,
            height: 28,
            background: '#1d63ed',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#fff',
          }}>
            PT
          </div>
        </div>
      </div>
    </header>
  )
}
