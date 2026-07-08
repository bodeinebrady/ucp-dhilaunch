import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ChevronDown, Copy, Check } from 'lucide-react';
import ScenarioBar from '../components/ScenarioBar';
import Navbar from '../components/Navbar';
import UseThisImageDrawer from '../components/UseThisImageDrawerV2';
import { IMAGE_VERSIONS_DATA } from '../data/imageData';

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={handleCopy}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', color: '#9ca3af', display: 'inline-flex', alignItems: 'center' }}
      title="Copy"
    >
      {copied ? <Check size={13} color="#388e3c" /> : <Copy size={13} />}
    </button>
  );
}

// ── Distro chip ───────────────────────────────────────────────────────────────

function Chip({ label, color }: { label: string; color?: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: '0.6875rem',
      fontWeight: 700,
      background: color ?? '#1d63ed',
      color: '#fff',
      letterSpacing: '0.02em',
    }}>
      {label.toUpperCase()}
    </span>
  );
}

// ── Vuln strip ────────────────────────────────────────────────────────────────

function VulnStrip({ vulns }: { vulns: { c: number; h: number; m: number; l: number; u: number } }) {
  const items = [vulns.c, vulns.h, vulns.m, vulns.l, vulns.u];
  const colors = ['#d52536', '#d52536', '#e8a100', '#e8c700', '#9ca3af'];
  return (
    <div className="flex items-center" style={{ gap: 2 }}>
      {items.map((count, i) => (
        <span
          key={i}
          style={{
            minWidth: 22,
            padding: '0 6px',
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            fontSize: '0.75rem',
            fontWeight: 700,
            background: count > 0 ? colors[i] : '#f3f4f6',
            color: count > 0 ? '#fff' : '#9ca3af',
          }}
        >
          {count}
        </span>
      ))}
    </div>
  );
}

// ── Sub-tabs ──────────────────────────────────────────────────────────────────

type SubTab = 'packages' | 'specifications' | 'vulnerabilities' | 'attestations';

