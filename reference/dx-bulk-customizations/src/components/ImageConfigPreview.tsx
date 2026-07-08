import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import {
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type DryRunAction =
  | 'SET_BY_CUSTOMIZATION'
  | 'SET_BY_TAG_DEFINITION'
  | 'INHERITED_FROM_ARTIFACT'
  | 'CUSTOMIZATION_OVERRIDES_ARTIFACT'
  | 'PATH_MERGED'
  | 'DEFAULT_PATH_ADDED'

type SourceKind = 'CUSTOMIZATION' | 'TAG_DEFINITION' | 'OCI_ARTIFACT' | 'DEFAULT_PATH'

interface ConfigSource {
  kind: SourceKind
  value?: string
  reference?: string
}

interface EnvEntry {
  name: string
  effectiveValue: string
  action: DryRunAction
  sources: ConfigSource[]
}

/** A single-value config field (CMD, ENTRYPOINT, User) */
interface SingleValueField {
  effectiveValue: string
  action: DryRunAction
  sources: ConfigSource[]
}

/** A key-value config field (Labels, Annotations) */
interface KeyValueEntry {
  key: string
  effectiveValue: string
  action: DryRunAction
  sources: ConfigSource[]
}

interface ImageConfig {
  environment: EnvEntry[]
  cmd: SingleValueField
  entrypoint: SingleValueField
  user: SingleValueField
  labels: KeyValueEntry[]
  annotations: KeyValueEntry[]
}

interface DryRunDiagnostic {
  severity: 'WARNING' | 'ERROR'
  code: string
  message: string
}

type PreviewStage = 'fetching' | 'resolving' | 'computing'

type PreviewState =
  | { status: 'idle' }
  | { status: 'loading'; stage: PreviewStage }
  | { status: 'success'; config: ImageConfig; diagnostics: DryRunDiagnostic[] }
  | { status: 'error'; message: string }
  | { status: 'timeout' }

// ─── Scenarios ────────────────────────────────────────────────────────────────

type Scenario = 'clean' | 'warnings' | 'error' | 'timeout'

interface ScenarioData {
  config: ImageConfig
  diagnostics: DryRunDiagnostic[]
}

// ── Helpers to build mock entries concisely ──

function cust(name: string, value: string): EnvEntry {
  return { name, effectiveValue: value, action: 'SET_BY_CUSTOMIZATION', sources: [{ kind: 'CUSTOMIZATION', value }] }
}
function tagDef(name: string, value: string): EnvEntry {
  return { name, effectiveValue: value, action: 'SET_BY_TAG_DEFINITION', sources: [{ kind: 'TAG_DEFINITION', value }] }
}
function inherited(name: string, value: string, ref: string): EnvEntry {
  return { name, effectiveValue: value, action: 'INHERITED_FROM_ARTIFACT', sources: [{ kind: 'OCI_ARTIFACT', value, reference: ref }] }
}
function override(name: string, custVal: string, artVal: string, ref: string): EnvEntry {
  return { name, effectiveValue: custVal, action: 'CUSTOMIZATION_OVERRIDES_ARTIFACT', sources: [{ kind: 'CUSTOMIZATION', value: custVal }, { kind: 'OCI_ARTIFACT', value: artVal, reference: ref }] }
}
function kvCust(key: string, value: string): KeyValueEntry {
  return { key, effectiveValue: value, action: 'SET_BY_CUSTOMIZATION', sources: [{ kind: 'CUSTOMIZATION', value }] }
}
function kvTag(key: string, value: string): KeyValueEntry {
  return { key, effectiveValue: value, action: 'SET_BY_TAG_DEFINITION', sources: [{ kind: 'TAG_DEFINITION', value }] }
}
function kvInherited(key: string, value: string, ref: string): KeyValueEntry {
  return { key, effectiveValue: value, action: 'INHERITED_FROM_ARTIFACT', sources: [{ kind: 'OCI_ARTIFACT', value, reference: ref }] }
}

const CA_CERTS = 'docker.io/moby/ca-certs:latest'
const INTERNAL_PKG = 'docker.io/moby/internal-packages:latest'
const MONITORING = 'docker.io/acme/monitoring-sidecar:2.4.1'

// ── Clean scenario: realistic Python 3.13 customization, no artifact conflicts ──

const CLEAN_CONFIG: ImageConfig = {
  environment: [
    // Customization-set
    cust('DEBIAN_FRONTEND', 'noninteractive'),
    cust('SSL_CERT_DIR', '/etc/ssl/certs'),
    cust('CURL_CA_BUNDLE', '/etc/ssl/certs/ca-certificates.crt'),
    cust('REQUESTS_CA_BUNDLE', '/etc/ssl/certs/ca-certificates.crt'),
    cust('NODE_EXTRA_CA_CERTS', '/etc/ssl/certs/ca-certificates.crt'),
    cust('PIP_INDEX_URL', 'https://pypi.internal.acme.com/simple'),
    cust('PIP_TRUSTED_HOST', 'pypi.internal.acme.com'),
    cust('HTTP_PROXY', 'http://proxy.acme.internal:3128'),
    cust('HTTPS_PROXY', 'http://proxy.acme.internal:3128'),
    cust('NO_PROXY', 'localhost,127.0.0.1,.acme.internal,.acme.com,10.0.0.0/8,172.16.0.0/12'),
    // Tag definition
    tagDef('LANG', 'C.UTF-8'),
    tagDef('GPG_KEY', 'E3FF2839C048B25C084DEBE9B26995E310250568'),
    tagDef('PYTHON_VERSION', '3.13.2'),
    tagDef('PYTHON_PIP_VERSION', '24.3.1'),
    tagDef('PYTHON_SETUPTOOLS_VERSION', '75.8.0'),
    tagDef('PYTHON_GET_PIP_URL', 'https://github.com/pypa/get-pip/raw/e03e1607ad60522cf34a92e834138eb89e57667b/public/get-pip.py'),
    tagDef('PYTHON_GET_PIP_SHA256', '3d5ef1f3056a585708da450b698a5960ae4ba54e3b3e5250e1e2f2c9c3a7e3e1'),
    tagDef('PYTHONDONTWRITEBYTECODE', '1'),
    tagDef('PYTHONUNBUFFERED', '1'),
    tagDef('PYTHONIOENCODING', 'UTF-8'),
    tagDef('PYTHONHASHSEED', 'random'),
    tagDef('LD_LIBRARY_PATH', '/usr/local/lib'),
    tagDef('PKG_CONFIG_PATH', '/usr/local/lib/pkgconfig'),
    tagDef('CFLAGS', '-fstack-protector-strong -D_FORTIFY_SOURCE=2'),
    tagDef('LDFLAGS', '-Wl,-z,relro,-z,now'),
    // Default PATH
    {
      name: 'PATH',
      effectiveValue: '/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin',
      action: 'DEFAULT_PATH_ADDED',
      sources: [{ kind: 'DEFAULT_PATH', value: '/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin' }],
    },
  ],
  cmd: {
    effectiveValue: '["python3"]',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: '["python3"]' }],
  },
  entrypoint: {
    effectiveValue: '/usr/local/bin/docker-entrypoint.sh',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: '/usr/local/bin/docker-entrypoint.sh' }],
  },
  user: {
    effectiveValue: 'nonroot:nonroot',
    action: 'SET_BY_CUSTOMIZATION',
    sources: [{ kind: 'CUSTOMIZATION', value: 'nonroot:nonroot' }],
  },
  labels: [
    kvCust('com.acme.team', 'platform-eng'),
    kvCust('com.acme.cost-center', 'CC-4420'),
    kvCust('com.acme.compliance', 'stig-v2'),
    kvCust('com.acme.contact', 'platform-eng@acme.com'),
    kvTag('com.docker.hardened', 'true'),
    kvTag('com.docker.hardened.revision', 'r3'),
    kvTag('org.opencontainers.image.vendor', 'Docker Inc.'),
    kvTag('org.opencontainers.image.title', 'Docker Hardened Python'),
    kvTag('org.opencontainers.image.description', 'Hardened Python 3.13 runtime with CIS benchmarks applied'),
    kvTag('org.opencontainers.image.version', '3.13.2-r3'),
    kvTag('org.opencontainers.image.url', 'https://hub.docker.com/r/docker/hardened-python'),
    kvTag('org.opencontainers.image.licenses', 'Apache-2.0'),
    kvTag('org.opencontainers.image.created', '2026-04-15T08:22:41Z'),
    kvTag('org.opencontainers.image.base.name', 'docker.io/library/debian:12-slim'),
  ],
  annotations: [
    kvCust('com.acme.build-policy', 'nightly'),
    kvCust('com.acme.scan-required', 'true'),
    kvTag('org.opencontainers.image.source', 'https://github.com/docker/hardened-images'),
    kvTag('org.opencontainers.image.revision', 'a1b2c3d4e5f6'),
    kvTag('com.docker.hardened.sbom', 'true'),
    kvTag('com.docker.hardened.provenance', 'true'),
    kvTag('com.docker.hardened.cis-benchmark', 'CIS_Docker_Benchmark_v1.6.0'),
  ],
}

