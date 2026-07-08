import { useState } from 'react';
import { AlertTriangle, MessageSquare, Users, Shield, ArrowRight, Sparkles, Search, ChevronDown, Copy, Check, Zap } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ScenarioBar from '../components/ScenarioBar';
import Navbar from '../components/Navbar';
import PageBreadcrumb from '../components/PageBreadcrumb';
import RepoHeader from '../components/RepoHeader';
import UseThisImageDrawer from '../components/UseThisImageDrawerV2';
import { useApp } from '../context/AppContext';
import { IMAGE_VERSIONS_DATA } from '../data/imageData';

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
              style={{ height: 18, padding: '0 6px', fontSize: '0.625rem', fontWeight: 700, background: '#e8f4f2', color: '#1a6b64' }}
            >
              SLSA L3
            </span>
            <span
              className="inline-flex items-center rounded"
              style={{ height: 18, padding: '0 6px', fontSize: '0.625rem', fontWeight: 700, background: '#e8f4f2', color: '#1a6b64' }}
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
              style={{ width: 26, height: 26, fontSize: '0.8125rem', fontWeight: 900, background: '#388e3c' }}
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

// ── Try DHI Enterprise upsell card ───────────────────────────────────────────

function TryEnterpriseCard({ onTry }: { onTry: () => void }) {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-xl"
      style={{
        padding: '20px 20px 18px',
        background: 'linear-gradient(135deg, rgba(29,99,237,0.05) 0%, rgba(125,46,255,0.07) 100%)',
        border: '1px solid rgba(29,99,237,0.18)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #1d63ed 0%, #7d2eff 100%)',
          }}
        >
          <Sparkles size={14} color="#fff" />
        </div>
        <p style={{ fontSize: '0.875rem', fontWeight: 680, color: '#111827', margin: 0 }}>
          Try DHI Enterprise
        </p>
      </div>

      <p className="text-sm" style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: 14 }}>
        Mirror this image to your org registry, unlock FIPS/STIG variants, and get SLA-backed CVE fixes within 7 days.
      </p>

      <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          'Mirror to your org registry',
          'FIPS & STIG-compliant variants',
          'SLA-backed CVE fixes',
          'Audit logs for compliance',
        ].map(item => (
          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#374151' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 8l3.5 3.5L13 4.5" stroke="#1d63ed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      <button
        onClick={onTry}
        style={{
          width: '100%',
          background: '#1d63ed',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '9px 16px',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: 8,
        }}
      >
        Try DHI Enterprise
      </button>

      <button
        onClick={() => navigate('/v3/plans')}
        style={{
          width: '100%',
          background: 'transparent',
          color: '#6b7280',
          border: 'none',
          borderRadius: 6,
          padding: '6px 16px',
          fontSize: '0.8125rem',
          fontWeight: 420,
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'center',
        }}
      >
        Compare all plans →
      </button>
    </div>
  );
}

// ── Customization limit card (Select users at limit) ─────────────────────────

