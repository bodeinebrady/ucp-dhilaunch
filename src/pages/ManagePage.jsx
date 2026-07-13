import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MoreHorizontal, Plus, ChevronDown, X } from 'lucide-react'
import ProtoBar from '../components/ProtoBar'
import Navbar from '../components/Navbar'

// ─── Data ─────────────────────────────────────────────────────────────────────

const IMAGES = [
  {
    id: 'pytorch',
    name: 'acmeinc/dhi-pytorch',
    source: 'dhi.io/pytorch',
    version: 'PyTorch 2.x',
    os: 'debian 13',
    compliance: ['CIS'],
    status: 'active',
    customizations: 1,
    lastSync: '2 hours ago',
    vulns: { c: 0, h: 0, m: 2, l: 8 },
    pulls: '1.2K',
  },
  {
    id: 'node',
    name: 'acmeinc/dhi-node',
    source: 'dhi.io/node',
    version: 'Node.js 25.x',
    os: 'debian 13',
    compliance: ['CIS', 'FIPS', 'STIG'],
    status: 'active',
    customizations: 0,
    lastSync: '4 hours ago',
    vulns: { c: 0, h: 0, m: 0, l: 2 },
    pulls: '3.4K',
  },
  {
    id: 'redis',
    name: 'acmeinc/dhi-redis',
    source: 'dhi.io/redis',
    version: 'Redis 7.x',
    os: 'debian 13',
    compliance: ['CIS'],
    status: 'syncing',
    customizations: 2,
    lastSync: 'Syncing now…',
    vulns: { c: 0, h: 0, m: 0, l: 0 },
    pulls: '892',
  },
  {
    id: 'go',
    name: 'acmeinc/dhi-go',
    source: 'dhi.io/go',
    version: 'Go 1.25.x',
    os: 'debian 13',
    compliance: ['CIS', 'FIPS'],
    status: 'active',
    customizations: 0,
    lastSync: '1 day ago',
    vulns: { c: 0, h: 0, m: 1, l: 3 },
    pulls: '2.1K',
  },
  {
    id: 'rust',
    name: 'acmeinc/dhi-rust',
    source: 'dhi.io/rust',
    version: 'Rust 1.85.x',
    os: 'debian 13',
    compliance: ['CIS', 'FIPS', 'STIG'],
    status: 'error',
    customizations: 0,
    lastSync: 'Sync failed',
    vulns: { c: 0, h: 0, m: 0, l: 0 },
    pulls: '445',
  },
  {
    id: 'tomcat',
    name: 'acmeinc/dhi-tomcat',
    source: 'dhi.io/tomcat',
    version: 'Tomcat 10.x',
    os: 'debian 13',
    compliance: ['CIS'],
    status: 'active',
    customizations: 1,
    lastSync: '6 hours ago',
    vulns: { c: 0, h: 0, m: 0, l: 1 },
    pulls: '678',
  },
  {
    id: 'valkey',
    name: 'acmeinc/dhi-valkey',
    source: 'dhi.io/valkey',
    version: 'Valkey 8.x',
    os: 'debian 13',
    compliance: ['CIS'],
    status: 'stopped',
    customizations: 0,
    lastSync: '3 days ago',
    vulns: { c: 0, h: 0, m: 0, l: 0 },
    pulls: '120',
  },
  {
    id: 'regctl',
    name: 'acmeinc/dhi-regctl',
    source: 'dhi.io/regctl',
    version: 'regctl 0.8.x',
    os: 'debian 13',
    compliance: ['CIS'],
    status: 'active',
    customizations: 3,
    lastSync: '12 hours ago',
    vulns: { c: 0, h: 0, m: 0, l: 0 },
    pulls: '234',
  },
]

const STATUS_CONFIG = {
  active:   { color: '#16a34a', label: 'Active' },
  syncing:  { color: '#d97706', label: 'Syncing' },
  error:    { color: '#dc2626', label: 'Sync failed' },
  stopped:  { color: '#9ca3af', label: 'Stopped' },
}

const COMPLIANCE_COLORS = {
  CIS:  '#1d63ed',
  FIPS: '#7d2eff',
  STIG: '#059669',
}

const FILTERS = ['All', 'Customized', 'FIPS', 'CIS', 'STIG', 'Sync failed']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status]
  const isPulsing = status === 'syncing'
  return (
    <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: cfg.color,
      }} />
      {isPulsing && (
        <div style={{
          position: 'absolute', inset: -2,
          borderRadius: '50%',
          border: `2px solid ${cfg.color}`,
          opacity: 0.4,
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      )}
    </div>
  )
}

function ComplianceChip({ label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '1px 6px', borderRadius: 100,
      fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.04em',
      background: COMPLIANCE_COLORS[label] + '18',
      color: COMPLIANCE_COLORS[label],
      border: `1px solid ${COMPLIANCE_COLORS[label]}33`,
    }}>
      {label}
    </span>
  )
}