// ── Warnings scenario: 3 OCI artifacts, overrides, PATH merge, inherited vars ──

const WARNING_CONFIG: ImageConfig = {
  environment: [
    // PATH merged from artifact
    {
      name: 'PATH',
      effectiveValue: '/opt/monitoring/bin:/artifact/bin:/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin',
      action: 'PATH_MERGED',
      sources: [
        { kind: 'OCI_ARTIFACT', value: '/opt/monitoring/bin', reference: MONITORING },
        { kind: 'OCI_ARTIFACT', value: '/artifact/bin', reference: CA_CERTS },
        { kind: 'DEFAULT_PATH', value: '/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin' },
      ],
    },
    // Customization-set
    cust('DEBIAN_FRONTEND', 'noninteractive'),
    cust('PIP_INDEX_URL', 'https://pypi.internal.acme.com/simple'),
    cust('PIP_TRUSTED_HOST', 'pypi.internal.acme.com'),
    cust('HTTP_PROXY', 'http://proxy.acme.internal:3128'),
    cust('HTTPS_PROXY', 'http://proxy.acme.internal:3128'),
    cust('NO_PROXY', 'localhost,127.0.0.1,.acme.internal,.acme.com,10.0.0.0/8,172.16.0.0/12'),
    // Overrides (customization wins over artifact)
    override('SSL_CERT_DIR', '/etc/ssl/certs', '/opt/certs/ssl', CA_CERTS),
    override('CURL_CA_BUNDLE', '/etc/ssl/certs/ca-certificates.crt', '/opt/certs/ca-bundle.crt', CA_CERTS),
    override('REQUESTS_CA_BUNDLE', '/etc/ssl/certs/ca-certificates.crt', '/opt/certs/ca-bundle.crt', CA_CERTS),
    override('NODE_EXTRA_CA_CERTS', '/etc/ssl/certs/ca-certificates.crt', '/opt/certs/node-ca.crt', CA_CERTS),
    // Inherited from artifacts (user didn't set these)
    inherited('CA_CERTIFICATES_JAVA_VERSION', '20230710', CA_CERTS),
    inherited('JAVA_HOME', '/usr/lib/jvm/java-17-openjdk-amd64', INTERNAL_PKG),
    inherited('JAVA_TOOL_OPTIONS', '-Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts', INTERNAL_PKG),
    inherited('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://localhost:4317', MONITORING),
    inherited('OTEL_SERVICE_NAME', 'unknown', MONITORING),
    inherited('OTEL_TRACES_SAMPLER', 'parentbased_traceidratio', MONITORING),
    inherited('OTEL_TRACES_SAMPLER_ARG', '0.1', MONITORING),
    inherited('PROMETHEUS_PORT', '9090', MONITORING),
    inherited('HEALTHCHECK_PORT', '8081', MONITORING),
    // Tag definition
    tagDef('LANG', 'C.UTF-8'),
    tagDef('GPG_KEY', 'E3FF2839C048B25C084DEBE9B26995E310250568'),
    tagDef('PYTHON_VERSION', '3.13.2'),
    tagDef('PYTHON_PIP_VERSION', '24.3.1'),
    tagDef('PYTHON_SETUPTOOLS_VERSION', '75.8.0'),
    tagDef('PYTHON_GET_PIP_URL', 'https://github.com/pypa/get-pip/raw/e03e1607ad60522cf34a92e834138eb89e57667b/public/get-pip.py'),
    tagDef('PYTHON_GET_PIP_SHA256', '3d5ef1f3056a585708da450b698a5960ae4ba54e3b3e5250e1e2f2c9c3a7e3e1'),
    tagDef('PYTHONDONTWRITEBYTECODE', '1'),
    tagDef('PYTHONUNBUFFERED', '1'),
    tagDef('PYTHONIOENCODING', 'UTF-8'),
    tagDef('PYTHONHASHSEED', 'random'),
    tagDef('LD_LIBRARY_PATH', '/usr/local/lib'),
    tagDef('PKG_CONFIG_PATH', '/usr/local/lib/pkgconfig'),
    tagDef('CFLAGS', '-fstack-protector-strong -D_FORTIFY_SOURCE=2'),
    tagDef('LDFLAGS', '-Wl,-z,relro,-z,now'),
  ],
  cmd: {
    effectiveValue: '["bash"]',
    action: 'SET_BY_CUSTOMIZATION',
    sources: [{ kind: 'CUSTOMIZATION', value: '["bash"]' }],
  },
  entrypoint: {
    effectiveValue: '/opt/acme/entrypoint.sh',
    action: 'CUSTOMIZATION_OVERRIDES_ARTIFACT',
    sources: [
      { kind: 'CUSTOMIZATION', value: '/opt/acme/entrypoint.sh' },
      { kind: 'OCI_ARTIFACT', value: '/opt/monitoring/entrypoint-wrapper.sh', reference: MONITORING },
    ],
  },
  user: {
    effectiveValue: 'nonroot:nonroot',
    action: 'SET_BY_CUSTOMIZATION',
    sources: [{ kind: 'CUSTOMIZATION', value: 'nonroot:nonroot' }],
  },
  labels: [
    kvCust('com.acme.team', 'platform-eng'),
    kvCust('com.acme.cost-center', 'CC-4420'),
    kvCust('com.acme.compliance', 'stig-v2'),
    kvCust('com.acme.contact', 'platform-eng@acme.com'),
    kvInherited('io.artifact.ca-certs.version', 'ca-certs-2024.04', CA_CERTS),
    kvInherited('io.artifact.monitoring.version', '2.4.1', MONITORING),
    kvTag('com.docker.hardened', 'true'),
    kvTag('com.docker.hardened.revision', 'r3'),
    kvTag('org.opencontainers.image.vendor', 'Docker Inc.'),
    kvTag('org.opencontainers.image.title', 'Docker Hardened Python'),
    kvTag('org.opencontainers.image.description', 'Hardened Python 3.13 runtime with CIS benchmarks applied'),
    kvTag('org.opencontainers.image.version', '3.13.2-r3'),
    kvTag('org.opencontainers.image.url', 'https://hub.docker.com/r/docker/hardened-python'),
    kvTag('org.opencontainers.image.licenses', 'Apache-2.0'),
    kvTag('org.opencontainers.image.created', '2026-04-15T08:22:41Z'),
    kvTag('org.opencontainers.image.base.name', 'docker.io/library/debian:12-slim'),
  ],
  annotations: [
    kvCust('com.acme.build-policy', 'nightly'),
    kvCust('com.acme.scan-required', 'true'),
    kvCust('com.acme.approved-by', 'secops-review-2026-04'),
    kvInherited('io.artifact.ca-certs.injected-at', '2026-04-10T12:00:00Z', CA_CERTS),
    kvTag('org.opencontainers.image.source', 'https://github.com/docker/hardened-images'),
    kvTag('org.opencontainers.image.revision', 'a1b2c3d4e5f6'),
    kvTag('com.docker.hardened.sbom', 'true'),
    kvTag('com.docker.hardened.provenance', 'true'),
    kvTag('com.docker.hardened.cis-benchmark', 'CIS_Docker_Benchmark_v1.6.0'),
  ],
}

