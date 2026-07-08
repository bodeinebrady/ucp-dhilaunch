import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Download, Star, Search, Sparkles, Zap } from 'lucide-react';
import ScenarioBar from '../components/ScenarioBar';
import Navbar from '../components/Navbar';
import UseThisImageDrawer from '../components/UseThisImageDrawerV2';
import { DhiBadge } from '../components/DhiBadge';
import { useApp } from '../context/AppContext';
import { FEATURED_IMAGES, MONITORING_IMAGES, RECENTLY_ADDED, ORG_USER } from '../data/imageData';
import type { CatalogImage } from '../data/imageData';

// Accent color by type
const ACCENT: Record<CatalogImage['type'], string> = {
  'HARDENED IMAGE': '#2e7f74',
  'HELM CHART': '#1d63ed',
};

const AVATAR_COLORS = [
  '#1d63ed', '#2e7f74', '#7d2eff', '#d52536', '#b85504',
  '#677285', '#0c49c2', '#185a51', '#5700bb', '#8b1924',
];
function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function ImageCard({ image, version }: { image: CatalogImage; version: 'v3' }) {
  const accent = ACCENT[image.type];
  const initial = image.name[0].toUpperCase();
  const color = avatarColor(image.name);
  const slug = image.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <Link
      to={`/${version}/image/${slug}`}
      className="block h-full no-underline"
    >
      <div
        className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden"
        style={{
          padding: '13px 15px 15px',
          transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
          boxSizing: 'border-box',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          el.style.borderColor = accent + '66';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = '';
          el.style.borderColor = '';
        }}
      >
        {/* Row 1: Type label */}
        <div
          style={{
            fontSize: '0.625rem',
            color: 'rgba(0,0,0,0.56)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: 11,
          }}
        >
          {image.type}
        </div>

        {/* Row 2: Avatar + name */}
        <div className="flex items-start gap-2.5 mb-3">
          <div
            className="flex items-center justify-center flex-shrink-0 rounded-md"
            style={{
              width: 32,
              height: 32,
              backgroundColor: color + '18',
              border: `1px solid ${color}33`,
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 900, color, lineHeight: 1 }}>
              {initial}
            </span>
          </div>
          <div className="min-w-0">
            <div
              className="overflow-hidden text-ellipsis whitespace-nowrap text-foreground"
              style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.25 }}
            >
              {image.name}
            </div>
            {image.toolsIncluded !== undefined && (
              <div style={{ fontSize: '0.6875rem', color: '#1d63ed', fontWeight: 520, marginTop: 3 }}>
                ⚡ {image.toolsIncluded} Tools included
              </div>
            )}
          </div>
        </div>

        {/* Row 3: DHI badge */}
        <div className="mb-2">
          <DhiBadge size={12} fontSize="0.6875rem" />
        </div>

        {/* Row 4: Description */}
        <p
          className="text-muted-foreground flex-1"
          style={{
            fontSize: '0.75rem',
            lineHeight: 1.46,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: '#393F49',
            marginBottom: 12,
          }}
        >
          {image.os
            ? `${image.os} · ${image.architecture ?? ''}`
            : image.dependencies ?? 'Hardened container image'}
        </p>

        {/* Row 5: Stats footer */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center gap-1">
            <Clock style={{ width: 13, height: 13, color: 'rgba(0,0,0,0.64)' }} />
            <span style={{ fontSize: '0.6875rem', color: 'rgba(0,0,0,0.64)' }}>1mo ago</span>
          </div>
          <div className="flex items-center gap-1">
            <Download style={{ width: 13, height: 13, color: 'rgba(0,0,0,0.64)' }} />
            <span style={{ fontSize: '0.6875rem', color: 'rgba(0,0,0,0.64)' }}>10M+</span>
          </div>
          <div className="flex items-center gap-1">
            <Star style={{ width: 13, height: 13, color: 'rgba(0,0,0,0.64)' }} />
            <span style={{ fontSize: '0.6875rem', color: 'rgba(0,0,0,0.64)' }}>1.6K</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-foreground mb-4">{children}</h2>
  );
}

