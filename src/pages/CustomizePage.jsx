import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CheckCircle2, X, ChevronRight, Check, Plus, Trash2 } from 'lucide-react'
import ProtoBar from '../components/ProtoBar'
import Navbar from '../components/Navbar'

// ─── Data ─────────────────────────────────────────────────────────────────────

const WIZARD_STEPS = ['Select base image', 'Add packages', 'Configure settings', 'Review', 'Preview']

const IMAGE_GROUPS = [
  {
    name: 'dhi-pytorch',
    versions: [
      { id: 'pytorch-2x-deb13',      version: 'PyTorch 2.x',        os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: false, user: 'nonroot' },
      { id: 'pytorch-2x-deb13-dev',  version: 'PyTorch 2.x (dev)',   os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: true,  shell: true,  user: 'root'    },
      { id: 'pytorch-2x-deb13-fips', version: 'PyTorch 2.x (fips)',  os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: false, user: 'nonroot' },
      { id: 'pytorch-2x-alp322',     version: 'PyTorch 2.x',        os: 'alpine 3.22', compliance: ['CIS'],                 pkgMgr: false, shell: false, user: 'nonroot' },
      { id: 'pytorch-2x-alp322-dev', version: 'PyTorch 2.x (dev)',   os: 'alpine 3.22', compliance: ['CIS'],                 pkgMgr: true,  shell: true,  user: 'root'    },
    ],
  },
  {
    name: 'dhi-node',
    versions: [
      { id: 'node-deb13',      version: 'Node.js 25.x',        os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: true,  user: 'nonroot' },
      { id: 'node-deb13-dev',  version: 'Node.js 25.x (dev)',  os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: true,  shell: true,  user: 'root'    },
      { id: 'node-deb13-fips', version: 'Node.js 25.x (fips)', os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: true,  user: 'nonroot' },
      { id: 'node-alp322',     version: 'Node.js 25.x',        os: 'alpine 3.22', compliance: ['CIS'],                 pkgMgr: false, shell: false, user: 'nonroot' },
      { id: 'node-alp322-dev', version: 'Node.js 25.x (dev)',  os: 'alpine 3.22', compliance: ['CIS'],                 pkgMgr: true,  shell: true,  user: 'root'    },
    ],
  },
  {
    name: 'dhi-go',
    versions: [
      { id: 'go-deb13',      version: 'Go 1.25.x',        os: 'debian 13', compliance: ['CIS'],                 pkgMgr: false, shell: true, user: 'nonroot' },
      { id: 'go-deb13-dev',  version: 'Go 1.25.x (dev)',  os: 'debian 13', compliance: ['CIS'],                 pkgMgr: true,  shell: true, user: 'root'    },
      { id: 'go-deb13-fips', version: 'Go 1.25.x (fips)', os: 'debian 13', compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: true, user: 'nonroot' },
    ],
  },
  {
    name: 'dhi-tomcat',
    versions: [
      { id: 'tomcat-deb13',      version: 'Tomcat 10.x',        os: 'debian 13', compliance: ['CIS'],                 pkgMgr: false, shell: true, user: 'nonroot' },
    ],
  },
  {
    name: 'dhi-valkey',
    versions: [
      { id: 'valkey-deb13', version: 'Valkey 8.x', os: 'debian 13', compliance: ['CIS'], pkgMgr: false, shell: false, user: 'nonroot' },
    ],
  },
  {
    name: 'dhi-redis',
    versions: [
      { id: 'redis-deb13',      version: 'Redis 7.x',        os: 'debian 13', compliance: ['CIS'],                 pkgMgr: false, shell: false, user: 'nonroot' },
      { id: 'redis-deb13-fips', version: 'Redis 7.x (fips)', os: 'debian 13', compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: false, user: 'nonroot' },
    ],
  },
  {
    name: 'dhi-rust',
    versions: [
      { id: 'rust-deb13',      version: 'Rust 1.85.x',        os: 'debian 13', compliance: ['CIS'],                 pkgMgr: false, shell: true, user: 'nonroot' },
      { id: 'rust-deb13-fips', version: 'Rust 1.85.x (fips)', os: 'debian 13', compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: true, user: 'nonroot' },
    ],
  },
  {
    name: 'dhi-regctl',
    versions: [
      { id: 'regctl-deb13', version: 'regctl 0.8.x', os: 'debian 13', compliance: ['CIS'], pkgMgr: false, shell: false, user: 'nonroot' },
    ],
  },
]

const AVAILABLE_PACKAGES = [
  { name: 'ping',            desc: 'Send ICMP echo requests to network hosts' },
  { name: 'vim',             desc: 'Highly configurable text editor' },
  { name: 'curl',            desc: 'Command line tool for transferring data' },
  { name: 'wget',            desc: 'Non-interactive network downloader' },
  { name: 'jq',              desc: 'Lightweight command-line JSON processor' },
  { name: 'openssl',         desc: 'Cryptography and SSL/TLS toolkit' },
  { name: 'ca-certificates', desc: 'Common CA certificates for SSL/TLS' },
  { name: 'git',             desc: 'Fast distributed version control system' },
  { name: 'unzip',           desc: 'De-archiver for .zip files' },
  { name: 'net-tools',       desc: 'Networking tools including ifconfig and netstat' },
  { name: 'dnsutils',        desc: 'DNS lookup utilities including dig and nslookup' },
  { name: 'procps',          desc: 'Utilities for process monitoring (ps, top, free)' },
]

// ─── Design tokens ────────────────────────────────────────────────────────────

