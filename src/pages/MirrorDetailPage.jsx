import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Copy, Check, ArrowRight, Shield } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@docker/trident/components/ui/select'
import Navbar from '../components/Navbar'
import { ShieldIcon } from '../components/DhiBadge'
import { BRAND_ICONS } from '../data/brandIcons'
import MirrorDrawer from '../components/MirrorDrawer'

// ─── Image data ───────────────────────────────────────────────────────────────

const GRADIENT = 'linear-gradient(95deg, #AB00A4 0%, #7D2EFF 25%, #1D63ED 50%, #1C90ED 75%, #88D5C0 100%)'

const IMAGE = {
  name: 'PyTorch',
  registry: 'dhi.io/pytorch',
  chips: ['CIS', 'LINUX/AMD64', 'LINUX/ARM64'],
  desc: 'A python-based machine learning framework, providing tensors, dynamic neural networks and strong GPU acceleration.',
}

const IMAGE_VERSIONS = [
  {
    id: 'pytorch-2x-dev-debian13',
    name: 'PyTorch 2.x (dev)',
    distro: 'Debian 13',
    tags: '2-debian13-dev, 2-dev, 2.7-debian13-dev, 2.7-dev, 2.7.0-debian13-dev',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: true,
    shell: true,
    user: 'root',
    lastPushed: '1 day ago',
    vulns: { c: 0, h: 0, m: 0, l: 0, u: 0 },
  },
  {
    id: 'pytorch-2x-debian13',
    name: 'PyTorch 2.x',
    distro: 'Debian 13',
    tags: '2, 2.7, 2.7-debian13, 2.7.0, 2.7.0-debian13',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: false,
    shell: false,
    user: 'nonroot 65532',
    lastPushed: '1 day ago',
    vulns: { c: 0, h: 0, m: 0, l: 0, u: 0 },
  },
  {
    id: 'pytorch-2x-dev-alpine',
    name: 'PyTorch 2.x (dev)',
    distro: 'Alpine 3.22',
    tags: '2-alpine3.22-dev, 2.7-alpine3.22-dev, 2.7.0-alpine3.22-dev',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: true,
    shell: true,
    user: 'root',
    lastPushed: '7 days ago',
    vulns: { c: 0, h: 0, m: 1, l: 2, u: 0 },
  },
  {
    id: 'pytorch-2x-alpine',
    name: 'PyTorch 2.x',
    distro: 'Alpine 3.22',
    tags: '2-alpine3.22, 2.7-alpine3.22, 2.7.0-alpine3.22',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: false,
    shell: false,
    user: 'nonroot 65532',
    lastPushed: '7 days ago',
    vulns: { c: 0, h: 0, m: 1, l: 2, u: 0 },
  },
]

const GUIDE_SECTIONS = [
  { id: 'how-to-use', label: 'How to use this image' },
  { id: 'start-instance', label: 'Start a PyTorch instance' },
  { id: 'build-run', label: 'Build and run a PyTorch application' },
  { id: 'image-variants', label: 'Image variants' },
  { id: 'migrate', label: 'Migrate to a DHI' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Chip({ label }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 100,
      fontSize: '0.6875rem',
      fontWeight: 700,
      letterSpacing: '0.03em',
      background: '#1d63ed',
      color: '#fff',
    }}>
      {label}
    </span>
  )
}

