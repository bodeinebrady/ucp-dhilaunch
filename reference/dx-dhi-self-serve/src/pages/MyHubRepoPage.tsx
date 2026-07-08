import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Search, AlertTriangle, Zap, Check, X } from 'lucide-react';
import ScenarioBar from '../components/ScenarioBar';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { ORG_USER } from '../data/imageData';

type Tab = 'general' | 'tags' | 'image-management' | 'customizations';

// ── Sidebar (reused from manage page) ────────────────────────────────────────

function MyHubSidebar() {
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

      {[
        { label: 'Repositories', onClick: () => navigate('/v3/manage') },
      ].map(item => (
        <button
          key={item.label}
          onClick={item.onClick}
          className="w-full flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left"
          style={{ padding: '8px 20px', fontSize: '0.875rem', fontWeight: 420, color: 'var(--foreground)', fontFamily: 'inherit' }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--muted-foreground)' }}>
            <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          {item.label}
        </button>
      ))}

      <button className="w-full flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left" style={{ padding: '8px 20px', fontSize: '0.875rem', fontWeight: 420, color: 'var(--foreground)', fontFamily: 'inherit' }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--muted-foreground)' }}>
          <path d="M8 2L3 4v4c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V4L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        Hardened Images
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--muted-foreground)', marginLeft: 'auto', transform: 'rotate(180deg)' }}>
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div style={{ paddingLeft: 20 }}>
        <button onClick={() => navigate('/v3')} className="w-full flex items-center cursor-pointer border-none bg-transparent text-left" style={{ padding: '6px 20px 6px 16px', fontSize: '0.875rem', fontWeight: 420, color: 'var(--foreground)', fontFamily: 'inherit' }}>Catalog</button>
        <button onClick={() => navigate('/v3/manage')} className="w-full flex items-center cursor-pointer border-none bg-transparent text-left" style={{ padding: '6px 20px 6px 16px', fontSize: '0.875rem', fontWeight: 420, color: 'var(--foreground)', fontFamily: 'inherit' }}>Manage</button>
      </div>

      <button className="w-full flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left" style={{ padding: '8px 20px', fontSize: '0.875rem', fontWeight: 420, color: 'var(--foreground)', fontFamily: 'inherit' }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--muted-foreground)' }}>
          <path d="M2 12l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Analytics
      </button>
    </aside>
  );
}

// ── Repo header ───────────────────────────────────────────────────────────────

function RepoHeader({ repoName, sourceName }: { repoName: string; sourceName: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="flex items-center justify-center rounded-md flex-shrink-0"
          style={{ width: 40, height: 40, background: 'rgba(29,99,237,0.1)', border: '1px solid rgba(29,99,237,0.2)' }}
        >
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M8 18h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="#1d63ed" />
            <path d="M8 15h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="#1d63ed" />
            <path d="M11 12h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="#1d63ed" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: '1.125rem', fontWeight: 680, color: 'var(--foreground)', margin: 0 }}>
              {ORG_USER.org}/{repoName}
            </h1>
            {/* Verified badge */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#1d63ed" />
              <path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* DHI shield */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L3 4v4c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V4L8 2z" fill="#2e7f74" />
              <path d="M5.5 8l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground" style={{ marginTop: 3 }}>
            <span>Last pushed 4 days ago</span>
            <span>·</span>
            <span>Repository size: 751.7 GB</span>
            <span>·</span>
            <span>⭐ 0</span>
            <span>·</span>
            <span>↓ 152</span>
            <span>·</span>
            <a href="#" style={{ color: '#1d63ed', textDecoration: 'none' }}>Mirror of {sourceName} ↗</a>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 8, marginLeft: 52 }}>
        <button className="border-none bg-transparent p-0 cursor-pointer text-xs" style={{ color: 'var(--muted-foreground)' }}>Add a description</button>
        <br />
        <button className="border-none bg-transparent p-0 cursor-pointer text-xs" style={{ color: 'var(--muted-foreground)' }}>Add a category</button>
      </div>
    </div>
  );
}

