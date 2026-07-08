import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, AlertTriangle, Rocket } from 'lucide-react';
import ScenarioBar from '../components/ScenarioBar';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { ORG_USER } from '../data/imageData';

// ── Sidebar ───────────────────────────────────────────────────────────────────

function MyHubSidebar({ active }: { active: 'manage' | 'catalog' | 'analytics' }) {
  const navigate = useNavigate();
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        background: 'var(--card)',
        padding: '24px 0',
      }}
    >
      {/* Org identity */}
      <div className="flex items-center gap-2.5 px-5 mb-6">
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 32, height: 32, background: '#1d63ed' }}
        >
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path d="M8 18h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
            <path d="M8 15h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
            <path d="M11 12h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 680, color: 'var(--foreground)' }}>{ORG_USER.org}</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>Organization account</div>
        </div>
      </div>

      <NavItem label="Repositories" icon="repos" active={false} onClick={() => {}} />

      {/* Hardened Images group */}
      <div>
        <NavItem label="Hardened Images" icon="shield" active={false} expandable expanded onClick={() => {}} />
        <div style={{ paddingLeft: 20 }}>
          <NavItem label="Catalog" icon={null} active={active === 'catalog'} onClick={() => navigate('/v3')} indent />
          <NavItem label="Manage" icon={null} active={active === 'manage'} onClick={() => navigate('/v3/manage')} indent />
        </div>
      </div>

      <NavItem label="Analytics" icon="analytics" active={active === 'analytics'} onClick={() => {}} />
    </aside>
  );
}

