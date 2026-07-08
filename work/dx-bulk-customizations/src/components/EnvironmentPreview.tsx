import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  ChevronDown,
  Info,
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

interface EnvSource {
  kind: SourceKind
  value?: string
  reference?: string
}

interface EnvEntry {
  name: string
  effectiveValue: string
  action: DryRunAction
  sources: EnvSource[]
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
  | { status: 'success'; entries: EnvEntry[]; diagnostics: DryRunDiagnostic[] }
  | { status: 'error'; message: string }
  | { status: 'timeout' }

// ─── Scenarios ────────────────────────────────────────────────────────────────

type Scenario = 'clean' | 'warnings' | 'error' | 'timeout'

interface ScenarioData {
  entries: EnvEntry[]
  diagnostics: DryRunDiagnostic[]
}

// Scenario 1: Clean build — no conflicts, no overrides, no PATH merge
const CLEAN_ENTRIES: EnvEntry[] = [
  {
    name: 'DEBIAN_FRONTEND',
    effectiveValue: 'noninteractive',
    action: 'SET_BY_CUSTOMIZATION',
    sources: [{ kind: 'CUSTOMIZATION', value: 'noninteractive' }],
  },
  {
    name: 'SSL_CERT_DIR',
    effectiveValue: '/etc/ssl/certs',
    action: 'SET_BY_CUSTOMIZATION',
    sources: [{ kind: 'CUSTOMIZATION', value: '/etc/ssl/certs' }],
  },
  {
    name: 'LANG',
    effectiveValue: 'C.UTF-8',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: 'C.UTF-8' }],
  },
  {
    name: 'GPG_KEY',
    effectiveValue: 'E3FF2839C048B25C084DEBE9B26995E310250568',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: 'E3FF2839C048B25C084DEBE9B26995E310250568' }],
  },
  {
    name: 'PYTHON_VERSION',
    effectiveValue: '3.13.2',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: '3.13.2' }],
  },
  {
    name: 'PYTHON_PIP_VERSION',
    effectiveValue: '24.3.1',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: '24.3.1' }],
  },
  {
    name: 'PATH',
    effectiveValue: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    action: 'DEFAULT_PATH_ADDED',
    sources: [{ kind: 'DEFAULT_PATH', value: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' }],
  },
]

// Scenario 2: Warnings — overrides, PATH merge, inherited artifact vars
const WARNING_ENTRIES: EnvEntry[] = [
  {
    name: 'PATH',
    effectiveValue: '/artifact/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    action: 'PATH_MERGED',
    sources: [
      { kind: 'OCI_ARTIFACT', value: '/artifact/bin', reference: 'docker.io/moby/ca-certs:latest' },
      { kind: 'DEFAULT_PATH', value: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' },
    ],
  },
  {
    name: 'DEBIAN_FRONTEND',
    effectiveValue: 'noninteractive',
    action: 'SET_BY_CUSTOMIZATION',
    sources: [{ kind: 'CUSTOMIZATION', value: 'noninteractive' }],
  },
  {
    name: 'SSL_CERT_DIR',
    effectiveValue: '/etc/ssl/certs',
    action: 'CUSTOMIZATION_OVERRIDES_ARTIFACT',
    sources: [
      { kind: 'CUSTOMIZATION', value: '/etc/ssl/certs' },
      { kind: 'OCI_ARTIFACT', value: '/opt/certs/ssl', reference: 'docker.io/moby/ca-certs:latest' },
    ],
  },
  {
    name: 'CA_CERTIFICATES_JAVA_VERSION',
    effectiveValue: '20230710',
    action: 'INHERITED_FROM_ARTIFACT',
    sources: [{ kind: 'OCI_ARTIFACT', value: '20230710', reference: 'docker.io/moby/ca-certs:latest' }],
  },
  {
    name: 'JAVA_HOME',
    effectiveValue: '/usr/lib/jvm/java-17-openjdk-amd64',
    action: 'INHERITED_FROM_ARTIFACT',
    sources: [{ kind: 'OCI_ARTIFACT', value: '/usr/lib/jvm/java-17-openjdk-amd64', reference: 'docker.io/moby/internal-packages:latest' }],
  },
  {
    name: 'LANG',
    effectiveValue: 'C.UTF-8',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: 'C.UTF-8' }],
  },
  {
    name: 'GPG_KEY',
    effectiveValue: 'E3FF2839C048B25C084DEBE9B26995E310250568',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: 'E3FF2839C048B25C084DEBE9B26995E310250568' }],
  },
  {
    name: 'PYTHON_VERSION',
    effectiveValue: '3.13.2',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: '3.13.2' }],
  },
  {
    name: 'PYTHON_PIP_VERSION',
    effectiveValue: '24.3.1',
    action: 'SET_BY_TAG_DEFINITION',
    sources: [{ kind: 'TAG_DEFINITION', value: '24.3.1' }],
  },
  {
    name: 'CURL_CA_BUNDLE',
    effectiveValue: '/etc/ssl/certs/ca-certificates.crt',
    action: 'CUSTOMIZATION_OVERRIDES_ARTIFACT',
    sources: [
      { kind: 'CUSTOMIZATION', value: '/etc/ssl/certs/ca-certificates.crt' },
      { kind: 'OCI_ARTIFACT', value: '/opt/certs/ca-bundle.crt', reference: 'docker.io/moby/ca-certs:latest' },
    ],
  },
]

