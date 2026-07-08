import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Copy, Check, ArrowRight, Shield } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@docker/trident/components/ui/select'
import ProtoBar from '../components/ProtoBar'
import Navbar from '../components/Navbar'
import { ShieldIcon } from '../components/DhiBadge'
import { BRAND_ICONS } from '../data/brandIcons'
import { CATALOG_BY_SLUG } from '../data/catalogData'

// ─── Data ─────────────────────────────────────────────────────────────────────

const GRADIENT = 'linear-gradient(95deg, #AB00A4 0%, #7D2EFF 25%, #1D63ED 50%, #1C90ED 75%, #88D5C0 100%)'

const IMAGE_DATA = {
  'dhi-build': {
    name: 'DHI Build',
    registry: 'dhi.io/build',
    type: 'HARDENED IMAGE',
    color: '#1D63ED',
    initial: 'D',
    chips: ['CIS', 'LINUX/AMD64', 'LINUX/ARM64'],
    desc: 'Buildkit frontend for building Docker Hardened Images.',
    pulls: '10M+',
    stars: '1.6K',
    updated: '6 hours ago',
  },
}

const FALLBACK = {
  name: 'Dart',
  registry: 'dhi.io/dart',
  type: 'HARDENED IMAGE',
  color: '#0EA5E9',
  initial: 'D',
  chips: ['CIS', 'LINUX/AMD64', 'LINUX/ARM64'],
  desc: 'Hardened Dart runtime for production workloads. Continuously patched, minimal, and compliance-ready.',
  pulls: '10M+',
  stars: '1.6K',
  updated: '1 day ago',
}

const IMAGE_VERSIONS = [
  {
    id: 'dart-3x-dev-debian13',
    name: 'Dart 3.x (dev)',
    distro: 'Debian 13',
    distroColor: '#1d63ed',
    tags: '3-debian13-dev, 3-dev, 3.12-debian13-dev, 3.12-dev, 3.12.0-debian13-dev',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: true,
    shell: true,
    user: 'root',
    lastPushed: '2 days ago',
    vulns: { c: 0, h: 0, m: 0, l: 0, u: 0 },
  },
  {
    id: 'dart-3x-debian13',
    name: 'Dart 3.x',
    distro: 'Debian 13',
    distroColor: '#1d63ed',
    tags: '3, 3.12, 3.12-debian13, 3.12.0, 3.12.0-debian13',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: false,
    shell: true,
    user: 'nonroot 65532',
    lastPushed: '2 days ago',
    vulns: { c: 0, h: 0, m: 0, l: 0, u: 0 },
  },
  {
    id: 'dart-3x-dev-alpine',
    name: 'Dart 3.x (dev)',
    distro: 'Alpine 3.22',
    distroColor: '#0ea5e9',
    tags: '3-alpine3.22-dev, 3.10-alpine3.22-dev, 3.10.9-alpine3.22-dev',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: true,
    shell: true,
    user: 'root',
    lastPushed: '1 month ago',
    vulns: { c: 0, h: 0, m: 1, l: 1, u: 0 },
  },
  {
    id: 'dart-3x-alpine',
    name: 'Dart 3.x',
    distro: 'Alpine 3.22',
    distroColor: '#0ea5e9',
    tags: '3-alpine3.22, 3.10-alpine3.22, 3.10.9-alpine3.22',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: false,
    shell: true,
    user: 'nonroot 65532',
    lastPushed: '1 month ago',
    vulns: { c: 0, h: 0, m: 1, l: 1, u: 0 },
  },
]

