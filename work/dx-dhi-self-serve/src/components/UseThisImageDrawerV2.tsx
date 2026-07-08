import { useState, useEffect } from 'react';
import { X, Clock, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ORG_USER } from '../data/imageData';

interface UseThisImageDrawerProps {
  open: boolean;
  onClose: () => void;
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close drawer"
      className="flex items-center justify-center rounded cursor-pointer border-none bg-transparent p-1.5"
      style={{ color: 'var(--muted-foreground)', fontFamily: 'inherit' }}
    >
      <X size={16} />
    </button>
  );
}

function DrawerHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div
      className="flex items-center justify-between flex-shrink-0 border-b border-border"
      style={{ padding: '16px 24px' }}
    >
      <h2 className="m-0 text-foreground" style={{ fontSize: '1rem', fontWeight: 680 }}>
        {title}
      </h2>
      <CloseButton onClick={onClose} />
    </div>
  );
}

function DrawerFooter({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex-shrink-0 border-t border-border bg-card"
      style={{ padding: '16px 24px' }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-md border-none cursor-pointer text-center"
      style={{
        background: disabled ? 'var(--muted)' : '#1d63ed',
        color: disabled ? 'var(--muted-foreground)' : '#fff',
        padding: '10px 20px',
        fontSize: '0.9375rem',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

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
      style={{
        padding: '8px 12px',
        background: '#f4f4f6',
        borderColor: '#e1e2e6',
      }}
    >
      <code
        className="flex-1"
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '0.8125rem',
          color: '#17191e',
          wordBreak: 'break-all',
          lineHeight: 1.6,
        }}
      >
        {code}
      </code>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 rounded border-none cursor-pointer"
        style={{
          background: copied ? '#388e3c' : 'rgba(0,0,0,0.08)',
          color: copied ? '#fff' : '#17191e',
          padding: '3px 8px',
          fontSize: '0.6875rem',
          fontWeight: 520,
          fontFamily: 'inherit',
          transition: 'background 0.15s ease',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-muted-foreground mb-1.5"
      style={{
        fontSize: '0.6875rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </div>
  );
}

function StepCircle({ n }: { n: number }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 rounded-full text-white"
      style={{
        width: 22,
        height: 22,
        background: '#1d63ed',
        fontSize: '0.625rem',
        fontWeight: 700,
      }}
    >
      {n}
    </div>
  );
}

function StepRail() {
  return <div className="w-px flex-1" style={{ background: '#d4d4d4' }} />;
}

function GoodToKnowBullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <Clock size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
      <span
        className="text-muted-foreground"
        style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}
      >
        {children}
      </span>
    </div>
  );
}

// ── State 1: Not signed in ────────────────────────────────────────────────────

function DrawerNotSignedIn({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <>
      <DrawerHeader title="Use this image" onClose={onClose} />
      <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
        <p className="m-0 mb-5" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
          Try DHI Enterprise to get SLA-backed updates, unlock FIPS/STIG variants, and customize images for your stack.
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-0 mb-6">
          <Step n={1} title="Authenticate to DHI">
            <div
              className="rounded-md border border-border px-3 py-2 mb-2"
              style={{ background: '#f4f4f6', borderColor: '#e1e2e6' }}
            >
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '0.8125rem', color: '#17191e' }}>
                docker login{' '}
                <span style={{ color: '#d45500' }}>dhi.io</span>
              </span>
            </div>
            <p className="m-0 text-xs text-muted-foreground">
              Use your Docker Hub credentials.{' '}
              <a href="#" style={{ color: '#1d63ed', textDecoration: 'none' }}>View auth docs →</a>
            </p>
          </Step>

          <Step n={2} title="Pull the image">
            <CodeBlock code="docker pull dhi.io/nodejs:20-bookworm" />
          </Step>
        </div>
      </div>
      <DrawerFooter>
        <PrimaryButton onClick={() => { onClose(); navigate('/v3/plans'); }}>Try DHI Enterprise</PrimaryButton>
      </DrawerFooter>
    </>
  );
}

// ── State 2: Personal ─────────────────────────────────────────────────────────

