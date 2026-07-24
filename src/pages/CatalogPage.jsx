import { useState } from 'react'
import { Clock, Download, Star, Search, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ShieldIcon } from '../components/DhiBadge'
import { FEATURED_IMAGES, MONITORING_IMAGES } from '../data/catalogData'
import { BRAND_ICONS } from '../data/brandIcons'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_COLOR = {
  'HARDENED IMAGE': '#2e7f74',
  'HELM CHART': '#1d63ed',
}

// ─── Full image card (featured / monitoring) ───────────────────────────────────

function ImageCard({ image }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const accent = TYPE_COLOR[image.type]
  const slug = image.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <div
      onClick={() => navigate(`/catalog/${slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: `1px solid ${hovered ? accent + '55' : 'rgba(11,11,15,0.09)'}`,
        borderRadius: 8,
        padding: '13px 15px 15px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 2px 8px rgba(11,11,15,0.08)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 11 }}>
        <ShieldIcon size={13} />
        <span style={{
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          background: 'linear-gradient(95deg, #AB00A4 0%, #7D2EFF 25%, #1D63ED 50%, #1C90ED 75%, #88D5C0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {image.type}
        </span>
      </div>

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: '#f4f4f6',
          border: '1px solid rgba(11,11,15,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: 5,
        }}>
          {image.icon && BRAND_ICONS[image.icon] ? (
            <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill={BRAND_ICONS[image.icon].color}>
              <path d={BRAND_ICONS[image.icon].path} />
            </svg>
          ) : (
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#6b7280', lineHeight: 1 }}>
              {image.name.charAt(0)}
            </span>
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            lineHeight: 1.25,
            color: '#0B0B0F',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {image.name}
          </div>
          {image.toolsIncluded && (
            <div style={{ fontSize: '0.6875rem', color: '#1d63ed', fontWeight: 520, marginTop: 3 }}>
              ⚡ {image.toolsIncluded} Tools included
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.75rem',
        lineHeight: 1.46,
        color: '#393F49',
        margin: '0 0 12px',
        flex: 1,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {image.desc}
      </p>

      {/* Stats footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={13} style={{ color: 'rgba(0,0,0,0.64)' }} />
          <span style={{ fontSize: '0.6875rem', color: 'rgba(0,0,0,0.64)' }}>1mo ago</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Download size={13} style={{ color: 'rgba(0,0,0,0.64)' }} />
          <span style={{ fontSize: '0.6875rem', color: 'rgba(0,0,0,0.64)' }}>10M+</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={13} style={{ color: 'rgba(0,0,0,0.64)' }} />
          <span style={{ fontSize: '0.6875rem', color: 'rgba(0,0,0,0.64)' }}>1.6K</span>
        </div>
      </div>
    </div>
  )
}

// ─── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontSize: '1rem',
      fontWeight: 700,
      color: '#0B0B0F',
      margin: '0 0 16px',
    }}>
      {children}
    </h2>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const [search, setSearch] = useState('')

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8fa', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: '0.8125rem' }}>
            <span style={{ color: '#1d63ed', fontWeight: 420, cursor: 'pointer' }}>Explore</span>
            <span style={{ color: 'rgba(0,0,0,0.3)' }}>/</span>
            <span style={{ color: '#111827', fontWeight: 520 }}>Docker Hardened Images</span>
          </div>

          {/* Hero banner */}
          <div style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            background: '#1D63ED',
            marginBottom: 32,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}>
            {/* Wave background */}
            <svg
              viewBox="0 0 1360 295"
              preserveAspectRatio="xMidYMid slice"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              aria-hidden
            >
              <path d="M383.713 278.881C324.404 252.168 256.36 263.986 180.682 286.265C77.143 316.772 -40.6823 366.875 -170 364.722V617.938H458.942C460.847 618.292 462.753 618.646 464.67 619C464.706 618.646 464.729 618.292 464.765 617.938C471.748 540.995 481.548 460.129 468.623 394.768C458.48 343.426 434.299 301.661 383.713 278.881ZM1297.59 430.132C1143.25 451.595 1020.47 504.352 924.833 528.725C865.051 543.954 815.873 548.084 776.235 526.542C754.883 514.941 741.355 498.63 733.638 478.75C708.925 415.109 743.853 314.845 773.111 215.161C807.73 97.1314 834.396 -20.1023 744.657 -74.8257C644.29 -136.028 486.093 -65.4856 314.616 -47.2477C239.684 -39.2742 162.219 -41.2896 85.9369 -68.671C-8.05101 -102.404 -67.8927 -163.016 -108.679 -228.447C-136.268 -272.689 -155.158 -319.135 -170 -360.949V178.931C-153.477 184.988 -136.09 190.169 -117.769 194.338C-80.9713 202.705 -45.0733 205.92 -10.0868 205.408C209.112 202.301 392.129 53.4883 531.519 114.465C645.118 164.164 629.377 309.31 619.316 444.506C614.57 508.196 611.091 569.684 622.985 617.938H1002.01C1039.4 601.372 1079.89 584.776 1124.07 570.136C1208.71 542.076 1306.9 521.164 1422.74 521.233C1482.84 521.273 1544.34 526.955 1603 536.964V436.729C1580.88 432.669 1558.58 429.316 1536.31 426.78C1449.48 416.879 1370.06 420.055 1297.59 430.132ZM1011.35 176.454C881.29 70.979 1232.13 -223.128 1172.44 -379H75.4149C82.3389 -370.82 89.6771 -362.827 97.465 -355.089C132.381 -320.344 176.303 -290.495 232.464 -270.241C483.051 -179.878 747.202 -363.633 891.208 -275.482C1051.16 -177.567 839.533 119.115 874.389 264.163C880.686 290.404 895.066 311.689 921.164 325.926C953.287 343.456 991.729 344.075 1037.05 335.59C1165.89 311.493 1350.32 213.775 1603 221.493V157.243C1321.32 140.843 1102.94 250.733 1011.35 176.454ZM1477.04 -379C1367.27 -239.507 1152.55 -85.1982 1225.41 5.1358C1276.27 68.1966 1421.71 43.5484 1603 48.2873V-379H1477.04Z" fill="white" fillOpacity="0.08" />
            </svg>

            {/* Text content */}
            <div style={{ position: 'relative', padding: '40px 48px 44px' }}>
              <h1 style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                lineHeight: 1.0,
                letterSpacing: '0em',
                color: '#ffffff',
                margin: '0 0 16px',
                textTransform: 'uppercase',
              }}>
                Most Wanted<br />Least Vulnerable
              </h1>
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '1.125rem',
                letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
                lineHeight: 1,
              }}>
                Top Docker images, pre-hardened and ready for serious workloads.
              </p>
            </div>
          </div>

          {/* Search + controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: 420,
                height: 38,
                borderRadius: 6,
                padding: '0 12px',
                background: '#fff',
                border: '1px solid rgba(11,11,15,0.12)',
                transition: 'border-color 0.12s',
              }}
              onFocusCapture={e => e.currentTarget.style.borderColor = '#1d63ed'}
              onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(11,11,15,0.12)'}
            >
              <Search size={15} style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  fontWeight: 420,
                  color: '#0B0B0F',
                }}
              />
            </div>

            <button
              title="Filter"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 6,
                border: '1px solid rgba(11,11,15,0.12)',
                background: '#fff',
                color: 'rgba(0,0,0,0.56)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'border-color 0.12s, color 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(11,11,15,0.28)'; e.currentTarget.style.color = 'rgba(0,0,0,0.8)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(11,11,15,0.12)'; e.currentTarget.style.color = 'rgba(0,0,0,0.56)' }}
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>

          {/* Featured */}
          <div style={{ marginBottom: 40 }}>
            <SectionHeading>Featured</SectionHeading>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}>
              {FEATURED_IMAGES.map(image => (
                <ImageCard key={image.name} image={image} />
              ))}
            </div>
          </div>

          {/* Monitoring & observability */}
          <div style={{ marginBottom: 40 }}>
            <SectionHeading>Monitoring &amp; observability</SectionHeading>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}>
              {MONITORING_IMAGES.map(image => (
                <ImageCard key={image.name} image={image} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