function CheckMark({ yes }) {
  if (!yes) return <span style={{ color: '#9ca3af' }}>—</span>
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="#374151" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function VulnPills({ vulns }) {
  const total = vulns.c + vulns.h + vulns.m + vulns.l + vulns.u
  if (total === 0) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: '#388e3c' }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#388e3c" strokeWidth="1.5" />
          <path d="M5 8l2.5 2.5L11 5.5" stroke="#388e3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        None
      </span>
    )
  }
  const pills = [
    { count: vulns.c, bg: '#7f1d1d', color: '#fff' },
    { count: vulns.h, bg: '#d52536', color: '#fff' },
    { count: vulns.m, bg: '#e8a100', color: '#fff' },
    { count: vulns.l, bg: '#e8c700', color: '#374151' },
    { count: vulns.u, bg: null, color: '#9ca3af' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {pills.map((p, i) =>
        p.bg ? (
          <span key={i} style={{ minWidth: 22, padding: '0 5px', height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3, fontSize: '0.6875rem', fontWeight: 700, background: p.bg, color: p.color }}>
            {p.count}
          </span>
        ) : (
          <span key={i} style={{ minWidth: 22, padding: '0 5px', height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', color: p.color }}>
            {p.count}
          </span>
        )
      )}
    </div>
  )
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <pre style={{ background: '#1e2433', color: '#e2e8f0', borderRadius: 8, padding: '14px 48px 14px 16px', fontSize: '0.8125rem', lineHeight: 1.6, overflowX: 'auto', margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', color: copied ? '#86efac' : '#94a3b8', fontSize: '0.6875rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

// ─── Repo header ──────────────────────────────────────────────────────────────

function RepoHeader({ onUseThisImage }) {
  const brandIcon = BRAND_ICONS['pytorch']

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
        {/* Avatar */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 14,
          background: '#f4f4f6',
          border: '1px solid rgba(11,11,15,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: 12,
        }}>
          <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill={brandIcon.color}>
            <path d={brandIcon.path} />
          </svg>
        </div>

        {/* Name block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.8125rem', color: '#6b7280', fontFamily: 'ui-monospace, monospace' }}>
            {IMAGE.registry}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '1.625rem', fontWeight: 700, color: '#0B0B0F', lineHeight: 1.2 }}>
              {IMAGE.name}
            </h1>
            <ShieldIcon size={20} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {IMAGE.chips.map(c => <Chip key={c} label={c} />)}
          </div>

          <p style={{ margin: 0, fontSize: '0.9375rem', color: '#6b7280', lineHeight: 1.6, maxWidth: 600 }}>
            {IMAGE.desc}
          </p>
        </div>

        {/* CTA */}
        <div style={{ flexShrink: 0, marginTop: 20 }}>
          <button
            onClick={onUseThisImage}
            style={{
              background: '#1d63ed',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1753d4'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1d63ed'}
          >
            Use this image
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function Tabs({ active, onChange }) {
  const tabs = ['overview', 'guides', 'images']
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(11,11,15,0.08)', marginBottom: 28 }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: active === tab ? '2px solid #1d63ed' : '2px solid transparent',
            padding: '10px 20px',
            fontSize: '0.9375rem',
            fontWeight: active === tab ? 600 : 420,
            color: active === tab ? '#1d63ed' : '#6b7280',
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: -1,
            textTransform: 'capitalize',
            transition: 'color 0.12s, border-color 0.12s',
          }}
          onMouseEnter={e => { if (tab !== active) e.currentTarget.style.color = '#374151' }}
          onMouseLeave={e => { if (tab !== active) e.currentTarget.style.color = '#6b7280' }}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}

// ─── Security sidebar ─────────────────────────────────────────────────────────

function SecuritySidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid rgba(11,11,15,0.09)', borderRadius: 10, padding: 20 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 680, color: '#0B0B0F', margin: '0 0 16px' }}>
          Security summary
        </p>

        <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: 6 }}>
          Image version
        </span>
        <div style={{ marginBottom: 20 }}>
          <Select defaultValue="pytorch-2x-dev">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pytorch-2x-dev">PyTorch 2.x (dev)</SelectItem>
              <SelectItem value="pytorch-2x">PyTorch 2.x</SelectItem>
              <SelectItem value="pytorch-2x-alpine">PyTorch 2.x — Alpine 3.22</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <SidebarRow label="Distribution">
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, background: '#1d63ed', color: '#fff' }}>
              DEBIAN 13
            </span>
          </SidebarRow>
          <SidebarRow label="Packages">
            <button style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#1d63ed', fontWeight: 680, fontSize: '0.875rem', fontFamily: 'inherit' }}>
              412 packages <ArrowRight size={12} />
            </button>
          </SidebarRow>
          <SidebarRow label="Vulnerabilities">
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {[
                { n: 0, bg: '#7f1d1d', color: '#fff' },
                { n: 0, bg: '#d52536', color: '#fff' },
                { n: 2, bg: '#e8a100', color: '#fff' },
                { n: 8, bg: '#e8c700', color: '#374151' },
                { n: 3, bg: '#f3f4f6', color: '#6b7280' },
              ].map((v, i) => (
                <span key={i} style={{ minWidth: 22, padding: '0 5px', height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3, fontSize: '0.6875rem', fontWeight: 700, background: v.bg, color: v.color }}>
                  {v.n}
                </span>
              ))}
            </div>
          </SidebarRow>
          <SidebarRow label="Attestations">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {['SLSA L3', 'Signed SBOM'].map(a => (
                <span key={a} style={{ display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 6px', borderRadius: 3, fontSize: '0.625rem', fontWeight: 700, background: '#e8f4f2', color: '#1a6b64' }}>
                  {a}
                </span>
              ))}
            </div>
          </SidebarRow>
          <SidebarRow label="Scout health score">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#388e3c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 900, color: '#fff' }}>
                A
              </span>
              <Shield size={14} style={{ color: '#388e3c' }} />
            </div>
          </SidebarRow>
        </div>

        <div style={{ borderTop: '1px solid rgba(11,11,15,0.08)', marginBottom: 14 }} />

        <button
          style={{ background: '#1d63ed', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1753d4'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1d63ed'}
        >
          View packages, CVEs &amp; attestations
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(11,11,15,0.09)', borderRadius: 10, padding: 20 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 680, color: '#0B0B0F', margin: '0 0 6px' }}>
          Got questions or feedback?
        </p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>
          Connect with the Docker community to ask questions, share feedback, and stay up to date on hardened image releases.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="https://forums.docker.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.875rem', color: '#1d63ed', fontWeight: 520, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Go to discussions ↗
          </a>
          <a href="https://www.docker.com/community/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.875rem', color: '#1d63ed', fontWeight: 520, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Join community ↗
          </a>
        </div>
      </div>
    </div>
  )
}

function SidebarRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: '0.875rem', color: '#6b7280', flexShrink: 0 }}>{label}</span>
      <div>{children}</div>
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: '#fff', border: '1px solid rgba(11,11,15,0.09)', borderRadius: 10, padding: 24 }}>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 10 }}>About PyTorch</h3>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
            PyTorch is an open-source machine learning framework that provides a flexible and powerful platform for building deep learning models. It offers dynamic computational graphs, automatic differentiation, and native GPU acceleration through CUDA. PyTorch is widely used in research and production for tasks ranging from computer vision to natural language processing and reinforcement learning.
          </p>
          <ul style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 }}>
            <li>Dynamic computational graphs for flexible model building</li>
            <li>Strong GPU acceleration with CUDA support</li>
            <li>Extensive ecosystem including TorchVision for computer vision and TorchAudio for audio processing</li>
            <li>TorchScript for production deployment</li>
            <li>Native support for distributed training</li>
          </ul>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>
            For more details, visit{' '}
            <a href="https://pytorch.org/docs/" target="_blank" rel="noopener noreferrer" style={{ color: '#1d63ed' }}>pytorch.org/docs</a>
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 10 }}>About Docker Hardened Images</h3>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>
            Docker Hardened Images are built to meet the highest security and compliance standards. They provide a trusted foundation for containerized workloads by incorporating security best practices from the start.
          </p>

          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 10 }}>Why use Docker Hardened Images?</h4>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>
            These images are published with zero-known CVEs, include signed provenance, and come with a complete Software Bill of Materials (SBOM) and VEX metadata. They're designed to secure your software supply chain while fitting seamlessly into existing Docker workflows.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 10 }}>Trademarks</h3>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>
            PyTorch, the PyTorch logo and any related marks are trademarks of The Linux Foundation.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>
            NVIDIA®, the NVIDIA® logo, and CUDA® are trademarks and/or registered trademarks of NVIDIA Corporation in the U.S. and other countries. Other company and product names may be trademarks of the respective companies with which they are associated.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
            This listing is prepared by Docker. All third-party product names, logos, and trademarks are the property of their respective owners and are used solely for identification. Docker claims no interest in those marks, and no affiliation, sponsorship, or endorsement is implied.
          </p>
        </div>
      </div>

      <div style={{ width: 360, flexShrink: 0 }}>
        <SecuritySidebar />
      </div>
    </div>
  )
}