function DrawerPersonal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <>
      <DrawerHeader title="Use this image" onClose={onClose} />
      <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
        <p className="m-0 mb-5" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
          Try DHI Enterprise to get SLA-backed updates, unlock FIPS/STIG variants, and customize images for your stack.
        </p>

        <div className="flex flex-col gap-0 mb-6">
          <Step n={1} title="Authenticate to DHI">
            <div
              className="rounded-md border border-border px-3 py-2 mb-2"
              style={{ background: '#f4f4f6', borderColor: '#e1e2e6' }}
            >
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '0.8125rem', color: '#17191e' }}>
                docker login{' '}
                <span style={{ color: '#d45500' }}>dhi.io</span>
              </span>
            </div>
            <p className="m-0 text-xs text-muted-foreground">
              Use your Docker Hub credentials.{' '}
              <a href="#" style={{ color: '#1d63ed', textDecoration: 'none' }}>View auth docs →</a>
            </p>
          </Step>

          <Step n={2} title="Pull the image">
            <CodeBlock code="docker pull dhi.io/nodejs:20-bookworm" />
          </Step>
        </div>
      </div>
      <DrawerFooter>
        <PrimaryButton onClick={() => { onClose(); navigate('/v3/plans'); }}>Try DHI Enterprise</PrimaryButton>
      </DrawerFooter>
    </>
  );
}

// ── Dark code block (for mirrored pull command) ──────────────────────────────

function DarkCodeBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div
      className="flex items-center gap-2 rounded-md"
      style={{ padding: '8px 12px', background: '#1b1f23' }}
    >
      <span
        className="flex-1"
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          letterSpacing: '-0.01em',
          color: '#e6edf3',
          wordBreak: 'break-all',
        }}
      >
        {command}
      </span>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 rounded border-none cursor-pointer p-1"
        style={{
          background: 'transparent',
          color: copied ? '#2e7f74' : 'rgba(255,255,255,0.5)',
          transition: 'color 0.15s',
        }}
      >
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M5 11H3.5A1.5 1.5 0 012 9.5V3.5A1.5 1.5 0 013.5 2h6A1.5 1.5 0 0111 3.5V5"/></svg>
        )}
      </button>
    </div>
  );
}

// ── Source repo card (matching screenshot) ────────────────────────────────────

function SourceRepoCardFull() {
  return (
    <div
      className="flex items-center gap-3 rounded-md border border-border"
      style={{ padding: 12 }}
    >
      <div
        className="flex items-center justify-center rounded shrink-0"
        style={{ width: 32, height: 32, background: '#1d63ed' }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>A</span>
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Alpine Linux</p>
        <span
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "'Roboto Mono', monospace" }}
        >
          dhi-alpine:latest
        </span>
      </div>
    </div>
  );
}

// ── State 3a: Org entitled ────────────────────────────────────────────────────

