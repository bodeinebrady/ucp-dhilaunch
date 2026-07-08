import { useState } from 'react';
import { MessageSquare, Users, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScenarioBar from '../components/ScenarioBar';
import Navbar from '../components/Navbar';
import PageBreadcrumb from '../components/PageBreadcrumb';

type Tab = 'overview' | 'guides' | 'images';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'guides', label: 'Guides' },
  { id: 'images', label: 'Images' },
];

// ── Code block ────────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div
      className="flex items-center gap-2.5 rounded-md border"
      style={{ padding: '8px 12px', background: '#f4f4f6', borderColor: '#e1e2e6' }}
    >
      <code className="flex-1" style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '0.8125rem', color: '#17191e', wordBreak: 'break-all', lineHeight: 1.6 }}>
        {code}
      </code>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 rounded border-none cursor-pointer"
        style={{
          background: copied ? '#388e3c' : 'rgba(0,0,0,0.08)',
          color: copied ? '#fff' : '#17191e',
          padding: '3px 8px', fontSize: '0.6875rem', fontWeight: 520, fontFamily: 'inherit',
          transition: 'background 0.15s ease',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

// ── Repo header ───────────────────────────────────────────────────────────────

function FreeRepoHeader({ onUseThisImage }: { onUseThisImage: () => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-5">
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-xl"
          style={{ width: 72, height: 72, background: '#2d3748' }}
        >
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <path d="M20 4L6 10v10c0 8 6 15 14 16 8-1 14-8 14-16V10L20 4z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M14 20l4.5 4.5L27 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="m-0 mb-1" style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', fontFamily: "'Roboto Mono', monospace" }}>
            dhi.io/nodejs
          </p>
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <h1 className="m-0" style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.2 }}>
              Node.js
            </h1>
            {/* Free tier badge — muted, no rainbow gradient */}
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '3px 10px', borderRadius: 100,
              fontSize: '0.6875rem', fontWeight: 700,
              background: '#f3f4f6', color: '#6b7280',
              border: '1px solid #e5e7eb',
            }}>
              DHI Free
            </span>
          </div>
          <p className="m-0" style={{ fontSize: '0.9375rem', color: 'var(--muted-foreground)', lineHeight: 1.6, maxWidth: 600 }}>
            Hardened Node.js runtime. Minimal, non-root, signed SBOM, zero CVEs at build time. No account required to pull.
          </p>
        </div>

        {/* CTA block */}
        <div className="flex-shrink-0 flex flex-col items-center" style={{ gap: 8, marginTop: 24 }}>
          <button
            onClick={onUseThisImage}
            className="rounded-md text-white border-none cursor-pointer w-full"
            style={{ background: '#1d63ed', padding: '9px 22px', fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'inherit' }}
          >
            Use this image
          </button>
          <Link
            to="/v1/image/nodejs"
            style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textDecoration: 'none', textAlign: 'center', lineHeight: 1.4 }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1d63ed'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted-foreground)'; }}
          >
            Looking for DHI Enterprise?
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Metadata strip ────────────────────────────────────────────────────────────

function MetadataStrip() {
  return (
    <div className="flex items-center flex-wrap bg-accent border border-border rounded-xl" style={{ padding: '12px 16px', gap: 24, marginBottom: 24 }}>
      <StatPair label="Pulls" value="10M+" />
      <Divider />
      <StatPair label="Stars" value="847" />
      <Divider />
      <StatPair label="Updated" value="18 days ago" />
      <Divider />
      <div className="flex items-center" style={{ gap: 6 }}>
        <ArchBadge label="linux/amd64" />
        <ArchBadge label="linux/arm64" />
      </div>
      <div className="ml-auto flex items-center" style={{ gap: 12 }}>
        <a href="#" className="text-xs text-muted-foreground hover:underline" style={{ textDecoration: 'none' }}>Documentation</a>
        <a href="#" className="text-xs text-muted-foreground hover:underline" style={{ textDecoration: 'none' }}>Report a vulnerability</a>
      </div>
    </div>
  );
}

function StatPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center" style={{ gap: 6 }}>
      <span className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{label}</span>
      <span className="text-sm" style={{ fontWeight: 680 }}>{value}</span>
    </div>
  );
}
function Divider() { return <div className="border-r border-border" style={{ height: 16 }} />; }
function ArchBadge({ label }: { label: string }) {
  return <span className="inline-flex items-center rounded-full border border-border text-xs text-muted-foreground" style={{ padding: '2px 8px' }}>{label}</span>;
}

// ── About section ─────────────────────────────────────────────────────────────

