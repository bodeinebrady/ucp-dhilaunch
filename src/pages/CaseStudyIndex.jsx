import { Link } from 'react-router-dom'

const F = {
  sans: "'DM Sans Variable', system-ui, sans-serif",
  mono: "'Fira Mono', monospace",
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 'dhi-catalog',
    color: '#2e7f74',
    label: 'DHI Catalog',
    desc: 'The public-facing catalog of Docker Hardened Images. Browse, search, filter by compliance, and discover images before mirroring.',
    href: '/catalog',
    external: false,
  },
  {
    id: 'mirroring-flow',
    color: '#1d63ed',
    label: 'Mirroring Flow',
    desc: 'The experience of mirroring a Docker Hardened Image into your org registry. Starts on the PyTorch repo detail page.',
    href: '/mirror',
    external: false,
  },
  {
    id: 'manage',
    color: '#059669',
    label: 'Manage Hardened Images',
    desc: 'The org-level management view. Mirror status, customizations, vulnerability counts, and compliance at a glance.',
    href: '/manage',
    external: false,
  },
  {
    id: 'bulk-customizations',
    color: '#7d2eff',
    label: 'Bulk Customizations',
    desc: 'Five-step wizard for configuring DHI images at scale. Dry-run preview, env var inheritance, and build output.',
    href: '/bulk-customizations',
    external: false,
  },
]

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ item }) {
  const Tag = item.external ? 'a' : Link
  const linkProps = item.external
    ? { href: item.href, target: '_blank', rel: 'noreferrer' }
    : { to: item.href }

  return (
    <Tag {...linkProps} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid rgba(11,11,15,0.09)',
          borderRadius: 10,
          padding: '28px 32px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.12s, box-shadow 0.12s, transform 0.12s',
          cursor: 'pointer',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr auto',
          gap: '0 48px',
          alignItems: 'center',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(11,11,15,0.18)'
          e.currentTarget.style.boxShadow = '0 6px 24px -6px rgba(11,11,15,0.1)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(11,11,15,0.09)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'none'
        }}
      >
        {/* Left accent bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, bottom: 0,
          width: 3,
          background: item.color,
          borderRadius: '10px 0 0 10px',
        }} />

        {/* Label */}
        <div style={{
          fontFamily: F.sans,
          fontSize: 17,
          fontVariationSettings: "'wght' 660",
          color: '#0B0B0F',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          {item.label}
        </div>

        {/* Description */}
        <p style={{
          fontFamily: F.mono,
          fontSize: 12,
          lineHeight: 1.7,
          color: '#5a5a6e',
          margin: 0,
        }}>
          {item.desc}
        </p>

        {/* Arrow */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, opacity: 0.3 }}>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="#0B0B0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Tag>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CaseStudyIndex() {
  return (
    <div style={{
      background: '#f8f8fa',
      minHeight: '100vh',
      fontFamily: F.sans,
    }}>
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '72px 40px 120px',
      }}>

        {/* Header */}
        <header style={{ marginBottom: 56 }}>
          <p style={{
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            margin: '0 0 14px',
          }}>
            Sean Brady — DHI Launch
          </p>
          <h1 style={{
            fontFamily: F.sans,
            fontSize: 40,
            fontVariationSettings: "'wght' 700",
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#0B0B0F',
            margin: '0 0 14px',
            textWrap: 'balance',
          }}>
            Docker Hardened Images, self-serve.
          </h1>
          <p style={{
            fontFamily: F.mono,
            fontSize: 13,
            lineHeight: 1.65,
            color: '#5a5a6e',
            maxWidth: '58ch',
            margin: 0,
          }}>
            Two design explorations covering the DHI acquisition and customization experience — from first pull to bulk configuration at scale.
          </p>
        </header>

        {/* Projects */}
        <section>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PROJECTS.map(item => <Card key={item.id} item={item} />)}
          </div>
        </section>

      </div>
    </div>
  )
}