function NavItem({
  label, icon, active, expandable, expanded, onClick, indent,
}: {
  label: string;
  icon: string | null;
  active: boolean;
  expandable?: boolean;
  expanded?: boolean;
  onClick: () => void;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left"
      style={{
        padding: indent ? '6px 20px 6px 16px' : '8px 20px',
        fontSize: '0.875rem',
        fontWeight: active ? 600 : 420,
        color: active ? '#1d63ed' : 'var(--foreground)',
        background: active ? 'rgba(29,99,237,0.06)' : 'transparent',
        fontFamily: 'inherit',
      }}
    >
      {icon === 'repos' && (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--muted-foreground)' }}>
          <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
      {icon === 'shield' && (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--muted-foreground)' }}>
          <path d="M8 2L3 4v4c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V4L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
      {icon === 'analytics' && (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--muted-foreground)' }}>
          <path d="M2 12l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span className="flex-1">{label}</span>
      {expandable && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--muted-foreground)', transform: expanded ? 'rotate(180deg)' : 'none' }}>
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ── Mirrored images data ──────────────────────────────────────────────────────

const MIRRORED_IMAGES = [
  { name: 'docker/dhi-node',     source: 'Node.js',     customized: true,  els: false, compliance: 'CIS, FIPS, STIG' },
  { name: 'docker/dhi-redis',    source: 'Redis',       customized: true,  els: false, compliance: 'CIS, FIPS, STIG' },
  { name: 'docker/dhi-postgres', source: 'PostgreSQL',  customized: false, els: false, compliance: 'CIS, FIPS, STIG' },
  { name: 'docker/dhi-python',   source: 'Python',      customized: true,  els: true,  compliance: 'CIS, FIPS, STIG' },
  { name: 'docker/dhi-nginx',    source: 'Nginx',       customized: false, els: false, compliance: 'CIS, FIPS, STIG' },
  { name: 'docker/dhi-rust',     source: 'Rust',        customized: true,  els: false, compliance: 'CIS' },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MyHubManagePage() {
  const { authState, daysRemaining } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'mirrored' | 'helm' | 'customizations'>(
    authState === 'org-select-customization-limit' ? 'customizations' : 'mirrored'
  );

  const isTrial = authState === 'org-trial';
  const isTrialEnded = authState === 'org-trial-ended';
  const isSelectAtLimit = authState === 'org-select-customization-limit';
  const urgent = isTrial && daysRemaining <= 7;
  const warm = isTrial && daysRemaining <= 14 && daysRemaining > 7;

  const filtered = MIRRORED_IMAGES.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <ScenarioBar mode="back" />
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <MyHubSidebar active="manage" />

        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }}>

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
              <h1 style={{ fontSize: '1.25rem', fontWeight: 680, color: 'var(--foreground)', margin: 0 }}>
                Manage Hardened Images
              </h1>
              <button
                onClick={() => navigate('/v3')}
                className="flex items-center gap-2 rounded-md border-none cursor-pointer"
                style={{
                  background: '#1d63ed',
                  color: '#fff',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                }}
              >
                <Rocket size={14} />
                Get started
              </button>
            </div>

            {/* Subscription strip */}
            <div
              className="rounded-xl border border-border bg-card mb-6"
              style={{ padding: '20px 24px' }}
            >
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Your subscription
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 680, color: isTrialEnded ? '#b45309' : isTrial ? '#1d63ed' : 'var(--foreground)' }}>
                    {isTrialEnded ? 'DHI Select Trial' : isTrial ? 'DHI Select Trial' : isSelectAtLimit ? 'DHI Select' : 'DHI Enterprise'}
                  </div>
                  {isTrial && (
                    <div style={{ fontSize: '0.75rem', color: urgent ? '#d52536' : warm ? '#b45309' : 'var(--muted-foreground)', fontWeight: 600, marginTop: 2 }}>
                      {daysRemaining} day{daysRemaining === 1 ? '' : 's'} remaining
                    </div>
                  )}
                  {isTrialEnded && (
                    <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: 2 }}>Trial ended</div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Hardened Images
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 680, color: 'var(--foreground)' }}>
                    {isTrial ? `${MIRRORED_IMAGES.length} of 10` : '34 of 1000'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Customizations
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 680, color: isSelectAtLimit ? '#d52536' : isTrial ? '#b45309' : '#388e3c' }}>
                    {isSelectAtLimit ? '5 of 5' : isTrial ? '3 of 5' : 'Unlimited'}
                  </div>
                  {isSelectAtLimit && (
                    <div style={{ fontSize: '0.75rem', color: '#d52536', fontWeight: 600, marginTop: 2 }}>Limit reached</div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    ELS Images
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 680, color: 'var(--muted-foreground)' }}>
                    Not available
                  </div>
                  <a href="#" onClick={e => { e.preventDefault(); navigate('/v3/plans'); }} style={{ fontSize: '0.75rem', color: '#1d63ed', textDecoration: 'none' }}>
                    Contact sales to get access
                  </a>
                </div>
              </div>
            </div>

            {/* Customization limit banner */}
            {isSelectAtLimit && (
              <div
                className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 mb-6"
                style={{ background: 'rgba(213,37,54,0.05)', border: '1px solid rgba(213,37,54,0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} style={{ color: '#d52536', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 680, color: '#7f1d1d', marginBottom: 3 }}>
                      You've reached the limit of 5 customizations
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#991b1b', lineHeight: 1.5 }}>
                      Remove an existing customization to create a new one, or contact sales to increase your limit.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('customizations')}
                  style={{
                    flexShrink: 0, background: '#1d63ed', color: '#fff',
                    border: 'none', borderRadius: 6,
                    padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}
                >
                  Manage customizations
                </button>
              </div>
            )}

            {/* Trial ended banner */}
            {isTrialEnded && (
              <div
                className="flex items-start justify-between gap-4 rounded-xl px-5 py-4 mb-6"
                style={{ background: 'rgba(232,161,0,0.06)', border: '1px solid rgba(232,161,0,0.3)' }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} style={{ color: '#b45309', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 680, color: '#78350f', marginBottom: 3 }}>
                      Trial ended — your mirrored images have stopped receiving updates
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#92400e', lineHeight: 1.5 }}>
                      Upgrade to DHI Enterprise to restore SLA-backed CVE fixes, customizations, and full mirror access.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/v3/plans')}
                  style={{
                    flexShrink: 0, background: '#b45309', color: '#fff',
                    border: 'none', borderRadius: 6,
                    padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}
                >
                  Try DHI Enterprise
                </button>
              </div>
            )}

            {/* Trial nudge banner */}
            {isTrial && (
              <div
                className="flex items-start justify-between gap-4 rounded-xl px-5 py-4 mb-6"
                style={{
                  background: urgent ? 'rgba(213,37,54,0.05)' : warm ? 'rgba(232,161,0,0.06)' : 'rgba(29,99,237,0.05)',
                  border: `1px solid ${urgent ? 'rgba(213,37,54,0.2)' : warm ? 'rgba(232,161,0,0.25)' : 'rgba(29,99,237,0.15)'}`,
                }}
              >
                <div className="flex items-start gap-3">
                  {urgent || warm ? (
                    <AlertTriangle size={16} style={{ color: urgent ? '#d52536' : '#b45309', flexShrink: 0, marginTop: 2 }} />
                  ) : (
                    <Zap size={16} style={{ color: '#1d63ed', flexShrink: 0, marginTop: 2 }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 680, color: urgent ? '#7f1d1d' : warm ? '#78350f' : '#1e3a5f', marginBottom: 3 }}>
                      {urgent
                        ? `Your trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} — upgrade to keep your mirrored images`
                        : warm
                        ? `${daysRemaining} days left in your trial`
                        : `You have full DHI Select access for ${daysRemaining} more days`}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: urgent ? '#991b1b' : warm ? '#92400e' : '#374151', lineHeight: 1.5 }}>
                      {urgent
                        ? 'After your trial, mirrored repositories stop receiving SLA-backed updates. Upgrade now to avoid disruption.'
                        : warm
                        ? 'Upgrade to DHI Enterprise to keep your mirrors, customizations, and SLA-backed CVE fixes.'
                        : 'Mirror images, create customizations, and get SLA-backed CVE fixes. Upgrade anytime to keep access.'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/v3/plans')}
                  className="flex-shrink-0 rounded-md border-none cursor-pointer whitespace-nowrap"
                  style={{
                    background: urgent ? '#d52536' : warm ? '#b45309' : '#1d63ed',
                    color: '#fff',
                    padding: '8px 18px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                  }}
                >
                  Try DHI Enterprise
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              {([
                { id: 'mirrored', label: 'Mirrored Images' },
                { id: 'helm', label: 'Mirrored Helm charts' },
                { id: 'customizations', label: 'Customizations' },
              ] as const).map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="border-none bg-transparent cursor-pointer"
                    style={{
                      padding: '10px 18px',
                      fontSize: '0.875rem',
                      fontWeight: active ? 520 : 420,
                      color: active ? '#1d63ed' : 'var(--muted-foreground)',
                      borderBottom: active ? '2px solid #1d63ed' : '2px solid transparent',
                      marginBottom: -1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Customizations tab content */}
            {activeTab === 'customizations' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3" style={{ height: 38, width: 320 }}>
                    <Search size={14} className="text-muted-foreground flex-shrink-0" />
                    <input type="text" placeholder="Search" className="flex-1 border-none outline-none bg-transparent text-foreground" style={{ fontSize: '0.875rem', fontFamily: 'inherit' }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="border-none bg-transparent p-0 cursor-pointer text-sm hover:underline" style={{ color: '#1d63ed' }}>
                      Learn about customizations ↗
                    </button>
                    <div
                      title={isSelectAtLimit ? "You've reached the 5 customization limit on DHI Select. Upgrade to Enterprise for unlimited customizations." : undefined}
                      style={{ display: 'inline-block', cursor: isSelectAtLimit ? 'not-allowed' : undefined }}
                    >
                      <button
                        disabled={isSelectAtLimit}
                        style={{
                          background: isSelectAtLimit ? '#f3f4f6' : '#1d63ed',
                          color: isSelectAtLimit ? '#9ca3af' : '#fff',
                          border: isSelectAtLimit ? '1.5px solid #e5e7eb' : 'none',
                          borderRadius: 6, padding: '7px 16px',
                          fontSize: '0.875rem', fontWeight: 600,
                          cursor: isSelectAtLimit ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                          pointerEvents: isSelectAtLimit ? 'none' : undefined,
                        }}
                      >
                        New customization
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customizations table */}
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', background: '#f9fafb' }}>
                        {['Name', 'Images / Charts', 'Destination repositories', 'Created by', 'Updated by', ''].map(col => (
                          <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'prod-certs', images: 'Node.js 20.x', dest: `${ORG_USER.org}/dhi-node`, createdBy: 'seanbrady192', updatedBy: 'seanbrady192' },
                        { name: 'staging-certs', images: 'Python 3.12.x', dest: `${ORG_USER.org}/dhi-python`, createdBy: 'pkhanchandan', updatedBy: '-' },
                        { name: 'fips-redis', images: 'Redis 7.x', dest: `${ORG_USER.org}/dhi-redis`, createdBy: 'toni.robinson', updatedBy: 'toni.robinson' },
                        { name: 'nginx-internal', images: 'Nginx 1.27.x', dest: `${ORG_USER.org}/dhi-nginx`, createdBy: 'fred.fredup', updatedBy: '-' },
                        { name: 'postgres-audit', images: 'PostgreSQL 16.x', dest: `${ORG_USER.org}/dhi-postgres`, createdBy: 'seanbrady192', updatedBy: 'seanbrady192' },
                      ].map((row, i, arr) => (
                        <tr key={row.name} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <button className="border-none bg-transparent p-0 cursor-pointer hover:underline" style={{ color: '#1d63ed', fontSize: '0.875rem', fontFamily: 'inherit' }}>{row.name}</button>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--foreground)' }}>{row.images}</td>
                          <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                            <button className="border-none bg-transparent p-0 cursor-pointer hover:underline" style={{ color: '#1d63ed', fontFamily: 'inherit', fontSize: '0.875rem' }}>{row.dest}</button>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--foreground)' }}>{row.createdBy}</td>
                          <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--foreground)' }}>{row.updatedBy}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button className="border-none bg-transparent p-1 cursor-pointer rounded" style={{ color: 'var(--muted-foreground)' }}>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="3" r="1.2" fill="currentColor" />
                                <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                                <circle cx="8" cy="13" r="1.2" fill="currentColor" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Search + mirror button + table */}
            {activeTab !== 'customizations' && (
            <>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex items-center gap-2 rounded-md border border-border bg-card px-3"
                style={{ flex: 1, maxWidth: 480, height: 38 }}
              >
                <Search size={14} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 border-none outline-none bg-transparent text-foreground"
                  style={{ fontSize: '0.875rem', fontFamily: 'inherit' }}
                />
              </div>
              <button
                onClick={() => navigate('/v3')}
                className="flex-shrink-0 rounded-md border-none cursor-pointer whitespace-nowrap ml-auto"
                style={{
                  background: '#1d63ed',
                  color: '#fff',
                  padding: '0 18px',
                  height: 38,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                }}
              >
                Mirror a hardened image
              </button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: '#f9fafb' }}>
                    {['Name', 'Source repository', 'Customized', 'ELS mirrored', 'Compliance', ''].map(col => (
                      <th
                        key={col}
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => {
                    const slug = row.name.replace('docker/', '');
                    return (
                      <tr
                        key={row.name}
                        style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => navigate(`/v3/manage/${slug}`)}
                            className="border-none bg-transparent p-0 cursor-pointer hover:underline"
                            style={{ color: '#1d63ed', fontSize: '0.875rem', fontWeight: 520, fontFamily: 'inherit' }}
                          >
                            {row.name}
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => navigate(`/v3/image/${row.source.toLowerCase().replace(/\./g, '-')}`)}
                            className="border-none bg-transparent p-0 cursor-pointer hover:underline"
                            style={{ color: '#1d63ed', fontSize: '0.875rem', fontFamily: 'inherit' }}
                          >
                            {row.source}
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--foreground)' }}>
                          {row.customized ? 'Yes' : 'No'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: row.els ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                          {row.els ? 'Yes' : 'Unavailable'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--foreground)' }}>
                          {row.compliance}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            className="border-none bg-transparent p-1 cursor-pointer rounded"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="3" r="1.2" fill="currentColor" />
                              <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                              <circle cx="8" cy="13" r="1.2" fill="currentColor" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