function DrawerOrgEntitled({ onClose }: { onClose: () => void }) {
  const [mirrored, setMirrored] = useState(false);
  const [mirroring, setMirroring] = useState(false);
  const orgName = ORG_USER.org;
  const destRepo = `${orgName}/dhi-alpine`;
  const orgPullCmd = `docker pull ${orgName}/dhi-alpine:latest`;

  const handleMirror = () => {
    setMirroring(true);
    setTimeout(() => {
      setMirroring(false);
      setMirrored(true);
    }, 1200);
  };

  // ── Post-mirror screen (matches screenshot 3) ──
  if (mirrored) {
    return (
      <>
        <DrawerHeader title="Use this image" onClose={onClose} />
        <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
          <FormLabel>Your mirrored repositories</FormLabel>

          {/* Mirrored repo card */}
          <div className="rounded-md border border-border overflow-hidden" style={{ marginBottom: 24 }}>
            <div className="flex items-start justify-between" style={{ padding: '16px 16px 12px' }}>
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-muted-foreground shrink-0" style={{ marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{destRepo}</p>
                  <span className="text-xs text-muted-foreground">Last pulled 2 hours ago</span>
                </div>
              </div>
              <button
                className="shrink-0 cursor-pointer border-none bg-transparent p-0 hover:underline"
                style={{ color: '#1d63ed', fontSize: '0.8125rem', fontWeight: 600 }}
              >
                Customize image
              </button>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              <FormLabel>Your SLA backed image</FormLabel>
              <DarkCodeBlock command={orgPullCmd} />
            </div>
          </div>

          {/* Create another mirror */}
          <button
            onClick={() => setMirrored(false)}
            className="inline-flex items-center gap-1 cursor-pointer border-none bg-transparent p-0 text-sm hover:underline"
            style={{ color: '#1d63ed', fontWeight: 600 }}
          >
            Create another mirror
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </button>
        </div>
      </>
    );
  }

  // ── Pre-mirror screen (matches screenshot 2) ──
  const entAvailable = 10;
  const entInUse = 5;
  const afterMirroring = entInUse + 1;

  return (
    <>
      <DrawerHeader title={`Mirror hardened image to ${orgName}`} onClose={onClose} />
      <div className="flex-1 overflow-y-auto">
        {/* Source repository */}
        <div style={{ padding: '24px 24px 24px' }}>
          <FormLabel>Source repository</FormLabel>
          <SourceRepoCardFull />
        </div>

        {/* Destination repository */}
        <div style={{ padding: '0 24px 24px' }}>
          <FormLabel>Destination repository</FormLabel>
          <div
            className="rounded-md border border-border"
            style={{ padding: '8px 12px' }}
          >
            <p style={{ fontSize: '0.875rem', fontFamily: "'Roboto Mono', monospace", margin: 0 }}>
              {destRepo}
            </p>
          </div>
          <span className="block text-xs" style={{ color: '#2e7f74', fontWeight: 600, marginTop: 8 }}>
            New repository
          </span>
        </div>

        {/* Entitlements */}
        <div style={{ padding: '0 24px 24px' }}>
          <FormLabel>Entitlements</FormLabel>
          <div className="rounded-md border border-border overflow-hidden">
            {[
              { label: 'Entitlements available', value: String(entAvailable) },
              { label: 'Entitlements in use', value: String(entInUse) },
              { label: 'This mirror will use', value: '1' },
              { label: 'After mirroring', value: `${afterMirroring} of ${entAvailable} in use`, bold: true },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between${i < arr.length - 1 ? ' border-b border-border' : ''}`}
                style={{ padding: '8px 12px' }}
              >
                <span className="text-muted-foreground" style={{ fontSize: '0.8125rem' }}>{row.label}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: row.bold ? 680 : 420 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Good to know */}
        <div style={{ padding: '0 24px 24px' }}>
          <FormLabel>Good to know</FormLabel>
          <div className="flex flex-col gap-2">
            <GoodToKnowBullet>Mirrored repositories work like any other repository in your Hub organization</GoodToKnowBullet>
            <GoodToKnowBullet>Stays current automatically — no manual updates required</GoodToKnowBullet>
            <GoodToKnowBullet>Each mirrored hardened image uses one entitlement from your plan</GoodToKnowBullet>
          </div>
        </div>
      </div>
      <DrawerFooter>
        <PrimaryButton onClick={handleMirror} disabled={mirroring}>
          {mirroring ? 'Mirroring…' : 'Mirror repository'}
        </PrimaryButton>
      </DrawerFooter>
    </>
  );
}

// ── State: Select — customization limit ──────────────────────────────────────

function DrawerSelectAtLimit({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const orgName = ORG_USER.org;
  const customizationsUsed = 5;
  const customizationsAvailable = 5;

  return (
    <>
      <DrawerHeader title={`Customize image for ${orgName}`} onClose={onClose} />
      <div className="flex-1 overflow-y-auto">
        <div style={{ padding: '24px 24px 0' }}>
          {/* Limit warning */}
          <div
            className="flex items-start gap-2.5 rounded-lg"
            style={{
              padding: '12px 14px',
              background: 'rgba(213,37,54,0.06)',
              border: '1px solid rgba(213,37,54,0.2)',
              marginBottom: 24,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M8 1.5L14.5 13H1.5L8 1.5Z" fill="#d52536" />
              <path d="M8 6V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="white" />
            </svg>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#7f1d1d', marginBottom: 2 }}>
                You've reached the customization limit
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#991b1b', lineHeight: 1.5 }}>
                {customizationsUsed} of {customizationsAvailable} customizations in use. Remove one to create a new one.
              </div>
            </div>
          </div>

          {/* Customization count */}
          <div style={{ marginBottom: 24 }}>
            <FormLabel>Customizations</FormLabel>
            <div className="rounded-md border border-border overflow-hidden">
              {[
                { label: 'Customizations available', value: String(customizationsAvailable) },
                { label: 'Customizations in use', value: String(customizationsUsed) },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between${i < arr.length - 1 ? ' border-b border-border' : ''}`}
                  style={{ padding: '8px 12px' }}
                >
                  <span className="text-muted-foreground" style={{ fontSize: '0.8125rem' }}>{row.label}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: i === 1 ? 600 : 400, color: i === 1 ? '#d52536' : 'inherit' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disabled form preview */}
          <div style={{ opacity: 0.35, pointerEvents: 'none', marginBottom: 24 }}>
            <FormLabel>Customization name</FormLabel>
            <div className="rounded-md border border-border" style={{ padding: '8px 12px', marginBottom: 16 }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>my-customization</span>
            </div>
            <FormLabel>Base image</FormLabel>
            <SourceRepoCardFull />
          </div>
        </div>
      </div>
      <DrawerFooter>
        <button
          onClick={() => { onClose(); navigate('/v3/manage'); }}
          style={{
            width: '100%', background: '#1d63ed', color: '#fff',
            border: 'none', borderRadius: 6, padding: '10px 0',
            fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Manage customizations
        </button>
        <button
          onClick={() => { onClose(); navigate('/v3/plans'); }}
          className="border-none bg-transparent cursor-pointer hover:underline"
          style={{ color: 'var(--muted-foreground)', fontSize: '0.8125rem', fontFamily: 'inherit', marginTop: 4 }}
        >
          Contact sales to increase your limit
        </button>
      </DrawerFooter>
    </>
  );
}

// ── State 3a at-limit: Org at limit ──────────────────────────────────────────

function DrawerOrgAtLimit({ onClose }: { onClose: () => void }) {
  const orgName = ORG_USER.org;
  const destRepo = `${orgName}/dhi-alpine`;
  const entAvailable = 10;
  const entInUse = 10;

  return (
    <>
      <DrawerHeader title={`Mirror hardened image to ${orgName}`} onClose={onClose} />
      <div className="flex-1 overflow-y-auto">
        {/* At-limit warning banner */}
        <div style={{ padding: '24px 24px 0' }}>
          <div
            className="flex items-start gap-2.5 rounded-lg"
            style={{
              padding: '12px 14px',
              background: 'rgba(213,37,54,0.06)',
              border: '1px solid rgba(213,37,54,0.2)',
              marginBottom: 24,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M8 1.5L14.5 13H1.5L8 1.5Z" fill="#d52536" />
              <path d="M8 6V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="white" />
            </svg>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#7f1d1d', marginBottom: 2 }}>
                You've used all your mirrored image entitlements
              </div>
              <div className="text-muted-foreground" style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                {entInUse} of {entAvailable} entitlements in use. Contact sales to add more.
              </div>
            </div>
          </div>
        </div>

        {/* Disabled mirror form (same layout as entitled, but greyed out) */}
        <div style={{ opacity: 0.4, pointerEvents: 'none' }}>
          {/* Source repository */}
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Source repository</FormLabel>
            <SourceRepoCardFull />
          </div>

          {/* Destination repository */}
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Destination repository</FormLabel>
            <div
              className="rounded-md border border-border"
              style={{ padding: '8px 12px' }}
            >
              <p style={{ fontSize: '0.875rem', fontFamily: "'Roboto Mono', monospace", margin: 0, color: 'var(--muted-foreground)' }}>
                {destRepo}
              </p>
            </div>
          </div>

          {/* Entitlements */}
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Entitlements</FormLabel>
            <div className="rounded-md border border-border overflow-hidden">
              {[
                { label: 'Entitlements available', value: String(entAvailable) },
                { label: 'Entitlements in use', value: String(entInUse) },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between${i < arr.length - 1 ? ' border-b border-border' : ''}`}
                  style={{ padding: '8px 12px' }}
                >
                  <span className="text-muted-foreground" style={{ fontSize: '0.8125rem' }}>{row.label}</span>
                  <span style={{ fontSize: '0.8125rem' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Good to know */}
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Good to know</FormLabel>
            <div className="flex flex-col gap-2">
              <GoodToKnowBullet>Mirrored repositories work like any other repository in your Hub organization</GoodToKnowBullet>
              <GoodToKnowBullet>Stays current automatically — no manual updates required</GoodToKnowBullet>
              <GoodToKnowBullet>Each mirrored hardened image uses one entitlement from your plan</GoodToKnowBullet>
            </div>
          </div>
        </div>

        {/* Free pull fallback (not greyed out) */}
        <div style={{ padding: '0 24px 24px' }}>
          <div className="border-t border-border" style={{ marginBottom: 20 }} />
          <FormLabel>Pull from DHI directly</FormLabel>
          <p className="m-0 mb-2 text-xs text-muted-foreground">
            You can still pull this image directly. Authenticate to <strong>dhi.io</strong> first.
          </p>
          <CodeBlock code="docker pull dhi.io/alpine:latest" />
        </div>
      </div>
      <DrawerFooter>
        <PrimaryButton>Contact sales to add more entitlements</PrimaryButton>
      </DrawerFooter>
    </>
  );
}

// ── State 3b: Org no entitlements ────────────────────────────────────────────

function DrawerOrgNoEntitlements({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <>
      <DrawerHeader title="Use this image" onClose={onClose} />
      <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
        <p className="m-0 mb-5" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
          Try DHI Enterprise to get SLA-backed updates, unlock FIPS/STIG variants, and customize images for your stack.
        </p>

        <div className="flex flex-col gap-0 mb-6">
          <Step n={1} title="Authenticate to DHI">
            <div
              className="rounded-md border border-border px-3 py-2 mb-2"
              style={{ background: '#f4f4f6', borderColor: '#e1e2e6' }}
            >
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '0.8125rem', color: '#17191e' }}>
                docker login{' '}
                <span style={{ color: '#d45500' }}>dhi.io</span>
              </span>
            </div>
            <p className="m-0 text-xs text-muted-foreground">
              Use your Docker Hub credentials.{' '}
              <a href="#" style={{ color: '#1d63ed', textDecoration: 'none' }}>View auth docs →</a>
            </p>
          </Step>
          <Step n={2} title="Pull the image">
            <CodeBlock code="docker pull dhi.io/nodejs:20-bookworm" />
          </Step>
        </div>
      </div>
      <DrawerFooter>
        <PrimaryButton onClick={() => { onClose(); navigate('/v3/plans'); }}>Try DHI Enterprise</PrimaryButton>
      </DrawerFooter>
    </>
  );
}

// ── Trial countdown banner ────────────────────────────────────────────────────

function TrialBanner({ daysRemaining, onUpgrade }: { daysRemaining: number; onUpgrade: () => void }) {
  const urgent = daysRemaining <= 7;
  const warm = daysRemaining <= 14;

  const bg = urgent
    ? 'rgba(213,37,54,0.06)'
    : warm
    ? 'rgba(232,161,0,0.07)'
    : 'rgba(29,99,237,0.05)';
  const border = urgent
    ? 'rgba(213,37,54,0.2)'
    : warm
    ? 'rgba(232,161,0,0.25)'
    : 'rgba(29,99,237,0.15)';
  const iconColor = urgent ? '#d52536' : warm ? '#b45309' : '#1d63ed';
  const textColor = urgent ? '#7f1d1d' : warm ? '#78350f' : '#1e3a5f';
  const subColor = urgent ? '#991b1b' : warm ? '#92400e' : '#374151';

  const headline = urgent
    ? `Your trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
    : warm
    ? `${daysRemaining} days left in your trial`
    : `${daysRemaining} days remaining in your free trial`;

  const sub = urgent
    ? 'Upgrade now to keep your mirrors and avoid disruption.'
    : warm
    ? 'Upgrade to DHI Enterprise to keep full access after your trial.'
    : 'You have full DHI Select access. Upgrade anytime to keep it.';

  return (
    <div
      style={{
        margin: '0 0 0 0',
        padding: '12px 24px',
        background: bg,
        borderBottom: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      <Zap size={14} style={{ color: iconColor, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 680, color: textColor, marginBottom: 2 }}>
          {headline}
        </div>
        <div style={{ fontSize: '0.75rem', color: subColor, lineHeight: 1.5 }}>
          {sub}
        </div>
      </div>
      {(urgent || warm) && (
        <button
          onClick={onUpgrade}
          style={{
            flexShrink: 0,
            background: urgent ? '#d52536' : warm ? '#b45309' : '#1d63ed',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '5px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          Upgrade
        </button>
      )}
    </div>
  );
}

// ── State org-trial: Trial — full access ──────────────────────────────────────

function DrawerOrgTrial({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { daysRemaining } = useApp();
  const [mirrored, setMirrored] = useState(false);
  const [mirroring, setMirroring] = useState(false);
  const orgName = ORG_USER.org;
  const destRepo = `${orgName}/dhi-alpine`;
  const orgPullCmd = `docker pull ${orgName}/dhi-alpine:latest`;

  const handleMirror = () => {
    setMirroring(true);
    setTimeout(() => {
      setMirroring(false);
      setMirrored(true);
    }, 1200);
  };

  const handleUpgrade = () => { onClose(); navigate('/v3/plans'); };

  // ── Post-mirror screen ──
  if (mirrored) {
    return (
      <>
        <DrawerHeader title="Use this image" onClose={onClose} />
        <TrialBanner daysRemaining={daysRemaining} onUpgrade={handleUpgrade} />
        <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
          <FormLabel>Your mirrored repositories</FormLabel>

          <div className="rounded-md border border-border overflow-hidden" style={{ marginBottom: 24 }}>
            <div className="flex items-start justify-between" style={{ padding: '16px 16px 12px' }}>
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-muted-foreground shrink-0" style={{ marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{destRepo}</p>
                  <span className="text-xs text-muted-foreground">Last pulled 2 hours ago</span>
                </div>
              </div>
              <button
                className="shrink-0 cursor-pointer border-none bg-transparent p-0 hover:underline"
                style={{ color: '#1d63ed', fontSize: '0.8125rem', fontWeight: 600 }}
              >
                Customize image
              </button>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              <FormLabel>Your SLA backed image</FormLabel>
              <DarkCodeBlock command={orgPullCmd} />
            </div>
          </div>

          <button
            onClick={() => setMirrored(false)}
            className="inline-flex items-center gap-1 cursor-pointer border-none bg-transparent p-0 text-sm hover:underline"
            style={{ color: '#1d63ed', fontWeight: 600 }}
          >
            Create another mirror
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </button>
        </div>
        <DrawerFooter>
          <PrimaryButton onClick={handleUpgrade}>Try DHI Enterprise</PrimaryButton>
        </DrawerFooter>
      </>
    );
  }

  // ── Pre-mirror screen ──
  const entAvailable = 10;
  const entInUse = 5;
  const afterMirroring = entInUse + 1;

  return (
    <>
      <DrawerHeader title={`Mirror hardened image to ${orgName}`} onClose={onClose} />
      <TrialBanner daysRemaining={daysRemaining} onUpgrade={handleUpgrade} />
      <div className="flex-1 overflow-y-auto">
        <div style={{ padding: '24px 24px 24px' }}>
          <FormLabel>Source repository</FormLabel>
          <SourceRepoCardFull />
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <FormLabel>Destination repository</FormLabel>
          <div className="rounded-md border border-border" style={{ padding: '8px 12px' }}>
            <p style={{ fontSize: '0.875rem', fontFamily: "'Roboto Mono', monospace", margin: 0 }}>
              {destRepo}
            </p>
          </div>
          <span className="block text-xs" style={{ color: '#2e7f74', fontWeight: 600, marginTop: 8 }}>
            New repository
          </span>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <FormLabel>Entitlements</FormLabel>
          <div className="rounded-md border border-border overflow-hidden">
            {[
              { label: 'Entitlements available', value: String(entAvailable) },
              { label: 'Entitlements in use', value: String(entInUse) },
              { label: 'This mirror will use', value: '1' },
              { label: 'After mirroring', value: `${afterMirroring} of ${entAvailable} in use`, bold: true },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between${i < arr.length - 1 ? ' border-b border-border' : ''}`}
                style={{ padding: '8px 12px' }}
              >
                <span className="text-muted-foreground" style={{ fontSize: '0.8125rem' }}>{row.label}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: row.bold ? 680 : 420 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <FormLabel>Good to know</FormLabel>
          <div className="flex flex-col gap-2">
            <GoodToKnowBullet>Mirrored repositories work like any other repository in your Hub organization</GoodToKnowBullet>
            <GoodToKnowBullet>Stays current automatically — no manual updates required</GoodToKnowBullet>
            <GoodToKnowBullet>Each mirrored hardened image uses one entitlement from your plan</GoodToKnowBullet>
          </div>
        </div>
      </div>
      <DrawerFooter>
        <PrimaryButton onClick={handleMirror} disabled={mirroring}>
          {mirroring ? 'Mirroring…' : 'Mirror repository'}
        </PrimaryButton>
      </DrawerFooter>
    </>
  );
}

// ── State org-trial at-limit: Trial — customization limit hit ─────────────────

function DrawerOrgTrialAtLimit({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { daysRemaining } = useApp();
  const orgName = ORG_USER.org;
  const destRepo = `${orgName}/dhi-alpine`;
  const entAvailable = 10;
  const entInUse = 10;

  const handleUpgrade = () => { onClose(); navigate('/v3/plans'); };

  return (
    <>
      <DrawerHeader title={`Mirror hardened image to ${orgName}`} onClose={onClose} />
      <TrialBanner daysRemaining={daysRemaining} onUpgrade={handleUpgrade} />
      <div className="flex-1 overflow-y-auto">
        {/* At-limit warning */}
        <div style={{ padding: '24px 24px 0' }}>
          <div
            className="flex items-start gap-2.5 rounded-lg"
            style={{
              padding: '12px 14px',
              background: 'rgba(213,37,54,0.06)',
              border: '1px solid rgba(213,37,54,0.2)',
              marginBottom: 24,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M8 1.5L14.5 13H1.5L8 1.5Z" fill="#d52536" />
              <path d="M8 6V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="white" />
            </svg>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#7f1d1d', marginBottom: 2 }}>
                You've reached your trial mirror limit
              </div>
              <div className="text-muted-foreground" style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                {entInUse} of {entAvailable} entitlements in use. Upgrade to DHI Enterprise for unlimited mirrors.
              </div>
            </div>
          </div>
        </div>

        {/* Disabled mirror form */}
        <div style={{ opacity: 0.4, pointerEvents: 'none' }}>
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Source repository</FormLabel>
            <SourceRepoCardFull />
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Destination repository</FormLabel>
            <div className="rounded-md border border-border" style={{ padding: '8px 12px' }}>
              <p style={{ fontSize: '0.875rem', fontFamily: "'Roboto Mono', monospace", margin: 0, color: 'var(--muted-foreground)' }}>
                {destRepo}
              </p>
            </div>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Entitlements</FormLabel>
            <div className="rounded-md border border-border overflow-hidden">
              {[
                { label: 'Entitlements available', value: String(entAvailable) },
                { label: 'Entitlements in use', value: String(entInUse) },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between${i < arr.length - 1 ? ' border-b border-border' : ''}`}
                  style={{ padding: '8px 12px' }}
                >
                  <span className="text-muted-foreground" style={{ fontSize: '0.8125rem' }}>{row.label}</span>
                  <span style={{ fontSize: '0.8125rem' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Good to know</FormLabel>
            <div className="flex flex-col gap-2">
              <GoodToKnowBullet>Mirrored repositories work like any other repository in your Hub organization</GoodToKnowBullet>
              <GoodToKnowBullet>Stays current automatically — no manual updates required</GoodToKnowBullet>
              <GoodToKnowBullet>Each mirrored hardened image uses one entitlement from your plan</GoodToKnowBullet>
            </div>
          </div>
        </div>

        {/* Free pull fallback */}
        <div style={{ padding: '0 24px 24px' }}>
          <div className="border-t border-border" style={{ marginBottom: 20 }} />
          <FormLabel>Pull from DHI directly</FormLabel>
          <p className="m-0 mb-2 text-xs text-muted-foreground">
            You can still pull this image directly. Authenticate to <strong>dhi.io</strong> first.
          </p>
          <CodeBlock code="docker pull dhi.io/alpine:latest" />
        </div>
      </div>
      <DrawerFooter>
        <PrimaryButton onClick={handleUpgrade}>Try DHI Enterprise</PrimaryButton>
      </DrawerFooter>
    </>
  );
}

// ── State org-trial-ended ─────────────────────────────────────────────────────

function DrawerOrgTrialEnded({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const orgName = ORG_USER.org;
  const destRepo = `${orgName}/dhi-alpine`;

  const handleUpgrade = () => { onClose(); navigate('/v3/plans'); };

  return (
    <>
      <DrawerHeader title="Use this image" onClose={onClose} />

      {/* Amber trial-ended banner */}
      <div
        style={{
          padding: '12px 24px',
          background: 'rgba(232,161,0,0.07)',
          borderBottom: '1px solid rgba(232,161,0,0.25)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <AlertTriangle size={14} style={{ color: '#b45309', flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 680, color: '#78350f', marginBottom: 2 }}>
            Your trial has ended
          </div>
          <div style={{ fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
            Mirrored images have stopped receiving SLA-backed updates. Upgrade to restore full access.
          </div>
        </div>
        <button
          onClick={handleUpgrade}
          style={{
            flexShrink: 0,
            background: '#b45309',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '5px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          Upgrade
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Disabled mirror form */}
        <div style={{ opacity: 0.4, pointerEvents: 'none' }}>
          <div style={{ padding: '24px 24px 24px' }}>
            <FormLabel>Source repository</FormLabel>
            <SourceRepoCardFull />
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Destination repository</FormLabel>
            <div className="rounded-md border border-border" style={{ padding: '8px 12px' }}>
              <p style={{ fontSize: '0.875rem', fontFamily: "'Roboto Mono', monospace", margin: 0, color: 'var(--muted-foreground)' }}>
                {destRepo}
              </p>
            </div>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <FormLabel>Good to know</FormLabel>
            <div className="flex flex-col gap-2">
              <GoodToKnowBullet>Mirrored repositories work like any other repository in your Hub organization</GoodToKnowBullet>
              <GoodToKnowBullet>Stays current automatically — no manual updates required</GoodToKnowBullet>
              <GoodToKnowBullet>Each mirrored hardened image uses one entitlement from your plan</GoodToKnowBullet>
            </div>
          </div>
        </div>

        {/* Free pull fallback */}
        <div style={{ padding: '0 24px 24px' }}>
          <div className="border-t border-border" style={{ marginBottom: 20 }} />
          <FormLabel>Pull from DHI directly</FormLabel>
          <p className="m-0 mb-2 text-xs text-muted-foreground">
            You can still pull this image directly. Authenticate to <strong>dhi.io</strong> first.
          </p>
          <CodeBlock code="docker pull dhi.io/alpine:latest" />
        </div>
      </div>

      <DrawerFooter>
        <button
          onClick={handleUpgrade}
          style={{
            display: 'block',
            width: '100%',
            background: '#b45309',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 16px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            textAlign: 'center',
          }}
        >
          Try DHI Enterprise
        </button>
      </DrawerFooter>
    </>
  );
}

// ── Step component ────────────────────────────────────────────────────────────

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex flex-col items-center">
        <StepCircle n={n} />
        <StepRail />
      </div>
      <div className="flex-1 pb-4">
        <div className="text-sm font-semibold text-foreground mb-2">{title}</div>
        {children}
      </div>
    </div>
  );
}

// ── Root drawer ───────────────────────────────────────────────────────────────

export default function UseThisImageDrawer({ open, onClose }: UseThisImageDrawerProps) {
  const { authState } = useApp();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Use this image"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 480,
          background: 'var(--card, #fff)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        }}
      >
        {authState === 'not-signed-in' && <DrawerNotSignedIn onClose={onClose} />}
        {authState === 'personal' && <DrawerPersonal onClose={onClose} />}
        {authState === 'org-entitled' && <DrawerOrgEntitled onClose={onClose} />}
        {authState === 'org-at-limit' && <DrawerOrgAtLimit onClose={onClose} />}
        {authState === 'org-select-customization-limit' && <DrawerSelectAtLimit onClose={onClose} />}
        {authState === 'org-no-entitlements' && <DrawerOrgNoEntitlements onClose={onClose} />}
        {authState === 'org-trial' && <DrawerOrgTrial onClose={onClose} />}
        {authState === 'org-trial-ended' && <DrawerOrgTrialEnded onClose={onClose} />}
      </div>
    </>
  );
}
