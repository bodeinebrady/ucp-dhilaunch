import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Copy, Check, Clock } from 'lucide-react'
import { ShieldIcon } from './DhiBadge'

// ─── Constants ────────────────────────────────────────────────────────────────

const ORG = 'acmeinc'
const IMAGE_NAME = 'pytorch'
const SOURCE_REGISTRY = `dhi.io/${IMAGE_NAME}`
const DEST_REPO = `${ORG}/dhi-${IMAGE_NAME}`
const PULL_CMD = `docker pull ${DEST_REPO}:latest`
const ENT_AVAILABLE = 1000
const ENT_IN_USE = 58

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.9375rem',
      fontWeight: 700,
      color: '#0B0B0F',
      marginBottom: 10,
    }}>
      {children}
    </div>
  )
}

function DarkCodeBlock({ command }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(command).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 12px',
      background: '#1b1f23',
      borderRadius: 6,
    }}>
      <span style={{
        flex: 1,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: '0.8125rem',
        lineHeight: 1.5,
        color: '#e6edf3',
        wordBreak: 'break-all',
      }}>
        {command}
      </span>
      <button
        onClick={handleCopy}
        style={{
          flexShrink: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: copied ? '#2e7f74' : 'rgba(255,255,255,0.45)',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.15s',
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  )
}

// ─── Drawer shell ─────────────────────────────────────────────────────────────

function DrawerHeader({ title, onClose }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexShrink: 0,
      padding: '20px 24px 16px',
      borderBottom: '1px solid rgba(11,11,15,0.09)',
    }}>
      <h2 style={{
        margin: 0,
        fontSize: '1.125rem',
        fontWeight: 700,
        color: '#0B0B0F',
        lineHeight: 1.3,
        paddingRight: 16,
      }}>
        {title}
      </h2>
      <button
        onClick={onClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#1d63ed',
          padding: 4,
          borderRadius: 4,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <X size={18} />
      </button>
    </div>
  )
}

function DrawerFooter({ children }) {
  return (
    <div style={{
      flexShrink: 0,
      padding: '16px 24px',
      borderTop: '1px solid rgba(11,11,15,0.09)',
      background: '#fff',
    }}>
      {children}
    </div>
  )
}

// ─── Source repo card ─────────────────────────────────────────────────────────

function SourceRepoCard() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      borderRadius: 8,
      border: '1px solid rgba(11,11,15,0.12)',
    }}>
      {/* PyTorch icon */}
      <div style={{ width: 36, height: 36, flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill="#EE4C2C">
          <path d="M12.005 0L4.952 7.053a9.865 9.865 0 000 14.022 9.866 9.866 0 0014.022 0c3.984-3.9 3.986-10.205.085-14.023l-1.744 1.743c2.904 2.905 2.904 7.634 0 10.538s-7.634 2.904-10.538 0-2.904-7.634 0-10.538l4.647-4.646.582-.665zm3.568 3.899a1.327 1.327 0 00-1.327 1.327 1.327 1.327 0 001.327 1.328A1.327 1.327 0 0016.9 5.226 1.327 1.327 0 0015.573 3.9z" />
        </svg>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0B0B0F' }}>PyTorch</span>
          <ShieldIcon size={14} />
        </div>
        <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontFamily: 'ui-monospace, monospace' }}>
          {SOURCE_REGISTRY}
        </span>
      </div>
    </div>
  )
}

// ─── Destination repo card ────────────────────────────────────────────────────

function DestRepoCard() {
  return (
    <div style={{
      padding: '12px 14px',
      borderRadius: 8,
      border: '1px solid rgba(11,11,15,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: '0.9375rem', color: '#0B0B0F' }}>{DEST_REPO}</span>
        <ShieldIcon size={14} />
      </div>
      <span style={{ fontSize: '0.8125rem', color: '#2e7f74', fontWeight: 600 }}>
        New repository
      </span>
    </div>
  )
}

// ─── Entitlements table ───────────────────────────────────────────────────────

function EntitlementsTable() {
  const afterMirroring = ENT_IN_USE + 1
  return (
    <div style={{ border: '1px solid rgba(11,11,15,0.12)', borderRadius: 8, overflow: 'hidden' }}>
      {[
        { label: 'Entitlements available', value: ENT_AVAILABLE.toLocaleString() },
        { label: 'Entitlements in use', value: ENT_IN_USE.toLocaleString() },
        { label: 'This mirror will use', value: '1' },
      ].map((row, i) => (
        <div key={row.label} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: i === 2 ? '1px solid rgba(11,11,15,0.09)' : 'none',
        }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{row.label}</span>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{row.value}</span>
        </div>
      ))}
      {/* After mirroring — separated */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
      }}>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>After mirroring</span>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{afterMirroring}</span>
      </div>
    </div>
  )
}

// ─── Good to know ─────────────────────────────────────────────────────────────

function GoodToKnowItem({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flexShrink: 0, marginTop: 1, color: '#6b7280' }}>{icon}</div>
      <span style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.55 }}>{children}</span>
    </div>
  )
}

// Shield icon for good to know
function GtkShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function GtkRefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  )
}

function GtkCoinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2m0 8v2M9.5 9.5c0-1.1.9-2 2.5-2s2.5.9 2.5 2-1 1.5-2.5 2-2.5.9-2.5 2 .9 2 2.5 2 2.5-.9 2.5-2" />
    </svg>
  )
}

// ─── Screen: Pre-mirror ───────────────────────────────────────────────────────