const GUIDE_SECTIONS = [
  { id: 'how-to-use', label: 'How to use this image' },
  { id: 'start-instance', label: 'Start a Dart instance' },
  { id: 'build-run', label: 'Build and run a Dart application' },
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

function DistroChip({ label, color }) {
  return (
    <span style={{
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
    }}>
      {label.toUpperCase()}
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

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
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
  )
}

// ─── Repo header ──────────────────────────────────────────────────────────────

function RepoHeader({ image, slug }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
        {/* Avatar */}
        {(() => {
          const catalogEntry = CATALOG_BY_SLUG[slug] || null
          const brandIcon = catalogEntry?.icon ? BRAND_ICONS[catalogEntry.icon] : null
          return (
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              background: brandIcon ? '#f4f4f6' : '#2d3748',
              border: brandIcon ? '1px solid rgba(11,11,15,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              padding: brandIcon ? 12 : 0,
            }}>
              {brandIcon ? (
                <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill={brandIcon.color}>
                  <path d={brandIcon.path} />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4L6 10v10c0 8 6 15 14 16 8-1 14-8 14-16V10L20 4z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M14 20l4.5 4.5L27 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )
        })()}

        {/* Name block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.8125rem', color: '#6b7280', fontFamily: 'ui-monospace, monospace' }}>
            {image.registry}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '1.625rem', fontWeight: 700, color: '#0B0B0F', lineHeight: 1.2 }}>
              {image.name}
            </h1>
            {/* DHI badge — icon only */}
            <ShieldIcon size={20} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {image.chips.map(c => <Chip key={c} label={c} />)}
          </div>

          <p style={{ margin: 0, fontSize: '0.9375rem', color: '#6b7280', lineHeight: 1.6, maxWidth: 600 }}>
            {image.desc}
          </p>
        </div>

        {/* CTA */}
        <div style={{ flexShrink: 0, marginTop: 20 }}>
          <button
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
    <div style={{
      display: 'flex',
      borderBottom: '1px solid rgba(11,11,15,0.08)',
      marginBottom: 28,
      gap: 0,
    }}>
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
      {/* Security summary card */}
      <div style={{
        background: '#fff',
        border: '1px solid rgba(11,11,15,0.09)',
        borderRadius: 10,
        padding: 20,
      }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 680, color: '#0B0B0F', margin: '0 0 16px' }}>
          Security summary
        </p>

        <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: 6 }}>
          Image version
        </span>
        <div style={{ marginBottom: 20 }}>
          <Select defaultValue="source-build-dev">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="source-build-dev">DHI Source Build 2.x (dev)</SelectItem>
              <SelectItem value="build-dev">DHI Build 2.x (dev)</SelectItem>
              <SelectItem value="build-alpine">DHI Build 2.x — Alpine 3.22</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <Row label="Distribution">
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: '0.6875rem',
              fontWeight: 700,
              background: '#1d63ed',
              color: '#fff',
            }}>
              DEBIAN 13
            </span>
          </Row>

          <Row label="Packages">
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: '#1d63ed',
                fontWeight: 680,
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                transition: 'opacity 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              306 packages <ArrowRight size={12} />
            </button>
          </Row>

          <Row label="Vulnerabilities">
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {[
                { n: 1, color: '#7f1d1d', bg: '#d52536' },
                { n: 2, color: '#fff', bg: '#d52536' },
                { n: 4, color: '#fff', bg: '#e8a100' },
                { n: 62, color: '#fff', bg: '#e8c700' },
                { n: 6, color: '#6b7280', bg: '#f3f4f6' },
              ].map((v, i) => (
                <span key={i} style={{
                  minWidth: 22,
                  padding: '0 5px',
                  height: 22,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  background: v.bg,
                  color: v.color,
                }}>
                  {v.n}
                </span>
              ))}
            </div>
          </Row>

          <Row label="Attestations">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {['SLSA L3', 'Signed SBOM'].map(a => (
                <span key={a} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 18,
                  padding: '0 6px',
                  borderRadius: 3,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  background: '#e8f4f2',
                  color: '#1a6b64',
                }}>
                  {a}
                </span>
              ))}
            </div>
          </Row>

          <Row label="Scout health score">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#388e3c',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8125rem',
                fontWeight: 900,
                color: '#fff',
              }}>
                A
              </span>
              <Shield size={14} style={{ color: '#388e3c' }} />
            </div>
          </Row>
        </div>

        <div style={{ borderTop: '1px solid rgba(11,11,15,0.08)', marginBottom: 14 }} />

        <button
          style={{
            background: '#1d63ed',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '7px 14px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background-color 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1753d4'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1d63ed'}
        >
          View packages, CVEs &amp; attestations
        </button>
      </div>

      {/* Got questions card */}
      <div style={{
        background: '#fff',
        border: '1px solid rgba(11,11,15,0.09)',
        borderRadius: 10,
        padding: 20,
      }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 680, color: '#0B0B0F', margin: '0 0 6px' }}>
          Got questions or feedback?
        </p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>
          Connect with the Docker community to ask questions, share feedback, and stay up to date on hardened image releases.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <a href="https://forums.docker.com" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '0.875rem', color: '#1d63ed', fontWeight: 520, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'text-decoration 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >
          Go to discussions ↗
        </a>
        <a href="https://www.docker.com/community/" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '0.875rem', color: '#1d63ed', fontWeight: 520, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
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

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: '0.875rem', color: '#6b7280', flexShrink: 0 }}>{label}</span>
      <div>{children}</div>
    </div>
  )
}