const CARD = {
  border: '1px solid rgba(11,11,15,0.12)',
  borderRadius: 8,
  background: '#fff',
  overflow: 'hidden',
}

const DIVIDER = '1px solid rgba(11,11,15,0.08)'

// ─── Shared primitives ────────────────────────────────────────────────────────

function SearchInput({ placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          paddingLeft: 32, paddingRight: 12,
          height: 38, borderRadius: 6,
          border: `1px solid ${focused ? '#1d63ed' : 'rgba(11,11,15,0.14)'}`,
          fontSize: '0.875rem', fontFamily: 'inherit',
          outline: 'none', color: '#0B0B0F',
          background: '#fff',
          transition: 'border-color 0.12s',
        }}
      />
    </div>
  )
}

function TextInput({ placeholder, value, onChange, mono, flex }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        flex: flex ?? 1, height: 38,
        padding: '0 10px', borderRadius: 6,
        border: `1px solid ${focused ? '#1d63ed' : 'rgba(11,11,15,0.14)'}`,
        fontSize: '0.875rem',
        fontFamily: mono ? 'ui-monospace, monospace' : 'inherit',
        outline: 'none', color: '#0B0B0F',
        background: '#fff',
        transition: 'border-color 0.12s',
      }}
    />
  )
}

function SelectedLabel({ children }) {
  return (
    <span style={{
      fontSize: '0.6875rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      color: '#9ca3af',
    }}>
      {children}
    </span>
  )
}

function ComplianceChip({ label }) {
  const colors = {
    CIS:  { bg: '#1d63ed', text: '#fff' },
    FIPS: { bg: '#7d2eff', text: '#fff' },
    STIG: { bg: '#059669', text: '#fff' },
  }
  const c = colors[label] || { bg: '#6b7280', text: '#fff' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '1px 6px', borderRadius: 100,
      fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.04em',
      background: c.bg, color: c.text,
    }}>
      {label}
    </span>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0B0B0F', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  )
}