export default function CatalogPageV3() {
  const { authState, daysRemaining, panelOpen, setPanelOpen } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const isTrial = authState === 'org-trial';
  const isTrialEnded = authState === 'org-trial-ended' || authState === 'org-trial-ended-extended';
  const isSelectAtLimit = authState === 'org-select-customization-limit';
  const isEntitled = authState === 'org-entitled' || authState === 'org-at-limit' || authState === 'org-select-customization-limit' || isTrial;
  const isOrg = authState.startsWith('org-');
  const isNotEntitled = !isEntitled && !isTrialEnded;

  const trialUrgent = isTrial && daysRemaining <= 7;
  const trialWarm = isTrial && daysRemaining <= 14 && daysRemaining > 7;

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <ScenarioBar mode="back" />
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
          <div className="max-w-screen-xl mx-auto py-10 px-6 md:px-10">



            {/* Hero header — matches live DHI catalog */}
            <div className="mb-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 mb-4" style={{ fontSize: '0.8125rem' }}>
                <button
                  onClick={() => navigate('/v3')}
                  className="border-none bg-transparent p-0 cursor-pointer"
                  style={{ color: '#1d63ed', fontWeight: 420, fontFamily: 'inherit', fontSize: 'inherit' }}
                >
                  Explore
                </button>
                <span style={{ color: 'rgba(0,0,0,0.3)' }}>/</span>
                <span style={{ color: '#111827', fontWeight: 520 }}>Docker Hardened Images</span>
              </div>

              {/* Display headline */}
              <h1
                className="text-foreground"
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: 0,
                  maxWidth: 640,
                }}
              >
                Choose secure, minimal, production-ready images.{' '}
                <span style={{ color: '#6b7280', fontWeight: 500 }}>They're free to use.</span>
              </h1>
            </div>

            {/* Subscription status — entitled non-trial users only */}
            {isEntitled && !isTrial && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="7" fill="#388e3c" />
                  <path d="M8 7V11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="5.25" r="0.75" fill="white" />
                </svg>
                <span>Subscription active</span>
                <span className="text-muted-foreground">·</span>
                <span>{ORG_USER.entitlements.used} of {ORG_USER.entitlements.total} images mirrored</span>
                <span className="text-muted-foreground">·</span>
                <a href="#" className="no-underline" style={{ color: '#1d63ed', fontWeight: 420 }}>
                  manage
                </a>
              </div>
            )}

            {/* Customization limit nudge — Select users at limit */}
            {isSelectAtLimit && (
              <div
                className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 mb-6"
                style={{ background: 'rgba(213,37,54,0.05)', border: '1px solid rgba(213,37,54,0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} style={{ color: '#d52536', flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#7f1d1d', marginBottom: 2 }}>
                      You've reached your customization limit
                    </p>
                    <p className="text-xs" style={{ color: '#991b1b' }}>
                      5 of 5 customizations in use. Remove one to create a new one, or contact sales to increase your limit.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/v3/manage')}
                  className="flex-shrink-0 rounded-md border-none cursor-pointer whitespace-nowrap"
                  style={{
                    background: '#1d63ed', color: '#fff',
                    padding: '8px 18px', fontSize: '0.8125rem',
                    fontWeight: 600, fontFamily: 'inherit',
                  }}
                >
                  Manage customizations
                </button>
              </div>
            )}

            {/* Trial nudge banner — early/warm trial states only (urgent handled by nav banner) */}
            {isTrial && !trialUrgent && (
              <div
                className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 mb-6"
                style={{
                  background: trialUrgent
                    ? 'rgba(213,37,54,0.05)'
                    : trialWarm
                    ? 'rgba(232,161,0,0.06)'
                    : 'linear-gradient(135deg, rgba(29,99,237,0.05) 0%, rgba(125,46,255,0.05) 100%)',
                  border: `1px solid ${trialUrgent ? 'rgba(213,37,54,0.2)' : trialWarm ? 'rgba(232,161,0,0.25)' : 'rgba(29,99,237,0.15)'}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      background: trialUrgent
                        ? '#d52536'
                        : trialWarm
                        ? '#b45309'
                        : 'linear-gradient(135deg, #1d63ed 0%, #7d2eff 100%)',
                    }}
                  >
                    <Zap size={16} color="#fff" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{
                      color: trialUrgent ? '#7f1d1d' : trialWarm ? '#78350f' : '#111827',
                      marginBottom: 2,
                    }}>
                      {trialUrgent
                        ? `Your trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} — upgrade to keep your mirrored images`
                        : trialWarm
                        ? `${daysRemaining} days left in your trial`
                        : `You have full DHI Select access for ${daysRemaining} more days`}
                    </p>
                    <p className="text-xs" style={{ color: trialUrgent ? '#991b1b' : trialWarm ? '#92400e' : '#6b7280' }}>
                      {trialUrgent
                        ? 'After your trial, mirrored repositories stop receiving SLA-backed updates. Upgrade now to avoid disruption.'
                        : trialWarm
                        ? 'Upgrade to DHI Enterprise to keep your mirrors, customizations, and SLA-backed CVE fixes.'
                        : 'Mirror images, create customizations, and get SLA-backed CVE fixes. Upgrade anytime to keep access.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/v3/plans')}
                  className="flex-shrink-0 rounded-md border-none cursor-pointer whitespace-nowrap"
                  style={{
                    background: trialUrgent ? '#d52536' : trialWarm ? '#b45309' : '#1d63ed',
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

            {/* Try DHI Enterprise banner — non-entitled users only */}
            {isNotEntitled && (
              <div
                className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(29,99,237,0.06) 0%, rgba(125,46,255,0.06) 100%)',
                  border: '1px solid rgba(29,99,237,0.18)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      background: 'linear-gradient(135deg, #1d63ed 0%, #7d2eff 100%)',
                    }}
                  >
                    <Sparkles size={16} color="#fff" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#111827', marginBottom: 2 }}>
                      Mirror, customize, and govern hardened images at org scale
                    </p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>
                      SLA-backed CVE fixes, FIPS/STIG variants, audit logs, and unlimited customizations. Try DHI Enterprise free for 14 days.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/v3/plans')}
                  className="flex-shrink-0 rounded-md border-none cursor-pointer whitespace-nowrap"
                  style={{
                    background: '#1d63ed',
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



            {/* Search + controls */}
            <div className="flex items-center gap-2.5 mb-6">
              {/* Search input */}
              <div
                className="flex items-center gap-2 rounded-md px-3 bg-card border border-border"
                style={{ width: 420, height: 38 }}
              >
                <Search size={15} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 border-none outline-none bg-transparent text-foreground"
                  style={{ fontSize: '0.875rem', fontFamily: 'inherit', fontWeight: 420 }}
                />
              </div>

              {/* Filter by */}
              <button
                className="flex items-center gap-1.5 rounded-md border border-border bg-card text-foreground cursor-pointer whitespace-nowrap"
                style={{ height: 38, padding: '0 14px', fontSize: '0.8125rem', fontFamily: 'inherit', fontWeight: 420 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filter by
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Make a request */}
              <button
                className="rounded-md border border-border bg-card text-foreground cursor-pointer whitespace-nowrap"
                style={{ height: 38, padding: '0 14px', fontSize: '0.8125rem', fontFamily: 'inherit', fontWeight: 420 }}
              >
                Make a request
              </button>


            </div>

            {/* Recently added chips */}
            <div className="mb-7">
              <SectionHeading>Recently added</SectionHeading>
              <div className="flex gap-2 flex-wrap">
                {RECENTLY_ADDED.map((item) => {
                  const color = avatarColor(item.name);
                  return (
                    <button
                      key={item.name}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-card text-foreground cursor-pointer"
                      style={{
                        padding: '5px 10px 5px 8px',
                        fontSize: '0.75rem',
                        fontFamily: 'inherit',
                        fontWeight: 420,
                      }}
                    >
                      <span
                        className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{
                          width: 16,
                          height: 16,
                          background: color + '22',
                          border: `1px solid ${color}44`,
                          fontSize: 9,
                        }}
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured */}
            <div className="mb-7">
              <SectionHeading>Featured</SectionHeading>
              <div className="grid grid-cols-12 gap-4">
                {FEATURED_IMAGES.map((image) => (
                  <div key={image.name} className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <ImageCard image={image} version="v3" />
                  </div>
                ))}
              </div>
            </div>

            {/* Monitoring & observability */}
            <div className="mb-7">
              <SectionHeading>Monitoring &amp; observability</SectionHeading>
              <div className="grid grid-cols-12 gap-4">
                {MONITORING_IMAGES.map((image) => (
                  <div key={image.name} className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <ImageCard image={image} version="v3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <UseThisImageDrawer open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