const WARNING_DIAGNOSTICS: DryRunDiagnostic[] = [
  {
    severity: 'WARNING',
    code: 'OCI_ARTIFACT_PATH_MERGED',
    message: 'OCI artifact modified PATH. Artifact entries are prepended and take runtime precedence.',
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
]

// Error message for the failure scenario
const ERROR_MESSAGE = 'Failed to resolve OCI artifact docker.io/moby/ca-certs:latest — manifest not found. The artifact may have been deleted or the tag may no longer exist.'

const SCENARIO_ORDER: Scenario[] = ['clean', 'warnings', 'error', 'timeout']
let scenarioIndex = 0

function pickScenario(): Scenario {
  const scenario = SCENARIO_ORDER[scenarioIndex % SCENARIO_ORDER.length]
  scenarioIndex++
  return scenario
}

function getScenarioData(scenario: Scenario): ScenarioData | null {
  switch (scenario) {
    case 'clean':
      return { entries: CLEAN_ENTRIES, diagnostics: [] }
    case 'warnings':
      return { entries: WARNING_ENTRIES, diagnostics: WARNING_DIAGNOSTICS }
    case 'error':
    case 'timeout':
      return null // both signal non-success paths
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STAGES: { key: PreviewStage; label: string }[] = [
  { key: 'fetching', label: 'Fetching config' },
  { key: 'resolving', label: 'Resolving artifacts' },
  { key: 'computing', label: 'Computing preview' },
]

function originLabel(action: DryRunAction): { text: string; className: string } {
  switch (action) {
    case 'SET_BY_CUSTOMIZATION':
      return { text: 'Customization', className: 'bg-muted text-muted-foreground' }
    case 'SET_BY_TAG_DEFINITION':
      return { text: 'Tag definition', className: 'bg-muted text-muted-foreground' }
    case 'INHERITED_FROM_ARTIFACT':
      return { text: 'OCI artifact', className: 'bg-blue-500/10 text-blue-600' }
    case 'CUSTOMIZATION_OVERRIDES_ARTIFACT':
      return { text: 'Override', className: 'bg-amber-500/10 text-amber-600' }
    case 'PATH_MERGED':
      return { text: 'PATH merged', className: 'bg-amber-500/10 text-amber-600' }
    case 'DEFAULT_PATH_ADDED':
      return { text: 'Default', className: 'bg-muted text-muted-foreground' }
  }
}

function sortEntries(entries: EnvEntry[]): EnvEntry[] {
  const order: Record<DryRunAction, number> = {
    CUSTOMIZATION_OVERRIDES_ARTIFACT: 0,
    PATH_MERGED: 1,
    INHERITED_FROM_ARTIFACT: 2,
    SET_BY_CUSTOMIZATION: 3,
    SET_BY_TAG_DEFINITION: 4,
    DEFAULT_PATH_ADDED: 5,
  }
  return [...entries].sort((a, b) => {
    const d = order[a.action] - order[b.action]
    if (d !== 0) return d
    return a.name.localeCompare(b.name)
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export type { Scenario }
export const SCENARIO_LABELS: Record<Scenario, string> = {
  clean: 'Clean build',
  warnings: 'Warnings',
  error: 'Error',
  timeout: 'Timeout',
}

interface EnvironmentPreviewProps {
  /** Set to true to auto-trigger the simulated loading sequence */
  active?: boolean
  /** Force a specific scenario instead of cycling */
  scenario?: Scenario | null
}

export default function EnvironmentPreview({ active = false, scenario: forcedScenario }: EnvironmentPreviewProps) {
  const [state, setState] = useState<PreviewState>({ status: 'idle' })
  const [open, setOpen] = useState(true)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  function applyScenario(scenario: Scenario) {
    setCurrentScenario(scenario)
    const data = getScenarioData(scenario)
    if (scenario === 'error') {
      setState({ status: 'error', message: ERROR_MESSAGE })
    } else if (scenario === 'timeout') {
      setState({ status: 'timeout' })
    } else {
      setState({ status: 'success', entries: data!.entries, diagnostics: data!.diagnostics })
    }
  }

  function runSimulation(overrideScenario?: Scenario) {
    const scenario = overrideScenario ?? pickScenario()
    setCurrentScenario(scenario)
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
        setState({ status: 'success', entries: data!.entries, diagnostics: data!.diagnostics })
        setHasLoaded(true)
      }, 6000))
    }

    return timers
  }

  // Run loading animation only on first activation
  useEffect(() => {
    if (!active) {
      setState({ status: 'idle' })
      setCurrentScenario(null)
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
    const scenario = forcedScenario ?? currentScenario ?? 'clean'
    applyScenario(scenario)
  }

  // Counts for summary
  const successData = state.status === 'success' ? state : null
  const tableEntries = successData ? sortEntries(successData.entries.filter(e => e.action !== 'PATH_MERGED')) : []
  const pathEntry = successData?.entries.find(e => e.action === 'PATH_MERGED')
  const inheritedCount = successData?.entries.filter(e => e.action === 'INHERITED_FROM_ARTIFACT').length ?? 0
  const overrideCount = successData?.entries.filter(e => e.action === 'CUSTOMIZATION_OVERRIDES_ARTIFACT').length ?? 0
  const warningCount = successData?.diagnostics.filter(d => d.severity === 'WARNING').length ?? 0

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border border-border rounded-xl overflow-hidden mt-6">
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button className="w-full bg-muted/40 px-5 py-3 flex items-center gap-3 cursor-pointer border-none text-left hover:bg-muted/60 transition-colors">
            <Eye className="size-4 text-muted-foreground shrink-0" />
            <span className="type-label flex-1">Environment preview</span>

            {/* Summary or stage pipeline */}
            <div className="flex items-center gap-3">
              {state.status === 'loading' && (
                <div className="flex items-center gap-2">
                  {STAGES.map((s, i) => {
                    const stageIdx = STAGES.findIndex(st => st.key === state.stage)
                    const isDone = i < stageIdx
                    const isCurrent = i === stageIdx
                    return (
                      <div key={s.key} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-muted-foreground/40 type-caption">→</span>}
                        {isDone && <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />}
                        {isCurrent && <Spinner size="sm" className="size-3.5 text-primary shrink-0" />}
                        <span className={cn(
                          'type-caption whitespace-nowrap',
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
                <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                  {warningCount === 0 && overrideCount === 0 && <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />}
                  {successData!.entries.length} vars{warningCount === 0 && overrideCount === 0 && ' · No conflicts'}
                  {inheritedCount > 0 && <> · <span className="text-blue-600">{inheritedCount} inherited</span></>}
                  {overrideCount > 0 && <> · <span className="text-amber-600">{overrideCount} override{overrideCount !== 1 ? 's' : ''}</span></>}
                </span>
              )}

              {state.status === 'error' && (
                <span className="type-caption text-destructive">Preview failed</span>
              )}

              {state.status === 'timeout' && (
                <span className="type-caption text-amber-600">Timed out</span>
              )}
            </div>

            <ChevronDown className={cn('size-4 text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')} />
          </button>
        </CollapsibleTrigger>

        {/* Detail panel */}
        <CollapsibleContent>
          <div className="border-t border-border">

            {/* Loading skeleton */}
            {state.status === 'loading' && (
              <div className="px-5 py-6 flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-4 rounded bg-muted animate-pulse" style={{ width: 120 + (i % 3) * 40 }} />
                    <div className="h-4 rounded bg-muted animate-pulse flex-1" />
                    <div className="h-5 w-20 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {/* Success */}
            {state.status === 'success' && (
              <div>
                {/* PATH callout */}
                {pathEntry && (
                  <div className="px-5 py-3 bg-amber-500/5 border-b border-amber-500/20 flex gap-3">
                    <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="type-body text-amber-800 dark:text-amber-400" style={{ fontVariationSettings: "'wght' 520" }}>
                        PATH was modified by an OCI artifact
                      </p>
                      <p className="type-caption text-amber-700/70 dark:text-amber-400/70 mt-0.5">
                        Artifact entries are prepended and take runtime precedence.
                        Source: {pathEntry.sources.find(s => s.kind === 'OCI_ARTIFACT')?.reference}
                      </p>
                      <code className="type-mono-terminal text-amber-800 dark:text-amber-300 bg-amber-500/10 rounded px-2 py-1 mt-2 block break-all">
                        {pathEntry.effectiveValue}
                      </code>
                    </div>
                  </div>
                )}

                {/* Warnings summary */}
                {warningCount > 0 && !pathEntry && (
                  <div className="px-5 py-2.5 bg-amber-500/5 border-b border-amber-500/20 flex items-center gap-2">
                    <AlertTriangle className="size-3.5 text-amber-600 shrink-0" />
                    <span className="type-caption text-amber-700 dark:text-amber-400">
                      {warningCount} warning{warningCount !== 1 ? 's' : ''} detected
                    </span>
                  </div>
                )}

                {/* Env var table */}
                <div className="px-5 py-1">
                  {/* Header row */}
                  <div className="flex items-center gap-4 py-2 border-b border-border">
                    <span className="type-overline text-muted-foreground w-[180px] shrink-0">Variable</span>
                    <span className="type-overline text-muted-foreground flex-1">Value</span>
                    <span className="type-overline text-muted-foreground w-[100px] shrink-0 text-right">Origin</span>
                  </div>

                  {tableEntries.map((entry) => {
                    const origin = originLabel(entry.action)
                    const suppressedSource = entry.action === 'CUSTOMIZATION_OVERRIDES_ARTIFACT'
                      ? entry.sources.find(s => s.kind === 'OCI_ARTIFACT')
                      : null

                    return (
                      <div
                        key={entry.name}
                        className={cn(
                          'flex items-center gap-4 py-2.5 border-b border-border/50 last:border-0',
                          entry.action === 'INHERITED_FROM_ARTIFACT' && 'border-l-2 border-l-blue-500 pl-[18px]',
                          entry.action === 'CUSTOMIZATION_OVERRIDES_ARTIFACT' && 'border-l-2 border-l-amber-500 pl-[18px]',
                        )}
                      >
                        <span className="type-mono-data w-[180px] shrink-0 truncate" style={{ fontVariationSettings: "'wght' 520" }}>
                          {entry.name}
                        </span>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="type-mono-terminal text-muted-foreground flex-1 truncate cursor-default">
                              {entry.effectiveValue}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-md break-all">
                            <p>{entry.effectiveValue}</p>
                            {suppressedSource && (
                              <p className="mt-1 text-amber-300">
                                Artifact value suppressed: {suppressedSource.value}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>

                        <div className="w-[100px] shrink-0 flex justify-end items-center gap-1">
                          <span className={cn('type-badge px-1.5 py-0.5 rounded', origin.className)}>
                            {origin.text}
                          </span>
                          {entry.action === 'CUSTOMIZATION_OVERRIDES_ARTIFACT' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="size-3 text-amber-500 shrink-0 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                Artifact attempted to set this value but your customization config took precedence.
                                {suppressedSource && <><br />Suppressed: {suppressedSource.value}</>}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Artifact references */}
                {(() => {
                  const refs = new Set<string>()
                  successData!.entries.forEach(e => e.sources.forEach(s => {
                    if (s.reference) refs.add(s.reference)
                  }))
                  if (refs.size === 0) return null
                  return (
                    <div className="px-5 py-3 border-t border-border bg-muted/20">
                      <span className="type-caption text-muted-foreground">
                        Artifacts resolved: {[...refs].join(', ')}
                      </span>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Error */}
            {state.status === 'error' && (
              <div className="px-5 py-5">
                <div className="flex gap-3 items-start rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3">
                  <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="type-body text-destructive" style={{ fontVariationSettings: "'wght' 520" }}>
                      Preview failed
                    </p>
                    <p className="type-caption text-destructive/70 mt-0.5">{state.message}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <Button variant="outline" size="sm" onClick={handleRetry}>Retry</Button>
                      <span className="type-caption text-muted-foreground">You can still save without the preview.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeout */}
            {state.status === 'timeout' && (
              <div className="px-5 py-5">
                <div className="flex gap-3 items-start rounded-lg bg-amber-500/5 border border-amber-500/20 px-4 py-3">
                  <Clock className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="type-body text-amber-800 dark:text-amber-400" style={{ fontVariationSettings: "'wght' 520" }}>
                      Preview timed out
                    </p>
                    <p className="type-caption text-amber-700/70 dark:text-amber-400/70 mt-0.5">
                      This doesn't affect your customization. The preview took longer than expected.
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <Button variant="outline" size="sm" onClick={handleRetry}>Retry</Button>
                      <span className="type-caption text-muted-foreground">You can still save without the preview.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Idle */}
            {state.status === 'idle' && (
              <div className="px-5 py-6 text-center">
                <p className="type-body text-muted-foreground">Preview will run when you reach this step.</p>
              </div>
            )}

            {/* Scenario indicator (demo only, shown when no switcher controls from parent) */}
            {currentScenario && state.status !== 'loading' && !forcedScenario && (
              <div className="px-5 py-2 border-t border-dashed border-border/50 flex items-center">
                <span className="type-caption text-muted-foreground/50">
                  Scenario: <span className="font-mono">{currentScenario}</span>
                </span>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
