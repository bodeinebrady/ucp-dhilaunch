import { useState } from 'react';
import { Info, Shield, ArrowRight, ChevronDown } from 'lucide-react';
import { IMAGE_DATA, IMAGE_VERSIONS } from '../data/imageData';

// ── Tier-derived values ──────────────────────────────────────────────────────
// DHI Free is hardened at build time but lacks continuous remediation.
// We derive Free-tier values from the image's enterprise baseline.

function freePackagesFromEnterprise(n: number): number {
  // Same package set on Free; show parity
  return n;
}

function freeSizeFromEnterprise(s: string): string {
  // Same content; same size
  return s;
}

function freePushedFromEnterprise(): string {
  // Free images follow upstream cadence — older
  return '18 days ago';
}

interface ComparisonViewProps {
  imageVersion: string;
  onVersionChange: (v: string) => void;
  onStartTrial: () => void;
}

const VulnPills = ({
  vulns,
}: {
  vulns: { c: number; h: number; m: number; l: number };
}) => {
  const pills = [
    { label: 'C', count: vulns.c, bg: '#d32f2f' },
    { label: 'H', count: vulns.h, bg: '#f57c00' },
    { label: 'M', count: vulns.m, bg: '#f9a825' },
    { label: 'L', count: vulns.l, bg: '#7cb342' },
    { label: 'U', count: 0, bg: '#757575' },
  ];
  return (
    <div className="flex items-center" style={{ gap: 4 }}>
      {pills.map((p) => {
        const has = p.count > 0;
        return (
          <div
            key={p.label}
            className="inline-flex items-center justify-center rounded text-center"
            style={{
              minWidth: 24,
              padding: '2px 6px',
              backgroundColor: has ? p.bg : 'var(--accent, #f4f4f6)',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: 1,
                color: has ? '#fff' : 'var(--muted-foreground)',
              }}
            >
              {p.count}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const HealthScore = ({ grade, color }: { grade: string; color: string }) => (
  <div className="flex items-center" style={{ gap: 6 }}>
    <Shield size={16} style={{ color }} />
    <span style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{grade}</span>
  </div>
);

const ENT_BG = 'rgba(227,242,253,0.32)'; // light blue tint for Enterprise column

const TH: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: '0.8125rem',
  fontWeight: 700,
  borderBottom: '1px solid var(--border)',
};

const TD: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '0.875rem',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'middle',
};

const TD_LABEL: React.CSSProperties = {
  ...TD,
  fontWeight: 600,
  color: 'var(--muted-foreground)',
};

export function ComparisonView({
  imageVersion,
  onVersionChange,
  onStartTrial,
}: ComparisonViewProps) {
  const [tipOpen, setTipOpen] = useState<string | null>(null);

  const data = IMAGE_DATA[imageVersion] ?? IMAGE_DATA['node:20-bookworm'];
  const enterprise = data.enterprise;

  // Distribution from version name: alpine vs bookworm
  const distro = imageVersion.includes('alpine')
    ? 'Alpine 3.20'
    : 'Debian 12 (bookworm)';

  return (
    <div className="bg-card border border-border rounded-lg" style={{ padding: 24 }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, marginBottom: 4 }}>
        Comparison
      </h3>
      <p
        className="text-sm text-muted-foreground"
        style={{ marginBottom: 16, lineHeight: 1.5 }}
      >
        Both tiers share the same secure foundation. Enterprise adds continuous
        guarantees and capabilities on top.
      </p>

      {/* Version selector */}
      <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
        <span
          className="text-xs text-muted-foreground"
          style={{ fontWeight: 600, flexShrink: 0 }}
        >
          Comparing version:
        </span>
        <div
          className="relative inline-flex items-center rounded-md border border-border bg-card"
          style={{ padding: '4px 10px' }}
        >
          <select
            value={imageVersion}
            onChange={(e) => onVersionChange(e.target.value)}
            className="appearance-none bg-transparent cursor-pointer"
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.75rem',
              fontWeight: 520,
              color: 'var(--foreground)',
              fontFamily: 'inherit',
              paddingRight: 18,
            }}
          >
            {IMAGE_VERSIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute pointer-events-none text-muted-foreground"
            style={{ right: 8 }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="border border-border rounded-lg"
        style={{ overflow: 'hidden' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--muted, rgba(0,0,0,0.025))' }}>
              <th style={{ ...TH, width: '32%' }} />
              <th style={TH}>DHI Enterprise</th>
              <th
                style={{ ...TH, color: 'var(--muted-foreground)' }}
              >
                DHI Free
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={TD_LABEL}>Distribution</td>
              <td style={{ ...TD, fontWeight: 700, background: ENT_BG }}>
                {distro}
              </td>
              <td style={TD}>{distro}</td>
            </tr>
            <tr>
              <td style={TD_LABEL}>Packages</td>
              <td style={{ ...TD, fontWeight: 700, background: ENT_BG }}>
                {enterprise.pkgs} packages
              </td>
              <td style={TD}>
                {freePackagesFromEnterprise(enterprise.pkgs)} packages
              </td>
            </tr>
            <tr>
              <td style={TD_LABEL}>Size</td>
              <td style={{ ...TD, fontWeight: 700, background: ENT_BG }}>
                {enterprise.size}
              </td>
              <td style={TD}>{freeSizeFromEnterprise(enterprise.size)}</td>
            </tr>
            <tr>
              <td style={TD_LABEL}>Last pushed</td>
              <td style={{ ...TD, fontWeight: 700, background: ENT_BG }}>
                2 days ago
              </td>
              <td style={TD}>{freePushedFromEnterprise()}</td>
            </tr>

            <tr>
              <td style={TD_LABEL}>Remediation</td>
              <td style={{ ...TD, background: ENT_BG }}>
                <Tooltip
                  open={tipOpen === 'rem-ent'}
                  onToggle={(o) => setTipOpen(o ? 'rem-ent' : null)}
                  content="Continuously remediated, vulnerabilities are patched as soon as fixes are available, with a guaranteed SLA."
                >
                  <span style={{ fontWeight: 700 }}>Continuous</span>
                  <Info size={12} className="text-muted-foreground" />
                </Tooltip>
              </td>
              <td style={TD}>
                <Tooltip
                  open={tipOpen === 'rem-free'}
                  onToggle={(o) => setTipOpen(o ? 'rem-free' : null)}
                  content="Follows upstream patching cadence, images are rebuilt when the upstream project releases a fix."
                >
                  <span>Upstream</span>
                  <Info size={12} className="text-muted-foreground" />
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td style={TD_LABEL}>SLA</td>
              <td style={{ ...TD, background: ENT_BG }}>
                <div
                  className="flex flex-col"
                  style={{ gap: 2 }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Critical &amp; High: 7 days
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Medium &amp; Low: 30 days
                  </span>
                </div>
              </td>
              <td style={TD}>None</td>
            </tr>

            {/* Section header: Security */}
            <tr style={{ background: 'var(--muted, rgba(0,0,0,0.025))' }}>
              <td
                colSpan={3}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                Security
              </td>
            </tr>

            <tr>
              <td style={TD_LABEL}>Vulnerabilities</td>
              <td style={{ ...TD, background: ENT_BG }}>
                <VulnPills vulns={enterprise.cves} />
              </td>
              <td style={TD}>
                <VulnPills vulns={enterprise.cves} />
              </td>
            </tr>
            <tr>
              <td style={TD_LABEL}>Scout health score</td>
              <td style={{ ...TD, background: ENT_BG }}>
                <HealthScore grade="A" color="#388e3c" />
              </td>
              <td style={TD}>
                <HealthScore grade="A" color="#388e3c" />
              </td>
            </tr>
            <tr>
              <td style={TD_LABEL}>SLSA Level</td>
              <td style={{ ...TD, fontWeight: 700, background: ENT_BG }}>L3</td>
              <td style={TD}>L3</td>
            </tr>
            <tr>
              <td style={{ ...TD_LABEL, borderBottom: 'none' }}>Compliance</td>
              <td
                style={{
                  ...TD,
                  background: ENT_BG,
                  borderBottom: 'none',
                }}
              >
                <div className="flex items-center" style={{ gap: 4, flexWrap: 'wrap' }}>
                  {['CIS', 'FIPS', 'STIG'].map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center rounded"
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        background: 'rgba(29,99,237,0.1)',
                        color: '#1d63ed',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </td>
              <td
                style={{
                  ...TD,
                  borderBottom: 'none',
                  color: 'var(--muted-foreground)',
                }}
              >
                None
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Trial CTA */}
      <div
        className="rounded-lg border flex items-center justify-between flex-wrap"
        style={{
          marginTop: 16,
          padding: 16,
          gap: 12,
          background: 'rgba(29,99,237,0.03)',
          borderColor: 'rgba(29,99,237,0.12)',
        }}
      >
        <p className="text-sm text-muted-foreground" style={{ margin: 0, lineHeight: 1.5 }}>
          Get SLA-backed patching, org namespace mirroring, and compliance variants.{' '}
          <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>
            No credit card required.
          </span>
        </p>
        <button
          onClick={onStartTrial}
          className="inline-flex items-center rounded-md text-white border-none cursor-pointer"
          style={{
            background: '#1d63ed',
            padding: '8px 14px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            gap: 6,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Start free trial
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Lightweight tooltip ──────────────────────────────────────────────────────

function Tooltip({
  open,
  onToggle,
  content,
  children,
}: {
  open: boolean;
  onToggle: (open: boolean) => void;
  content: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="relative inline-flex items-center cursor-default"
      style={{ gap: 4 }}
      onMouseEnter={() => onToggle(true)}
      onMouseLeave={() => onToggle(false)}
      onFocus={() => onToggle(true)}
      onBlur={() => onToggle(false)}
      tabIndex={0}
    >
      {children}
      {open && (
        <span
          className="absolute rounded-md text-white"
          style={{
            bottom: '100%',
            left: 0,
            marginBottom: 6,
            padding: '6px 10px',
            background: 'rgba(20,22,30,0.95)',
            fontSize: '0.75rem',
            fontWeight: 420,
            lineHeight: 1.4,
            maxWidth: 260,
            width: 'max-content',
            zIndex: 50,
            pointerEvents: 'none',
            boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