function VulnPills({ vulns }) {
  const total = vulns.c + vulns.h + vulns.m + vulns.l
  if (total === 0) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#16a34a' }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M5 8l2.5 2.5L11 5.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        None
      </span>
    )
  }
  const pills = [
    { n: vulns.c, bg: '#dc2626', color: '#fff' },
    { n: vulns.h, bg: '#ef4444', color: '#fff' },
    { n: vulns.m, bg: '#f59e0b', color: '#fff' },
    { n: vulns.l, bg: '#fcd34d', color: '#374151' },
  ].filter(p => p.n > 0)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {pills.map((p, i) => (
        <span key={i} style={{
          minWidth: 20, padding: '0 4px', height: 18,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 3, fontSize: '0.625rem', fontWeight: 700,
          background: p.bg, color: p.color,
        }}>
          {p.n}
        </span>
      ))}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        height: 28, padding: '0 10px', borderRadius: 100,
        fontSize: '0.8125rem', fontWeight: active ? 600 : 420,
        background: active ? '#1d63ed' : '#fff',
        color: active ? '#fff' : '#374151',
        border: `1px solid ${active ? '#1d63ed' : 'rgba(11,11,15,0.14)'}`,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.12s',
      }}
    >
      {label}
    </button>
  )
}

function ActionMenu({ image, onClose }) {
  const navigate = useNavigate()
  const items = [
    { label: 'View repository', action: () => {} },
    { label: 'Customize image', action: () => navigate('/customize') },
    { label: 'View customizations', action: () => {}, disabled: image.customizations === 0 },
    { label: 'Stop mirroring', action: () => {}, danger: true },
  ]
  return (
    <div
      style={{
        position: 'absolute', right: 0, top: '100%', zIndex: 50,
        background: '#fff', border: '1px solid rgba(11,11,15,0.12)',
        borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        minWidth: 180, overflow: 'hidden',
        marginTop: 4,
      }}
      onClick={e => e.stopPropagation()}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => { item.action(); onClose() }}
          disabled={item.disabled}
          style={{
            width: '100%', display: 'block', textAlign: 'left',
            padding: '9px 14px', border: 'none', background: 'transparent',
            fontSize: '0.875rem', cursor: item.disabled ? 'not-allowed' : 'pointer',
            color: item.danger ? '#dc2626' : item.disabled ? '#9ca3af' : '#374151',
            fontFamily: 'inherit',
            borderBottom: i < items.length - 1 ? '1px solid rgba(11,11,15,0.06)' : 'none',
            transition: 'background-color 0.1s',
          }}
          onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.backgroundColor = '#f9fafb' }}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function ImageRow({ image, isNew }) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const statusCfg = STATUS_CONFIG[image.status]

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      style={{
        borderBottom: '1px solid rgba(11,11,15,0.06)',
        background: isNew ? 'rgba(29,99,237,0.03)' : hovered ? '#fafafa' : 'transparent',
        transition: 'background-color 0.1s',
        position: 'relative',
      }}
    >
      {/* Status bar */}
      <td style={{ width: 4, padding: 0 }}>
        <div style={{ width: 4, height: 44, background: statusCfg.color, opacity: image.status === 'stopped' ? 0.3 : 1 }} />
      </td>

      {/* Name + compliance */}
      <td style={{ padding: '0 16px', height: 44, verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontSize: '0.875rem', fontWeight: 600,
                fontFamily: 'ui-monospace, monospace',
                color: '#0B0B0F',
              }}>
                {image.name}
              </span>
              {isNew && (
                <span style={{
                  fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.06em',
                  padding: '1px 6px', borderRadius: 100,
                  background: 'rgba(29,99,237,0.1)', color: '#1d63ed',
                  border: '1px solid rgba(29,99,237,0.2)',
                }}>
                  NEW
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{image.version} · {image.os}</span>
              <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>·</span>
              {image.compliance.map(c => <ComplianceChip key={c} label={c} />)}
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: '0 16px', height: 44, verticalAlign: 'middle', width: 130 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StatusDot status={image.status} />
          <span style={{ fontSize: '0.8125rem', color: image.status === 'error' ? '#dc2626' : '#374151' }}>
            {statusCfg.label}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 1 }}>{image.lastSync}</div>
      </td>

      {/* Customizations */}
      <td style={{ padding: '0 16px', height: 44, verticalAlign: 'middle', width: 140 }}>
        {image.customizations > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
            <span style={{ fontSize: '0.8125rem', color: '#374151' }}>
              {image.customizations} customization{image.customizations !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>—</span>
        )}
      </td>

      {/* Vulnerabilities */}
      <td style={{ padding: '0 16px', height: 44, verticalAlign: 'middle', width: 120 }}>
        <VulnPills vulns={image.vulns} />
      </td>

      {/* Pulls */}
      <td style={{ padding: '0 16px', height: 44, verticalAlign: 'middle', width: 80 }}>
        <span style={{ fontSize: '0.8125rem', color: '#374151' }}>{image.pulls}</span>
      </td>

      {/* Actions */}
      <td style={{ padding: '0 12px 0 0', height: 44, verticalAlign: 'middle', width: 40 }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 4,
              background: menuOpen ? 'rgba(11,11,15,0.06)' : 'transparent',
              border: 'none', cursor: 'pointer',
              color: '#6b7280',
              opacity: hovered || menuOpen ? 1 : 0,
              transition: 'opacity 0.12s, background-color 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(11,11,15,0.06)'}
            onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && <ActionMenu image={image} onClose={() => setMenuOpen(false)} />}
        </div>
      </td>
    </tr>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ManagePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchFocused, setSearchFocused] = useState(false)

  const filtered = IMAGES.filter(img => {
    const matchesSearch = !search ||
      img.name.toLowerCase().includes(search.toLowerCase()) ||
      img.version.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      activeFilter === 'All' ? true :
      activeFilter === 'Customized' ? img.customizations > 0 :
      activeFilter === 'Sync failed' ? img.status === 'error' :
      img.compliance.includes(activeFilter)

    return matchesSearch && matchesFilter
  })

  const totalCustomizations = IMAGES.reduce((sum, img) => sum + img.customizations, 0)
  const activeCount = IMAGES.filter(i => i.status === 'active').length
  const errorCount = IMAGES.filter(i => i.status === 'error').length

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8fa', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
      <ProtoBar label="Manage Hardened Images" />
      <Navbar />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 80px' }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0B0B0F', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Manage Hardened Images
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {IMAGES.length} mirrored · {totalCustomizations} customizations · {activeCount} active
                {errorCount > 0 && (
                  <span style={{ color: '#dc2626', fontWeight: 600 }}> · {errorCount} sync failed</span>
                )}
              </p>
            </div>
            <button
              onClick={() => navigate('/customize')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#1d63ed', color: '#fff',
                border: 'none', borderRadius: 6,
                padding: '9px 18px',
                fontSize: '0.9375rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background-color 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1753d4'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1d63ed'}
            >
              <Plus size={15} />
              Customize image
            </button>
          </div>

          {/* Error banner */}
          {errorCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 8, marginBottom: 20,
              background: 'rgba(220,38,38,0.05)',
              border: '1px solid rgba(220,38,38,0.2)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="1.75" />
                <line x1="12" y1="8" x2="12" y2="12" stroke="#dc2626" strokeWidth="1.75" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#dc2626" />
              </svg>
              <span style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 520 }}>
                <strong>dhi-rust</strong> failed to sync. The upstream image may have changed.
              </span>
              <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'inherit', padding: 0 }}>
                Retry sync
              </button>
            </div>
          )}

          {/* Search + filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: 280, height: 36, borderRadius: 6,
                padding: '0 12px', background: '#fff',
                border: `1px solid ${searchFocused ? '#1d63ed' : 'rgba(11,11,15,0.14)'}`,
                transition: 'border-color 0.12s',
              }}
            >
              <Search size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search images…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.875rem', fontFamily: 'inherit', color: '#0B0B0F' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {FILTERS.map(f => (
                <FilterChip
                  key={f}
                  label={f}
                  active={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                />
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid rgba(11,11,15,0.09)', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(11,11,15,0.08)' }}>
                  <th style={{ width: 4, padding: 0 }} />
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                    Image
                  </th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', width: 130 }}>
                    Status
                  </th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', width: 140 }}>
                    Customizations
                  </th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', width: 120 }}>
                    Vulnerabilities
                  </th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', width: 80 }}>
                    Pulls
                  </th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 0', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>
                        No images match your filters
                      </p>
                      <button
                        onClick={() => { setActiveFilter('All'); setSearch('') }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1d63ed', fontSize: '0.875rem', fontFamily: 'inherit', padding: 0 }}
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : filtered.map((img, i) => (
                  <ImageRow key={img.id} image={img} isNew={img.id === 'pytorch'} />
                ))}
              </tbody>
            </table>

            {/* Table footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px',
              borderTop: '1px solid rgba(11,11,15,0.06)',
              background: '#fafafa',
            }}>
              <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
                {filtered.length} of {IMAGES.length} images
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Rows per page:</span>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  border: '1px solid rgba(11,11,15,0.12)', borderRadius: 4,
                  background: '#fff', padding: '3px 8px', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '0.8125rem', color: '#374151',
                }}>
                  25 <ChevronDown size={12} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