function SubTabBar({ active, onSelect, pkgCount, vulnCount }: {
  active: SubTab;
  onSelect: (t: SubTab) => void;
  pkgCount: number;
  vulnCount: number;
}) {
  const tabs: { id: SubTab; label: string; count?: number }[] = [
    { id: 'packages', label: 'Packages', count: pkgCount },
    { id: 'specifications', label: 'Specifications' },
    { id: 'vulnerabilities', label: 'Vulnerabilities', count: vulnCount },
    { id: 'attestations', label: 'Attestations' },
  ];
  return (
    <div className="flex border-b border-border" style={{ marginBottom: 24 }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className="border-none bg-transparent cursor-pointer"
            style={{
              padding: '10px 18px',
              fontSize: '0.875rem',
              fontWeight: isActive ? 520 : 420,
              color: isActive ? '#1d63ed' : 'var(--muted-foreground)',
              borderBottom: isActive ? '2px solid #1d63ed' : '2px solid transparent',
              marginBottom: -1,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                marginLeft: 6,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isActive ? '#1d63ed' : '#9ca3af',
              }}>
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Packages table ────────────────────────────────────────────────────────────

function PackagesTable({ packages }: { packages: { name: string; namespace: string; type: string; version: string; license: string }[] }) {
  const [search, setSearch] = useState('');
  const filtered = packages.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.namespace.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md border border-border bg-card px-3 mb-5"
        style={{ width: 220, height: 34 }}
      >
        <Search size={13} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border-none outline-none bg-transparent text-foreground"
          style={{ fontSize: '0.8125rem', fontFamily: 'inherit' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Package', 'Namespace', 'Type', 'Version', 'License'].map(col => (
              <th
                key={col}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
                {col === 'Package' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 3, display: 'inline' }}>
                    <path d="M5 3L2 6h6L5 3z" fill="#9ca3af" />
                  </svg>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((pkg, i) => (
            <tr
              key={`${pkg.name}-${i}`}
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <td style={{ padding: '9px 12px', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>{pkg.name}</td>
              <td style={{ padding: '9px 12px', fontSize: '0.875rem', color: '#374151' }}>{pkg.namespace}</td>
              <td style={{ padding: '9px 12px', fontSize: '0.875rem', color: '#374151' }}>{pkg.type}</td>
              <td style={{ padding: '9px 12px', fontSize: '0.875rem', color: '#374151', fontFamily: 'monospace' }}>{pkg.version}</td>
              <td style={{ padding: '9px 12px', fontSize: '0.8125rem', color: '#6b7280', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pkg.license}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Stub tab ──────────────────────────────────────────────────────────────────

function StubTab({ label }: { label: string }) {
  return (
    <div className="bg-card border border-border rounded-xl text-center text-muted-foreground" style={{ padding: '48px 32px' }}>
      <div style={{ fontSize: '0.875rem' }}>{label} content</div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ImageVersionPage() {
  const { slug, versionId } = useParams<{ slug: string; versionId: string }>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SubTab>('packages');
  const [arch, setArch] = useState('linux/amd64');

  const version = IMAGE_VERSIONS_DATA.find(v => v.id === versionId) ?? IMAGE_VERSIONS_DATA[0];
  const imageName = slug
    ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Dart';

  const totalVulns = version.vulns.c + version.vulns.h + version.vulns.m + version.vulns.l + version.vulns.u;

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <ScenarioBar />
      <Navbar />

      <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
        <div className="mx-auto py-8 px-6 md:px-10" style={{ maxWidth: 1280 }}>

          {/* Breadcrumb */}
          <nav style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link to="/v3" style={{ color: '#1d63ed', textDecoration: 'none' }}>Hardened Images</Link>
            <span>/</span>
            <Link to={`/v3/image/${slug}`} style={{ color: '#1d63ed', textDecoration: 'none' }}>{imageName}</Link>
            <span>/</span>
            <Link to={`/v3/image/${slug}`} onClick={e => { e.preventDefault(); window.history.back(); }} style={{ color: '#1d63ed', textDecoration: 'none' }}>Images</Link>
            <span>/</span>
            <span style={{ color: '#374151' }}>{version.name}</span>
          </nav>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            {/* Namespace */}
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1d63ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" /></svg>
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>dhi.io/{slug}</span>
            </div>

            {/* Title + badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                {version.name}
              </h1>
              <Chip label="CIS" color="#374151" />
              <Chip label="LINUX/AMD64" color="#374151" />
              <Chip label={version.distro} color={version.distroColor} />
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Tags */}
            <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, color: '#374151', marginRight: 6 }}>TAGS:</span>
              {version.tags}
            </div>

            {/* Digests */}
            <div className="flex items-center gap-6 flex-wrap" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: 6 }}>Index Digest:</span>
                <span style={{ fontFamily: 'monospace', color: '#374151' }}>{version.indexDigest}</span>
                <CopyButton value={version.indexDigest} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: 6 }}>Manifest Digest:</span>
                <span style={{ fontFamily: 'monospace', color: '#374151' }}>{version.manifestDigest}</span>
                <CopyButton value={version.manifestDigest} />
              </div>
            </div>

            {/* Metadata strip */}
            <div
              className="flex items-center flex-wrap gap-6 rounded-xl border border-border bg-card"
              style={{ padding: '14px 20px' }}
            >
              {/* Arch selector */}
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Arch</div>
                <button
                  className="flex items-center gap-1.5 rounded-md border border-border bg-card cursor-pointer"
                  style={{ padding: '5px 10px', fontSize: '0.875rem', fontFamily: 'inherit', color: '#111827' }}
                  onClick={() => setArch(a => a === 'linux/amd64' ? 'linux/arm64' : 'linux/amd64')}
                >
                  {arch}
                  <ChevronDown size={13} style={{ color: '#9ca3af' }} />
                </button>
              </div>

              <div style={{ height: 32, width: 1, background: 'var(--border)' }} />

              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Size</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{version.size}</div>
              </div>

              <div style={{ height: 32, width: 1, background: 'var(--border)' }} />

              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Last Pushed</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{version.lastPushed}</div>
              </div>

              <div style={{ height: 32, width: 1, background: 'var(--border)' }} />

              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Vulnerabilities</div>
                <VulnStrip vulns={version.vulns} />
              </div>

              <div style={{ height: 32, width: 1, background: 'var(--border)' }} />

              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Support</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: version.support === 'Active' ? '#388e3c' : version.support === 'Approaching EOL' ? '#e8a100' : '#d52536' }}>
                  {version.support}
                </div>
              </div>

              {/* Use this image — right aligned */}
              <div className="ml-auto">
                <button
                  onClick={() => setDrawerOpen(true)}
                  style={{
                    background: '#1d63ed',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 18px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Use this image
                </button>
              </div>
            </div>
          </div>

          {/* Sub-tabs */}
          <SubTabBar
            active={activeTab}
            onSelect={setActiveTab}
            pkgCount={version.packages.length}
            vulnCount={totalVulns}
          />

          {/* Tab content */}
          {activeTab === 'packages' && <PackagesTable packages={version.packages} />}
          {activeTab === 'specifications' && <StubTab label="Specifications" />}
          {activeTab === 'vulnerabilities' && <StubTab label="Vulnerabilities" />}
          {activeTab === 'attestations' && <StubTab label="Attestations" />}
        </div>
      </main>

      <UseThisImageDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