const WARNING_DIAGNOSTICS: DryRunDiagnostic[] = [
  {
    severity: 'WARNING',
    code: 'OCI_ARTIFACT_PATH_MERGED',
    message: 'OCI artifacts modified PATH. Artifact entries are prepended and take runtime precedence.',
  },
  {
    severity: 'WARNING',
    code: 'OCI_ARTIFACT_ENV_OVERRIDDEN',
    message: 'SSL_CERT_DIR from artifact was overridden by customization config.',
  },
  {
    severity: 'WARNING',
    code: 'OCI_ARTIFACT_ENV_OVERRIDDEN',
    message: 'CURL_CA_BUNDLE from artifact was overridden by customization config.',
  },
  {
    severity: 'WARNING',
    code: 'OCI_ARTIFACT_ENV_OVERRIDDEN',
    message: 'REQUESTS_CA_BUNDLE from artifact was overridden by customization config.',
  },
  {
    severity: 'WARNING',
    code: 'OCI_ARTIFACT_ENV_OVERRIDDEN',
    message: 'NODE_EXTRA_CA_CERTS from artifact was overridden by customization config.',
  },
  {
    severity: 'WARNING',
    code: 'OCI_ARTIFACT_ENTRYPOINT_OVERRIDDEN',
    message: 'ENTRYPOINT from monitoring artifact was overridden by customization config.',
  },
]