// ─── Guides tab ───────────────────────────────────────────────────────────────

function GuidesTab() {
  return (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <section id="how-to-use" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>How to use this image</h4>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
            All examples use the public image. If you've mirrored the repository to your org, update commands to reference the mirrored image instead.
          </p>
          <ul style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 }}>
            <li>Public: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem' }}>dhi.io/pytorch:&lt;tag&gt;</code></li>
            <li>Mirrored: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem' }}>&lt;your-namespace&gt;/dhi-pytorch:&lt;tag&gt;</code></li>
          </ul>
        </section>

        <section id="start-instance" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>Start a PyTorch instance</h4>
          <CodeBlock code={`docker run --rm dhi.io/pytorch:<tag> python3 -c "import torch; print(torch.__version__)"`} />
        </section>

        <section id="build-run" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>Build and run a PyTorch application</h4>
          <CodeBlock code={`# syntax=docker/dockerfile:1

## Build stage
FROM dhi.io/pytorch:<tag> AS build-stage
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

## Runtime stage
FROM dhi.io/pytorch:<tag> AS runtime-stage
WORKDIR /app
COPY --from=build-stage /app /app
EXPOSE 8080
CMD ["python3", "app.py"]`} />
        </section>

        <section id="image-variants" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>Image variants</h4>
          <ul style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}><strong>Runtime variants</strong> — run as nonroot, no package manager, minimal libraries.</li>
            <li><strong>Build-time variants</strong> — include <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem' }}>dev</code> in the tag, run as root, include shell and package manager.</li>
          </ul>
        </section>

        <section id="migrate" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>Migrate to a Docker Hardened Image</h4>
          <div style={{ border: '1px solid rgba(11,11,15,0.09)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid rgba(11,11,15,0.08)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '30%' }}>Item</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Migration note</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Base image', 'Replace your base images in your Dockerfile with a Docker Hardened Image.'],
                  ['Package management', "Non-dev images don't contain package managers. Use dev tags for build stages only."],
                  ['Non-root user', 'Non-dev images run as nonroot by default. Ensure files are accessible to that user.'],
                  ['Ports', "Non-dev images can't bind to privileged ports (below 1024). Use port 1025 or higher."],
                  ['No shell', "Some images don't contain a shell. Use dev images in build stages."],
                ].map(([item, note], i, arr) => (
                  <tr key={item} style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(11,11,15,0.08)' : 'none' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#374151', verticalAlign: 'top' }}>{item}</td>
                    <td style={{ padding: '10px 14px', color: '#6b7280', lineHeight: 1.6 }}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="troubleshooting">
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 16 }}>Troubleshooting</h4>
          {[
            { title: 'General debugging', body: "Runtime images don't contain a shell or debugging tools. Use Docker Debug to attach to these containers." },
            { title: 'Privileged ports', body: "Non-dev images run as nonroot and can't bind to ports below 1024. Configure your app to listen on port 1025 or higher." },
            { title: 'No shell', body: 'Use dev images in build stages to run shell commands, then copy artifacts to the runtime stage.' },
          ].map(s => (
            <div key={s.title} style={{ marginBottom: 20 }}>
              <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 8 }}>{s.title}</h5>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>{s.body}</p>
            </div>
          ))}
        </section>
      </div>

      <div style={{ width: 200, flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: 24 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
            On this page
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {GUIDE_SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`}
                style={{ fontSize: '0.8125rem', color: '#6b7280', textDecoration: 'none', padding: '3px 0', lineHeight: 1.5 }}
                onMouseEnter={e => e.currentTarget.style.color = '#1d63ed'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

// ─── Images tab ───────────────────────────────────────────────────────────────

function ImagesTab() {
  const [search, setSearch] = useState('')
  const versions = IMAGE_VERSIONS.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.distro.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: 300, height: 40, borderRadius: 6, padding: '0 12px', background: '#fff', border: '1px solid rgba(11,11,15,0.14)', transition: 'border-color 0.12s' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = '#1d63ed'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(11,11,15,0.14)'}
        >
          <Search size={15} style={{ color: 'rgba(0,0,0,0.35)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.875rem', fontFamily: 'inherit', color: '#0B0B0F' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 200, height: 40, borderRadius: 6, padding: '0 12px', background: '#fff', border: '1px solid rgba(11,11,15,0.14)', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Filter by</span>
          <ChevronDown size={15} style={{ color: '#1d63ed' }} />
        </div>
      </div>

      <div style={{ border: '1px solid rgba(11,11,15,0.09)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '30%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(11,11,15,0.1)' }}>
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
                <th key={col.label} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 700, color: '#0B0B0F', whiteSpace: 'nowrap', background: 'transparent' }}>
                  {col.label}
                  {col.sortable && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4, display: 'inline', verticalAlign: 'middle' }}>
                      <path d="M5 7L2 4h6L5 7z" fill="#6b7280" />
                    </svg>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {versions.map((v, i) => (
              <tr key={v.id} style={{ borderBottom: i < versions.length - 1 ? '1px solid rgba(11,11,15,0.07)' : 'none', verticalAlign: 'top' }}>
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ color: '#1d63ed', fontWeight: 520, fontSize: '0.875rem', cursor: 'pointer' }}>{v.name}</span>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{v.distro}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4 }}>Tags: {v.tags}</div>
                </td>
                <td style={{ padding: '14px 12px', fontSize: '0.875rem', color: '#374151', verticalAlign: 'middle' }}>{v.type}</td>
                <td style={{ padding: '14px 12px', fontSize: '0.875rem', color: '#374151', verticalAlign: 'middle' }}>{v.compliance}</td>
                <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}><CheckMark yes={v.packageManager} /></td>
                <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}><CheckMark yes={v.shell} /></td>
                <td style={{ padding: '14px 12px', fontSize: '0.8125rem', color: '#374151', verticalAlign: 'middle' }}>{v.user}</td>
                <td style={{ padding: '14px 12px', fontSize: '0.8125rem', color: '#374151', verticalAlign: 'middle' }}>{v.lastPushed}</td>
                <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}><VulnPills vulns={v.vulns} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 16, fontSize: '0.8125rem', color: '#6b7280' }}>
        <span>Rows per page:</span>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(11,11,15,0.12)', borderRadius: 4, background: '#fff', padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8125rem', color: '#374151' }}>
          10 <ChevronDown size={12} />
        </button>
        <span>1–{versions.length} of {versions.length}</span>
        <button style={{ border: '1px solid rgba(11,11,15,0.12)', borderRadius: 4, background: '#fff', padding: 4, opacity: 0.4, cursor: 'not-allowed' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button style={{ border: '1px solid rgba(11,11,15,0.12)', borderRadius: 4, background: '#fff', padding: 4, opacity: 0.4, cursor: 'not-allowed' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function MirrorDetailPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8fa', display: 'flex', flexDirection: 'column' }}>
      <MirrorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Navbar />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 80px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: '0.8125rem' }}>
            <span
              onClick={() => navigate('/')}
              style={{ color: '#1d63ed', fontWeight: 420, cursor: 'pointer', transition: 'opacity 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Docker Hardened Images
            </span>
            <span style={{ color: 'rgba(0,0,0,0.3)' }}>/</span>
            <span style={{ color: '#111827', fontWeight: 520 }}>PyTorch</span>
          </div>

          <RepoHeader onUseThisImage={() => setDrawerOpen(true)} />
          <Tabs active={activeTab} onChange={setActiveTab} />

          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'guides' && <GuidesTab />}
          {activeTab === 'images' && <ImagesTab />}

        </div>
      </main>
    </div>
  )
}