function PreMirrorScreen({ onMirror, mirroring, onClose }) {
  return (
    <>
      <DrawerHeader title={`Mirror hardened image to ${ORG}`} onClose={onClose} />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '24px 24px 0' }}>

          {/* Source */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Source repository</SectionLabel>
            <SourceRepoCard />
          </div>

          {/* Destination */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Destination repository</SectionLabel>
            <DestRepoCard />
          </div>

          {/* Entitlements */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>Entitlements</SectionLabel>
            <EntitlementsTable />
          </div>

          {/* Good to know */}
          <div style={{ marginBottom: 32 }}>
            <SectionLabel>Good to know</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <GoodToKnowItem icon={<GtkShieldIcon />}>
                Mirrored repositories work like any other repository in your Docker Hub organization
              </GoodToKnowItem>
              <GoodToKnowItem icon={<GtkRefreshIcon />}>
                Stays current automatically — no manual updates required
              </GoodToKnowItem>
              <GoodToKnowItem icon={<GtkCoinIcon />}>
                Each mirrored hardened image uses one entitlement from your plan
              </GoodToKnowItem>
            </div>
          </div>

        </div>
      </div>

      <DrawerFooter>
        <button
          onClick={onMirror}
          disabled={mirroring}
          style={{
            width: '100%',
            background: mirroring ? '#93b4f5' : '#1d63ed',
            color: '#fff',
            border: 'none',
            borderRadius: 100,
            padding: '13px 0',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: mirroring ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'background-color 0.12s',
          }}
          onMouseEnter={e => { if (!mirroring) e.currentTarget.style.backgroundColor = '#1753d4' }}
          onMouseLeave={e => { if (!mirroring) e.currentTarget.style.backgroundColor = '#1d63ed' }}
        >
          {mirroring ? 'Mirroring…' : 'Mirror repository'}
        </button>
      </DrawerFooter>
    </>
  )
}

// ─── Screen: Mirroring in progress ───────────────────────────────────────────

function MirroringScreen({ onClose }) {
  return (
    <>
      <DrawerHeader title={`Mirror hardened image to ${ORG}`} onClose={onClose} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 20 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid rgba(29,99,237,0.15)',
          borderTopColor: '#1d63ed',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0B0B0F', margin: '0 0 6px' }}>
            Mirroring PyTorch…
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
            This usually takes 1–2 minutes. You can close this drawer and we'll notify you when it's ready.
          </p>
        </div>
      </div>
    </>
  )
}

// ─── Screen: Post-mirror ──────────────────────────────────────────────────────

function PostMirrorScreen({ onReset, onClose, onCustomize }) {
  return (
    <>
      <DrawerHeader title="PyTorch mirrored" onClose={onClose} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

        {/* Success */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
          borderRadius: 8,
          background: 'rgba(46,127,116,0.06)',
          border: '1px solid rgba(46,127,116,0.2)',
          marginBottom: 24,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" fill="#2e7f74" />
            <path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '0.875rem', color: '#1a5c55', lineHeight: 1.4 }}>
            <strong>{DEST_REPO}</strong> is ready in your org.
          </span>
        </div>

        {/* Primary CTA — customize */}
        <div style={{
          borderRadius: 10,
          border: '1px solid rgba(29,99,237,0.2)',
          background: 'linear-gradient(135deg, rgba(29,99,237,0.04) 0%, rgba(125,46,255,0.04) 100%)',
          padding: '20px',
          marginBottom: 20,
        }}>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0B0B0F', margin: '0 0 6px' }}>
            Customize PyTorch for {ORG}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.55, margin: '0 0 16px' }}>
            Add packages, set env vars, configure entrypoints — and publish a version tailored to your stack without breaking the security chain.
          </p>
          <ul style={{ margin: '0 0 18px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              'Install org-specific packages and dependencies',
              'Set environment variables and working directory',
              'Rebuild automatically when upstream patches ship',
            ].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8125rem', color: '#374151' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M3 8l3.5 3.5L13 4.5" stroke="#1d63ed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={onCustomize}
            style={{
              width: '100%',
              background: '#1d63ed',
              color: '#fff',
              border: 'none',
              borderRadius: 100,
              padding: '11px 0',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background-color 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1753d4'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1d63ed'}
          >
            Customize image
          </button>
        </div>

        {/* Tertiary */}
        <button
          onClick={onReset}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '0.8125rem', fontFamily: 'inherit', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#374151'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
        >
          Mirror another image →
        </button>

      </div>

      {/* Pull directly — pinned to bottom */}
      <div style={{ flexShrink: 0, borderTop: '1px solid rgba(11,11,15,0.08)', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(11,11,15,0.08)' }} />
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>or pull directly</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(11,11,15,0.08)' }} />
        </div>
        <DarkCodeBlock command={PULL_CMD} />
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '8px 0 0', lineHeight: 1.5 }}>
          Customize anytime from your org's repository page.
        </p>
      </div>
    </>
  )
}

// ─── Main drawer ──────────────────────────────────────────────────────────────

export default function MirrorDrawer({ open, onClose }) {
  const [screen, setScreen] = useState('pre')
  const navigate = useNavigate()

  function handleMirror() {
    setScreen('mirroring')
    setTimeout(() => setScreen('post'), 2000)
  }

  function handleClose() {
    onClose()
    setTimeout(() => setScreen('pre'), 300)
  }

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 480,
        background: '#fff',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
      }}>
        {screen === 'pre' && <PreMirrorScreen onMirror={handleMirror} mirroring={false} onClose={handleClose} />}
        {screen === 'mirroring' && <MirroringScreen onClose={handleClose} />}
        {screen === 'post' && <PostMirrorScreen onReset={() => setScreen('pre')} onClose={handleClose} onCustomize={() => { onClose(); navigate('/customize') }} />}
      </div>
    </>
  )
}