// ─── Per-image About content ──────────────────────────────────────────────────

const GENERIC_DHI_COPY = `Docker Hardened Images are built to meet the highest security and compliance standards. They provide a trusted foundation for containerized workloads by incorporating security best practices from the start.`
const GENERIC_WHY = `These images are published with zero-known CVEs, include signed provenance, and come with a complete Software Bill of Materials (SBOM) and VEX metadata. They're designed to secure your software supply chain while fitting seamlessly into existing Docker workflows.`
const GENERIC_TRADEMARK = `This listing is prepared by Docker. All third-party product names, logos, and trademarks are the property of their respective owners and are used solely for identification. Docker claims no interest in those marks, and no affiliation, sponsorship, or endorsement is implied.`

const IMAGE_CONTENT = {
  caddy: {
    title: 'About Caddy',
    paragraphs: [
      "Caddy is an extensible, open source web server platform that uses TLS by default. It's designed to make HTTPS easy and automatic, with powerful configuration options and a modular architecture.",
      "Caddy is most often used as an HTTPS server, reverse proxy, and static file server. It's the first web server to use HTTPS automatically and by default without any configuration required. Caddy is written in Go, providing higher memory safety guarantees than traditional web servers written in C.",
    ],
    bullets: [
      'Automatic HTTPS with Let\'s Encrypt and ZeroSSL',
      'HTTP/1.1, HTTP/2, and HTTP/3 support out of the box',
      'Easy configuration with the Caddyfile or native JSON config',
      'Dynamic configuration via REST API',
      'Extensible modular architecture',
      'Production-ready, having served trillions of requests',
    ],
    link: { text: 'caddyserver.com/docs', href: 'https://caddyserver.com/docs/' },
    trademark: 'The name "Caddy" is a registered trademark of Stack Holdings GmbH. Any use by Docker is for referential purposes only and does not indicate sponsorship, endorsement, or affiliation.',
  },
  dart: {
    title: 'About Dart',
    paragraphs: [
      'Dart is a client-optimized programming language developed by Google for building fast apps on any platform. It is an object-oriented, class-based language with C-style syntax that supports ahead-of-time (AOT) compilation to native code and just-in-time (JIT) compilation for development. Dart is the foundation of the Flutter framework and provides features such as null safety, async/await, and a rich standard library.',
    ],
    link: { text: 'dart.dev', href: 'https://dart.dev/' },
    trademark: 'Dart is a registered trademark of Google. All rights in the mark are reserved to Google. Any use by Docker is for referential purposes only and does not indicate sponsorship, endorsement, or affiliation.',
  },
  pytorch: {
    title: 'About PyTorch',
    paragraphs: [
      'PyTorch is an open-source machine learning framework that provides a flexible and powerful platform for building deep learning models. It offers dynamic computational graphs, automatic differentiation, and native GPU acceleration through CUDA. PyTorch is widely used in research and production for tasks ranging from computer vision to natural language processing and reinforcement learning.',
    ],
    bullets: [
      'Dynamic computational graphs for flexible model building',
      'Strong GPU acceleration with CUDA support',
      'Extensive ecosystem including TorchVision for computer vision and TorchAudio for audio processing',
      'TorchScript for production deployment',
      'Native support for distributed training',
    ],
    link: { text: 'pytorch.org/docs', href: 'https://pytorch.org/docs/' },
    trademark: 'PyTorch, the PyTorch logo and any related marks are trademarks of The Linux Foundation.\n\nNVIDIA®, the NVIDIA® logo, and CUDA® are trademarks and/or registered trademarks of NVIDIA Corporation in the U.S. and other countries. Other company and product names may be trademarks of the respective companies with which they are associated.\n\n' + GENERIC_TRADEMARK,
  },
  redis: {
    title: 'About Redis',
    paragraphs: [
      "Redis is the world's fastest data platform. It provides cloud and on-prem solutions for caching, vector search, and NoSQL databases that seamlessly fit into any tech stack—making it simple for digital customers to build, scale, and deploy the fast apps our world runs on.",
    ],
    link: { text: 'redis.io', href: 'https://redis.io/' },
    trademark: 'Redis® is a registered trademark of Redis Ltd. Any rights therein are reserved to Redis Ltd. Any use by Docker is for referential purposes only and does not indicate any sponsorship, endorsement, or affiliation between Redis Ltd.',
  },
  php: {
    title: 'About PHP',
    paragraphs: [
      'PHP is a server-side scripting language designed for web development, but which can also be used as a general-purpose programming language. PHP can be added to straight HTML or it can be used with a variety of templating engines and web frameworks. PHP code is usually processed by an interpreter, which is either implemented as a native module on the web-server or as a common gateway interface (CGI).',
    ],
    link: { text: 'wikipedia.org/wiki/PHP', href: 'https://wikipedia.org/wiki/PHP' },
    trademark: GENERIC_TRADEMARK,
  },
  tomcat: {
    title: 'About Apache Tomcat',
    paragraphs: [
      'Apache Tomcat (or simply Tomcat) is an open source web server and servlet container developed by the Apache Software Foundation (ASF). Tomcat implements the Java Servlet and the JavaServer Pages (JSP) specifications from Oracle, and provides a "pure Java" HTTP web server environment for Java code to run in. In the simplest config Tomcat runs in a single operating system process. The process runs a Java virtual machine (JVM). Every single HTTP request from a browser to Tomcat is processed in the Tomcat process in a separate thread.',
    ],
    link: { text: 'tomcat.apache.org', href: 'https://tomcat.apache.org/' },
    trademark: 'Tomcat™ is a trademark of the Apache Software Foundation. All rights in the mark are reserved to the Apache Software Foundation. Any use by Docker is for referential purposes only and does not indicate sponsorship, endorsement, or affiliation.',
  },
  haproxy: {
    title: 'About HAProxy',
    paragraphs: [
      'HAProxy is a free, open source high availability solution, providing load balancing and proxying for TCP and HTTP-based applications by spreading requests across multiple servers. It is written in C and has a reputation for being fast and efficient (in terms of processor and memory usage).',
    ],
    link: { text: 'docs.haproxy.org', href: 'https://docs.haproxy.org/' },
    trademark: 'HAProxy® is a registered trademark in the U.S and France of HAProxy Technologies LLC and its affiliated entities. All rights in the mark are reserved to HAProxy Technologies LLC. Any use by Docker is for referential purposes only and does not indicate sponsorship, endorsement, or affiliation.',
  },
  traefik: {
    title: 'About Traefik',
    paragraphs: [
      'Traefik is a modern HTTP reverse proxy and ingress controller that makes deploying microservices easy.',
      'Traefik integrates with your existing infrastructure components (Kubernetes, Docker, Swarm, Consul, Nomad, etcd, Amazon ECS, etc.) and configures itself automatically and dynamically.',
      'Pointing Traefik at your orchestrator should be the only configuration step you need.',
    ],
    link: { text: 'traefik.io', href: 'https://traefik.io/' },
    trademark: 'Traefik® is a registered trademark of Traefik Labs. Any rights therein are reserved to Traefik Labs. Any use by Docker is for referential purposes only and does not indicate any sponsorship, endorsement, or affiliation between Traefik Labs.',
  },
  'prometheus-alertmanager': {
    title: 'About Alertmanager',
    paragraphs: [
      'Prometheus Alertmanager receives alerts from Prometheus servers, deduplicates and groups them, and routes notifications to configured receivers such as email, Slack, PagerDuty, or webhooks. It supports silencing, inhibition, and high-availability clustering to ensure reliable delivery of notifications in production environments.',
    ],
    link: { text: 'prometheus.io/docs/alerting', href: 'https://prometheus.io/docs/alerting/latest/alertmanager/' },
    whyCopy: 'These images are published with near-zero known CVEs, include signed provenance, and come with a complete Software Bill of Materials (SBOM) and VEX metadata. They\'re designed to secure your software supply chain while fitting seamlessly into existing Docker workflows.',
    trademark: GENERIC_TRADEMARK,
  },
  'grafana-alloy': {
    title: 'About Grafana Alloy',
    paragraphs: [
      'Grafana Alloy is a flexible and extensible distribution of the OpenTelemetry Collector, developed by Grafana Labs. It enables you to collect, transform, and export telemetry data from a wide range of sources to observability platforms such as Grafana, Loki, Tempo, and Prometheus.',
      'Alloy supports a modular pipeline architecture and includes a curated set of receivers, processors, and exporters for common telemetry systems. It is well-suited for organizations that want to standardize and simplify their observability pipelines.',
    ],
    link: { text: 'grafana.com/oss/alloy', href: 'https://grafana.com/oss/alloy-opentelemetry-collector/' },
    whyCopy: 'These images are published with near-zero known CVEs, include signed provenance, and come with a complete Software Bill of Materials (SBOM) and VEX metadata. They\'re designed to secure your software supply chain while fitting seamlessly into existing Docker workflows.',
    trademark: 'Grafana® Alloy is a trademark of Raintank, Inc. dba Grafana Labs. All rights in the mark are reserved to Raintank, Inc. dba Grafana Labs. Any use by Docker is for referential purposes only and does not indicate sponsorship, endorsement, or affiliation.',
  },
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ imageName, slug }) {
  const [showMore, setShowMore] = useState(false)
  const display = imageName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const content = IMAGE_CONTENT[slug] || null

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: '#fff',
          border: '1px solid rgba(11,11,15,0.09)',
          borderRadius: 10,
          padding: 24,
        }}>
          {/* About [Image] */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 10 }}>
            {content ? content.title : `About ${display}`}
          </h3>
          {content ? (
            <>
              {content.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>{p}</p>
              ))}
              {content.bullets && (
                <ul style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 }}>
                  {content.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
              {content.link && (
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>
                  For more details, visit{' '}
                  <a href={content.link.href} target="_blank" rel="noopener noreferrer" style={{ color: '#1d63ed' }}>
                    {content.link.text}
                  </a>
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>
              The Docker Hardened Images Build images <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem' }}>dhi.io/build</code> can be used to build hardened images using the DHI yaml syntax.
            </p>
          )}

          {/* About Docker Hardened Images */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 10 }}>
            About Docker Hardened Images
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>
            {GENERIC_DHI_COPY}
          </p>

          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 10 }}>
            Why use Docker Hardened Images?
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>
            {content?.whyCopy || GENERIC_WHY}
          </p>

          {/* Trademarks */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 10 }}>
            Trademarks
          </h3>
          {(content?.trademark || GENERIC_TRADEMARK).split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>{para}</p>
          ))}
        </div>
      </div>

      {/* Sidebar */}
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
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>
            How to use this image
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>
            All examples use the public image. If you've mirrored the repository to your org, update commands to reference the mirrored image instead.
          </p>
          <ul style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 }}>
            <li>Public: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem' }}>dhi.io/dart:&lt;tag&gt;</code></li>
            <li>Mirrored: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem' }}>&lt;your-namespace&gt;/dhi-dart:&lt;tag&gt;</code></li>
          </ul>
        </section>

        <section id="start-instance" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>
            Start a Dart instance
          </h4>
          <CodeBlock code={`docker run --rm dhi.io/dart:<tag> dart --version`} />
        </section>

        <section id="build-run" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>
            Build and run a Dart application
          </h4>
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
        </section>

        <section id="image-variants" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>
            Image variants
          </h4>
          <ul style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.8, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}><strong>Runtime variants</strong> — run as nonroot, no package manager, minimal libraries.</li>
            <li><strong>Build-time variants</strong> — include <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, fontSize: '0.8125rem' }}>dev</code> in the tag, run as root, include shell and package manager.</li>
          </ul>
        </section>

        <section id="migrate" style={{ marginBottom: 36 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 12 }}>
            Migrate to a Docker Hardened Image
          </h4>
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
                  ['Package management', 'Non-dev images don\'t contain package managers. Use dev tags for build stages only.'],
                  ['Non-root user', 'Non-dev images run as nonroot by default. Ensure files are accessible to that user.'],
                  ['Ports', 'Non-dev images can\'t bind to privileged ports (below 1024). Use port 1025 or higher.'],
                  ['No shell', 'Some images don\'t contain a shell. Use dev images in build stages.'],
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
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 16 }}>
            Troubleshooting
          </h4>
          {[
            { title: 'General debugging', body: 'Runtime images don\'t contain a shell or debugging tools. Use Docker Debug to attach to these containers.' },
            { title: 'Privileged ports', body: 'Non-dev images run as nonroot and can\'t bind to ports below 1024. Configure your app to listen on port 1025 or higher.' },
            { title: 'No shell', body: 'Use dev images in build stages to run shell commands, then copy artifacts to the runtime stage.' },
          ].map(s => (
            <div key={s.title} style={{ marginBottom: 20 }}>
              <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0B0B0F', marginBottom: 8 }}>{s.title}</h5>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>{s.body}</p>
            </div>
          ))}
        </section>
      </div>

      {/* On this page */}
      <div style={{ width: 200, flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: 24 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
            On this page
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {GUIDE_SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} style={{ fontSize: '0.8125rem', color: '#6b7280', textDecoration: 'none', padding: '3px 0', lineHeight: 1.5 }}
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
          <span key={i} style={{
            minWidth: 22,
            padding: '0 5px',
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            fontSize: '0.6875rem',
            fontWeight: 700,
            background: p.bg,
            color: p.color,
          }}>
            {p.count}
          </span>
        ) : (
          <span key={i} style={{
            minWidth: 22,
            padding: '0 5px',
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6875rem',
            color: p.color,
          }}>
            {p.count}
          </span>
        )
      )}
    </div>
  )
}