function SectionSubtitle({ children }) {
  return (
    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 20px', lineHeight: 1.5 }}>
      {children}
    </p>
  )
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step, onGoTo }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
      {WIZARD_STEPS.map((label, i) => {
        const isCompleted = i < step
        const isActive = i === step
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={isCompleted ? () => onGoTo(i) : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', border: 'none', padding: '0 4px',
                cursor: isCompleted ? 'pointer' : 'default',
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0,
                background: isActive ? '#1d63ed' : isCompleted ? 'rgba(29,99,237,0.15)' : '#f3f4f6',
                color: isActive ? '#fff' : isCompleted ? '#1d63ed' : '#9ca3af',
                transition: 'background 0.15s',
              }}>
                {isCompleted ? <CheckCircle2 size={13} /> : i + 1}
              </span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 420,
                color: isActive ? '#0B0B0F' : isCompleted ? '#1d63ed' : '#9ca3af',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </button>
            {i < WIZARD_STEPS.length - 1 && (
              <div style={{
                width: 32, height: 1, flexShrink: 0, margin: '0 4px',
                background: i < step ? 'rgba(29,99,237,0.3)' : '#e5e7eb',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Select base image ────────────────────────────────────────────────

function ShieldBlue() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1d63ed" style={{ flexShrink: 0 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function Step1({ selectedIds, onToggle, search, onSearch, expandedGroups, onToggleGroup }) {
  const filtered = IMAGE_GROUPS.filter(g =>
    !search ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.versions.some(v => v.version.toLowerCase().includes(search.toLowerCase()) || v.os.toLowerCase().includes(search.toLowerCase()))
  )

  // Build selected panel data: grouped by image name
  const selectedGroups = IMAGE_GROUPS
    .map(g => ({ name: g.name, versions: g.versions.filter(v => selectedIds.has(v.id)) }))
    .filter(g => g.versions.length > 0)

  const totalVersions = Array.from(selectedIds).length
  const totalImages = selectedGroups.length

  return (
    <div>
      <SectionHeading>Select base image or chart</SectionHeading>
      <SectionSubtitle>Browse all base images and select the versions you need. Your selections appear on the right.</SectionSubtitle>

      <div style={{ ...CARD }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Left: catalog */}
        <div style={{ flex: '0 0 56%', display: 'flex', flexDirection: 'column', borderRight: DIVIDER }}>
          {/* Search — left column only */}
          <div style={{ padding: '10px 12px', borderBottom: DIVIDER, flexShrink: 0 }}>
            <SearchInput placeholder="Search base images…" value={search} onChange={onSearch} />
          </div>
          <div>
            {filtered.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, fontSize: '0.875rem', color: '#9ca3af' }}>
                No images match "{search}"
              </div>
            ) : filtered.map((group, gi) => {
              const isExpanded = search.length > 0 || expandedGroups.has(group.name)
              const selectedCount = group.versions.filter(v => selectedIds.has(v.id)).length
              const hasSelection = selectedCount > 0

              return (
                <div key={group.name} style={{ borderTop: gi > 0 ? '1px solid rgba(11,11,15,0.08)' : 'none' }}>
                  {/* Group row */}
                  <button
                    onClick={() => { if (!search) onToggleGroup(group.name) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 14px', background: hasSelection ? 'rgba(29,99,237,0.03)' : '#fff',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      outline: hasSelection ? '1.5px solid #1d63ed' : 'none',
                      outlineOffset: -1,
                    }}
                  >
                    <ChevronRight size={14} style={{ color: '#9ca3af', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: '#0B0B0F' }}>{group.name}</span>
                    {selectedCount > 0 && (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#1d63ed', background: 'rgba(29,99,237,0.1)', borderRadius: 100, padding: '2px 8px', border: '1px solid rgba(29,99,237,0.25)' }}>
                        {selectedCount}
                      </span>
                    )}
                    <span style={{ fontSize: '0.8125rem', color: '#9ca3af', flexShrink: 0 }}>{group.versions.length} ver.</span>
                  </button>

                  {/* Version rows */}
                  {isExpanded && group.versions.map(img => {
                    const checked = selectedIds.has(img.id)
                    return (
                      <label
                        key={img.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 14px 9px 44px', cursor: 'pointer',
                          background: checked ? 'rgba(29,99,237,0.04)' : '#fafafa',
                          borderTop: '1px solid rgba(11,11,15,0.06)',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(img.id)}
                          style={{ width: 14, height: 14, accentColor: '#1d63ed', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 520, color: '#0B0B0F' }}>{img.version}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{img.os}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                          {img.compliance.map(c => <ComplianceChip key={c} label={c} />)}
                        </div>
                      </label>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: selected panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: DIVIDER, flexShrink: 0 }}>
              <SelectedLabel>Selected</SelectedLabel>
              {totalVersions > 0 && (
                <span style={{ fontSize: '0.8125rem', color: '#1d63ed', fontWeight: 520 }}>
                  {totalVersions} version{totalVersions !== 1 ? 's' : ''} · {totalImages} image{totalImages !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {totalVersions === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120, fontSize: '0.8125rem', color: '#9ca3af', textAlign: 'center', padding: '0 16px' }}>
                Select versions from the catalog
              </div>
            ) : (
              <div>
                {selectedGroups.map((group, gi) => (
                  <div key={group.name} style={{ borderTop: gi > 0 ? DIVIDER : 'none' }}>
                    {/* Group header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px 6px' }}>
                      <ShieldBlue />
                      <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: '#0B0B0F' }}>{group.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{group.versions.length} version{group.versions.length !== 1 ? 's' : ''}</span>
                    </div>
                    {/* Version rows */}
                    {group.versions.map(v => (
                      <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px 7px 38px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.875rem', color: '#0B0B0F' }}>{v.version}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{v.os}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                          {v.compliance.map(c => <ComplianceChip key={c} label={c} />)}
                        </div>
                        <button onClick={() => onToggle(v.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex', flexShrink: 0 }}>
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Add packages & artifacts ────────────────────────────────────────

const OCI_ARTIFACTS = [
  { name: 'moby/dhi-temporalio-admin-tools', tags: ['1.29.4-debian13-fips', '1.29-debian13-fips', '1.28-debian13', '1.28.3-debian13'] },
  { name: 'moby/dhi-airflow',                tags: ['2.10-debian13', '2.9-debian13-fips', '2.10.4-debian13'] },
  { name: 'moby/dhi-argocd',                 tags: ['2.14-debian13', '2.13-debian13-fips'] },
  { name: 'moby/dhi-flyway',                 tags: ['11-debian13', '10.22-debian13-fips'] },
  { name: 'moby/dhi-haproxy',                tags: ['3.1-debian13', '3.0-debian13-fips'] },
  { name: 'moby/ca-certs',                   tags: ['latest', '2024.12'] },
  { name: 'moby/internal-packages',          tags: ['latest', '1.2.0', '1.1.0'] },
]

function CollapsibleSection({ icon, label, expanded, onToggle, children }) {
  return (
    <div style={{ ...CARD, marginBottom: 12 }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.12s' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
      >
        {icon && <span style={{ color: '#374151', flexShrink: 0 }}>{icon}</span>}
        <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 600, color: '#0B0B0F' }}>{label}</span>
        <ChevronRight size={16} style={{ color: '#9ca3af', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
      </button>
      {expanded && (
        <div style={{ borderTop: DIVIDER }}>
          {children}
        </div>
      )}
    </div>
  )
}

function ArchiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}

function Step2({ selectedPackages, onTogglePackage, search, onSearch }) {
  const [packagesOpen, setPackagesOpen] = useState(true)
  const [ociOpen, setOciOpen] = useState(false)
  const [scriptsOpen, setScriptsOpen] = useState(false)

  // OCI state
  const [ociSearch, setOciSearch] = useState('')
  const [selectedArtifacts, setSelectedArtifacts] = useState([])

  function toggleArtifact(name) {
    setSelectedArtifacts(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    )
  }

  // Scripts state
  const [scriptInput, setScriptInput] = useState('')
  const [scripts, setScripts] = useState([])

  function addScript() {
    const trimmed = scriptInput.trim()
    if (trimmed && !scripts.includes(trimmed)) {
      setScripts(prev => [...prev, trimmed])
      setScriptInput('')
    }
  }

  const filteredOci = OCI_ARTIFACTS.filter(a =>
    !ociSearch || a.name.toLowerCase().includes(ociSearch.toLowerCase())
  )

  const filtered = AVAILABLE_PACKAGES.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase())
  )

  const PANEL_H = 380

  return (
    <div>
      <SectionHeading>Add packages &amp; artifacts</SectionHeading>
      <SectionSubtitle>Add custom packages as an OCI artifact or choose from a predefined list.</SectionSubtitle>

      {/* Packages section */}
      <CollapsibleSection
        label="Packages"
        expanded={packagesOpen}
        onToggle={() => setPackagesOpen(o => !o)}
      >
        <div style={{ display: 'flex', gap: 0, height: PANEL_H }}>
          {/* Left: search + list */}
          <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(11,11,15,0.08)' }}>
            {/* Search */}
            <div style={{ padding: '10px 12px', borderBottom: DIVIDER, flexShrink: 0 }}>
              <SearchInput placeholder="Search packages…" value={search} onChange={onSearch} />
            </div>
            {/* Package list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.map((pkg, i) => {
                const checked = selectedPackages.includes(pkg.name)
                return (
                  <label
                    key={pkg.name}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', cursor: 'pointer', background: checked ? 'rgba(29,99,237,0.03)' : 'transparent', borderBottom: i < filtered.length - 1 ? '1px solid rgba(11,11,15,0.07)' : 'none' }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onTogglePackage(pkg.name)}
                      style={{ width: 14, height: 14, accentColor: '#1d63ed', flexShrink: 0, marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B0B0F', fontFamily: 'ui-monospace, monospace' }}>{pkg.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: 2 }}>{pkg.desc}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Right: selected panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 14px', borderBottom: DIVIDER, flexShrink: 0 }}>
              <SelectedLabel>Selected</SelectedLabel>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {selectedPackages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: '#9ca3af' }}>
                  <ArchiveIcon />
                  <span style={{ fontSize: '0.875rem' }}>No packages selected</span>
                </div>
              ) : (
                selectedPackages.map((p, i) => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderBottom: i < selectedPackages.length - 1 ? '1px solid rgba(11,11,15,0.07)' : 'none' }}>
                    <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, fontFamily: 'ui-monospace, monospace', color: '#0B0B0F' }}>{p}</span>
                    <button onClick={() => onTogglePackage(p)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex', flexShrink: 0 }}>
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* OCI artifacts section */}
      <CollapsibleSection
        label="OCI artifacts"
        expanded={ociOpen}
        onToggle={() => setOciOpen(o => !o)}
      >
        <div style={{ display: 'flex', height: PANEL_H }}>
          {/* Left: search + list */}
          <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', borderRight: DIVIDER }}>
            <div style={{ padding: '10px 12px', borderBottom: DIVIDER, flexShrink: 0 }}>
              <SearchInput placeholder="Search OCI images…" value={ociSearch} onChange={setOciSearch} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredOci.map((artifact, i) => {
                const checked = selectedArtifacts.includes(artifact.name)
                return (
                  <label
                    key={artifact.name}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 14px', background: checked ? 'rgba(29,99,237,0.04)' : 'transparent',
                      borderBottom: i < filteredOci.length - 1 ? DIVIDER : 'none',
                      cursor: 'pointer', boxSizing: 'border-box',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArtifact(artifact.name)}
                      style={{ width: 14, height: 14, accentColor: '#1d63ed', flexShrink: 0 }}
                    />
                    <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: '#0B0B0F' }}>{artifact.name}</span>
                    <span style={{ fontSize: '0.8125rem', color: '#9ca3af', flexShrink: 0 }}>{artifact.tags.length} tags</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Right: selected */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 14px', borderBottom: DIVIDER, flexShrink: 0 }}>
              <SelectedLabel>Selected</SelectedLabel>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {selectedArtifacts.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 8, color: '#9ca3af' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span style={{ fontSize: '0.875rem' }}>No artifacts selected</span>
                </div>
              ) : selectedArtifacts.map((name, i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderBottom: i < selectedArtifacts.length - 1 ? DIVIDER : 'none' }}>
                  <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, fontFamily: 'ui-monospace, monospace', color: '#0B0B0F' }}>{name}</span>
                  <button onClick={() => toggleArtifact(name)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Scripts section */}
      <CollapsibleSection
        label="Scripts"
        expanded={scriptsOpen}
        onToggle={() => setScriptsOpen(o => !o)}
      >
        <div style={{ padding: '16px' }}>
          {/* Input row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: DIVIDER.replace('1px', '1px'), borderRadius: 6, overflow: 'hidden', background: '#fff', border: '1px solid rgba(11,11,15,0.14)' }}>
            <input
              type="text"
              placeholder="Add a script path"
              value={scriptInput}
              onChange={e => setScriptInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addScript() }}
              style={{
                flex: 1, height: 40, padding: '0 12px',
                border: 'none', outline: 'none',
                fontSize: '0.875rem', fontFamily: 'ui-monospace, monospace',
                color: '#0B0B0F', background: 'transparent',
              }}
            />
            <button
              onClick={addScript}
              style={{
                height: 40, padding: '0 16px',
                background: 'transparent', border: 'none',
                borderLeft: '1px solid rgba(11,11,15,0.14)',
                cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                color: '#1d63ed', fontFamily: 'inherit',
              }}
            >
              Add
            </button>
          </div>

          {/* Added scripts */}
          {scripts.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {scripts.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6, background: '#f8f8fa', border: '1px solid rgba(11,11,15,0.08)' }}>
                  <span style={{ flex: 1, fontSize: '0.875rem', fontFamily: 'ui-monospace, monospace', color: '#374151' }}>{s}</span>
                  <button onClick={() => setScripts(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  )
}

// ─── Step 3: Configure settings ───────────────────────────────────────────────

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 36, height: 20, borderRadius: 100,
        background: on ? '#1d63ed' : '#d1d5db',
        border: 'none', cursor: 'pointer', padding: 0,
        position: 'relative', flexShrink: 0,
        transition: 'background 0.15s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: on ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

function SettingCard({ label, rows, onRowChange, onAddRow, onRemoveRow, imageCount }) {
  const [enabled, setEnabled] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  function handleToggle() {
    if (!enabled) {
      setShowWarning(true)
    } else {
      setEnabled(false)
    }
  }

  function handleConfirm() {
    setEnabled(true)
    setShowWarning(false)
  }

  return (
    <>
      {/* Warning modal */}
      {showWarning && (
        <div
          onClick={() => setShowWarning(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(11,11,15,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 12,
              maxWidth: 440, width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Amber header strip */}
            <div style={{
              background: 'rgba(234,160,0,0.08)',
              borderBottom: '1px solid rgba(234,160,0,0.2)',
              padding: '20px 24px 16px',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(234,160,0,0.12)',
                border: '1px solid rgba(234,160,0,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="#e8a100" />
                  <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="1" fill="white" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', margin: '0 0 4px' }}>
                  Enable {label}?
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0, lineHeight: 1.4, fontWeight: 520 }}>
                  This will affect all {imageCount} image{imageCount !== 1 ? 's' : ''} in this customization.
                </p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
                The value you set will be applied identically to every image in this customization.
                If a base image already defines <strong>{label}</strong>, it will be overridden —
                which may cause unexpected behaviour in images that depend on that value.
              </p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
                To set different values per image, save this customization and create separate
                customizations for the affected images.
              </p>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              padding: '0 24px 20px',
            }}>
              <button
                onClick={() => setShowWarning(false)}
                style={{
                  background: 'transparent', border: '1px solid rgba(11,11,15,0.14)',
                  borderRadius: 6, padding: '8px 18px',
                  fontSize: '0.875rem', fontWeight: 520, color: '#374151',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  background: '#e8a100', color: '#fff',
                  border: 'none', borderRadius: 6, padding: '8px 18px',
                  fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d49200'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e8a100'}
              >
                Enable anyway
              </button>
            </div>
          </div>
        </div>
      )}

    <div style={{ ...CARD, marginBottom: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: DIVIDER }}>
        <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0B0B0F' }}>{label}</span>
        <Toggle on={enabled} onToggle={handleToggle} />
      </div>

      {/* Rows */}
      <div style={{ padding: '12px 16px', opacity: enabled ? 1 : 0.35, pointerEvents: enabled ? 'auto' : 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: DIVIDER, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center',
                borderBottom: i < rows.length - 1 ? DIVIDER : 'none',
              }}
            >
              <input
                type="text"
                placeholder="Key"
                value={row.key}
                onChange={e => onRowChange(i, 'key', e.target.value)}
                style={{
                  flex: 1, height: 40, padding: '0 12px',
                  border: 'none', outline: 'none',
                  fontSize: '0.875rem', fontFamily: 'ui-monospace, monospace',
                  color: '#0B0B0F', background: 'transparent',
                  borderRight: '1px solid rgba(11,11,15,0.08)',
                }}
              />
              <input
                type="text"
                placeholder="Value"
                value={row.value}
                onChange={e => onRowChange(i, 'value', e.target.value)}
                style={{
                  flex: 2, height: 40, padding: '0 12px',
                  border: 'none', outline: 'none',
                  fontSize: '0.875rem', fontFamily: 'ui-monospace, monospace',
                  color: '#0B0B0F', background: 'transparent',
                }}
              />
              <button
                onClick={() => onRemoveRow(i)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '0 12px', height: 40, display: 'flex', alignItems: 'center', flexShrink: 0 }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

          <button
            onClick={onAddRow}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '0.875rem', fontFamily: 'inherit', padding: 0, transition: 'color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#374151'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            Add
          </button>
      </div>
    </div>
    </>
  )
}

function Step3({ envVars, onEnvChange, onAddEnv, onRemoveEnv, imageCount }) {
  const [labelRows, setLabelRows] = useState([{ key: '', value: '' }])
  const [annotationRows, setAnnotationRows] = useState([{ key: '', value: '' }])

  function changeRow(setter, i, field, val) {
    setter(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r))
  }
  function addRow(setter) {
    setter(prev => [...prev, { key: '', value: '' }])
  }
  function removeRow(setter, i) {
    setter(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : [{ key: '', value: '' }])
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <SectionHeading>Configure image settings</SectionHeading>
      <SectionSubtitle>Define labels, annotations, and environment variables for your selected images.</SectionSubtitle>

      <SettingCard
        label="ENV variables"
        rows={envVars}
        onRowChange={(i, f, v) => onEnvChange(i, f, v)}
        onAddRow={onAddEnv}
        onRemoveRow={(i) => onRemoveEnv(i)}
        imageCount={imageCount}
      />
      <SettingCard
        label="Labels"
        rows={labelRows}
        onRowChange={(i, f, v) => changeRow(setLabelRows, i, f, v)}
        onAddRow={() => addRow(setLabelRows)}
        onRemoveRow={(i) => removeRow(setLabelRows, i)}
        imageCount={imageCount}
      />
      <SettingCard
        label="Annotations"
        rows={annotationRows}
        onRowChange={(i, f, v) => changeRow(setAnnotationRows, i, f, v)}
        onAddRow={() => addRow(setAnnotationRows)}
        onRemoveRow={(i) => removeRow(setAnnotationRows, i)}
        imageCount={imageCount}
      />
    </div>
  )
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function ReviewSectionHeader({ icon, label, onEdit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 20px', borderBottom: DIVIDER }}>
      {icon && <span style={{ color: '#6b7280', flexShrink: 0 }}>{icon}</span>}
      <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 600, color: '#0B0B0F' }}>{label}</span>
      <button onClick={onEdit} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
        <PencilIcon />
      </button>
    </div>
  )
}

function ReviewRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '11px 20px', borderBottom: DIVIDER }}>
      <span style={{ width: 140, flexShrink: 0, fontSize: '0.875rem', color: '#6b7280' }}>{label}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function NoneAdded() {
  return <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontStyle: 'italic' }}>None added</span>
}

function InheritValue() {
  return <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontStyle: 'italic' }}>Inherit from base image</span>
}

function Step4({ selectedIds, selectedPackages, envVars, onGoTo }) {
  const selectedVersions = IMAGE_GROUPS.flatMap(g => g.versions.filter(v => selectedIds.has(v.id)))
  const filledEnvVars = envVars.filter(r => r.key.trim())

  // Group selected versions by image name
  const selectedGroups = IMAGE_GROUPS
    .map(g => ({ name: g.name, versions: g.versions.filter(v => selectedIds.has(v.id)) }))
    .filter(g => g.versions.length > 0)

  return (
    <div style={{ maxWidth: 900 }}>
      <SectionHeading>Review configuration</SectionHeading>
      <SectionSubtitle>Review your selections before saving.</SectionSubtitle>

      <div style={{ ...CARD }}>

        {/* Base image section */}
        <ReviewSectionHeader
          label="Base image"
          onEdit={() => onGoTo(0)}
        />
        {selectedGroups.length === 0 ? (
          <div style={{ padding: '12px 20px' }}><NoneAdded /></div>
        ) : selectedGroups.map(group =>
          group.versions.map(v => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: DIVIDER, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: '#0B0B0F', minWidth: 120 }}>{group.name}</span>
              <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1 }}>{v.version}</span>
              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', border: '1px solid rgba(11,11,15,0.14)', color: '#374151', flexShrink: 0 }}>{v.os}</span>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {v.compliance.map(c => <ComplianceChip key={c} label={c} />)}
              </div>
            </div>
          ))
        )}

        {/* Packages & artifacts section */}
        <ReviewSectionHeader
          label="Packages & artifacts"
          onEdit={() => onGoTo(1)}
        />
        <ReviewRow label="Packages">
          {selectedPackages.length === 0 ? <NoneAdded /> : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {selectedPackages.map(p => (
                <span key={p} style={{ padding: '2px 8px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, background: '#f3f4f6', color: '#374151', fontFamily: 'ui-monospace, monospace' }}>{p}</span>
              ))}
            </div>
          )}
        </ReviewRow>
        <ReviewRow label="OCI artifacts"><NoneAdded /></ReviewRow>
        <ReviewRow label="Scripts"><NoneAdded /></ReviewRow>

        {/* Settings section */}
        <ReviewSectionHeader
          label="Settings"
          onEdit={() => onGoTo(2)}
        />
        <ReviewRow label="ENV variables">
          {filledEnvVars.length === 0 ? <InheritValue /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filledEnvVars.map((r, i) => (
                <span key={i} style={{ fontSize: '0.875rem', fontFamily: 'ui-monospace, monospace', color: '#374151' }}>
                  <strong>{r.key}</strong> = {r.value}
                </span>
              ))}
            </div>
          )}
        </ReviewRow>
        <ReviewRow label="Labels"><InheritValue /></ReviewRow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '11px 20px' }}>
          <span style={{ width: 140, flexShrink: 0, fontSize: '0.875rem', color: '#6b7280' }}>Annotations</span>
          <div style={{ flex: 1 }}><InheritValue /></div>
        </div>

      </div>
    </div>
  )
}

// ─── Step 5: Preview ──────────────────────────────────────────────────────────

const PREVIEW_STAGES = ['Fetching config', 'Resolving artifacts', 'Computing preview']

// Clean build mock data
const CLEAN_ENV = [
  { name: 'DEBIAN_FRONTEND',    value: 'noninteractive',                                   origin: 'Yours' },
  { name: 'SSL_CERT_DIR',       value: '/etc/ssl/certs',                                   origin: 'Yours' },
  { name: 'HTTP_PROXY',         value: 'http://proxy.acme.internal:3128',                  origin: 'Yours' },
  { name: 'HTTPS_PROXY',        value: 'http://proxy.acme.internal:3128',                  origin: 'Yours' },
  { name: 'LANG',               value: 'C.UTF-8',                                          origin: 'Tag definition' },
  { name: 'PYTHON_VERSION',     value: '3.13.2',                                           origin: 'Tag definition' },
  { name: 'PYTHONUNBUFFERED',   value: '1',                                                origin: 'Tag definition' },
  { name: 'PATH',               value: '/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin', origin: 'Default' },
]

const CLEAN_SETTINGS = [
  { label: 'CMD',        value: '["python3"]',                          origin: 'Tag definition' },
  { label: 'ENTRYPOINT', value: '/usr/local/bin/docker-entrypoint.sh',  origin: 'Tag definition' },
  { label: 'User',       value: 'nonroot:nonroot',                      origin: 'Yours' },
]

const CLEAN_LABELS = [
  { key: 'com.acme.team',                          value: 'platform-eng',                     origin: 'Yours' },
  { key: 'com.acme.compliance',                    value: 'stig-v2',                          origin: 'Yours' },
  { key: 'com.docker.hardened',                    value: 'true',                             origin: 'Tag definition' },
  { key: 'org.opencontainers.image.vendor',        value: 'Docker Inc.',                      origin: 'Tag definition' },
  { key: 'org.opencontainers.image.title',         value: 'Docker Hardened PyTorch',          origin: 'Tag definition' },
  { key: 'org.opencontainers.image.version',       value: '2.7.0-r3',                         origin: 'Tag definition' },
]

function originStyle(origin) {
  if (origin === 'Yours') return { color: '#0B0B0F', fontWeight: 520 }
  if (origin === 'OCI artifact') return { color: '#1d63ed', background: 'rgba(29,99,237,0.08)', padding: '1px 6px', borderRadius: 4, border: '1px solid rgba(29,99,237,0.2)' }
  if (origin === 'Override') return { color: '#374151', background: 'rgba(11,11,15,0.04)', padding: '1px 6px', borderRadius: 4, border: '1px solid rgba(11,11,15,0.08)' }
  return { color: '#9ca3af' }
}

function ConfigTable({ rows, keyLabel = 'Variable', keyWidth = 200 }) {
  return (
    <div>
      {/* Column headers */}
      <div style={{ display: 'flex', gap: 16, padding: '6px 20px', borderBottom: DIVIDER }}>
        <span style={{ width: keyWidth, flexShrink: 0, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af' }}>{keyLabel}</span>
        <span style={{ flex: 1, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af' }}>Value</span>
        <span style={{ width: 100, flexShrink: 0, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', textAlign: 'right' }}>Origin</span>
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 20px', borderBottom: i < rows.length - 1 ? '1px solid rgba(11,11,15,0.05)' : 'none', background: i % 2 === 1 ? 'rgba(11,11,15,0.014)' : 'transparent' }}>
          <span style={{ width: keyWidth, flexShrink: 0, fontSize: '0.8125rem', fontFamily: 'ui-monospace, monospace', color: '#0B0B0F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.name || row.label || row.key}
          </span>
          <span style={{ flex: 1, fontSize: '0.8125rem', fontFamily: 'ui-monospace, monospace', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.value || row.effectiveValue}
          </span>
          <span style={{ width: 100, flexShrink: 0, fontSize: '0.75rem', textAlign: 'right', ...originStyle(row.origin) }}>
            {row.origin}
          </span>
        </div>
      ))}
    </div>
  )
}

function CollapsibleConfigSection({ label, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: DIVIDER }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.12s' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0B0B0F', flex: 1 }}>{label}</span>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{count}</span>
        <ChevronRight size={14} style={{ color: '#9ca3af', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
      </button>
      {open && children}
    </div>
  )
}

function Step5() {
  const [stage, setStage] = useState(0) // 0=loading, 1=done
  const [stageLabel, setStageLabel] = useState(0)
  const [hideInherited, setHideInherited] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setStageLabel(1), 1800)
    const t2 = setTimeout(() => setStageLabel(2), 3600)
    const t3 = setTimeout(() => setStage(1), 5400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const envRows = hideInherited ? CLEAN_ENV.filter(r => r.origin === 'Yours') : CLEAN_ENV
  const settingRows = hideInherited ? CLEAN_SETTINGS.filter(r => r.origin === 'Yours') : CLEAN_SETTINGS
  const labelRows = hideInherited ? CLEAN_LABELS.filter(r => r.origin === 'Yours') : CLEAN_LABELS

  if (stage === 0) {
    return (
      <div style={{ maxWidth: 900 }}>
        <SectionHeading>Build preview</SectionHeading>
        <SectionSubtitle>See how your customizations will resolve before committing to a build. No changes are made.</SectionSubtitle>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes shimmer { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
        `}</style>
        <div style={{ ...CARD }}>
          {/* Card header with stage indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: DIVIDER }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662"/>
            </svg>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0B0B0F', flex: 1 }}>Environment preview</span>
            {/* Stage indicators inline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {PREVIEW_STAGES.map((s, i) => {
                const isDone = i < stageLabel
                const isCurrent = i === stageLabel
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {i > 0 && <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>→</span>}
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="8" cy="8" r="7" stroke="#2e7f74" strokeWidth="1.5"/>
                        <path d="M5 8l2.5 2.5L11 5.5" stroke="#2e7f74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : isCurrent ? (
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(29,99,237,0.2)', borderTopColor: '#1d63ed', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                    ) : null}
                    <span style={{ fontSize: '0.8125rem', color: isCurrent ? '#0B0B0F' : isDone ? '#6b7280' : '#d1d5db', fontWeight: isCurrent ? 600 : 420, whiteSpace: 'nowrap' }}>{s}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Skeleton rows */}
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[180, 240, 200, 160, 220, 190, 170, 210].map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: w * 0.6, height: 12, borderRadius: 4, background: '#e5e7eb', animation: `shimmer ${1.2 + i * 0.1}s ease-in-out infinite` }} />
                <div style={{ flex: 1, height: 12, borderRadius: 4, background: '#e5e7eb', animation: `shimmer ${1.4 + i * 0.1}s ease-in-out infinite` }} />
                <div style={{ width: 80, height: 12, borderRadius: 4, background: '#e5e7eb', animation: `shimmer ${1.6 + i * 0.1}s ease-in-out infinite` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <SectionHeading>Preview build</SectionHeading>
      <SectionSubtitle>Full config — Clean build. Review the computed configuration before running.</SectionSubtitle>

      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(46,127,116,0.06)', border: '1px solid rgba(46,127,116,0.2)', marginBottom: 16 }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" fill="#2e7f74" />
          <path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a5c55', flex: 1 }}>Build looks good — no conflicts detected</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Hide inherited</span>
          <input type="checkbox" checked={hideInherited} onChange={e => setHideInherited(e.target.checked)} style={{ accentColor: '#1d63ed', width: 14, height: 14 }} />
        </label>
      </div>

      {/* Config card */}
      <div style={{ ...CARD }}>
        <CollapsibleConfigSection label="Image settings" count={settingRows.length}>
          <ConfigTable rows={settingRows} keyLabel="Field" keyWidth={140} />
        </CollapsibleConfigSection>

        <CollapsibleConfigSection label="Environment variables" count={envRows.length}>
          <ConfigTable rows={envRows} keyLabel="Variable" keyWidth={220} />
        </CollapsibleConfigSection>

        <CollapsibleConfigSection label="Labels" count={labelRows.length} defaultOpen={false}>
          <ConfigTable rows={labelRows} keyLabel="Label" keyWidth={280} />
        </CollapsibleConfigSection>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CustomizePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  // Step 1
  const [selectedIds, setSelectedIds] = useState(new Set(['pytorch-2x-deb13']))
  const [catalogSearch, setCatalogSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState(new Set(['dhi-pytorch']))

  // Step 2
  const [selectedPackages, setSelectedPackages] = useState([])
  const [packageSearch, setPackageSearch] = useState('')

  // Step 3
  const [envVars, setEnvVars] = useState([{ key: '', value: '' }])

  function toggleId(id) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleGroup(name) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  function togglePackage(name) {
    setSelectedPackages(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    )
  }

  function handleEnvChange(i, field, val) {
    setEnvVars(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r))
  }

  function addEnv() {
    setEnvVars(prev => [...prev, { key: '', value: '' }])
  }

  function removeEnv(i) {
    setEnvVars(prev => prev.filter((_, idx) => idx !== i))
  }

  const NEXT_LABELS = [
    'Next: Add packages',
    'Next: Configure settings',
    'Next: Review',
    'Preview build',
    'Build customization',
  ]

  return (
    <div style={{ height: '100vh', background: '#f8f8fa', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ProtoBar label="Bulk Customizations" />
      <Navbar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 24px' }}>

          {/* Breadcrumb + close */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem' }}>
              <span
                onClick={() => navigate('/mirror')}
                style={{ color: '#1d63ed', cursor: 'pointer', fontWeight: 420 }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Docker Hardened Images
              </span>
              <span style={{ color: 'rgba(0,0,0,0.3)' }}>/</span>
              <span style={{ color: '#111827', fontWeight: 520 }}>New customization</span>
            </nav>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => navigate('/mirror')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ height: 1, background: 'rgba(11,11,15,0.08)', margin: '0 -40px 24px' }} />

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0B0B0F', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            New customization
          </h1>

          <Stepper step={step} onGoTo={setStep} />

          <div style={{ height: 1, background: 'rgba(11,11,15,0.08)', margin: '0 -40px 32px' }} />

          {/* Step content */}
          {step === 0 && (
            <Step1
              selectedIds={selectedIds}
              onToggle={toggleId}
              search={catalogSearch}
              onSearch={setCatalogSearch}
              expandedGroups={expandedGroups}
              onToggleGroup={toggleGroup}
            />
          )}
          {step === 1 && (
            <Step2
              selectedPackages={selectedPackages}
              onTogglePackage={togglePackage}
              search={packageSearch}
              onSearch={setPackageSearch}
            />
          )}
          {step === 2 && (
            <Step3
              envVars={envVars}
              onEnvChange={handleEnvChange}
              onAddEnv={addEnv}
              onRemoveEnv={removeEnv}
              imageCount={selectedIds.size}
            />
          )}
          {step === 3 && (
            <Step4
              selectedIds={selectedIds}
              selectedPackages={selectedPackages}
              envVars={envVars}
              onGoTo={setStep}
            />
          )}
          {step === 4 && <Step5 />}

        </div>
        </div>

        {/* Footer nav — sticky, always visible */}
        <div style={{
          flexShrink: 0,
          borderTop: '1px solid rgba(11,11,15,0.08)',
          background: '#fff',
          padding: '16px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={() => step === 0 ? navigate('/mirror') : setStep(s => s - 1)}
            style={{ background: 'transparent', border: '1px solid rgba(11,11,15,0.14)', borderRadius: 6, padding: '9px 20px', fontSize: '0.9375rem', fontWeight: 520, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.12s, background-color 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(11,11,15,0.28)'; e.currentTarget.style.backgroundColor = '#fafafa' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(11,11,15,0.14)'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {step === 3 && (
              <button
                onClick={() => navigate('/')}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '0.875rem', fontWeight: 520, fontFamily: 'inherit', padding: '9px 0', transition: 'color 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                Build customization
              </button>
            )}
              {(() => {
                const isDisabled = step === 0 && selectedIds.size === 0
                return (
                  <button
                    onClick={() => {
                      if (isDisabled) return
                      if (step === 4) navigate('/')
                      else setStep(s => s + 1)
                    }}
                    disabled={isDisabled}
                    style={{
                      background: isDisabled ? '#e5e7eb' : '#1d63ed',
                      color: isDisabled ? '#9ca3af' : '#fff',
                      border: 'none', borderRadius: 6,
                      padding: '9px 24px', fontSize: '0.9375rem', fontWeight: 600,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'background-color 0.12s',
                    }}
                    onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.backgroundColor = '#1753d4' }}
                    onMouseLeave={e => { if (!isDisabled) e.currentTarget.style.backgroundColor = '#1d63ed' }}
                  >
                    {NEXT_LABELS[step]}
                  </button>
                )
              })()}
          </div>
        </div>
      </main>
    </div>
  )
}