// ── Vuln pills ────────────────────────────────────────────────────────────────

function VulnPills({ c, h, m, l, u }: { c: number; h: number; m: number; l: number; u: number }) {
  const pills = [
    { count: c, color: '#d52536' },
    { count: h, color: '#d52536' },
    { count: m, color: '#e8a100' },
    { count: l, color: '#e8c700' },
    { count: u, color: '#9ca3af' },
  ];
  return (
    <div className="flex items-center" style={{ gap: 2 }}>
      {pills.map((p, i) => (
        <span key={i} style={{
          minWidth: 20, padding: '0 5px', height: 20,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 3, fontSize: '0.6875rem', fontWeight: 700,
          background: p.count > 0 ? p.color : '#f3f4f6',
          color: p.count > 0 ? '#fff' : '#9ca3af',
        }}>{p.count}</span>
      ))}
    </div>
  );
}

function HealthBadge({ grade }: { grade: string }) {
  const color = grade === 'A' ? '#388e3c' : grade === 'B' ? '#1d63ed' : '#e8a100';
  return (
    <span className="inline-flex items-center justify-center rounded-full text-white"
      style={{ width: 26, height: 26, fontSize: '0.8125rem', fontWeight: 900, background: color }}>
      {grade}
    </span>
  );
}

// ── Trial repo card ───────────────────────────────────────────────────────────

