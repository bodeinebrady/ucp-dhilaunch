import { GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DhiBadge } from './DhiBadge';
import { useApp } from '../context/AppContext';

interface RepoHeaderProps {
  onUseThisImage: () => void;
  /** If provided, renders a "Looking for the free version?" escape hatch below the CTA */
  freeHref?: string;
  /** If provided, renders a "Looking for DHI Enterprise?" escape hatch below the CTA */
  enterpriseHref?: string;
}

export default function RepoHeader({ onUseThisImage, freeHref, enterpriseHref }: RepoHeaderProps) {
  const { authState } = useApp();
  const isTrial = authState === 'org-trial' || authState === 'org-trial-ended';
  const isEntitled = authState === 'org-entitled' || authState === 'org-at-limit' || isTrial;

  return (
    <div className="mb-6">
      <div className="flex items-start gap-5">
        {/* Avatar — dark square matching real DHI style */}
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-xl"
          style={{ width: 72, height: 72, background: '#2d3748' }}
        >
          {/* DHI shield icon */}
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <path d="M20 4L6 10v10c0 8 6 15 14 16 8-1 14-8 14-16V10L20 4z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M14 20l4.5 4.5L27 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Name block */}
        <div className="flex-1 min-w-0">
          {/* Registry path */}
          <p className="m-0 mb-1" style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', fontFamily: "'Roboto Mono', monospace" }}>
            dhi.io/nodejs
          </p>

          {/* Name + DHI badge */}
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <h1 className="m-0" style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.2 }}>
              Node.js
            </h1>
            <DhiBadge size={14} fontSize="0.75rem" />
            {isEntitled && (
              <div
                className="flex items-center gap-1 rounded"
                style={{
                  padding: '3px 8px',
                  backgroundColor: 'rgba(46,127,116,0.08)',
                  border: '1px solid rgba(46,127,116,0.25)',
                  borderRadius: 6,
                }}
              >
                <GitBranch style={{ width: 12, height: 12, color: '#2e7f74' }} />
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#2e7f74' }}>
                  Mirrored to org
                </span>
              </div>
            )}
          </div>

          {/* Compliance chips — filled blue pills */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            {['CIS', 'LINUX/ARM64', 'LINUX/AMD64'].map(tag => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 10px',
                  borderRadius: 100,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  background: '#1d63ed',
                  color: '#fff',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="m-0" style={{ fontSize: '0.9375rem', color: 'var(--muted-foreground)', lineHeight: 1.6, maxWidth: 600 }}>
            Hardened Node.js runtime for production workloads. Continuously patched, minimal, and compliance-ready.
          </p>
        </div>

        {/* CTA block — top right */}
        <div className="flex-shrink-0 flex flex-col items-center" style={{ gap: 8, marginTop: 24 }}>
          <button
            onClick={onUseThisImage}
            className="rounded-md text-white border-none cursor-pointer w-full"
            style={{
              background: '#1d63ed',
              padding: '9px 22px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            Use this image
          </button>
          {freeHref && (
            <Link
              to={freeHref}
              style={{
                fontSize: '0.75rem',
                color: 'var(--muted-foreground)',
                textDecoration: 'none',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1d63ed'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted-foreground)'; }}
            >
              Looking for the free version?
            </Link>
          )}
          {enterpriseHref && (
            <Link
              to={enterpriseHref}
              style={{
                fontSize: '0.75rem',
                color: 'var(--muted-foreground)',
                textDecoration: 'none',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1d63ed'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted-foreground)'; }}
            >
              Looking for DHI Enterprise?
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
