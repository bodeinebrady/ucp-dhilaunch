import { useState } from 'react';
import { MessageSquare, Users, Shield, ArrowRight } from 'lucide-react';
import ScenarioBar from '../components/ScenarioBar';
import Navbar from '../components/Navbar';
import PageBreadcrumb from '../components/PageBreadcrumb';
import RepoHeader from '../components/RepoHeader';
import UseThisImageDrawer from '../components/UseThisImageDrawerV2';
import { ComparisonView } from '../components/ComparisonView';
import { CustomizationCard } from '../components/CustomizationCard';
import { useApp } from '../context/AppContext';

type Tab = 'overview' | 'guides' | 'images';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'guides', label: 'Guides' },
  { id: 'images', label: 'Images' },
];

// ── Vulnerability pills ──────────────────────────────────────────────────────

function VulnPill({ label, count, color }: { label: string; count: number; color: string }) {
  const hasCount = count > 0;
  return (
    <span
      className="inline-flex items-center justify-center rounded"
      style={{
        minWidth: 20,
        padding: '0 6px',
        height: 20,
        fontSize: '0.6875rem',
        fontWeight: 700,
        background: hasCount ? color : 'var(--accent, #f4f4f6)',
        color: hasCount ? '#fff' : 'var(--muted-foreground)',
      }}
      title={label}
    >
      {count}
    </span>
  );
}

// ── Security summary card ────────────────────────────────────────────────────

function SecuritySummaryCard({ onViewDetails }: { onViewDetails: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-card" style={{ padding: 20 }}>
      <p style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 16 }}>
        Security summary
      </p>

      {/* Version selector */}
      <span className="block text-xs text-muted-foreground" style={{ marginBottom: 4 }}>
        Image version
      </span>
      <select
        className="w-full rounded-md border border-border bg-card"
        style={{
          padding: '6px 10px',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          color: 'var(--foreground)',
          marginBottom: 20,
        }}
      >
        <option>3.20</option>
        <option>3.19</option>
        <option>3.18</option>
      </select>

      {/* Detail rows */}
      <div className="flex flex-col" style={{ gap: 12, marginBottom: 20 }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Distribution</span>
          <span className="text-sm text-muted-foreground">—</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Packages</span>
          <button
            onClick={onViewDetails}
            className="flex items-center gap-0.5 bg-transparent border-0 p-0 cursor-pointer text-sm hover:underline"
            style={{ color: '#1d63ed', fontWeight: 680 }}
          >
            14 packages
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Vulnerabilities</span>
          <div className="flex items-center" style={{ gap: 2 }}>
            <VulnPill label="Critical" count={0} color="#d52536" />
            <VulnPill label="High" count={0} color="#d52536" />
            <VulnPill label="Medium" count={0} color="#e8a100" />
            <VulnPill label="Low" count={0} color="#e8c700" />
            <VulnPill label="Unknown" count={0} color="transparent" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Attestations</span>
          <div className="flex items-center" style={{ gap: 6 }}>
            <span
              className="inline-flex items-center rounded"
              style={{
                height: 18,
                padding: '0 6px',
                fontSize: '0.625rem',
                fontWeight: 700,
                background: '#e8f4f2',
                color: '#1a6b64',
              }}
            >
              SLSA L3
            </span>
            <span
              className="inline-flex items-center rounded"
              style={{
                height: 18,
                padding: '0 6px',
                fontSize: '0.625rem',
                fontWeight: 700,
                background: '#e8f4f2',
                color: '#1a6b64',
              }}
            >
              Signed SBOM
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground" style={{ textDecoration: 'underline dotted', textUnderlineOffset: 2, cursor: 'default' }}>
            Scout health score
          </span>
          <div className="flex items-center" style={{ gap: 4 }}>
            <span
              className="inline-flex items-center justify-center rounded-full text-white"
              style={{
                width: 26,
                height: 26,
                fontSize: '0.8125rem',
                fontWeight: 900,
                background: '#388e3c',
              }}
            >
              A
            </span>
            <Shield size={14} style={{ color: '#388e3c' }} />
          </div>
        </div>
      </div>

      <div className="border-t border-border" style={{ marginBottom: 12 }} />

      <button
        onClick={onViewDetails}
        className="rounded-md border-none cursor-pointer"
        style={{
          background: '#1d63ed',
          color: '#fff',
          padding: '6px 14px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          fontFamily: 'inherit',
        }}
      >
        View packages, CVEs &amp; attestations
      </button>
    </div>
  );
}

// ── Got questions card ───────────────────────────────────────────────────────

function GotQuestionsCard() {
  return (
    <div className="rounded-xl border border-border bg-card" style={{ padding: 20 }}>
      <p style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 6 }}>
        Got questions or feedback?
      </p>
      <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.6, marginBottom: 16 }}>
        Connect with the Docker community to ask questions, share feedback, and stay up to date on hardened image releases.
      </p>
      <div className="flex flex-col" style={{ gap: 8 }}>
        <button
          className="inline-flex items-center bg-transparent border-0 p-0 cursor-pointer text-sm hover:underline"
          style={{ color: '#1d63ed', fontWeight: 520, gap: 6 }}
        >
          <MessageSquare size={16} className="shrink-0" />
          Go to discussions ↗
        </button>
        <button
          className="inline-flex items-center bg-transparent border-0 p-0 cursor-pointer text-sm hover:underline"
          style={{ color: '#1d63ed', fontWeight: 520, gap: 6 }}
        >
          <Users size={16} className="shrink-0" />
          Join community ↗
        </button>
      </div>
    </div>
  );
}