const ERROR_MESSAGE = 'Failed to resolve OCI artifact docker.io/moby/ca-certs:latest \u2014 manifest not found. The artifact may have been deleted or the tag may no longer exist.'

function getScenarioData(scenario: Scenario): ScenarioData | null {
  switch (scenario) {
    case 'clean':
      return { config: CLEAN_CONFIG, diagnostics: [] }
    case 'warnings':
      return { config: WARNING_CONFIG, diagnostics: WARNING_DIAGNOSTICS }
    case 'error':
    case 'timeout':
      return null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STAGES: { key: PreviewStage; label: string }[] = [
  { key: 'fetching', label: 'Fetching config' },
  { key: 'resolving', label: 'Resolving artifacts' },
  { key: 'computing', label: 'Computing preview' },
]

function originDescription(action: DryRunAction): string {
  switch (action) {
    case 'SET_BY_CUSTOMIZATION':
      return 'You set this value in your customization.'
    case 'SET_BY_TAG_DEFINITION':
      return 'This value comes from the base image tag definition. You did not change it.'
    case 'INHERITED_FROM_ARTIFACT':
      return 'This value was added by an OCI artifact. You did not set it, but it will be present in the final image.'
    case 'CUSTOMIZATION_OVERRIDES_ARTIFACT':
      return 'Your customization value took precedence over a value provided by an OCI artifact.'
    case 'PATH_MERGED':
      return 'PATH was modified by OCI artifacts. Artifact entries are prepended and take runtime precedence over the default PATH.'
    case 'DEFAULT_PATH_ADDED':
      return 'The default container PATH. Used when no customization or artifact provides one.'
  }
}

function originLabel(action: DryRunAction): { text: string; className: string; plain?: boolean } {
  switch (action) {
    case 'SET_BY_CUSTOMIZATION':
      return { text: 'Yours', className: 'text-foreground', plain: true }
    case 'SET_BY_TAG_DEFINITION':
      return { text: 'Tag definition', className: 'text-muted-foreground/60', plain: true }
    case 'INHERITED_FROM_ARTIFACT':
      return { text: 'OCI artifact', className: 'bg-blue-500/10 text-blue-600 border border-blue-500/20' }
    case 'CUSTOMIZATION_OVERRIDES_ARTIFACT':
      return { text: 'Override', className: 'bg-foreground/[0.04] text-foreground/75 border border-foreground/[0.06]' }
    case 'PATH_MERGED':
      return { text: 'PATH merged', className: 'bg-foreground/[0.04] text-foreground/75 border border-foreground/[0.06]' }
    case 'DEFAULT_PATH_ADDED':
      return { text: 'Default', className: 'text-muted-foreground/60', plain: true }
  }
}

/** Sort order: most surprising first, baseline last */
function actionRank(action: DryRunAction): number {
  const order: Record<DryRunAction, number> = {
    CUSTOMIZATION_OVERRIDES_ARTIFACT: 0,
    PATH_MERGED: 1,
    INHERITED_FROM_ARTIFACT: 2,
    SET_BY_CUSTOMIZATION: 3,
    SET_BY_TAG_DEFINITION: 4,
    DEFAULT_PATH_ADDED: 5,
  }
  return order[action]
}

function sortEnv(entries: EnvEntry[]): EnvEntry[] {
  return [...entries].sort((a, b) => {
    const d = actionRank(a.action) - actionRank(b.action)
    if (d !== 0) return d
    return a.name.localeCompare(b.name)
  })
}

function sortKv(entries: KeyValueEntry[]): KeyValueEntry[] {
  return [...entries].sort((a, b) => {
    const d = actionRank(a.action) - actionRank(b.action)
    if (d !== 0) return d
    return a.key.localeCompare(b.key)
  })
}

function isInherited(action: DryRunAction): boolean {
  return action === 'INHERITED_FROM_ARTIFACT' ||
    action === 'SET_BY_TAG_DEFINITION' ||
    action === 'DEFAULT_PATH_ADDED'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const MONO_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '13px',
}

/** Origin pill (right column) — hover for explanation */
function OriginPill({ action, suppressedValue }: { action: DryRunAction; suppressedValue?: string }) {
  const origin = originLabel(action)
  const description = originDescription(action)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(
          'text-xs cursor-help',
          origin.plain ? '' : 'px-1.5 py-0.5 rounded',
          origin.className,
        )}>
          {origin.text}
        </span>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-xs">
        <p>{description}</p>
        {suppressedValue && (
          <p className="mt-1 text-muted-foreground" style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)', fontSize: '11px' }}>
            Artifact value: {suppressedValue}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

/** Renders a single-value field (CMD, ENTRYPOINT, User) as a row */
function SingleFieldRow({ label, field, zebra }: { label: string; field: SingleValueField; zebra?: boolean }) {
  const suppressedSource = field.action === 'CUSTOMIZATION_OVERRIDES_ARTIFACT'
    ? field.sources.find(s => s.kind === 'OCI_ARTIFACT')
    : null

  return (
    <div className={cn(
      'flex items-center gap-4 py-2 border-b border-border/50 last:border-0',
      zebra && 'bg-black/[0.014] dark:bg-white/[0.035]',
      field.action === 'INHERITED_FROM_ARTIFACT' && 'border-l-2 border-l-blue-500/40 pl-[18px]',
    )}>
      <span className="w-[180px] shrink-0 text-foreground" style={MONO_STYLE}>
        {label}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <code className="flex-1 truncate cursor-default text-muted-foreground" style={MONO_STYLE}>
            {field.effectiveValue}
          </code>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-md break-all">
          <p>{field.effectiveValue}</p>
          {suppressedSource && (
            <p className="mt-1 text-muted-foreground">
              Artifact value: {suppressedSource.value}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
      <div className="w-[120px] shrink-0 flex justify-end items-center gap-1">
        <OriginPill action={field.action} suppressedValue={suppressedSource?.value} />
      </div>
    </div>
  )
}

/** Env var row */
function EnvRow({ entry, zebra }: { entry: EnvEntry; zebra: boolean }) {
  const suppressedSource = entry.action === 'CUSTOMIZATION_OVERRIDES_ARTIFACT'
    ? entry.sources.find(s => s.kind === 'OCI_ARTIFACT')
    : null

  return (
    <div className={cn(
      'flex items-center gap-4 py-2 border-b border-border/50 last:border-0',
      zebra && 'bg-black/[0.014] dark:bg-white/[0.035]',
      entry.action === 'INHERITED_FROM_ARTIFACT' && 'border-l-2 border-l-blue-500/40 pl-[18px]',
    )}>
      <span className="w-[180px] shrink-0 truncate text-foreground" style={MONO_STYLE}>
        {entry.name}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex-1 truncate cursor-default text-muted-foreground" style={MONO_STYLE}>
            {entry.effectiveValue}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-md break-all">
          <p>{entry.effectiveValue}</p>
          {suppressedSource && (
            <p className="mt-1 text-muted-foreground">
              Artifact value: {suppressedSource.value}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
      <div className="w-[120px] shrink-0 flex justify-end items-center gap-1">
        <OriginPill action={entry.action} suppressedValue={suppressedSource?.value} />
      </div>
    </div>
  )
}

/** Key-value row (Labels, Annotations) */
function KvRow({ entry, zebra }: { entry: KeyValueEntry; zebra: boolean }) {
  return (
    <div className={cn(
      'flex items-center gap-4 py-2 border-b border-border/50 last:border-0',
      zebra && 'bg-black/[0.014] dark:bg-white/[0.035]',
      entry.action === 'INHERITED_FROM_ARTIFACT' && 'border-l-2 border-l-blue-500/40 pl-[18px]',
    )}>
      <span className="w-[280px] shrink-0 truncate text-foreground" style={MONO_STYLE}>
        {entry.key}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex-1 truncate cursor-default text-muted-foreground" style={MONO_STYLE}>
            {entry.effectiveValue}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-md break-all">
          <p>{entry.effectiveValue}</p>
        </TooltipContent>
      </Tooltip>
      <div className="w-[120px] shrink-0 flex justify-end">
        <OriginPill action={entry.action} />
      </div>
    </div>
  )
}

/** Column header for a section's list */
function ColumnHeader({ keyLabel, keyWidth = 180 }: { keyLabel: string; keyWidth?: number }) {
  return (
    <div className="flex items-center gap-4 py-1.5 border-b border-border">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 shrink-0" style={{ width: keyWidth }}>{keyLabel}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 flex-1">Value</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 w-[120px] shrink-0 text-right">Origin</span>
    </div>
  )
}

/** Section wrapper — header with title + count summary, default open */
function ConfigSection({ label, count, summary, defaultOpen = true, children }: {
  label: string
  count?: number
  summary?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border-b border-border last:border-0">
        <CollapsibleTrigger asChild>
          <button className="w-full px-5 py-2.5 flex items-center gap-2 cursor-pointer border-none text-left hover:bg-muted/30 transition-colors">
            <span className="text-sm text-foreground" style={{ fontVariationSettings: "'wght' 520" }}>{label}</span>
            {count !== undefined && (
              <span className="text-xs text-muted-foreground/70">{count}</span>
            )}
            {summary && (
              <span className="text-xs text-muted-foreground/60">· {summary}</span>
            )}
            <div className="flex-1" />
            <ChevronDown className={cn('size-3.5 text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-3">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export type { Scenario }
export const SCENARIO_LABELS: Record<Scenario, string> = {
  clean: 'Clean build',
  warnings: 'Warnings',
  error: 'Error',
  timeout: 'Timeout',
}

interface ImageConfigPreviewProps {
  active?: boolean
  scenario?: Scenario | null
}

export default function ImageConfigPreview({ active = false, scenario: forcedScenario }: ImageConfigPreviewProps) {
  const [state, setState] = useState<PreviewState>({ status: 'idle' })
  const [open, setOpen] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hideInherited, setHideInherited] = useState(false)

  function applyScenario(scenario: Scenario) {
    const data = getScenarioData(scenario)
    if (scenario === 'error') {
      setState({ status: 'error', message: ERROR_MESSAGE })
    } else if (scenario === 'timeout') {
      setState({ status: 'timeout' })
    } else {
      setState({ status: 'success', config: data!.config, diagnostics: data!.diagnostics })
    }
  }

  function runSimulation(overrideScenario?: Scenario) {
    const scenario = overrideScenario ?? 'clean'
    const data = getScenarioData(scenario)

    setState({ status: 'loading', stage: 'fetching' })

    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setState({ status: 'loading', stage: 'resolving' }), 1800))

    if (scenario === 'error') {
      timers.push(setTimeout(() => {
        setState({ status: 'error', message: ERROR_MESSAGE })
        setHasLoaded(true)
      }, 3400))
    } else if (scenario === 'timeout') {
      timers.push(setTimeout(() => setState({ status: 'loading', stage: 'computing' }), 4200))
      timers.push(setTimeout(() => {
        setState({ status: 'timeout' })
        setHasLoaded(true)
      }, 7500))
    } else {
      timers.push(setTimeout(() => setState({ status: 'loading', stage: 'computing' }), 4200))
      timers.push(setTimeout(() => {
        setState({ status: 'success', config: data!.config, diagnostics: data!.diagnostics })
        setHasLoaded(true)
      }, 6000))
    }

    return timers
  }

  // Run loading animation only on first activation
  useEffect(() => {
    if (!active) {
      setState({ status: 'idle' })
      setHasLoaded(false)
      return
    }

    const timers = runSimulation(forcedScenario ?? undefined)
    return () => { timers.forEach(clearTimeout) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // When scenario changes after initial load, swap data instantly
  useEffect(() => {
    if (!active || !hasLoaded || forcedScenario == null) return
    applyScenario(forcedScenario)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedScenario])

  const handleRetry = () => {
    const scenario = forcedScenario ?? 'clean'
    applyScenario(scenario)
  }

  // Derived data
  const successData = state.status === 'success' ? state : null
  const config = successData?.config
  const warningCount = successData?.diagnostics.filter(d => d.severity === 'WARNING').length ?? 0

  // Apply hide-inherited filter
  const visibleEnv = config
    ? sortEnv(hideInherited ? config.environment.filter(e => !isInherited(e.action)) : config.environment)
    : []
  const visibleLabels = config
    ? sortKv(hideInherited ? config.labels.filter(l => !isInherited(l.action)) : config.labels)
    : []
  const visibleAnnotations = config
    ? sortKv(hideInherited ? config.annotations.filter(a => !isInherited(a.action)) : config.annotations)
    : []

  // Image settings always shown (only 3 fields)
  const settings: { label: string; field: SingleValueField }[] = config ? [
    { label: 'CMD', field: config.cmd },
    { label: 'ENTRYPOINT', field: config.entrypoint },
    { label: 'User', field: config.user },
  ] : []
  const visibleSettings = hideInherited
    ? settings.filter(s => !isInherited(s.field.action))
    : settings

  // PATH callout (always shown if present, even when filter hides inherited)
  const pathEntry = config?.environment.find(e => e.action === 'PATH_MERGED')

  // Counts for status bar
  const overrideEnvCount = config?.environment.filter(e => e.action === 'CUSTOMIZATION_OVERRIDES_ARTIFACT').length ?? 0
  const overrideEntrypoint = config?.entrypoint.action === 'CUSTOMIZATION_OVERRIDES_ARTIFACT'
  const totalOverrides = overrideEnvCount + (overrideEntrypoint ? 1 : 0)
  const inheritedEnvCount = config?.environment.filter(e => e.action === 'INHERITED_FROM_ARTIFACT').length ?? 0
  const pathMerged = !!pathEntry
  const isClean = totalOverrides === 0 && !pathMerged && warningCount === 0

  // Notice list (Andre wants context, Britney wants summary text)
  const notices: string[] = []
  if (totalOverrides > 0) {
    notices.push(`${totalOverrides} value${totalOverrides !== 1 ? 's' : ''} overridden by your customization`)
  }
  if (pathMerged) {
    notices.push('PATH was modified by OCI artifacts')
  }

  // Section count summaries (kept tiny, just total counts)
  const totalEnv = config?.environment.length ?? 0
  const totalLabels = config?.labels.length ?? 0
  const totalAnnotations = config?.annotations.length ?? 0
  const totalSettings = settings.length

  // Artifact references
  const artifactRefs = new Set<string>()
  if (config) {
    config.environment.forEach(e => e.sources.forEach(s => { if (s.reference) artifactRefs.add(s.reference) }))
    config.labels.forEach(e => e.sources.forEach(s => { if (s.reference) artifactRefs.add(s.reference) }))
    config.annotations.forEach(e => e.sources.forEach(s => { if (s.reference) artifactRefs.add(s.reference) }))
    config.cmd.sources.forEach(s => { if (s.reference) artifactRefs.add(s.reference) })
    config.entrypoint.sources.forEach(s => { if (s.reference) artifactRefs.add(s.reference) })
    config.user.sources.forEach(s => { if (s.reference) artifactRefs.add(s.reference) })
  }

  // Header summary
  const headerSummary = config
    ? `${totalEnv} env vars · ${totalLabels} labels${totalOverrides > 0 ? ` · ${totalOverrides} override${totalOverrides !== 1 ? 's' : ''}` : ''}`
    : ''

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border border-border rounded-xl overflow-hidden mt-6">
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button className="w-full bg-muted/40 px-5 py-3 flex items-center gap-3 cursor-pointer border-none text-left hover:bg-muted/60 transition-colors">
            <Eye className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm flex-1" style={{ fontVariationSettings: "'wght' 520" }}>Image config preview</span>

            <div className="flex items-center gap-3">
              {state.status === 'loading' && (
                <div className="flex items-center gap-2">
                  {STAGES.map((s, i) => {
                    const stageIdx = STAGES.findIndex(st => st.key === state.stage)
                    const isDone = i < stageIdx
                    const isCurrent = i === stageIdx
                    return (
                      <div key={s.key} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-muted-foreground/40 text-xs">{'\u2192'}</span>}
                        {isDone && <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />}
                        {isCurrent && <Spinner size="sm" className="size-3.5 text-primary shrink-0" />}
                        <span className={cn(
                          'text-xs whitespace-nowrap',
                          isDone ? 'text-muted-foreground' : isCurrent ? 'text-foreground' : 'text-muted-foreground/50'
                        )} style={isCurrent ? { fontVariationSettings: "'wght' 520" } : undefined}>
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {state.status === 'success' && (
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  {isClean && <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />}
                  {headerSummary}
                </span>
              )}

              {state.status === 'error' && (
                <span className="text-xs text-destructive">Preview failed</span>
              )}

              {state.status === 'timeout' && (
                <span className="text-xs text-muted-foreground">Timed out</span>
              )}
            </div>

            <ChevronDown className={cn('size-4 text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border">

            {/* Loading skeleton */}
            {state.status === 'loading' && (
              <div className="px-5 py-6 flex flex-col gap-3 max-h-[480px]">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-4 rounded bg-muted animate-pulse" style={{ width: 120 + (i % 3) * 40 }} />
                    <div className="h-4 rounded bg-muted animate-pulse flex-1" />
                    <div className="h-5 w-20 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {/* Success: Unified config view */}
            {state.status === 'success' && config && (
              <>
                {/* Legend + filter bar */}
                <div className="px-5 pt-4 pb-3 flex items-center gap-4 border-b border-border">
                  <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                    {isClean ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-green-600 dark:text-green-400 shrink-0" />
                        <span className="text-sm text-muted-foreground">Build looks good</span>
                      </>
                    ) : (
                      <>
                        {totalOverrides > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-foreground/[0.04] text-foreground/75 border border-foreground/10">
                            {totalOverrides} override{totalOverrides !== 1 ? 's' : ''}
                          </span>
                        )}
                        {pathMerged && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-foreground/[0.04] text-foreground/75 border border-foreground/10">
                            PATH merged
                          </span>
                        )}
                        {inheritedEnvCount > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            {inheritedEnvCount} inherited
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <label className="flex items-center gap-2 shrink-0 cursor-pointer select-none">
                    <Switch
                      size="sm"
                      checked={hideInherited}
                      onCheckedChange={setHideInherited}
                    />
                    <span className="text-xs text-muted-foreground">Hide inherited</span>
                  </label>
                </div>

                <div className="max-h-[560px] overflow-y-auto">
                  {/* Image settings */}
                  {visibleSettings.length > 0 && (
                    <ConfigSection label="Image settings" count={visibleSettings.length} summary={hideInherited && totalSettings > visibleSettings.length ? `of ${totalSettings}` : undefined}>
                      <ColumnHeader keyLabel="Field" />
                      {visibleSettings.map(({ label, field }, i) => (
                        <SingleFieldRow key={label} label={label} field={field} zebra={i % 2 === 1} />
                      ))}
                    </ConfigSection>
                  )}

                  {/* Environment variables */}
                  {visibleEnv.length > 0 && (
                    <ConfigSection label="Environment variables" count={visibleEnv.length} summary={hideInherited && totalEnv > visibleEnv.length ? `of ${totalEnv}` : undefined}>
                      <ColumnHeader keyLabel="Variable" />
                      {visibleEnv.map((entry, i) => (
                        <EnvRow key={entry.name} entry={entry} zebra={i % 2 === 1} />
                      ))}
                    </ConfigSection>
                  )}

                  {/* Labels */}
                  {visibleLabels.length > 0 && (
                    <ConfigSection label="Labels" count={visibleLabels.length} summary={hideInherited && totalLabels > visibleLabels.length ? `of ${totalLabels}` : undefined}>
                      <ColumnHeader keyLabel="Label" keyWidth={280} />
                      {visibleLabels.map((entry, i) => (
                        <KvRow key={entry.key} entry={entry} zebra={i % 2 === 1} />
                      ))}
                    </ConfigSection>
                  )}

                  {/* Annotations */}
                  {visibleAnnotations.length > 0 && (
                    <ConfigSection label="Annotations" count={visibleAnnotations.length} summary={hideInherited && totalAnnotations > visibleAnnotations.length ? `of ${totalAnnotations}` : undefined}>
                      <ColumnHeader keyLabel="Annotation" keyWidth={280} />
                      {visibleAnnotations.map((entry, i) => (
                        <KvRow key={entry.key} entry={entry} zebra={i % 2 === 1} />
                      ))}
                    </ConfigSection>
                  )}

                  {/* Empty state when filter hides everything */}
                  {hideInherited && visibleEnv.length === 0 && visibleLabels.length === 0 && visibleAnnotations.length === 0 && visibleSettings.length === 0 && (
                    <div className="px-5 py-12 text-center">
                      <p className="text-sm text-muted-foreground">No customizations applied to this image.</p>
                      <button
                        onClick={() => setHideInherited(false)}
                        className="text-xs text-primary hover:text-primary/80 mt-2 cursor-pointer bg-transparent border-none"
                      >
                        Show inherited values
                      </button>
                    </div>
                  )}

                  {/* Artifact references */}
                  {artifactRefs.size > 0 && (
                    <div className="px-5 py-2.5 border-t border-border bg-muted/20">
                      <span className="text-xs text-muted-foreground/60">
                        Artifacts resolved: {[...artifactRefs].join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Error */}
            {state.status === 'error' && (
              <div className="px-5 py-5">
                <div className="flex gap-3 items-start rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3">
                  <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-destructive" style={{ fontVariationSettings: "'wght' 520" }}>
                      Preview failed
                    </p>
                    <p className="text-xs text-destructive/70 mt-0.5">{state.message}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <Button variant="outline" size="sm" onClick={handleRetry}>Retry</Button>
                      <span className="text-xs text-muted-foreground">You can still build without the preview.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeout */}
            {state.status === 'timeout' && (
              <div className="px-5 py-5">
                <div className="flex gap-3 items-start rounded-lg bg-muted/40 px-4 py-3">
                  <Clock className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground" style={{ fontVariationSettings: "'wght' 520" }}>
                      Preview timed out
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      This doesn't affect your customization. The preview took longer than expected.
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <Button variant="outline" size="sm" onClick={handleRetry}>Retry</Button>
                      <span className="text-xs text-muted-foreground">You can still build without the preview.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Idle */}
            {state.status === 'idle' && (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-muted-foreground">Preview will run when you reach this step.</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