function TrialRepoCard({ authState, daysRemaining, onUpgrade }: {
  authState: string;
  daysRemaining: number;
  onUpgrade: () => void;
}) {
  const isTrialEnded = authState === 'org-trial-ended';
  const urgent = !isTrialEnded && daysRemaining <= 7;
  const warm = !isTrialEnded && daysRemaining <= 14 && daysRemaining > 7;

  const bg = isTrialEnded
    ? 'rgba(232,161,0,0.06)'
    : urgent
    ? 'rgba(213,37,54,0.05)'
    : warm
    ? 'rgba(232,161,0,0.06)'
    : 'rgba(29,99,237,0.05)';

  const border = isTrialEnded
    ? 'rgba(232,161,0,0.25)'
    : urgent
    ? 'rgba(213,37,54,0.2)'
    : warm
    ? 'rgba(232,161,0,0.25)'
    : 'rgba(29,99,237,0.15)';

  const iconColor = isTrialEnded ? '#b45309' : urgent ? '#d52536' : warm ? '#b45309' : '#1d63ed';
  const headlineColor = isTrialEnded ? '#78350f' : urgent ? '#7f1d1d' : warm ? '#78350f' : '#1e3a5f';
  const btnBg = isTrialEnded ? '#b45309' : urgent ? '#d52536' : warm ? '#b45309' : '#1d63ed';

  const headline = isTrialEnded
    ? 'Trial ended'
    : urgent
    ? `Trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
    : warm
    ? `${daysRemaining} days left in your trial`
    : `${daysRemaining} days remaining in your trial`;

  const body = isTrialEnded
    ? 'This repository has stopped receiving SLA-backed updates. Upgrade to restore full access.'
    : urgent
    ? 'Upgrade now to keep this repository receiving SLA-backed updates without interruption.'
    : warm
    ? 'Upgrade to DHI Enterprise to keep this repository after your trial ends.'
    : 'Upgrade anytime to keep this repository after your trial.';

  return (
    <div className="rounded-xl" style={{ padding: '16px', background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2 mb-2">
        {isTrialEnded || warm
          ? <AlertTriangle size={14} style={{ color: iconColor, flexShrink: 0 }} />
          : <Zap size={14} style={{ color: iconColor, flexShrink: 0 }} />
        }
        <span style={{ fontSize: '0.8125rem', fontWeight: 680, color: headlineColor }}>
          {headline}
        </span>
      </div>
      <p className="text-xs" style={{ color: isTrialEnded ? '#92400e' : urgent ? '#991b1b' : warm ? '#92400e' : 'var(--muted-foreground)', lineHeight: 1.5, marginBottom: 10 }}>
        {body}
      </p>
      <button
        onClick={onUpgrade}
        style={{
          width: '100%', background: btnBg, color: '#fff',
          border: 'none', borderRadius: 5, padding: '7px 12px',
          fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Try DHI Enterprise
      </button>
    </div>
  );
}

// ── General tab ───────────────────────────────────────────────────────────────

const TAGS_PREVIEW = [
  { tag: '11.0.22-jdk21-fips', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', pulled: '4 days', pushed: '4 days' },
  { tag: '9-jdk25-fips',       vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', pulled: '4 days', pushed: '4 days' },
  { tag: '11.0.22-jdk25-deb…', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', pulled: '4 days', pushed: '4 days' },
  { tag: '11-jdk25-debian13-…', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', pulled: '4 days', pushed: '4 days' },
  { tag: '11.0-jdk25-debian1…', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', pulled: '4 days', pushed: '4 days' },
];

function GeneralTab({ repoName, onTabChange, authState, daysRemaining }: {
  repoName: string;
  onTabChange: (t: Tab) => void;
  authState: string;
  daysRemaining: number;
}) {
  const navigate = useNavigate();
  const isTrial = authState === 'org-trial';
  const isTrialEnded = authState === 'org-trial-ended';
  const urgent = isTrial && daysRemaining <= 7;

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left — tags preview + overview */}
      <div className="col-span-8">
        <div className="rounded-lg border border-border bg-card" style={{ padding: 20, marginBottom: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 680, margin: 0 }}>Tags</h3>
            <span className="text-xs text-muted-foreground">Analyzed by Docker Scout</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">This repository contains 1658 tag(s).</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Tag', 'OS', 'Vulnerabilities', 'Health', 'Pulled', 'Pushed'].map(col => (
                  <th key={col} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TAGS_PREVIEW.map((row, i) => (
                <tr key={row.tag} style={{ borderBottom: i < TAGS_PREVIEW.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '10px 10px' }}>
                    <span className="flex items-center gap-1.5">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#388e3c', display: 'inline-block', flexShrink: 0 }} />
                      <button className="border-none bg-transparent p-0 cursor-pointer hover:underline" style={{ color: '#1d63ed', fontSize: '0.8125rem', fontFamily: 'inherit' }}>{row.tag}</button>
                    </span>
                  </td>
                  <td style={{ padding: '10px 10px' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="#9ca3af" strokeWidth="1.2" /><path d="M5 8h6M8 5v6" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" /></svg>
                  </td>
                  <td style={{ padding: '10px 10px' }}><VulnPills {...row.vulns} /></td>
                  <td style={{ padding: '10px 10px' }}><HealthBadge grade={row.health} /></td>
                  <td style={{ padding: '10px 10px', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{row.pulled}</td>
                  <td style={{ padding: '10px 10px', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{row.pushed}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => onTabChange('tags')} className="border-none bg-transparent p-0 cursor-pointer text-sm hover:underline mt-3" style={{ color: '#1d63ed' }}>See all</button>
        </div>

        <div className="rounded-lg border border-border bg-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 680, marginBottom: 12 }}>Repository overview</h3>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>How to use this image</h4>
          <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.7 }}>
            Run a {repoName} container using the mirrored image from your org registry. No dhi.io auth required in CI.
          </p>
          <div style={{ background: '#1e2433', borderRadius: 6, padding: '10px 14px', marginTop: 12, fontFamily: 'monospace', fontSize: '0.8125rem', color: '#e2e8f0' }}>
            docker pull {ORG_USER.org}/{repoName}:latest
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div className="col-span-4 flex flex-col gap-4">
        {/* Trial nudge in right rail — preserves full state */}
        {(isTrial || isTrialEnded) && (
          <TrialRepoCard
            authState={authState}
            daysRemaining={daysRemaining}
            onUpgrade={() => navigate('/v3/plans')}
          />
        )}

        {/* Get started card */}
        <div className="rounded-lg border border-border bg-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 680, marginBottom: 16 }}>
            Get started with your hardened {repoName} image
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: 28, height: 28, background: 'rgba(29,99,237,0.08)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#1d63ed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Test your image locally</div>
                <div style={{ background: '#f4f4f6', borderRadius: 4, padding: '6px 10px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#17191e' }}>
                  docker pull {ORG_USER.org}/{repoName}:latest
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: 28, height: 28, background: 'rgba(46,127,116,0.08)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" rx="1.5" stroke="#2e7f74" strokeWidth="1.4" /><path d="M6 8h4M8 6v4" stroke="#2e7f74" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Customize your image</div>
                <p className="text-xs text-muted-foreground" style={{ lineHeight: 1.5, marginBottom: 8 }}>
                  Extend Docker Hardened Images with your internal certificates, tools and files — no Dockerfile required.
                </p>
                <button
                  onClick={() => onTabChange('customizations')}
                  style={{
                    background: '#1d63ed', color: '#fff', border: 'none', borderRadius: 5,
                    padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Customize image
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: 28, height: 28, background: 'rgba(125,46,255,0.08)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#7d2eff" strokeWidth="1.4" /><path d="M8 5v3l2 2" stroke="#7d2eff" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>Migrate with confidence</div>
                <p className="text-xs text-muted-foreground" style={{ lineHeight: 1.5, marginBottom: 8 }}>
                  Follow guides to replace existing images in your workflows.
                </p>
                <button
                  style={{
                    background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)',
                    borderRadius: 5, padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 420,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Migration guide
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions card */}
        <div className="rounded-lg border border-border bg-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 680, marginBottom: 6 }}>Got questions about Docker Hardened Images?</h3>
          <p className="text-xs text-muted-foreground" style={{ lineHeight: 1.5, marginBottom: 12 }}>
            Join the conversation in the GitHub Discussions forum. Share feedback, ask questions, or connect with the team.
          </p>
          <button style={{ background: 'transparent', color: '#1d63ed', border: '1px solid rgba(29,99,237,0.3)', borderRadius: 5, padding: '6px 14px', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            Go to discussions ↗
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tags tab ──────────────────────────────────────────────────────────────────

const FULL_TAGS = [
  {
    tag: '11.0.22-jdk21-fips',
    digests: [
      { digest: '6d4ba9878d32', arch: 'linux/amd64', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', lastPull: '4 days', size: '78.12 MB' },
      { digest: 'b143bd064fa7', arch: 'linux/arm64', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', lastPull: '4 days', size: '77.87 MB' },
    ],
  },
  {
    tag: '9-jdk25-fips',
    digests: [
      { digest: '79cdb5040877', arch: 'linux/amd64', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', lastPull: '4 days', size: '85.52 MB' },
      { digest: 'c85f2731874f', arch: 'linux/arm64', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', lastPull: '4 days', size: '85.08 MB' },
    ],
  },
  {
    tag: '11.0.22-jdk25-debian13',
    digests: [
      { digest: 'a3f1c2d4e5b6', arch: 'linux/amd64', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', lastPull: '2 days', size: '91.4 MB' },
      { digest: 'f7e8d9c0b1a2', arch: 'linux/arm64', vulns: { c: 0, h: 0, m: 1, l: 0, u: 0 }, health: 'A', lastPull: '2 days', size: '90.1 MB' },
    ],
  },
];

function TagsTab({ repoName }: { repoName: string }) {
  const [search, setSearch] = useState('');
  const filtered = FULL_TAGS.filter(t => t.tag.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <input type="checkbox" style={{ width: 14, height: 14 }} />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <button className="flex items-center gap-1 border border-border rounded bg-card cursor-pointer" style={{ padding: '5px 10px', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
            Newest
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3" style={{ height: 34, width: 240 }}>
          <Search size={13} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Filter tags"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent text-foreground"
            style={{ fontSize: '0.8125rem', fontFamily: 'inherit' }}
          />
        </div>
        <button className="border border-border rounded bg-card cursor-pointer" style={{ padding: '5px 12px', fontSize: '0.8125rem', fontFamily: 'inherit', color: 'var(--muted-foreground)' }}>Delete</button>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(tagGroup => (
          <div key={tagGroup.tag} className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Tag header */}
            <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <input type="checkbox" style={{ width: 14, height: 14 }} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#388e3c', display: 'inline-block' }} />
                    <span style={{ color: '#1d63ed', fontSize: '0.875rem', fontWeight: 520 }}>{tagGroup.tag}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Last pushed <strong>4 days</strong> by <span style={{ color: '#1d63ed' }}>docker</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--muted-foreground)', background: '#f4f4f6', padding: '4px 10px', borderRadius: 4 }}>
                  docker pull {ORG_USER.org}/{repoName}:{tagGroup.tag}
                </code>
                <button className="border-none bg-transparent p-1 cursor-pointer" style={{ color: '#1d63ed' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>

            {/* Digest table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
                  {['Digest', 'OS/ARCH', 'Vulnerabilities', 'Health score', 'Last pull', 'Compressed size'].map(col => (
                    <th key={col} style={{ padding: '8px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tagGroup.digests.map((d, i) => (
                  <tr key={d.digest} style={{ borderBottom: i < tagGroup.digests.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <button className="border-none bg-transparent p-0 cursor-pointer hover:underline" style={{ color: '#1d63ed', fontSize: '0.8125rem', fontFamily: 'monospace' }}>{d.digest}</button>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '0.8125rem', color: 'var(--foreground)' }}>{d.arch}</td>
                    <td style={{ padding: '10px 14px' }}><VulnPills {...d.vulns} /></td>
                    <td style={{ padding: '10px 14px' }}><HealthBadge grade={d.health} /></td>
                    <td style={{ padding: '10px 14px', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{d.lastPull}</td>
                    <td style={{ padding: '10px 14px', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{d.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Customizations tab ────────────────────────────────────────────────────────

const CUSTOMIZATIONS = [
  { name: 'CSP team',    version: 'Node.js 23.x Dev', tags: '23.11-debian12-dev, 23.11.1-dev, 23.11-dev, 23-dev', createdBy: 'Megan Callaghan', updatedBy: 'Megan Callaghan', status: 'building' as const },
  { name: 'CSP',         version: 'Node.js 23.x Dev', tags: '23.11-debian12-dev, 23.11.1-dev, 23.11-dev, 23-dev', createdBy: 'Toni Robinson',   updatedBy: 'Toni Robinson',   status: 'failed' as const },
  { name: 'Custom prod', version: 'Node.js 23.x',     tags: '23.11-debian12, 23-debian12, 23.11.1, 23.11, 23',   createdBy: 'Fred Fredup',      updatedBy: 'Fred Fredup',     status: 'completed' as const },
];

const TRIAL_CUSTOMIZATION_LIMIT = 3;

function CustomizationsTab({ authState }: { authState: string }) {
  const navigate = useNavigate();
  const { daysRemaining } = useApp();
  const isTrial = authState === 'org-trial';
  const isTrialEnded = authState === 'org-trial-ended';
  const isSelectAtLimit = authState === 'org-select-customization-limit';
  const urgent = isTrial && daysRemaining <= 7;
  const atLimit = isSelectAtLimit || ((isTrial || isTrialEnded) && CUSTOMIZATIONS.length >= TRIAL_CUSTOMIZATION_LIMIT);

  const bannerBg = isSelectAtLimit
    ? 'rgba(213,37,54,0.05)'
    : isTrialEnded || (!urgent)
    ? 'rgba(232,161,0,0.07)'
    : 'rgba(213,37,54,0.06)';
  const bannerBorder = isSelectAtLimit
    ? 'rgba(213,37,54,0.2)'
    : isTrialEnded || (!urgent)
    ? 'rgba(232,161,0,0.3)'
    : 'rgba(213,37,54,0.2)';
  const bannerIconColor = isSelectAtLimit ? '#d52536' : urgent && !isTrialEnded ? '#d52536' : '#b45309';
  const bannerTextColor = isSelectAtLimit ? '#7f1d1d' : urgent && !isTrialEnded ? '#7f1d1d' : '#78350f';
  const bannerBtnBg = isSelectAtLimit ? '#1d63ed' : isTrialEnded ? '#b45309' : urgent ? '#d52536' : '#b45309';
  const bannerBtnLabel = isSelectAtLimit ? 'Contact sales' : 'Try DHI Enterprise';
  const bannerMessage = isSelectAtLimit
    ? `You've reached the limit of 5 customizations. Remove one to create a new one, or contact sales to increase your limit.`
    : `You've reached the trial limit of ${TRIAL_CUSTOMIZATION_LIMIT} customizations.`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3" style={{ height: 36, width: 320 }}>
          <Search size={13} className="text-muted-foreground flex-shrink-0" />
          <input type="text" placeholder="Search" className="flex-1 border-none outline-none bg-transparent text-foreground" style={{ fontSize: '0.8125rem', fontFamily: 'inherit' }} />
        </div>
        <div className="flex items-center gap-3">
          <button className="border-none bg-transparent p-0 cursor-pointer text-sm hover:underline" style={{ color: '#1d63ed' }}>
            Learn about customizations ↗
          </button>
          <div
            title={atLimit && isSelectAtLimit ? "You've reached the limit of 5 customizations. Remove one to free up a slot." : atLimit ? `Trial limit of ${TRIAL_CUSTOMIZATION_LIMIT} customizations reached.` : undefined}
            style={{ display: 'inline-block', cursor: atLimit ? 'not-allowed' : undefined }}
          >
            <button
              disabled={atLimit}
              style={{
                background: atLimit ? '#f3f4f6' : '#1d63ed',
                color: atLimit ? '#9ca3af' : '#fff',
                border: atLimit ? '1.5px solid #e5e7eb' : 'none',
                borderRadius: 6, padding: '7px 16px',
                fontSize: '0.875rem', fontWeight: 600,
                cursor: atLimit ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                pointerEvents: atLimit ? 'none' : undefined,
              }}
            >
              Create customization
            </button>
          </div>
        </div>
      </div>

      {/* Limit banner */}
      {atLimit && (
        <div
          className="flex items-center justify-between gap-4 rounded-lg mb-5"
          style={{
            padding: '12px 16px',
            background: bannerBg,
            border: `1px solid ${bannerBorder}`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={15} style={{ color: bannerIconColor, flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: bannerTextColor, lineHeight: 1.5 }}>
              {bannerMessage}
              {!isSelectAtLimit && (
                <>
                  {' '}
                  <button className="border-none bg-transparent p-0 cursor-pointer hover:underline" style={{ color: '#1d63ed', fontSize: '0.875rem', fontFamily: 'inherit' }}>
                    Manage customizations
                  </button>
                  {' '}or upgrade for unlimited access.
                </>
              )}
            </span>
          </div>
          <button
            onClick={() => navigate('/v3/plans')}
            style={{
              flexShrink: 0, background: bannerBtnBg, color: '#fff',
              border: 'none', borderRadius: 5, padding: '6px 14px',
              fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >
            {bannerBtnLabel}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Customization name', 'Image version', 'Created by', 'Updated by', 'Last build', ''].map(col => (
                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CUSTOMIZATIONS.map((row, i) => (
              <tr key={row.name} style={{ borderBottom: i < CUSTOMIZATIONS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <button className="border-none bg-transparent p-0 cursor-pointer hover:underline" style={{ color: '#1d63ed', fontSize: '0.875rem', fontFamily: 'inherit' }}>{row.name}</button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{row.version}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)', marginTop: 2 }}>{row.tags}</div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--foreground)' }}>{row.createdBy}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--foreground)' }}>{row.updatedBy}</td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusChip status={row.status} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center gap-3">
                    {row.status === 'building' || row.status === 'failed' ? (
                      <button className="border-none bg-transparent p-0 cursor-pointer hover:underline text-sm" style={{ color: '#1d63ed' }}>View logs</button>
                    ) : (
                      <>
                        <button className="border-none bg-transparent p-0 cursor-pointer hover:underline text-sm" style={{ color: '#1d63ed' }}>View image</button>
                        <button className="border-none bg-transparent p-0 cursor-pointer hover:underline text-sm" style={{ color: '#1d63ed' }}>Edit</button>
                      </>
                    )}
                    <button className="border-none bg-transparent p-0 cursor-pointer" style={{ color: '#d52536' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V3h4v1M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4" style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
        <span>Rows per page:</span>
        <button className="flex items-center gap-1 border border-border rounded bg-card cursor-pointer" style={{ padding: '3px 8px', fontFamily: 'inherit', fontSize: '0.8125rem', color: '#374151' }}>
          10 <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span>1–{CUSTOMIZATIONS.length} of {CUSTOMIZATIONS.length}</span>
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

function StatusChip({ status }: { status: 'building' | 'failed' | 'completed' }) {
  if (status === 'building') return (
    <span className="flex items-center gap-1.5 text-sm" style={{ color: '#1d63ed' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid #1d63ed', display: 'inline-block' }} />
      Building
    </span>
  );
  if (status === 'failed') return (
    <span className="flex items-center gap-1.5 text-sm" style={{ color: '#d52536' }}>
      <X size={14} />
      Failed
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 text-sm" style={{ color: '#388e3c' }}>
      <Check size={14} />
      Completed
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const REPO_META: Record<string, { displayName: string; sourceName: string }> = {
  'dhi-node':     { displayName: 'dhi-node',     sourceName: 'Node.js' },
  'dhi-redis':    { displayName: 'dhi-redis',    sourceName: 'Redis' },
  'dhi-postgres': { displayName: 'dhi-postgres', sourceName: 'PostgreSQL' },
  'dhi-python':   { displayName: 'dhi-python',   sourceName: 'Python' },
  'dhi-nginx':    { displayName: 'dhi-nginx',    sourceName: 'Nginx' },
  'dhi-rust':     { displayName: 'dhi-rust',     sourceName: 'Rust' },
};

export default function MyHubRepoPage() {
  const { authState, daysRemaining } = useApp();
  const { repoSlug } = useParams<{ repoSlug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const isTrial = authState === 'org-trial';
  const isTrialEnded = authState === 'org-trial-ended';
  const meta = REPO_META[repoSlug ?? ''] ?? { displayName: repoSlug ?? 'dhi-node', sourceName: 'Node.js' };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'tags', label: 'Tags' },
    { id: 'image-management', label: 'Image Management' },
    { id: 'customizations', label: 'Customizations' },
  ];

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <ScenarioBar mode="back" />
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <MyHubSidebar />

        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 40px' }}>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
              <button onClick={() => navigate('/v3/manage')} className="border-none bg-transparent p-0 cursor-pointer hover:underline" style={{ color: '#1d63ed', fontFamily: 'inherit', fontSize: '0.875rem' }}>Repositories</button>
              <span>/</span>
              <button onClick={() => navigate('/v3/manage')} className="border-none bg-transparent p-0 cursor-pointer hover:underline" style={{ color: '#1d63ed', fontFamily: 'inherit', fontSize: '0.875rem' }}>{meta.displayName}</button>
              <span>/</span>
              <span style={{ textTransform: 'capitalize' }}>{activeTab}</span>
            </div>

            <RepoHeader repoName={meta.displayName} sourceName={meta.sourceName} />

            {/* Tabs */}
            <div className="flex border-b border-border" style={{ margin: '20px 0 24px' }}>
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
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === 'general' && (
              <GeneralTab
                repoName={meta.displayName}
                onTabChange={setActiveTab}
                authState={authState}
                daysRemaining={daysRemaining}
              />
            )}
            {activeTab === 'tags' && <TagsTab repoName={meta.displayName} />}
            {activeTab === 'image-management' && (
              <div className="text-sm text-muted-foreground" style={{ padding: '40px 0' }}>Image Management tab — not in scope for this prototype.</div>
            )}
            {activeTab === 'customizations' && (
              <CustomizationsTab authState={authState} />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