function ImagesTab() {
  const [search, setSearch] = useState('')
  const versions = IMAGE_VERSIONS.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.distro.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search + filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: 300,
            height: 40,
            borderRadius: 6,
            padding: '0 12px',
            background: '#fff',
            border: '1px solid rgba(11,11,15,0.14)',
            transition: 'border-color 0.12s',
          }}
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 200,
          height: 40,
          borderRadius: 6,
          padding: '0 12px',
          background: '#fff',
          border: '1px solid rgba(11,11,15,0.14)',
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Filter by</span>
          <ChevronDown size={15} style={{ color: '#1d63ed' }} />
        </div>
      </div>

      {/* Table */}
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
              <th key={col.label} style={{
                padding: '10px 12px',
                textAlign: 'left',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#0B0B0F',
                whiteSpace: 'nowrap',
                background: 'transparent',
              }}>
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
            <tr key={v.id} style={{
              borderBottom: i < versions.length - 1 ? '1px solid rgba(11,11,15,0.07)' : 'none',
              verticalAlign: 'top',
            }}>
              <td style={{ padding: '14px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ color: '#1d63ed', fontWeight: 520, fontSize: '0.875rem', cursor: 'pointer' }}>{v.name}</span>
                  <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 400 }}>{v.distro}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4 }}>
                  Tags: {v.tags}
                </div>
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

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 16, fontSize: '0.8125rem', color: '#6b7280' }}>
        <span>Rows per page:</span>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4,
          border: '1px solid rgba(11,11,15,0.12)', borderRadius: 4,
          background: '#fff', padding: '3px 8px', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: '0.8125rem', color: '#374151',
        }}>
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

export default function ImageDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const image = { ...(IMAGE_DATA[slug] ?? { ...FALLBACK, name: slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Dart' }), slug }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8fa', display: 'flex', flexDirection: 'column' }}>
      <ProtoBar label="DHI Catalog" />
      <Navbar />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 80px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: '0.8125rem' }}>
            <span
              onClick={() => navigate('/catalog')}
              style={{ color: '#1d63ed', fontWeight: 420, cursor: 'pointer', transition: 'opacity 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Docker Hardened Images
            </span>
            <span style={{ color: 'rgba(0,0,0,0.3)' }}>/</span>
            <span style={{ color: '#111827', fontWeight: 520 }}>{image.name}</span>
          </div>

          <RepoHeader image={image} slug={slug} />
          <Tabs active={activeTab} onChange={setActiveTab} />

          {activeTab === 'overview' && <OverviewTab imageName={slug ?? 'dart'} slug={slug ?? 'dart'} />}
          {activeTab === 'guides' && <GuidesTab />}
          {activeTab === 'images' && <ImagesTab />}

        </div>
      </main>
    </div>
  )
}
