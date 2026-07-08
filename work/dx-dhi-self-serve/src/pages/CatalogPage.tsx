import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Download, Star, Search, Building2, Info } from 'lucide-react';
import ScenarioBar from '../components/ScenarioBar';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UseThisImageDrawer from '../components/UseThisImageDrawer';
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

function ImageCard({ image }: { image: CatalogImage }) {
  const accent = ACCENT[image.type];
  const initial = image.name[0].toUpperCase();
  const color = avatarColor(image.name);
  const isNodeLink = image.name === 'DHI Build';

  return (
    <Link
      to={isNodeLink ? '/v1/image/nodejs' : '#'}
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

function FreeImageCard({ name, registry, description, href }: {
  name: string;
  registry: string;
  description: string;
  href: string;
}) {
  return (
    <Link to={href} className="block h-full no-underline">
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
          el.style.borderColor = '#9ca3af';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = '';
          el.style.borderColor = '';
        }}
      >
        {/* Row 1: Type label */}
        <div style={{ fontSize: '0.625rem', color: 'rgba(0,0,0,0.56)', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 11 }}>
          Free image
        </div>

        {/* Row 2: Avatar + name */}
        <div className="flex items-start gap-2.5 mb-3">
          <div
            className="flex items-center justify-center flex-shrink-0 rounded-md"
            style={{ width: 32, height: 32, backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>⬡</span>
          </div>
          <div className="min-w-0">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-foreground" style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.25 }}>
              {name}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#6b7280', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
              {registry}
            </div>
          </div>
        </div>

        {/* Row 3: Description */}
        <p
          className="text-muted-foreground flex-1"
          style={{ fontSize: '0.75rem', lineHeight: 1.46, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', color: '#393F49', marginBottom: 12 }}
        >
          {description}
        </p>

        {/* Row 4: Footer */}
        <div className="flex items-center gap-2 mt-auto">
          <span style={{ fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 500 }}>Docker Official Image</span>
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

export default function CatalogPage() {
  const { authState, panelOpen, setPanelOpen } = useApp();
  const [search, setSearch] = useState('');

  const isEntitled = authState === 'org-entitled' || authState === 'org-at-limit';
  const isOrg = authState.startsWith('org-');

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <ScenarioBar />
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
          <div className="max-w-screen-xl mx-auto py-10 px-6 md:px-10">

            {/* Org summary strip — entitled only */}
            {isOrg && isEntitled && (
              <div
                className="flex items-center gap-3 mb-5 px-4 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(125,46,255,0.04)',
                  borderBottom: '1px solid rgba(125,46,255,0.12)',
                  border: '1px solid rgba(125,46,255,0.12)',
                }}
              >
                <Building2 size={16} style={{ color: '#7d2eff', flexShrink: 0 }} />
                <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                  {ORG_USER.org}
                </span>
                <span className="text-xs text-muted-foreground">
                  {ORG_USER.entitlements.used} of {ORG_USER.entitlements.total} images mirrored
                </span>
                <a
                  href="#"
                  className="text-xs ml-auto no-underline"
                  style={{ color: '#7d2eff', fontWeight: 520 }}
                >
                  Manage subscription
                </a>
              </div>
            )}

            {/* Page heading */}
            <div className="mb-5">
              <h1 className="text-foreground mb-1.5" style={{ fontSize: '1.25rem', fontWeight: 680 }}>
                Hardened Image catalog
              </h1>

              {/* Subscription status */}
              {isEntitled && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
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
            </div>

            {/* Blue info banner */}
            {isEntitled && (
              <div
                className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 mb-6"
                style={{
                  background: 'rgba(29,99,237,0.06)',
                  border: '1px solid rgba(29,99,237,0.18)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Info size={16} style={{ color: '#1d63ed', flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: '#1a3a7a' }}>
                    <strong style={{ fontWeight: 520 }}>Extend your free trial</strong>
                    {' · '}get 14 extra days of hardened image updates when you share your feedback.
                  </span>
                </div>
                <a
                  href="#"
                  className="text-sm no-underline whitespace-nowrap"
                  style={{ color: '#1d63ed', fontWeight: 520 }}
                >
                  Share feedback →
                </a>
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
                    <ImageCard image={image} />
                  </div>
                ))}
              </div>
            </div>

            {/* Free images */}
            <div className="mb-7">
              <SectionHeading>Free images</SectionHeading>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                  <FreeImageCard
                    name="Node.js"
                    registry="docker.io/library/node"
                    description="Official Node.js runtime. Rebuilt on upstream cadence. No SLA, no continuous remediation."
                    href="/v1/image/nodejs-free"
                  />
                </div>
              </div>
            </div>

            {/* Monitoring & observability */}
            <div className="mb-7">
              <SectionHeading>Monitoring &amp; observability</SectionHeading>
              <div className="grid grid-cols-12 gap-4">
                {MONITORING_IMAGES.map((image) => (
                  <div key={image.name} className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <ImageCard image={image} />
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