function CustomizationLimitCard() {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-xl"
      style={{
        padding: '18px 20px',
        background: 'rgba(213,37,54,0.04)',
        border: '1px solid rgba(213,37,54,0.2)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <AlertTriangle size={15} style={{ color: '#d52536', flexShrink: 0 }} />
        <p style={{ fontSize: '0.875rem', fontWeight: 680, color: '#7f1d1d', margin: 0 }}>
          Customization limit reached
        </p>
      </div>
      <p style={{ fontSize: '0.8125rem', color: '#991b1b', lineHeight: 1.6, marginBottom: 14 }}>
        You're using all 5 customizations on DHI Select. Remove one to create a new one for this image.
      </p>
      <button
        onClick={() => navigate('/v3/manage')}
        style={{
          width: '100%', background: '#1d63ed', color: '#fff',
          border: 'none', borderRadius: 6, padding: '9px 16px',
          fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit', marginBottom: 8,
        }}
      >
        Manage customizations
      </button>
      <button
        onClick={() => navigate('/v3/plans')}
        style={{
          width: '100%', background: 'transparent', color: '#6b7280',
          border: 'none', borderRadius: 6, padding: '6px 16px',
          fontSize: '0.8125rem', fontWeight: 420, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'center',
        }}
      >
        Contact sales to increase your limit
      </button>
    </div>
  );
}

// ── Trial upgrade card ────────────────────────────────────────────────────────

function TrialUpgradeCard({ daysRemaining, authState }: { daysRemaining: number; authState: string }) {
  const navigate = useNavigate();
  const isEndedNotExtended = authState === 'org-trial-ended';
  const isEndedExtended = authState === 'org-trial-ended-extended';
  const isEnded = isEndedNotExtended || isEndedExtended;
  const urgent = !isEnded && daysRemaining <= 7;
  const warm = !isEnded && daysRemaining <= 14;

  const bg = isEnded
    ? 'rgba(232,161,0,0.06)'
    : urgent
    ? 'rgba(213,37,54,0.05)'
    : warm
    ? 'rgba(232,161,0,0.06)'
    : 'linear-gradient(135deg, rgba(29,99,237,0.05) 0%, rgba(125,46,255,0.06) 100%)';
  const border = isEnded
    ? 'rgba(232,161,0,0.25)'
    : urgent
    ? 'rgba(213,37,54,0.2)'
    : warm
    ? 'rgba(232,161,0,0.25)'
    : 'rgba(29,99,237,0.15)';
  const iconBg = isEnded ? '#b45309' : urgent ? '#d52536' : warm ? '#b45309' : 'linear-gradient(135deg, #1d63ed 0%, #7d2eff 100%)';
  const headlineColor = isEnded ? '#78350f' : urgent ? '#7f1d1d' : warm ? '#78350f' : '#111827';
  const btnBg = isEnded ? '#b45309' : urgent ? '#d52536' : warm ? '#b45309' : '#1d63ed';

  const headline = isEndedExtended
    ? 'Your trial has been extended'
    : isEndedNotExtended
    ? 'Your trial has ended'
    : urgent
    ? `Trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
    : warm
    ? `${daysRemaining} days left in your trial`
    : 'You\'re on a free trial';

  const body = isEndedExtended
    ? 'Your trial has been extended. Upgrade to DHI Enterprise before it ends to keep your mirrors and SLA-backed CVE fixes.'
    : isEndedNotExtended
    ? 'This image is no longer receiving SLA-backed updates. Upgrade to restore full access.'
    : urgent
    ? 'Upgrade now to keep your mirrors and SLA-backed CVE fixes without interruption.'
    : warm
    ? 'Upgrade to DHI Enterprise before your trial ends to keep full access.'
    : 'You have full DHI Select access. Upgrade anytime to keep it after your trial.';

  const items = isEnded
    ? [
        'Restore SLA-backed CVE fixes',
        'Keep your mirrored repositories',
        'FIPS & STIG-compliant variants',
        'Unlimited customizations',
      ]
    : [
        'Keep your mirrored repositories',
        'FIPS & STIG-compliant variants',
        'SLA-backed CVE fixes',
        'Audit logs for compliance',
      ];

  return (
    <div
      className="rounded-xl"
      style={{ padding: '20px 20px 18px', background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 32, height: 32, background: iconBg }}
        >
          <Zap size={14} color="#fff" />
        </div>
        <p style={{ fontSize: '0.875rem', fontWeight: 680, color: headlineColor, margin: 0 }}>
          {headline}
        </p>
      </div>

      <p className="text-sm" style={{ color: isEnded ? '#92400e' : urgent ? '#991b1b' : warm ? '#92400e' : '#4b5563', lineHeight: 1.6, marginBottom: 14 }}>
        {body}
      </p>

      <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => (
          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#374151' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 8l3.5 3.5L13 4.5" stroke={btnBg} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate('/v3/plans')}
        style={{
          width: '100%',
          background: btnBg,
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '9px 16px',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: isEndedNotExtended ? 10 : 0,
        }}
      >
        Upgrade to DHI Enterprise
      </button>

      {isEndedNotExtended && (
        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#92400e', margin: 0 }}>
          Not ready to upgrade?{' '}
          <a
            href="#extend-trial"
            style={{ color: '#92400e', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}
          >
            Request a trial extension
          </a>
        </p>
      )}
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
        <a
          href="https://forums.docker.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm hover:underline"
          style={{ color: '#1d63ed', fontWeight: 520, gap: 6, textDecoration: 'none' }}
        >
          <MessageSquare size={16} className="shrink-0" />
          Go to discussions ↗
        </a>
        <a
          href="https://www.docker.com/community/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm hover:underline"
          style={{ color: '#1d63ed', fontWeight: 520, gap: 6, textDecoration: 'none' }}
        >
          <Users size={16} className="shrink-0" />
          Join community ↗
        </a>
      </div>
    </div>
  );
}

// ── About section ────────────────────────────────────────────────────────────

function AboutSection({ imageName }: { imageName: string }) {
  const [showMore, setShowMore] = useState(false);

  const displayName = imageName
    ? imageName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Alpine Linux';

  return (
    <div className="bg-card border border-border rounded-lg" style={{ padding: 24 }}>
      <h6 style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 12 }}>
        About {displayName}
      </h6>
      <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.7, marginBottom: 12 }}>
        {displayName} is available as a free Docker Hardened Image — distroless, non-root, signed SBOM, and zero CVEs at build time. No account required to pull.
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
      <VertDivider />
      <StatPair label="Stars" value="847" />
      <VertDivider />
      <StatPair label="Updated" value="1 day ago" />
      <VertDivider />
      <div className="flex items-center" style={{ gap: 6 }}>
        <ArchBadge label="linux/amd64" />
        <ArchBadge label="linux/arm64" />
      </div>
      <div className="ml-auto flex items-center" style={{ gap: 12 }}>
        <a
          href="https://docs.docker.com/docker-hub/dhi/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:underline"
          style={{ textDecoration: 'none' }}
        >
          Documentation
        </a>
        <a
          href="https://github.com/docker/dhi/security"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:underline"
          style={{ textDecoration: 'none' }}
        >
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

function VertDivider() {
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

// ── PLG nudge card ───────────────────────────────────────────────────────────

function PlgNudge({ text, cta, onClick }: { text: string; cta: string; onClick: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        borderLeft: '3px solid rgba(29,99,237,0.4)',
        padding: '10px 14px',
        margin: '20px 0',
        background: 'transparent',
      }}
    >
      <span style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>{text}</span>
      <button
        onClick={onClick}
        style={{
          flexShrink: 0,
          background: 'transparent',
          color: '#1d63ed',
          border: 'none',
          padding: 0,
          fontSize: '0.8125rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        {cta} →
      </button>
    </div>
  );
}

// ── Guides tab ───────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <pre style={{
        background: '#1e2433',
        color: '#e2e8f0',
        borderRadius: 8,
        padding: '14px 48px 14px 16px',
        fontSize: '0.8125rem',
        lineHeight: 1.6,
        overflowX: 'auto',
        margin: 0,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(255,255,255,0.08)',
          border: 'none',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer',
          color: copied ? '#86efac' : '#94a3b8',
          fontSize: '0.6875rem',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

const GUIDE_SECTIONS = [
  { id: 'how-to-use', label: 'How to use this image' },
  { id: 'start-instance', label: 'Start a Dart instance' },
  { id: 'common-use-cases', label: 'Common Dart use cases' },
  { id: 'build-run', label: 'Build and run a Dart CLI application' },
  { id: 'compile-inside', label: 'Compile your app inside the Docker container' },
  { id: 'package-commands', label: 'Run Dart package commands' },
  { id: 'image-variants', label: 'Image variants' },
  { id: 'migrate', label: 'Migrate to a Docker Hardened Image' },
  { id: 'troubleshooting', label: 'Troubleshooting migration' },
];

function GuidesTab({ onTryEnterprise, isSelectAtLimit }: { onTryEnterprise: () => void; isSelectAtLimit?: boolean }) {
  const enterpriseCta = isSelectAtLimit ? 'Manage customizations' : 'Try DHI Enterprise';
  return (
    <div className="flex items-start" style={{ gap: 48 }}>
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* How to use */}
        <section id="how-to-use" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>
            How to use this image
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
            All examples in this guide use the public image. If you've mirrored the repository for your own use (for example, to your Docker Hub namespace), update your commands to reference the mirrored image instead of the public one.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>For example:</p>
          <ul style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 }}>
            <li>Public image: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem', fontFamily: 'monospace' }}>dhi.io/&lt;repository&gt;:&lt;tag&gt;</code></li>
            <li>Mirrored image: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem', fontFamily: 'monospace' }}>&lt;your-namespace&gt;/dhi-&lt;repository&gt;:&lt;tag&gt;</code></li>
          </ul>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
            For the examples, you must first use <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem', fontFamily: 'monospace' }}>docker login dhi.io</code> to authenticate to the registry to pull the images.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              background: 'linear-gradient(135deg, rgba(29,99,237,0.05) 0%, rgba(125,46,255,0.06) 100%)',
              border: '1px solid rgba(29,99,237,0.16)',
              borderRadius: 8,
              padding: '12px 16px',
              margin: '16px 0',
            }}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={14} style={{ color: '#1d63ed', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 }}>
                Mirror this image to your org registry and pull from your own namespace — no dhi.io auth required in CI.
              </span>
            </div>
            <button
              onClick={onTryEnterprise}
              style={{
                flexShrink: 0,
                background: '#1d63ed',
                color: '#fff',
                border: 'none',
                borderRadius: 5,
                padding: '6px 14px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {enterpriseCta}
            </button>
          </div>
        </section>

        {/* Start a Dart instance */}
        <section id="start-instance" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>
            Start a Dart instance
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
            Run the following command to run a Dart instance. Replace <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem', fontFamily: 'monospace' }}>&lt;tag&gt;</code> with the image variant you want to run.
          </p>
          <CodeBlock code={`docker run --rm dhi.io/dart:<tag> dart --version`} />
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
            Create a simple Dart program and run it directly from the container:
          </p>
          <CodeBlock code={`docker run --rm -v $(pwd):/app -w /app dhi.io/dart:<tag> sh -c 'cat > hello.dart << EOF
void main() {
  print("Hello from DHI Dart!");
}
EOF
dart run hello.dart'`} />
        </section>

        {/* Common use cases */}
        <section id="common-use-cases" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 20 }}>
            Common Dart use cases
          </h4>

          <div id="build-run" style={{ marginBottom: 28 }}>
            <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>
              Build and run a Dart CLI application
            </h5>
            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
              Create a simple Dart console application:
            </p>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Step 1: Create pubspec.yaml</p>
            <CodeBlock code={`cat > pubspec.yaml << EOF
name: dart_hello
description: A simple Dart CLI application
version: 1.0.0
environment:
  sdk: ^3.0.0

dependencies:
  http: ^1.1.0
EOF`} />
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Step 2: Create the application</p>
            <CodeBlock code={`mkdir -p bin
cat > bin/main.dart << EOF
import 'dart:io';

void main() async {
  final server = await HttpServer.bind('0.0.0.0', 8080);
  print('Server listening on port 8080');

  await for (final request in server) {
    request.response
      ..headers.contentType = ContentType.text
      ..write('Hello from DHI Dart!')
      ..close();
  }
}
EOF`} />
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Step 3: Create the Dockerfile</p>
            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>
              Create a Dockerfile with the following content to compile and run the project. Replace <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem', fontFamily: 'monospace' }}>&lt;tag&gt;</code> with the image variant you want to run.
            </p>
            <CodeBlock code={`# syntax=docker/dockerfile:1

## Build stage
FROM dhi.io/dart:<tag> AS build-stage

WORKDIR /app
COPY pubspec.yaml ./
RUN dart pub get

COPY . .
RUN dart compile exe bin/main.dart -o /app/server

## Runtime stage
FROM dhi.io/dart:<tag> AS runtime-stage

WORKDIR /app
COPY --from=build-stage /app/server /app/server

EXPOSE 8080
CMD ["/app/server"]`} />
            <CodeBlock code={`docker build -t my-dart-app .
docker run -d -p 8080:8080 --name my-dart-app my-dart-app

# Test the server
curl http://localhost:8080/

# Clean up
docker stop my-dart-app && docker rm my-dart-app`} />
          </div>

          <div id="compile-inside" style={{ marginBottom: 28 }}>
            <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>
              Compile your app inside the Docker container
            </h5>
            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
              There may be occasions where it is not appropriate to run your app inside a container. To compile, but not run your app inside the Docker instance, you can write something like:
            </p>
            <CodeBlock code={`docker run --rm \\
  -v "$PWD":/app \\
  -w /app \\
  dhi.io/dart:<tag> \\
  dart compile exe bin/main.dart -o my-app`} />
          </div>

          <div id="package-commands">
            <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>
              Run Dart package commands
            </h5>
            <CodeBlock code={`# Get dependencies
docker run --rm -v "$PWD":/app -w /app dhi.io/dart:<tag> dart pub get

# Run tests
docker run --rm -v "$PWD":/app -w /app dhi.io/dart:<tag> dart test

# Analyze code
docker run --rm -v "$PWD":/app -w /app dhi.io/dart:<tag> dart analyze`} />
          </div>
        </section>

        {/* Image variants */}
        <section id="image-variants" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>
            Image variants
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
            Docker Hardened Images come in different variants depending on their intended use.
          </p>
          <ul style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Runtime variants</strong> are designed to run your application in production. These images run as the nonroot user, do not include a package manager, and contain only the minimal set of libraries needed to run the app.
            </li>
            <li>
              <strong>Build-time variants</strong> typically include <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem', fontFamily: 'monospace' }}>dev</code> in the variant name and are intended for use in the first stage of a multi-stage Dockerfile. These images run as root, include a shell and package manager, and are used to build or compile applications.
            </li>
          </ul>
        </section>

        {/* Migrate */}
        <section id="migrate" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>
            Migrate to a Docker Hardened Image
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 16 }}>
            To migrate your application to a Docker Hardened Image, update your Dockerfile. At minimum, update the base image to a Docker Hardened Image.
          </p>
          <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '30%' }}>Item</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Migration note</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Base image', 'Replace your base images in your Dockerfile with a Docker Hardened Image.'],
                  ['Package management', 'Non-dev images don\'t contain package managers. Use package managers only in images with a dev tag.'],
                  ['Non-root user', 'By default, non-dev images run as the nonroot user. Ensure that necessary files and directories are accessible to the nonroot user.'],
                  ['Multi-stage build', 'Use images with a dev tag for build stages and non-dev images for runtime.'],
                  ['TLS certificates', 'Docker Hardened Images contain standard TLS certificates by default. No need to install them.'],
                  ['Ports', 'Non-dev images run as nonroot and can\'t bind to privileged ports (below 1024). Configure your app to listen on port 1025 or higher.'],
                  ['Entry point', 'Docker Hardened Images may have different entry points than Docker Official Images. Inspect and update your Dockerfile if necessary.'],
                  ['No shell', 'Some images don\'t contain a shell. Use dev images in build stages and copy artifacts to the runtime stage.'],
                ].map(([item, note], i, arr) => (
                  <tr key={item} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#374151', verticalAlign: 'top' }}>{item}</td>
                    <td style={{ padding: '10px 14px', color: '#6b7280', lineHeight: 1.6 }}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <PlgNudge
          text={isSelectAtLimit ? "Need more customizations? Contact sales to increase your limit." : "Going to production? DHI Enterprise includes audit logs, compliance reporting, and a dedicated security review."}
          cta={enterpriseCta}
          onClick={onTryEnterprise}
        />

        {/* Troubleshooting */}
        <section id="troubleshooting" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 16 }}>
            Troubleshooting migration
          </h4>
          {[
            {
              id: 'general-debugging',
              title: 'General debugging',
              body: 'The hardened images intended for runtime don\'t contain a shell nor any tools for debugging. The recommended method for debugging is to use Docker Debug to attach to these containers. Docker Debug provides a shell, common debugging tools, and lets you install other tools in an ephemeral, writable layer.',
            },
            {
              id: 'permissions',
              title: 'Permissions',
              body: 'By default, image variants intended for runtime run as a nonroot user. Ensure that necessary files and directories are accessible to that user. You may need to copy files to different directories or change permissions.',
            },
            {
              id: 'privileged-ports',
              title: 'Privileged ports',
              body: 'Non-dev hardened images run as a nonroot user by default. Applications in these images can\'t bind to privileged ports (below 1024). Configure your application to listen on port 1025 or higher inside the container.',
            },
            {
              id: 'no-shell',
              title: 'No shell',
              body: 'By default, image variants intended for runtime don\'t contain a shell. Use dev images in build stages to run shell commands and then copy any necessary artifacts into the runtime stage.',
            },
            {
              id: 'entry-point',
              title: 'Entry point',
              body: 'Docker Hardened Images may have different entry points than Docker Official Images. To view the Entrypoint or CMD defined for an image variant, select the Images tab, select a tag, and then select the Specifications tab.',
            },
          ].map((section, i, arr) => (
            <div key={section.id}>
              <div id={section.id} style={{ marginBottom: 20 }}>
                <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                  {section.title}
                </h5>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
                  {section.body}
                </p>
              </div>

            </div>
          ))}
        </section>
      </div>

      {/* On this page — sticky right rail */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: 24 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
            On this page
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {GUIDE_SECTIONS.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontSize: '0.8125rem',
                  color: '#6b7280',
                  textDecoration: 'none',
                  padding: '3px 0',
                  lineHeight: 1.5,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1d63ed')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

// ── Images tab ───────────────────────────────────────────────────────────────

function CheckMark({ yes }: { yes: boolean }) {
  if (!yes) return <span style={{ color: '#9ca3af' }}>—</span>;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="#374151" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VulnCell({ vulns }: { vulns: { c: number; h: number; m: number; l: number; u: number } }) {
  const total = vulns.c + vulns.h + vulns.m + vulns.l + vulns.u;
  if (total === 0) {
    return (
      <span className="flex items-center gap-1 text-sm" style={{ color: '#388e3c' }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#388e3c" strokeWidth="1.5" />
          <path d="M5 8l2.5 2.5L11 5.5" stroke="#388e3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        None
      </span>
    );
  }
  const pills = [
    { count: vulns.c, color: '#d52536' },
    { count: vulns.h, color: '#d52536' },
    { count: vulns.m, color: '#e8a100' },
    { count: vulns.l, color: '#e8c700' },
    { count: vulns.u, color: '#9ca3af' },
  ];
  return (
    <div className="flex items-center" style={{ gap: 2 }}>
      {pills.map((p, i) => (
        <span
          key={i}
          style={{
            minWidth: 20,
            padding: '0 5px',
            height: 20,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            fontSize: '0.6875rem',
            fontWeight: 700,
            background: p.count > 0 ? p.color : '#f3f4f6',
            color: p.count > 0 ? '#fff' : '#9ca3af',
          }}
        >
          {p.count}
        </span>
      ))}
    </div>
  );
}

function DistroChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 7px',
        borderRadius: 4,
        fontSize: '0.6875rem',
        fontWeight: 700,
        background: color,
        color: '#fff',
        marginLeft: 6,
        letterSpacing: '0.02em',
      }}
    >
      {label.toUpperCase()}
    </span>
  );
}