function AboutSection() {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="bg-card border border-border rounded-lg" style={{ padding: 24 }}>
      <h6 style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 12 }}>About Node.js</h6>
      <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.7, marginBottom: 12 }}>
        Node.js is available as a free Docker Hardened Image — distroless, non-root, signed SBOM, and zero CVEs at build time. No account required to pull.
      </p>
      <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.7, marginBottom: 12 }}>
        This image ships with 14 packages, has 0 known CVEs, and is 72% smaller than the standard upstream image. It is rebuilt on the upstream release cadence — not continuously remediated.
      </p>
      {showMore && (
        <>
          <div className="border-t border-border" style={{ margin: '16px 0' }} />
          <p style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 6 }}>What's the difference from DHI Enterprise?</p>
          <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.7 }}>
            DHI Enterprise adds SLA-backed continuous remediation, org namespace mirroring, FIPS/STIG compliance variants, and a Scout health score guarantee. The free image uses the same hardened foundation but follows upstream patching cadence with no SLA.
          </p>
        </>
      )}
      <button
        onClick={() => setShowMore(s => !s)}
        className="bg-transparent border-0 p-0 cursor-pointer text-sm hover:underline"
        style={{ color: '#2e7f74', fontWeight: 520, marginTop: 8, display: 'block' }}
      >
        {showMore ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

// ── Enterprise upsell card ────────────────────────────────────────────────────

function EnterpriseUpsellCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="bg-card border border-border rounded-lg" style={{ padding: 24 }}>
      <h6 style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 4 }}>Want continuous remediation?</h6>
      <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.6, marginBottom: 16 }}>
        DHI Enterprise adds SLA-backed patching, org namespace mirroring, and FIPS/STIG compliance variants on top of this image.
      </p>
      <div className="flex flex-col" style={{ gap: 8, marginBottom: 16 }}>
        {['Critical & High CVEs patched within 7 days', 'Mirror to your org namespace', 'FIPS, STIG, CIS compliance variants', 'Scout health score guarantee'].map(f => (
          <div key={f} className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#388e3c" /><path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="text-sm" style={{ color: 'var(--foreground)' }}>{f}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onUpgrade}
        className="inline-flex items-center rounded-md text-white border-none cursor-pointer"
        style={{ background: '#1d63ed', padding: '8px 14px', fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'inherit', gap: 6 }}
      >
        Start free trial
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ── Security summary card (free tier) ─────────────────────────────────────────

function SecuritySummaryCard() {
  return (
    <div className="rounded-lg border border-border bg-card" style={{ padding: 20 }}>
      <p style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 16 }}>Security summary</p>
      <div className="flex flex-col" style={{ gap: 12, marginBottom: 20 }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Packages</span>
          <span className="text-sm" style={{ fontWeight: 680 }}>14 packages</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Vulnerabilities</span>
          <div className="flex items-center" style={{ gap: 2 }}>
            {[0, 0, 0, 0].map((n, i) => (
              <span key={i} className="inline-flex items-center justify-center rounded" style={{ minWidth: 20, padding: '0 6px', height: 20, fontSize: '0.6875rem', fontWeight: 700, background: 'var(--accent, #f4f4f6)', color: 'var(--muted-foreground)' }}>{n}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Attestations</span>
          <div className="flex items-center" style={{ gap: 6 }}>
            <span className="inline-flex items-center rounded" style={{ height: 18, padding: '0 6px', fontSize: '0.625rem', fontWeight: 700, background: '#e8f4f2', color: '#1a6b64' }}>SLSA L3</span>
            <span className="inline-flex items-center rounded" style={{ height: 18, padding: '0 6px', fontSize: '0.625rem', fontWeight: 700, background: '#e8f4f2', color: '#1a6b64' }}>Signed SBOM</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Remediation</span>
          <span className="text-sm text-muted-foreground">Upstream cadence</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">SLA</span>
          <span className="text-sm text-muted-foreground">None</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Scout health score</span>
          <div className="flex items-center" style={{ gap: 4 }}>
            <span className="inline-flex items-center justify-center rounded-full text-white" style={{ width: 26, height: 26, fontSize: '0.8125rem', fontWeight: 900, background: '#388e3c' }}>A</span>
            <Shield size={14} style={{ color: '#388e3c' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Got questions card ────────────────────────────────────────────────────────

function GotQuestionsCard() {
  return (
    <div className="rounded-xl border border-border bg-card" style={{ padding: 20 }}>
      <p style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 6 }}>Got questions or feedback?</p>
      <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.6, marginBottom: 16 }}>
        Connect with the Docker community to ask questions, share feedback, and stay up to date on releases.
      </p>
      <div className="flex flex-col" style={{ gap: 8 }}>
        <button className="inline-flex items-center bg-transparent border-0 p-0 cursor-pointer text-sm hover:underline" style={{ color: '#1d63ed', fontWeight: 520, gap: 6 }}>
          <MessageSquare size={16} className="shrink-0" />Go to discussions ↗
        </button>
        <button className="inline-flex items-center bg-transparent border-0 p-0 cursor-pointer text-sm hover:underline" style={{ color: '#1d63ed', fontWeight: 520, gap: 6 }}>
          <Users size={16} className="shrink-0" />Join community ↗
        </button>
      </div>
    </div>
  );
}

// ── Use this image drawer (free) ──────────────────────────────────────────────

function FreeDrawer({ open, onClose, onUpgrade }: { open: boolean; onClose: () => void; onUpgrade: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.2s ease' }} />
      <div
        role="dialog" aria-modal="true" aria-label="Use this image"
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, background: 'var(--card, #fff)', zIndex: 101, display: 'flex', flexDirection: 'column', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 border-b border-border" style={{ padding: '16px 24px' }}>
          <h2 className="m-0 text-foreground" style={{ fontSize: '1rem', fontWeight: 680 }}>Use this image</h2>
          <button onClick={onClose} aria-label="Close" className="flex items-center justify-center rounded cursor-pointer border-none bg-transparent p-1.5" style={{ color: 'var(--muted-foreground)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" style={{ padding: 24 }}>
          <p className="m-0 mb-5" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
            Pull this image directly — no account required. It's hardened at build time with zero CVEs and a signed SBOM.
          </p>

          {/* Pull command */}
          <div style={{ marginBottom: 24 }}>
            <div className="text-muted-foreground mb-1.5" style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pull the image
            </div>
            <CodeBlock code="docker pull dhi.io/nodejs:20-bookworm" />
          </div>

          {/* Divider + upsell */}
          <div className="border-t border-border" style={{ marginBottom: 20 }} />
          <div className="rounded-lg border" style={{ padding: 16, background: 'rgba(29,99,237,0.03)', borderColor: 'rgba(29,99,237,0.12)' }}>
            <p className="text-sm" style={{ fontWeight: 680, marginBottom: 4 }}>Want SLA-backed updates?</p>
            <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.5, marginBottom: 12 }}>
              DHI Enterprise mirrors this image to your org namespace with continuous remediation and a 7-day patch SLA.
            </p>
            <button
              onClick={onUpgrade}
              className="inline-flex items-center rounded-md text-white border-none cursor-pointer"
              style={{ background: '#1d63ed', padding: '7px 14px', fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'inherit', gap: 6 }}
            >
              Start free trial <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ImageDetailPageV1Free() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <ScenarioBar />
      <Navbar />

      <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
        <div className="mx-auto py-10 px-6 md:px-10" style={{ maxWidth: 1536 }}>
          <PageBreadcrumb crumbs={[
            { label: 'DHI', href: '/v1' },
            { label: 'Runtimes', href: '/v1' },
            { label: 'Node.js (Free)' },
          ]} />

          <FreeRepoHeader onUseThisImage={() => setDrawerOpen(true)} />

          <MetadataStrip />

          {/* Tabs */}
          <div className="flex border-b border-border" style={{ marginBottom: 24 }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="border-none bg-transparent cursor-pointer"
                  style={{
                    padding: '10px 18px', fontSize: '0.875rem',
                    fontWeight: active ? 520 : 420,
                    color: active ? '#1d63ed' : 'var(--muted-foreground)',
                    borderBottom: active ? '2px solid #1d63ed' : '2px solid transparent',
                    marginBottom: -1, fontFamily: 'inherit', transition: 'color 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 items-start" style={{ gap: 24 }}>
              <div className="col-span-12 md:col-span-7 flex flex-col" style={{ gap: 24 }}>
                <AboutSection />
                <EnterpriseUpsellCard onUpgrade={() => setDrawerOpen(true)} />
              </div>
              <div className="col-span-12 md:col-span-5 flex flex-col" style={{ gap: 20 }}>
                <SecuritySummaryCard />
                <GotQuestionsCard />
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-card border border-border rounded-xl text-center text-muted-foreground" style={{ padding: '48px 32px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 420 }}>
                {activeTab === 'guides' ? 'Guides' : 'Images'} content
              </div>
            </div>
          )}
        </div>
      </main>

      <FreeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onUpgrade={() => setDrawerOpen(false)} />
    </div>
  );
}