// ── About section ────────────────────────────────────────────────────────────

function AboutSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg" style={{ padding: 24 }}>
      <h6 style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 12 }}>
        About Alpine Linux
      </h6>
      <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.7, marginBottom: 12 }}>
        Alpine Linux is available as a free Docker Hardened Image — distroless, non-root, signed SBOM, and zero CVEs at build time. No account required to pull.
      </p>
      <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.7, marginBottom: 12 }}>
        This image ships with 14 packages, has 0 known CVEs, and is 72% smaller than the standard upstream image. It includes SLSA Build Level 3 provenance attestation.
      </p>

      {showMore && (
        <>
          <div className="border-t border-border" style={{ margin: '16px 0' }} />
          <p style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 6 }}>
            What's included in the hardened image?
          </p>
          <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.7, marginBottom: 16 }}>
            Hardened images are distroless, non-root by default, and built with a minimal package footprint. Each image ships with a signed SBOM and SLSA Build Level 3 provenance attestation. Zero CVEs at build time.
          </p>
        </>
      )}

      <button
        onClick={() => setShowMore(s => !s)}
        className="bg-transparent border-0 p-0 cursor-pointer text-sm hover:underline"
        style={{ color: '#2e7f74', fontWeight: 520 }}
      >
        {showMore ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

// ── Metadata strip ───────────────────────────────────────────────────────────

function MetadataStrip() {
  return (
    <div
      className="flex items-center flex-wrap bg-accent border border-border rounded-xl"
      style={{ padding: '12px 16px', gap: 24, marginBottom: 24 }}
    >
      <StatPair label="Pulls" value="10M+" />
      <Divider />
      <StatPair label="Stars" value="847" />
      <Divider />
      <StatPair label="Updated" value="1 day ago" />
      <Divider />
      <div className="flex items-center" style={{ gap: 6 }}>
        <ArchBadge label="linux/amd64" />
        <ArchBadge label="linux/arm64" />
      </div>
      <div className="ml-auto flex items-center" style={{ gap: 12 }}>
        <a href="#" className="text-xs text-muted-foreground hover:underline" style={{ textDecoration: 'none' }}>
          Documentation
        </a>
        <a href="#" className="text-xs text-muted-foreground hover:underline" style={{ textDecoration: 'none' }}>
          Report a vulnerability
        </a>
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

function Divider() {
  return <div className="border-r border-border" style={{ height: 16 }} />;
}

function ArchBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-border text-xs text-muted-foreground"
      style={{ padding: '2px 8px', fontSize: '0.75rem' }}
    >
      {label}
    </span>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ImageDetailPage() {
  const { authState, selectedImage, setSelectedImage } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const isEntitled = authState === 'org-entitled' || authState === 'org-at-limit';

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <ScenarioBar />
      <Navbar />

      <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
        <div className="mx-auto py-10 px-6 md:px-10" style={{ maxWidth: 1536 }}>
          <PageBreadcrumb crumbs={[
            { label: 'DHI', href: '/' },
            { label: 'Operating Systems', href: '/' },
            { label: 'Alpine Linux' },
          ]} />

          <RepoHeader onUseThisImage={() => setDrawerOpen(true)} />

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
                    padding: '10px 18px',
                    fontSize: '0.875rem',
                    fontWeight: active ? 520 : 420,
                    color: active ? '#1d63ed' : 'var(--muted-foreground)',
                    borderBottom: active ? '2px solid #1d63ed' : '2px solid transparent',
                    marginBottom: -1,
                    fontFamily: 'inherit',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 items-start" style={{ gap: 24 }}>
              {/* Left column */}
              <div className="col-span-12 md:col-span-7 flex flex-col" style={{ gap: 24 }}>
                <AboutSection />
                {!isEntitled && (
                  <ComparisonView
                    imageVersion={selectedImage}
                    onVersionChange={setSelectedImage}
                    onStartTrial={() => setDrawerOpen(true)}
                  />
                )}
              </div>

              {/* Right column */}
              <div className="col-span-12 md:col-span-5 flex flex-col" style={{ gap: 20 }}>
                {!isEntitled && (
                  <CustomizationCard onStartTrial={() => setDrawerOpen(true)} />
                )}
                <SecuritySummaryCard onViewDetails={() => setActiveTab('images')} />
                <GotQuestionsCard />
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div
              className="bg-card border border-border rounded-xl text-center text-muted-foreground"
              style={{ padding: '48px 32px' }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 420 }}>
                {activeTab === 'guides' ? 'Guides' : 'Images'} content
              </div>
            </div>
          )}
        </div>
      </main>

      <UseThisImageDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