function ImagesTab({ slug }: { slug: string }) {
  const [search, setSearch] = useState('');
  const versions = IMAGE_VERSIONS_DATA.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.distro.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center gap-2 rounded-md border border-border bg-card px-3"
          style={{ width: 280, height: 36 }}
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
          className="flex items-center gap-1.5 rounded-md border border-border bg-card text-foreground cursor-pointer"
          style={{ height: 36, padding: '0 12px', fontSize: '0.8125rem', fontFamily: 'inherit' }}
        >
          Filter by
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '14%' }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {[
                { label: 'Image version', sortable: true },
                { label: 'Type' },
                { label: 'Compliance' },
                { label: 'Package Manager' },
                { label: 'Shell' },
                { label: 'User' },
                { label: 'Last pushed' },
                { label: 'Vulnerabilities' },
              ].map(col => (
                <th
                  key={col.label}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    background: '#f9fafb',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                  {col.sortable && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4, display: 'inline' }}>
                      <path d="M5 7L2 4h6L5 7z" fill="#9ca3af" />
                    </svg>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {versions.map((v, i) => (
              <tr
                key={v.id}
                style={{
                  borderBottom: i < versions.length - 1 ? '1px solid var(--border)' : 'none',
                  verticalAlign: 'top',
                }}
              >
                {/* Image version */}
                <td style={{ padding: '12px 14px' }}>
                  <Link
                    to={`/v3/image/${slug}/version/${v.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span style={{ color: '#1d63ed', fontWeight: 520, fontSize: '0.875rem' }}>
                      {v.name}
                    </span>
                    <DistroChip label={v.distro} color={v.distroColor} />
                  </Link>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: 3, lineHeight: 1.4 }}>
                    Tags: {v.tags}
                  </div>
                </td>
                {/* Type */}
                <td style={{ padding: '12px 14px', fontSize: '0.875rem', color: '#374151', verticalAlign: 'middle' }}>
                  {v.type}
                </td>
                {/* Compliance */}
                <td style={{ padding: '12px 14px', fontSize: '0.875rem', color: '#374151', verticalAlign: 'middle' }}>
                  {v.compliance}
                </td>
                {/* Package Manager */}
                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                  <CheckMark yes={v.packageManager} />
                </td>
                {/* Shell */}
                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                  <CheckMark yes={v.shell} />
                </td>
                {/* User */}
                <td style={{ padding: '12px 14px', fontSize: '0.8125rem', color: '#374151', verticalAlign: 'middle' }}>
                  {v.user}
                </td>
                {/* Last pushed */}
                <td style={{ padding: '12px 14px', fontSize: '0.8125rem', color: '#374151', verticalAlign: 'middle' }}>
                  {v.lastPushed}
                </td>
                {/* Vulnerabilities */}
                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                  <VulnCell vulns={v.vulns} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-3 mt-4" style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
        <span>Rows per page:</span>
        <button
          className="flex items-center gap-1 border border-border rounded bg-card cursor-pointer"
          style={{ padding: '3px 8px', fontFamily: 'inherit', fontSize: '0.8125rem', color: '#374151' }}
        >
          10 <ChevronDown size={12} />
        </button>
        <span>1–{versions.length} of {versions.length}</span>
        <button className="border border-border rounded bg-card cursor-not-allowed p-1 opacity-40">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className="border border-border rounded bg-card cursor-not-allowed p-1 opacity-40">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ImageDetailPageV3() {
  const { authState, daysRemaining } = useApp();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const isTrial = authState === 'org-trial';
  const isTrialEnded = authState === 'org-trial-ended' || authState === 'org-trial-ended-extended';
  const isSelectAtLimit = authState === 'org-select-customization-limit';
  const isEntitled = authState === 'org-entitled' || authState === 'org-at-limit' || authState === 'org-select-customization-limit' || isTrial || isTrialEnded;
  const imageName = slug ?? 'alpine-linux';

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <ScenarioBar mode="back" />
      <Navbar />

      <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
        <div className="mx-auto py-10 px-6 md:px-10" style={{ maxWidth: 1536 }}>
          <PageBreadcrumb crumbs={[
            { label: 'DHI', href: '/v3' },
            { label: 'Operating Systems', href: '/v3' },
            { label: imageName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') },
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
                <AboutSection imageName={imageName} />
              </div>

              {/* Right column */}
              <div className="col-span-12 md:col-span-5 flex flex-col" style={{ gap: 20 }}>
                {!isEntitled && (
                  <TryEnterpriseCard onTry={() => navigate('/v3/plans')} />
                )}
                {isSelectAtLimit && (
                  <CustomizationLimitCard />
                )}
                {(isTrial || authState === 'org-trial-ended' || authState === 'org-trial-ended-extended') && (
                  <TrialUpgradeCard daysRemaining={daysRemaining} authState={authState} />
                )}
                <SecuritySummaryCard onViewDetails={() => setActiveTab('images')} />
                <GotQuestionsCard />
              </div>
            </div>
          )}

          {activeTab === 'guides' && (
            <GuidesTab
              onTryEnterprise={isSelectAtLimit ? () => navigate('/v3/manage') : () => navigate('/v3/plans')}
              isSelectAtLimit={isSelectAtLimit}
            />
          )}

          {activeTab === 'images' && (
            <ImagesTab slug={slug ?? ''} />
          )}
        </div>
      </main>

      <UseThisImageDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
