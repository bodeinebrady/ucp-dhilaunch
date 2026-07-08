import { useState, Fragment } from 'react'
import { toast } from 'sonner'
import PrototypeHeader from '../components/PrototypeHeader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Tag } from '@/components/ui/tag'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from '@/components/ui/combobox'
import { Search } from '@/components/ui/search'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import HelpCircle from '@docker/icons/react/HelpCircle'
import BellEmpty from '@docker/icons/react/BellEmpty'
import Grid from '@docker/icons/react/Grid'
import SearchDockerIcon from '@docker/icons/react/Search'
import Shield from '@docker/icons/react/Shield'
import SettingsIcon from '@docker/icons/react/Settings'
import CreditCard from '@docker/icons/react/CreditCard'
import BarChart from '@docker/icons/react/BarChart'
import Users from '@docker/icons/react/Users'
import BaseImages from '@docker/icons/react/BaseImages'
import ChevronDownIcon from '@docker/icons/react/ChevronDown'
import ArrowRight from '@docker/icons/react/ArrowRight'
import {
  MoreVertical,
  ChevronRight,
  ChevronDown,
  X,
  Archive,
  ExternalLink,
  Info,
  CheckCircle2,
  Search as SearchLucide,
  Trash2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageRef {
  name: string
  linked: boolean
}

interface CustomizationRow {
  id: string
  type: 'parent' | 'child' | 'standalone'
  name: string
  images: ImageRef[]
  imageLabel: string
  os: string | null
  parentId?: string
  parentName?: string
  childIds?: string[]
}

interface BuildLogContext {
  imageName: string
  baseImage: string
  parentName?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROWS: CustomizationRow[] = [
  {
    id: 'ca-certs',
    type: 'parent',
    name: 'ca-certs',
    images: [
      { name: 'dhi-vault', linked: true },
      { name: 'dhi-node', linked: true },
      { name: 'dhi-php', linked: false },
    ],
    imageLabel: '3 images',
    os: 'debian',
    childIds: ['ca-certs-vault', 'ca-certs-node', 'ca-certs-php'],
  },
  {
    id: 'ca-certs-vault',
    type: 'child',
    name: 'dhi-vault',
    images: [],
    imageLabel: 'Bulk: ca-certs',
    os: 'debian',
    parentId: 'ca-certs',
    parentName: 'ca-certs',
  },
  {
    id: 'ca-certs-node',
    type: 'child',
    name: 'dhi-node',
    images: [],
    imageLabel: 'Bulk: ca-certs',
    os: 'debian',
    parentId: 'ca-certs',
    parentName: 'ca-certs',
  },
  {
    id: 'ca-certs-php',
    type: 'child',
    name: 'dhi-php',
    images: [],
    imageLabel: 'Bulk: ca-certs',
    os: 'debian',
    parentId: 'ca-certs',
    parentName: 'ca-certs',
  },
  {
    id: 'ping-dev-libs',
    type: 'standalone',
    name: 'ping-dev-libs',
    images: [{ name: 'dhi-valkey', linked: true }],
    imageLabel: '1 image',
    os: 'alpine',
  },
  {
    id: 'payments-team',
    type: 'parent',
    name: 'payments-team',
    images: [{ name: 'dhi-tomcat', linked: true }],
    imageLabel: '1 image',
    os: 'debian',
    childIds: ['payments-team-tomcat'],
  },
  {
    id: 'payments-team-tomcat',
    type: 'child',
    name: 'dhi-tomcat',
    images: [],
    imageLabel: 'Bulk: payments-team',
    os: 'debian',
    parentId: 'payments-team',
    parentName: 'payments-team',
  },
  {
    id: 'chart-references',
    type: 'standalone',
    name: 'chart references',
    images: [
      { name: 'dhi-valkey-chart', linked: true },
      { name: 'dhi-redis-ha-chart', linked: true },
      { name: 'dhi-traefik-chart', linked: false },
    ],
    imageLabel: '3 charts',
    os: null,
  },
]

const DEFINITION_MOCK = {
  baseImage: 'debian:12-slim',
  packages: ['ca-certificates', 'curl', 'openssl'],
  ociArtifacts: ['moby/ca-certs', 'moby/internal-packages'],
  scripts: ['/usr/lib/ssl/update-certs.sh'],
  entrypoint: '/usr/local/bin/docker-entrypoint.sh',
  cmd: '["bash"]',
  user: 'root',
  envVars: [
    { key: 'DEBIAN_FRONTEND', value: 'noninteractive' },
    { key: 'SSL_CERT_DIR', value: '/etc/ssl/certs' },
  ],
}

const BUILDS_MOCK = [
  { id: 'b1', baseImage: 'debian:12-slim', lastBuild: '3 mins ago', image: 'docker.io/moby/dhi-vault:latest', status: 'success' as const },
  { id: 'b2', baseImage: 'debian:12-slim', lastBuild: '2 hours ago', image: 'docker.io/moby/dhi-vault:1.14.0', status: 'success' as const },
  { id: 'b3', baseImage: 'debian:11-slim', lastBuild: '1 day ago', image: 'docker.io/moby/dhi-vault:1.13.0', status: 'failed' as const },
]

function getBadgeClasses(label: string): string {
  if (label.startsWith('CONTEXT')) return 'bg-teal-500 text-teal-50'
  if (label === 'AUTH') return 'bg-blue-500 text-blue-50'
  return 'bg-muted-foreground text-muted'
}

const LOGS_MOCK = [
  { id: '1',  badge: null,                                          message: 'building with "builder-2b82e582-3a60-4b2e-b547-dd673a779dc0" instance using cloud driver',                                                                                     duration: '0.0s',  cached: false, expandable: false },
  { id: '2',  badge: { label: 'INTERNAL' },                         message: 'connected to docker build cloud service',                                                                                                                                           duration: '0.0s',  cached: false, expandable: false },
  { id: '3',  badge: { label: 'INTERNAL' },                         message: 'load build definition from 1.24_test.yaml',                                                                                                                                         duration: '0.3s',  cached: false, expandable: true  },
  { id: '4',  badge: { label: 'CONTEXT DHI/BUILD:2-ALPINE3.22' },   message: 'load metadata for dhi/build:2-alpine3.22@sha256:253660709769799faefa73ccd25e8fcadcfae56e111d2c19cc1223cc10f6566d',                                                                duration: '0.5s',  cached: false, expandable: true  },
  { id: '5',  badge: { label: 'AUTH' },                             message: 'dhi/build:pull token for registry-1.docker.io',                                                                                                                                     duration: '0.0s',  cached: false, expandable: false },
  { id: '6',  badge: { label: 'CONTEXT DHI/BUILD:2-ALPINE3.22' },   message: 'dhi/build:2-alpine3.22@sha256:253660709769799faefa73ccd25e8fcadcfae56e111d2c19cc1223cc10f6566d',                                                                                   duration: '0.0s',  cached: true,  expandable: true  },
  { id: '7',  badge: null,                                          message: 'resolve image config for docker-image://docker.io/dhi/pkg-golang:1.24.13-alpine3.22@sha256:5d35ca2b7c523b99fece4a9cff6896bddef229ee7db5e61a07080e524b93aaa3',                      duration: '0.6s',  cached: false, expandable: true  },
  { id: '8',  badge: { label: 'AUTH' },                             message: 'dhi/pkg-golang:pull token for registry-1.docker.io',                                                                                                                                duration: '0.0s',  cached: false, expandable: false },
  { id: '9',  badge: { label: 'AUTH' },                             message: 'dhi/scout-sbom-indexer:pull token for registry-1.docker.io',                                                                                                                       duration: '0.0s',  cached: false, expandable: false },
  { id: '10', badge: null,                                          message: 'resolve image config for docker-image://docker.io/dhi/scout-sbom-indexer:1@sha256:3bb9e9ce87ae914199ce811545fba9c583a39949a745321f877c31725b857255',                               duration: '23.5s', cached: false, expandable: true  },
  { id: '11', badge: null,                                          message: 'docker-image://docker.io/dhi/scout-sbom-indexer:1@sha256:3bb9e9ce87ae914199ce811545fba9c583a39949a745321f877c31725b857255',                                                         duration: '4.9s',  cached: true,  expandable: false },
  { id: '12', badge: null,                                          message: 'docker-image://docker.io/dhi/pkg-golang:1.24.13-alpine3.22@sha256:5d35ca2b7c523b99fece4a9cff6896bddef229ee7db5e61a07080e524b93aaa3',                                               duration: '4.3s',  cached: false, expandable: false },
  { id: '13', badge: null,                                          message: 'copy artifact dhi/pkg-golang:1.24.13-alpine3.22@sha256:5d35ca2b7c523b99fece4a9cff6896bddef229ee7db5e61a07080e524b93aaa3',                                                          duration: '3.0s',  cached: false, expandable: false },
]

// ─── Top Nav ──────────────────────────────────────────────────────────────────

function TopNav() {
  return (
    <header className="h-16 flex items-center px-6 shrink-0 bg-primary">
      <div className="flex items-center gap-1 mr-8">
        <img
          src="https://www.figma.com/api/mcp/asset/045496e7-aef5-45ea-a25d-773f16c1f335"
          alt="Docker"
          className="size-6 object-contain"
        />
        <span className="text-primary-foreground text-lg tracking-tight font-[Comfortaa,sans-serif]">
          <b>docker</b> hub
        </span>
      </div>

      <div className="flex h-full items-center">
        {['Explore', 'MyHub'].map((label) => (
          <button
            key={label}
            className={`border-none cursor-pointer px-2 h-8 rounded type-body transition-colors ${
              label === 'MyHub'
                ? 'text-primary-foreground bg-white/8'
                : 'text-primary-foreground/90 bg-transparent'
            }`}
            style={{ fontVariationSettings: label === 'MyHub' ? "'wght' 520" : "'wght' 420" }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 rounded px-4 h-10 w-96 type-body bg-white/10 border-[1.5px] border-primary-foreground/80 text-primary-foreground/80">
          <SearchDockerIcon className="size-5 text-primary-foreground/80" />
          <span className="text-primary-foreground/80">Search Hub Marketplace</span>
        </div>
        {([HelpCircle, BellEmpty, Grid] as React.ComponentType<React.SVGProps<SVGSVGElement>>[]).map((Icon, i) => (
          <button key={i} className="p-2 rounded cursor-pointer border-none bg-transparent">
            <Icon className="size-5 text-primary-foreground" />
          </button>
        ))}
        <div className="size-9 rounded-full flex items-center justify-center type-body bg-muted-foreground text-primary-foreground">
          D
        </div>
      </div>
    </header>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function SidebarNav() {
  const navItems = [
    { label: 'Repositories', icon: BaseImages },
    { label: 'Hardened images', icon: Shield, expanded: true, sub: ['Catalog', 'Manage'], activeIndex: 1 },
    { label: 'Settings', icon: SettingsIcon, hasChevron: true },
    { label: 'Billing', icon: CreditCard },
    { label: 'Usage', icon: BarChart },
    { label: 'Manage organization', icon: Users, external: true },
  ] as const

  return (
    <aside className="w-[248px] shrink-0 px-3 py-6 flex flex-col gap-1 bg-muted border-r border-border">
      <div className="flex items-center gap-2 pb-2">
        <div className="size-10 rounded flex items-center justify-center shrink-0 bg-[#7d2eff]">
          <Users className="size-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="type-body leading-5" style={{ fontVariationSettings: "'wght' 520" }}>Moby Inc</p>
          <p className="type-caption text-muted-foreground leading-4">Organization</p>
        </div>
        <button className="p-1 rounded cursor-pointer border-none bg-transparent">
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </button>
      </div>

      <Separator className="my-1" />

      {navItems.map((item) => (
        <div key={item.label}>
          <div className="flex items-center gap-2 px-2 h-8 rounded-md cursor-pointer hover:bg-black/6">
            <item.icon className="size-5 text-muted-foreground shrink-0" />
            <span className="flex-1 type-body overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wght' 520" }}>{item.label}</span>
            {'hasChevron' in item && item.hasChevron && <ChevronDownIcon className="size-4 text-muted-foreground" />}
            {'expanded' in item && item.expanded && <ChevronDownIcon className="size-4 text-muted-foreground" />}
            {'external' in item && item.external && <ArrowRight className="size-4 text-muted-foreground" />}
          </div>
          {'expanded' in item && item.expanded && item.sub && (
            <div className="flex flex-col">
              {item.sub.map((sub, i) => (
                <div
                  key={sub}
                  className={`px-2 pl-10 h-7 flex items-center rounded-md cursor-pointer ${i === item.activeIndex ? 'bg-muted/60' : 'hover:bg-black/6'}`}
                >
                  <span
                    className={`type-label ${i === item.activeIndex ? '' : 'text-muted-foreground'}`}
                    style={i === item.activeIndex ? { fontVariationSettings: "'wght' 520" } : undefined}
                  >
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  )
}

// ─── Tree Connector ───────────────────────────────────────────────────────────

function TreeConnector({ continues }: { continues: boolean }) {
  return (
    <div aria-hidden className="absolute left-6 top-0 bottom-0 w-4 pointer-events-none">
      <div className={`absolute left-0 top-0 w-px bg-border ${continues ? 'bottom-0' : 'bottom-1/2'}`} />
      <div className="absolute left-0 w-4 h-px bg-border top-1/2 -translate-y-px" />
    </div>
  )
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

function DeleteDialog({ open, title, body, onCancel, onConfirm }: {
  open: boolean; title: string; body: string; onCancel: () => void; onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel() }}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Definition Tab ───────────────────────────────────────────────────────────

function DefinitionTab() {
  function DefSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="flex gap-8 py-4 border-b border-border">
        <p className="type-body text-muted-foreground w-[200px] shrink-0 pt-0.5" style={{ fontVariationSettings: "'wght' 520" }}>{label}</p>
        <div className="flex-1">{children}</div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <DefSection label="Base image">
        <Tag className="border border-border bg-transparent">{DEFINITION_MOCK.baseImage}</Tag>
      </DefSection>
      <DefSection label="Packages">
        <div className="flex flex-wrap gap-2">
          {DEFINITION_MOCK.packages.map((p) => <Tag key={p}>{p}</Tag>)}
        </div>
      </DefSection>
      <DefSection label="OCI artifacts">
        <div className="flex flex-col gap-1">
          {DEFINITION_MOCK.ociArtifacts.map((a) => <p key={a} className="type-body">{a}</p>)}
        </div>
      </DefSection>
      <DefSection label="Scripts">
        <div className="flex flex-col gap-1">
          {DEFINITION_MOCK.scripts.map((s) => <p key={s} className="font-mono type-mono-code">{s}</p>)}
        </div>
      </DefSection>
      <DefSection label="Entrypoint">
        <p className="font-mono type-mono-code">{DEFINITION_MOCK.entrypoint}</p>
      </DefSection>
      <DefSection label="CMD">
        <p className="font-mono type-mono-code">{DEFINITION_MOCK.cmd}</p>
      </DefSection>
      <DefSection label="User">
        <p className="type-body">{DEFINITION_MOCK.user}</p>
      </DefSection>
      <DefSection label="Environment variables">
        <div className="flex flex-col gap-2">
          {DEFINITION_MOCK.envVars.map((env) => (
            <div key={env.key} className="flex gap-6">
              <p className="font-mono type-mono-code" style={{ fontVariationSettings: "'wght' 520" }}>{env.key}</p>
              <p className="font-mono type-mono-code text-muted-foreground">{env.value}</p>
            </div>
          ))}
        </div>
      </DefSection>
    </div>
  )
}

// ─── Builds Tab ───────────────────────────────────────────────────────────────

function BuildsTab({ onViewLogs }: { onViewLogs: (build: typeof BUILDS_MOCK[0]) => void }) {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Base image definition</TableHead>
          <TableHead>Last build</TableHead>
          <TableHead>Image</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {BUILDS_MOCK.map((build) => (
          <TableRow key={build.id}>
            <TableCell>
              <button
                className="type-body text-primary hover:underline cursor-pointer bg-transparent border-none"
                style={{ fontVariationSettings: "'wght' 520" }}
                onClick={() => onViewLogs(build)}
              >
                {build.baseImage}
              </button>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className={`size-2 rounded-full shrink-0 ${build.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="type-body">{build.lastBuild}</p>
              </div>
            </TableCell>
            <TableCell>
              <a href="#" className="type-body text-primary hover:underline flex items-center gap-1">
                {build.image}
                <ExternalLink className="size-3.5" />
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ─── Build Runs ───────────────────────────────────────────────────────────────

const BUILD_RUNS = [
  { id: 'r1-amd', time: '12 minutes ago', status: 'Completed' as const, platform: 'LINUX/AMD64' },
  { id: 'r1-arm', time: '12 minutes ago', status: 'Completed' as const, platform: 'LINUX/ARM64' },
  { id: 'r2-amd', time: '2 hours ago',    status: 'Completed' as const, platform: 'LINUX/AMD64' },
  { id: 'r3-amd', time: '1 day ago',      status: 'Failed'    as const, platform: 'LINUX/AMD64' },
]

// ─── Build Logs Page ──────────────────────────────────────────────────────────

interface BuildLogsPageProps {
  context: BuildLogContext
  onBack: () => void
  onBackToParentDetail?: () => void
  onBackToList: () => void
}

function BuildLogsPage({ context, onBack, onBackToParentDetail, onBackToList }: BuildLogsPageProps) {
  const [logSearch, setLogSearch] = useState('')
  const [selectedRun, setSelectedRun] = useState(BUILD_RUNS[0])
  const [selectorOpen, setSelectorOpen] = useState(false)

  const filteredLogs = logSearch
    ? LOGS_MOCK.filter((l) => l.message.toLowerCase().includes(logSearch.toLowerCase()))
    : LOGS_MOCK

  return (
    <div>
      <nav className="flex items-center gap-1 mb-2 type-body">
        <button className="text-primary hover:underline cursor-pointer bg-transparent border-none" onClick={onBackToList}>
          Docker Hardened Images
        </button>
        {context.parentName && (
          <>
            <span className="text-muted-foreground">/</span>
            <button
              className="text-primary hover:underline cursor-pointer bg-transparent border-none"
              onClick={onBackToParentDetail ?? onBack}
            >
              {context.parentName}
            </button>
          </>
        )}
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground" style={{ fontVariationSettings: "'wght' 520" }}>{context.imageName}</span>
      </nav>

      <Separator className="mb-7 -mx-5" />

      {/* Build selector + search */}
      <div className="flex items-start gap-6 mb-7">
        <div className="relative mt-5">
          <span className={`absolute -top-2.5 left-2.5 z-10 bg-background px-1 type-caption leading-none transition-colors ${selectorOpen ? 'text-primary' : 'text-muted-foreground'}`}>
            Build
          </span>
          <Popover open={selectorOpen} onOpenChange={setSelectorOpen}>
            <PopoverTrigger asChild>
              <button
                className={`border rounded-xl px-4 py-3 inline-flex items-center gap-4 cursor-pointer min-w-[300px] transition-colors bg-transparent ${selectorOpen ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}
              >
                <CheckCircle2
                  className={`size-5 shrink-0 ${selectedRun.status === 'Completed' ? 'text-green-500' : 'text-red-500'}`}
                />
                <div className="flex-1 text-left">
                  <p className="type-body leading-tight" style={{ fontVariationSettings: "'wght' 520" }}>{selectedRun.time}</p>
                  <p className="type-caption text-muted-foreground leading-tight">{selectedRun.status}</p>
                </div>
                <span className="border border-primary bg-primary/5 text-primary type-badge font-mono px-1.5 py-0.5 rounded-md shrink-0" style={{ fontVariationSettings: "'wght' 680" }}>
                  {selectedRun.platform}
                </span>
                <ChevronDown className={`size-4 text-muted-foreground shrink-0 transition-transform ${selectorOpen ? 'rotate-180' : ''}`} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 w-[320px]">
              {BUILD_RUNS.map((run) => {
                const isSelected = run.id === selectedRun.id
                return (
                  <div
                    key={run.id}
                    onClick={() => { setSelectedRun(run); setSelectorOpen(false) }}
                    className={`flex items-center gap-4 px-4 py-3 cursor-pointer border-b border-border last:border-0 ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/40'}`}
                  >
                    <CheckCircle2
                      className={`size-4 shrink-0 ${isSelected ? 'text-primary' : run.status === 'Completed' ? 'text-green-500' : 'text-red-500'}`}
                    />
                    <div className="flex-1">
                      <p className="type-body leading-tight" style={isSelected ? { fontVariationSettings: "'wght' 520" } : undefined}>{run.time}</p>
                      <p className={`type-caption leading-tight ${run.status === 'Failed' ? 'text-red-500' : 'text-muted-foreground'}`}>{run.status}</p>
                    </div>
                    <span className="border border-primary bg-primary/5 text-primary type-badge font-mono px-1.5 py-0.5 rounded-md" style={{ fontVariationSettings: "'wght' 680" }}>
                      {run.platform}
                    </span>
                  </div>
                )
              })}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1" />

        <div className="relative mt-5">
          <SearchLucide className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-8 w-60"
            placeholder="Search logs"
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Log rows */}
      <div>
        {filteredLogs.map((log, i) => {
          const badgeClasses = log.badge ? getBadgeClasses(log.badge.label) : ''
          return (
            <div
              key={log.id}
              className={`flex items-center gap-3 px-2 py-2.5 border-b border-border ${log.expandable ? 'cursor-pointer hover:bg-black/2' : ''} ${i === 0 ? 'rounded-t' : ''} ${i === filteredLogs.length - 1 ? 'rounded-b' : ''}`}
            >
              {log.badge ? (
                <span className={`shrink-0 inline-flex items-center type-badge font-mono px-2 py-1 rounded-full whitespace-nowrap ${badgeClasses}`}>
                  {log.badge.label}
                </span>
              ) : (
                <div className="shrink-0 w-1" />
              )}

              <p className="flex-1 type-mono-code text-foreground break-all">
                {log.message}
              </p>

              {log.cached && (
                <span className="shrink-0 type-badge font-mono px-2 py-1 rounded-md bg-blue-500 text-blue-100" style={{ fontVariationSettings: "'wght' 680" }}>
                  CACHED
                </span>
              )}

              <span className="shrink-0 type-mono-terminal text-muted-foreground w-10 text-right">
                {log.duration}
              </span>

              {log.expandable ? (
                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              ) : (
                <div className="w-4 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Customization Detail ─────────────────────────────────────────────────────

interface CustomizationDetailProps {
  row: CustomizationRow
  onBack: () => void
  onEdit: () => void
  onViewLogs: (context: BuildLogContext) => void
}

function CustomizationDetail({ row, onBack, onEdit, onViewLogs }: CustomizationDetailProps) {
  const [tab, setTab] = useState('0')
  const isBulk = row.type === 'parent'
  const children = ROWS.filter((r) => r.parentId === row.id)

  return (
    <div>
      <nav className="flex items-center gap-1 mb-2 type-body">
        <button className="text-primary hover:underline cursor-pointer bg-transparent border-none" onClick={onBack}>
          Docker Hardened Images
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground" style={{ fontVariationSettings: "'wght' 520" }}>{row.name}</span>
      </nav>

      <Separator className="mb-7 -mx-5" />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="type-display" style={{ fontVariationSettings: "'wght' 680" }}>{row.name}</h1>
            {row.os && <Tag>{row.os}</Tag>}
            {isBulk && <Tag className="border-primary text-primary bg-transparent">Bulk</Tag>}
          </div>
          <p className="type-body text-muted-foreground">
            Created by <a href="#" className="text-primary hover:underline">moby</a> · Updated 2 days ago
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onEdit}>Edit customization</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="More options">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line">
          <TabsTrigger value="0">Definition</TabsTrigger>
          <TabsTrigger value="1">{isBulk ? 'Bulk Customizations' : 'Builds'}</TabsTrigger>
        </TabsList>

        <TabsContent value="0">
          <DefinitionTab />
        </TabsContent>

        <TabsContent value="1">
          {!isBulk && (
            <BuildsTab
              onViewLogs={(build) => onViewLogs({ imageName: row.name, baseImage: build.baseImage })}
            />
          )}
          {isBulk && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead>Last build</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {children.map((child) => (
                  <TableRow key={child.id} className="cursor-pointer">
                    <TableCell>
                      <button
                        className="type-body text-primary hover:underline cursor-pointer bg-transparent border-none"
                        style={{ fontVariationSettings: "'wght' 520" }}
                        onClick={() => onViewLogs({ imageName: child.name, baseImage: DEFINITION_MOCK.baseImage, parentName: row.name })}
                      >
                        {child.name}
                      </button>
                    </TableCell>
                    <TableCell>{child.os && <Tag>{child.os}</Tag>}</TableCell>
                    <TableCell><p className="type-body text-muted-foreground">3 mins ago</p></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-green-500" />
                        <p className="type-body">Succeeded</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Child Build Page ─────────────────────────────────────────────────────────

interface ChildBuildPageProps {
  childRow: CustomizationRow
  onBack: () => void
  onBackToList: () => void
  onViewLogs: (context: BuildLogContext) => void
}

function ChildBuildPage({ childRow, onBack, onBackToList, onViewLogs }: ChildBuildPageProps) {
  return (
    <div>
      <nav className="flex items-center gap-1 mb-2 type-body">
        <button className="text-primary hover:underline cursor-pointer bg-transparent border-none" onClick={onBackToList}>
          Docker Hardened Images
        </button>
        <span className="text-muted-foreground">/</span>
        <button className="text-primary hover:underline cursor-pointer bg-transparent border-none" onClick={onBack}>
          {childRow.parentName}
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground" style={{ fontVariationSettings: "'wght' 520" }}>{childRow.name}</span>
      </nav>

      <Separator className="mb-7 -mx-5" />

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="type-display" style={{ fontVariationSettings: "'wght' 680" }}>{childRow.name}</h1>
          {childRow.os && <Tag>{childRow.os}</Tag>}
          <Tag className="border-border bg-transparent">Part of {childRow.parentName}</Tag>
        </div>
        <p className="type-body text-muted-foreground">
          Managed by bulk customization{' '}
          <button className="text-primary hover:underline cursor-pointer bg-transparent border-none" onClick={onBack}>
            {childRow.parentName}
          </button>
        </p>
      </div>

      <p className="type-heading mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Builds</p>
      <p className="type-body text-muted-foreground mb-4">Build history for this customized image.</p>

      <BuildsTab
        onViewLogs={(build) => onViewLogs({ imageName: childRow.name, baseImage: build.baseImage, parentName: childRow.parentName })}
      />
    </div>
  )
}

// ─── Edit Wizard ──────────────────────────────────────────────────────────────

const AVAILABLE_PACKAGES = [
  { name: 'ping',            description: 'Send ICMP echo requests to network hosts' },
  { name: 'vim',             description: 'Highly configurable text editor' },
  { name: 'curl',            description: 'Command line tool for transferring data' },
  { name: 'wget',            description: 'Non-interactive network downloader' },
  { name: 'jq',              description: 'Lightweight command-line JSON processor' },
  { name: 'openssl',         description: 'Cryptography and SSL/TLS toolkit' },
  { name: 'ca-certificates', description: 'Common CA certificates for SSL/TLS' },
  { name: 'git',             description: 'Fast distributed version control system' },
  { name: 'unzip',           description: 'De-archiver for .zip files' },
  { name: 'net-tools',       description: 'Networking tools including ifconfig and netstat' },
  { name: 'dnsutils',        description: 'DNS lookup utilities including dig and nslookup' },
  { name: 'procps',          description: 'Utilities for process monitoring (ps, top, free)' },
]

const AVAILABLE_OCI_IMAGES = [
  { name: 'moby/dhi-alpine-base',            tags: ['3.22-base', '3.21-base', '3.22-base-fips'] },
  { name: 'moby/dhi-kafka',                  tags: ['4-debian13-fips', '3.9-debian13', '3.8-debian13-fips'] },
  { name: 'moby/dhi-temporalio-admin-tools', tags: ['1.29.4-debian13-fips', '1.29-debian13-fips', '1.28-debian13', '1.28.3-debian13'] },
  { name: 'moby/dhi-airflow',                tags: ['2.10-debian13', '2.9-debian13-fips', '2.10.4-debian13'] },
  { name: 'moby/dhi-argocd',                 tags: ['2.14-debian13', '2.13-debian13-fips'] },
  { name: 'moby/dhi-flyway',                 tags: ['11-debian13', '10.22-debian13-fips'] },
  { name: 'moby/dhi-haproxy',                tags: ['3.1-debian13', '3.0-debian13-fips'] },
  { name: 'moby/ca-certs',                   tags: ['latest', '2024.12'] },
  { name: 'moby/internal-packages',          tags: ['latest', '1.2.0', '1.1.0'] },
]

const SCRIPT_OPTIONS = [
  '/usr/lib/ssl/update-certs.sh',
  '/etc/docker/configure-registry.sh',
  '/usr/local/bin/setup-env.sh',
  '/opt/security/harden.sh',
  '/etc/init.d/configure-logging.sh',
  '/usr/share/scripts/inject-ca.sh',
]

const AVAILABLE_IMAGES = [
  {
    id: 'node', name: 'Node.js',
    versions: [
      { label: 'Node.js 25.x', os: 'debian 13', imageName: 'dhi-node' },
      { label: 'Node.js 25.x', os: 'alpine 3.22', imageName: 'dhi-node' },
      { label: 'Node.js 24.x', os: 'debian 13', imageName: 'dhi-node' },
    ],
  },
  {
    id: 'go', name: 'Go',
    versions: [
      { label: 'Go 1.25.x', os: 'debian 13', imageName: 'dhi-go' },
      { label: 'Go 1.25.x', os: 'alpine 3.22', imageName: 'dhi-go' },
      { label: 'Go 1.24.x', os: 'debian 13', imageName: 'dhi-go' },
    ],
  },
  {
    id: 'python', name: 'Python',
    versions: [
      { label: 'Python 3.13.x', os: 'debian 13', imageName: 'dhi-python' },
      { label: 'Python 3.12.x', os: 'debian 12', imageName: 'dhi-python' },
    ],
  },
  {
    id: 'redis', name: 'Redis',
    versions: [
      { label: 'Redis 7.4.x', os: 'debian 13', imageName: 'dhi-redis' },
      { label: 'Redis 7.4.x', os: 'alpine 3.22', imageName: 'dhi-redis' },
    ],
  },
  {
    id: 'vault', name: 'Vault',
    versions: [{ label: 'Vault 1.17.x', os: 'debian 13', imageName: 'dhi-vault' }],
  },
  {
    id: 'tomcat', name: 'Tomcat',
    versions: [
      { label: 'Tomcat 10.1.x', os: 'debian 13', imageName: 'dhi-tomcat' },
      { label: 'Tomcat 11.0.x', os: 'debian 13', imageName: 'dhi-tomcat' },
    ],
  },
  {
    id: 'traefik', name: 'Traefik',
    versions: [{ label: 'Traefik 3.3.x', os: 'alpine 3.22', imageName: 'dhi-traefik' }],
  },
]

const SETTINGS = ['ENV variables', 'Labels', 'Annotations']

function EditWizard({ onBack, name }: { onBack: () => void; name: string | null }) {
  const [step, setStep] = useState(1)

  // Step 1
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<string>('')
  const [addedImages, setAddedImages] = useState<Array<{ imageName: string; label: string; os: string }>>([])

  const imageEntry = AVAILABLE_IMAGES.find((i) => i.name === selectedImage)
  const versionOptions = imageEntry?.versions ?? []

  function handleVersionSelect(idx: string) {
    const i = Number(idx)
    const version = versionOptions[i]
    if (!version) return
    setAddedImages((prev) => [...prev, { imageName: version.imageName, label: version.label, os: version.os }])
    setSelectedImage('')
    setSelectedVersionIdx('')
  }

  // Step 2
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [artifactImage, setArtifactImage] = useState('')
  const [selectedArtifacts, setSelectedArtifacts] = useState<Array<{ image: string; tag: string }>>([])
  const [expandedArtifacts, setExpandedArtifacts] = useState<Set<string>>(new Set())
  const [scripts, setScripts] = useState<string[]>([])

  function toggleArtifactExpand(key: string) {
    setExpandedArtifacts((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function removeArtifact(image: string, tag: string) {
    setSelectedArtifacts((prev) => prev.filter((a) => !(a.image === image && a.tag === tag)))
    setExpandedArtifacts((prev) => { const next = new Set(prev); next.delete(`${image}:${tag}`); return next })
  }

  function StepSummary({ children, onEdit }: { children: React.ReactNode; onEdit: () => void }) {
    return (
      <div className="border border-border rounded-xl p-4 flex items-start justify-between gap-4">
        <div className="flex-1">{children}</div>
        <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
      </div>
    )
  }

  function StepHeader({ n, title, description }: { n: number; title: string; description?: string }) {
    return (
      <div>
        <span className="type-overline text-muted-foreground">Step {n}</span>
        <p className="type-heading" style={{ fontVariationSettings: "'wght' 680" }}>{title}</p>
        {description && <p className="type-body text-muted-foreground">{description}</p>}
      </div>
    )
  }

  return (
    <div>
      <nav className="flex items-center gap-1 mb-2 type-body">
        <button className="text-primary hover:underline cursor-pointer bg-transparent border-none" onClick={onBack}>
          Docker Hardened Images
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground" style={{ fontVariationSettings: "'wght' 520" }}>Edit customization</span>
      </nav>

      <Separator className="mb-7 -mx-5" />

      <h1 className="type-display mb-8" style={{ fontVariationSettings: "'wght' 800" }}>
        {name ? `Edit ${name}` : 'Customize your hardened image'}
      </h1>

      <div className="flex flex-col gap-8 max-w-[950px]">

        {/* ── Step 1 ── */}
        <div className={cn('flex flex-col gap-3', step < 1 && 'opacity-40 pointer-events-none')}>
          <StepHeader n={1} title="Select base image or chart" />
          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <p className="type-body text-muted-foreground">
                Use a pre-verified version as the starting point for your customization.
              </p>

              <div className="flex gap-2 max-w-[731px]">
                <div className="flex-1">
                  <Combobox
                    value={selectedImage}
                    onValueChange={(v) => { setSelectedImage(v ?? ''); setSelectedVersionIdx('') }}
                  >
                    <ComboboxInput placeholder="Search images" className="w-full" />
                    <ComboboxContent className="w-full">
                      <ComboboxList>
                        {AVAILABLE_IMAGES.map((img) => (
                          <ComboboxItem key={img.id} value={img.name}>{img.name}</ComboboxItem>
                        ))}
                        <ComboboxEmpty>No images found</ComboboxEmpty>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
                <div className="flex-1">
                  <Select
                    value={selectedVersionIdx}
                    onValueChange={handleVersionSelect}
                    disabled={!selectedImage}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Version" />
                    </SelectTrigger>
                    <SelectContent>
                      {versionOptions.map((v, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {v.label} — {v.os}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {addedImages.length > 0 && (
                <div className="flex flex-col gap-2 max-w-[731px]">
                  {addedImages.map((img, i) => (
                    <div key={i} className="flex items-center gap-3 border border-border rounded-lg px-4 py-3">
                      <Shield className="size-4 text-primary shrink-0" />
                      <span className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>{img.imageName}</span>
                      <span className="type-body text-muted-foreground">{img.label}</span>
                      <Tag className="type-caption">{img.os}</Tag>
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setAddedImages((prev) => prev.filter((_, j) => j !== i))}
                        className="text-muted-foreground"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={() => setStep(2)} disabled={addedImages.length === 0}>
                  Next: Add packages
                </Button>
              </div>
            </div>
          ) : step > 1 ? (
            <StepSummary onEdit={() => setStep(1)}>
              <p className="type-body mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Image versions</p>
              {addedImages.map((img, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <Shield className="size-3.5 text-primary shrink-0" />
                  <span className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>{img.imageName}</span>
                  <span className="type-body text-muted-foreground">{img.label}</span>
                  <Tag className="type-caption">{img.os}</Tag>
                </div>
              ))}
            </StepSummary>
          ) : null}
        </div>

        {/* ── Step 2 ── */}
        <div className={cn('flex flex-col gap-3', step < 2 && 'opacity-40 pointer-events-none')}>
          <StepHeader n={2} title="Add packages" />
          {step === 2 ? (
            <div className="flex flex-col gap-6">
              <p className="type-body text-muted-foreground">
                Add custom packages as an OCI artifact or choose from a predefined list.
              </p>

              {/* Packages */}
              <div>
                <p className="type-body mb-2" style={{ fontVariationSettings: "'wght' 520" }}>Packages</p>
                <Combobox
                  multiple
                  value={selectedPackages}
                  onValueChange={setSelectedPackages}
                >
                  <ComboboxInput placeholder={selectedPackages.length === 0 ? 'Select from a list of pre-defined packages' : `${selectedPackages.length} selected`} />
                  <ComboboxContent>
                    <ComboboxList>
                      {AVAILABLE_PACKAGES.map((pkg) => (
                        <ComboboxItem key={pkg.name} value={pkg.name}>
                          <Archive className="size-4 text-muted-foreground shrink-0" />
                          <div className="flex-1">
                            <span style={{ fontVariationSettings: "'wght' 520" }}>{pkg.name}</span>
                            <span className="ml-2 type-caption text-muted-foreground">{pkg.description}</span>
                          </div>
                        </ComboboxItem>
                      ))}
                      <ComboboxEmpty>No packages found</ComboboxEmpty>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {selectedPackages.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedPackages.map((p) => (
                      <Tag key={p} onRemove={() => setSelectedPackages((prev) => prev.filter((x) => x !== p))}>
                        <span className="font-mono type-mono-terminal uppercase">{p}</span>
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              {/* OCI artifacts */}
              <div>
                <p className="type-body mb-2" style={{ fontVariationSettings: "'wght' 520" }}>OCI artifacts</p>

                {selectedArtifacts.length > 0 && (
                  <div className="border border-border rounded-xl overflow-hidden mb-3">
                    {selectedArtifacts.map((a, i) => {
                      const key = `${a.image}:${a.tag}`
                      const isExpanded = expandedArtifacts.has(key)
                      return (
                        <Collapsible
                          key={key}
                          open={isExpanded}
                          onOpenChange={() => toggleArtifactExpand(key)}
                        >
                          <div className={cn('flex items-center gap-2 px-4 py-3', i < selectedArtifacts.length - 1 && 'border-b border-border')}>
                            <button
                              onClick={() => toggleArtifactExpand(key)}
                              className="p-0.5 cursor-pointer border-none bg-transparent text-muted-foreground"
                            >
                              <ChevronRight className={cn('size-4 transition-transform', isExpanded && 'rotate-90')} />
                            </button>
                            <span className="type-body font-mono flex-1">{a.image}:{a.tag}</span>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeArtifact(a.image, a.tag)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          <CollapsibleContent>
                            <div className="px-8 pb-4 pt-2 flex flex-col gap-4 bg-muted/30">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>Include paths</span>
                                  <button className="type-body text-primary hover:underline border-none bg-transparent cursor-pointer">Add</button>
                                </div>
                                <Input placeholder="/path/to/include" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>Exclude paths</span>
                                  <button className="type-body text-primary hover:underline border-none bg-transparent cursor-pointer">Add</button>
                                </div>
                                <Input placeholder="/path/to/exclude" />
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })}
                  </div>
                )}

                <div className="flex gap-3 mb-3">
                  <div className="flex-[0_0_60%]">
                    <Combobox
                      value={artifactImage}
                      onValueChange={(v) => setArtifactImage(v ?? '')}
                    >
                      <ComboboxInput placeholder="Search for Docker Hub images in the 'moby'…" className="w-full" />
                      <ComboboxContent className="w-full">
                        <ComboboxList>
                          {AVAILABLE_OCI_IMAGES.map((img) => (
                            <ComboboxItem key={img.name} value={img.name}>
                              <Shield className="size-4 text-primary shrink-0" />
                              <span className="font-mono type-body">{img.name}</span>
                            </ComboboxItem>
                          ))}
                          <ComboboxEmpty>No images found</ComboboxEmpty>
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  <div className="flex-[0_0_calc(40%-12px)]">
                    <Select
                      disabled={!artifactImage}
                      onValueChange={(tag) => {
                        const already = selectedArtifacts.some((a) => a.image === artifactImage && a.tag === tag)
                        if (!already) setSelectedArtifacts((prev) => [...prev, { image: artifactImage, tag }])
                        setArtifactImage('')
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {(AVAILABLE_OCI_IMAGES.find((i) => i.name === artifactImage)?.tags ?? []).map((t) => (
                          <SelectItem key={t} value={t}>
                            <span className="font-mono type-body">{t}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl p-4 bg-primary/8 border border-primary/20">
                  <Info className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="type-body mb-0.5" style={{ fontVariationSettings: "'wght' 520" }}>Add custom packages</p>
                    <p className="type-body text-muted-foreground">
                      To display your artifact here, build it with custom packages and push it to Docker Hub.{' '}
                      <a href="#" className="text-primary underline inline-flex items-center gap-0.5">
                        Learn more<ExternalLink className="size-3" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Scripts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>Scripts</p>
                  <button
                    className="type-body text-primary hover:underline border-none bg-transparent cursor-pointer"
                    onClick={() => {
                      const next = SCRIPT_OPTIONS.find((s) => !scripts.includes(s))
                      if (next) setScripts((prev) => [...prev, next])
                    }}
                  >
                    Add
                  </button>
                </div>
                {scripts.length === 0 ? (
                  <div className="border border-border rounded-xl p-6 text-center">
                    <p className="type-body text-muted-foreground">Add scripts to see them here</p>
                  </div>
                ) : (
                  <div className="border border-border rounded-xl overflow-hidden">
                    {scripts.map((s, i) => (
                      <div key={s} className={cn('flex items-center gap-3 px-4 py-3', i < scripts.length - 1 && 'border-b border-border')}>
                        <span className="type-body font-mono flex-1">{s}</span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setScripts((prev) => prev.filter((x) => x !== s))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Next: Configure settings</Button>
              </div>
            </div>
          ) : step > 2 ? (
            <StepSummary onEdit={() => setStep(2)}>
              {selectedPackages.length > 0 && (
                <div className="mb-2">
                  <p className="type-body mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Packages</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPackages.map((p) => <Tag key={p} className="font-mono type-mono-terminal">{p}</Tag>)}
                  </div>
                </div>
              )}
              {selectedArtifacts.length > 0 && (
                <div className="mb-2">
                  <p className="type-body mb-1" style={{ fontVariationSettings: "'wght' 520" }}>OCI artifacts</p>
                  {selectedArtifacts.map((a) => (
                    <p key={`${a.image}:${a.tag}`} className="type-caption font-mono">{a.image}:{a.tag}</p>
                  ))}
                </div>
              )}
              {scripts.length > 0 && (
                <div>
                  <p className="type-body mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Scripts</p>
                  {scripts.map((s) => <p key={s} className="type-caption font-mono">{s}</p>)}
                </div>
              )}
              {selectedPackages.length === 0 && selectedArtifacts.length === 0 && scripts.length === 0 && (
                <p className="type-body text-muted-foreground">No packages, artifacts, or scripts added</p>
              )}
            </StepSummary>
          ) : null}
        </div>

        {/* ── Step 3 ── */}
        <div className={cn('flex flex-col gap-3', step < 3 && 'opacity-40 pointer-events-none')}>
          <StepHeader n={3} title="Configure image settings"
            description={step === 3 ? 'Define labels, annotations, and environment variables.' : undefined} />
          {step === 3 ? (
            <div className="flex flex-col gap-4">
              {SETTINGS.map((setting) => (
                <div key={setting} className="flex items-center justify-between max-w-[425px]">
                  <div className="flex items-center gap-2">
                    <span className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>{setting}</span>
                    <span className="type-body text-muted-foreground">Inherit from base image(s)</span>
                  </div>
                  <button className="type-body text-primary underline border-none bg-transparent cursor-pointer">Edit</button>
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Next: Review</Button>
              </div>
            </div>
          ) : step > 3 ? (
            <StepSummary onEdit={() => setStep(3)}>
              {SETTINGS.map((setting) => (
                <div key={setting} className="flex justify-between max-w-[425px] mb-1">
                  <span className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>{setting}</span>
                  <span className="type-body text-muted-foreground">Inherit from base image(s)</span>
                </div>
              ))}
            </StepSummary>
          ) : null}
        </div>

        {/* ── Step 4: Review ── */}
        <div className={cn('flex flex-col gap-3', step < 4 && 'opacity-40 pointer-events-none')}>
          <StepHeader n={4} title="Review configuration"
            description="Review the image version, packages, and settings before saving." />
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className="border border-border rounded-xl p-4 flex flex-col gap-4">
                <div>
                  <p className="type-body mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Images</p>
                  {addedImages.map((img, i) => (
                    <div key={i} className="flex items-center gap-2 mb-0.5">
                      <Shield className="size-3.5 text-primary shrink-0" />
                      <span className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>{img.imageName}</span>
                      <span className="type-body text-muted-foreground">{img.label}</span>
                      <Tag className="type-caption">{img.os}</Tag>
                    </div>
                  ))}
                </div>
                <Separator />
                {selectedPackages.length > 0 && (
                  <div>
                    <p className="type-body mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Packages</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedPackages.map((p) => <Tag key={p} className="font-mono type-mono-terminal">{p}</Tag>)}
                    </div>
                  </div>
                )}
                {selectedArtifacts.length > 0 && (
                  <div>
                    <p className="type-body mb-1" style={{ fontVariationSettings: "'wght' 520" }}>OCI artifacts</p>
                    {selectedArtifacts.map((a) => (
                      <p key={`${a.image}:${a.tag}`} className="type-caption font-mono">{a.image}:{a.tag}</p>
                    ))}
                  </div>
                )}
                {scripts.length > 0 && (
                  <div>
                    <p className="type-body mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Scripts</p>
                    {scripts.map((s) => <p key={s} className="type-caption font-mono">{s}</p>)}
                  </div>
                )}
                <Separator />
                {SETTINGS.map((setting) => (
                  <div key={setting} className="flex justify-between max-w-[425px]">
                    <span className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>{setting}</span>
                    <span className="type-body text-muted-foreground">Inherit from base image(s)</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={onBack}>Save customization</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type View = 'list' | 'edit' | 'detail' | 'child-build' | 'build-logs'

export default function BulkCustomizations() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['ca-certs', 'payments-team']))
  const [rows, setRows] = useState<CustomizationRow[]>(ROWS)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; title: string; body: string; ids: string[] }>({
    open: false, title: '', body: '', ids: [],
  })
  const [view, setView] = useState<View>('list')
  const [editingName, setEditingName] = useState<string | null>(null)
  const [detailRow, setDetailRow] = useState<CustomizationRow | null>(null)
  const [childBuildRow, setChildBuildRow] = useState<CustomizationRow | null>(null)
  const [buildLogContext, setBuildLogContext] = useState<BuildLogContext | null>(null)
  const [prevView, setPrevView] = useState<View>('list')
  const [searchValue, setSearchValue] = useState('')

  const openEdit = (name: string | null) => { setEditingName(name); setView('edit') }
  const openDetail = (row: CustomizationRow) => { setDetailRow(row); setView('detail') }
  const openChildBuild = (row: CustomizationRow) => { setChildBuildRow(row); setView('child-build') }

  const openBuildLogs = (context: BuildLogContext, from: View) => {
    setBuildLogContext(context)
    setPrevView(from)
    setView('build-logs')
  }

  const toggleExpanded = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleMenuAction = (action: string, rowId: string) => {
    if (action === 'edit' || action === 'customize') {
      const row = rows.find((r) => r.id === rowId)
      openEdit(row?.name ?? null)
      return
    }
    if (action === 'delete') {
      const row = rows.find((r) => r.id === rowId)
      if (!row) return
      const childIds = row.childIds ?? []
      const childNames = rows.filter((r) => childIds.includes(r.id)).map((r) => r.name)
      const body = childIds.length > 0
        ? `Deleting "${row.name}" will also permanently remove ${childIds.length} child customization${childIds.length === 1 ? '' : 's'} (${childNames.join(', ')}). This action cannot be undone.`
        : `Delete customization "${row.name}"? This action cannot be undone.`
      setDeleteDialog({ open: true, title: 'Delete customization?', body, ids: [rowId, ...childIds] })
    }
  }

  const confirmDelete = () => {
    const { ids } = deleteDialog
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)))
    setDeleteDialog({ open: false, title: '', body: '', ids: [] })
    toast.success(ids.length === 1 ? 'Customization deleted.' : `${ids.length} customizations deleted.`)
  }

  const visibleRows = rows.filter((row) => {
    if (row.type === 'child' && !expandedRows.has(row.parentId!)) return false
    if (searchValue) return row.name.toLowerCase().includes(searchValue.toLowerCase())
    return true
  })

  return (
    <Fragment>
      <PrototypeHeader version="Version 1" status="Initial Design" />
      <div className="min-h-screen flex justify-center p-10 bg-muted">
        <div
          className="w-[1440px] rounded-xl overflow-hidden flex flex-col bg-background shadow-[0_4px_40px_rgba(0,0,0,0.25)]"
        >
          <TopNav />

          <div className="flex flex-1">
            <SidebarNav />

            <main className="flex-1 min-w-0 pt-7 pr-6 pb-16 pl-5 overflow-y-auto">

              {/* ── LIST ── */}
              {view === 'list' && (
                <>
                  <h1 className="type-display mb-6" style={{ fontVariationSettings: "'wght' 680" }}>Manage Hardened Images</h1>

                  {/* Subscription stats */}
                  <div className="border border-border rounded p-4 flex items-start justify-between mb-8">
                    {[
                      { label: 'Your subscription', value: 'DHI Enterprise' },
                      { label: 'Hardened images', value: '12 of 20' },
                      { label: 'Customizations', value: '8 of 15' },
                      { label: 'ELS images', value: 'Not available', disabled: true },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1">
                        <span className="type-overline text-muted-foreground">{item.label}</span>
                        <span className={`text-2xl ${item.disabled ? 'text-muted-foreground' : ''}`} style={{ fontVariationSettings: "'wght' 680" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Manage tabs */}
                  <Tabs value="customizations">
                    <TabsList variant="line">
                      <TabsTrigger value="mirrored">Mirrored Images</TabsTrigger>
                      <TabsTrigger value="helm">Mirrored Helm charts</TabsTrigger>
                      <TabsTrigger value="customizations">Customizations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="customizations">
                      <div className="flex items-center gap-4 mt-6 mb-6">
                        <Search
                          placeholder="Search"
                          value={searchValue}
                          onChange={setSearchValue}
                          onClear={() => setSearchValue('')}
                          className="w-[244px]"
                        />
                        <div className="flex-1" />
                        <a href="#" className="type-body text-primary underline">Learn about customizations</a>
                        <Button onClick={() => openEdit(null)}>New customization</Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Image/Chart</TableHead>
                            <TableHead>OS</TableHead>
                            <TableHead className="w-14" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {visibleRows.map((row) => {
                            const isParent = row.type === 'parent'
                            const isChild = row.type === 'child'
                            const isExpanded = expandedRows.has(row.id)
                            const siblings = rows.filter((r) => r.parentId === row.parentId)
                            const isLastChild = isChild && siblings[siblings.length - 1]?.id === row.id

                            return (
                              <TableRow key={row.id} className={isChild ? 'bg-black/1' : ''}>
                                <TableCell>
                                  <div className={cn('flex items-center gap-2 relative', isChild && 'pl-12')}>
                                    {isChild && <TreeConnector continues={!isLastChild} />}
                                    {isParent && (
                                      <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => toggleExpanded(row.id)}
                                        aria-label={isExpanded ? `Collapse ${row.name}` : `Expand ${row.name}`}
                                        className="p-0.5 size-6"
                                      >
                                        {isExpanded
                                          ? <ChevronDown className="size-4" />
                                          : <ChevronRight className="size-4" />}
                                      </Button>
                                    )}
                                    <button
                                      className="type-body text-primary underline cursor-pointer border-none bg-transparent"
                                      onClick={() => isChild ? openChildBuild(row) : openDetail(row)}
                                    >
                                      {row.name}
                                    </button>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  {isChild ? (
                                    <Tag>{row.imageLabel}</Tag>
                                  ) : (
                                    <div>
                                      <p className="type-body">{row.imageLabel}</p>
                                      <p className="type-caption text-muted-foreground">
                                        {row.images.map((img, i) => (
                                          <span key={img.name}>
                                            {i > 0 && ', '}
                                            {img.linked
                                              ? <a href="#" className="text-primary hover:underline">{img.name}</a>
                                              : img.name}
                                          </span>
                                        ))}
                                      </p>
                                    </div>
                                  )}
                                </TableCell>

                                <TableCell>
                                  {row.os && <Tag>{row.os}</Tag>}
                                </TableCell>

                                <TableCell className="text-right">
                                  {!isChild && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.name}`}>
                                          <MoreVertical className="size-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleMenuAction('edit', row.id)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleMenuAction('customize', row.id)}>Customize</DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onClick={() => handleMenuAction('delete', row.id)}
                                        >
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </>
              )}

              {/* ── EDIT ── */}
              {view === 'edit' && <EditWizard onBack={() => setView('list')} name={editingName} />}

              {/* ── DETAIL ── */}
              {view === 'detail' && detailRow && (
                <CustomizationDetail
                  row={detailRow}
                  onBack={() => setView('list')}
                  onEdit={() => openEdit(detailRow.name)}
                  onViewLogs={(ctx) => openBuildLogs(ctx, 'detail')}
                />
              )}

              {/* ── CHILD BUILD ── */}
              {view === 'child-build' && childBuildRow && (
                <ChildBuildPage
                  childRow={childBuildRow}
                  onBack={() => {
                    const parent = rows.find((r) => r.id === childBuildRow.parentId)
                    if (parent) openDetail(parent)
                    else setView('list')
                  }}
                  onBackToList={() => setView('list')}
                  onViewLogs={(ctx) => openBuildLogs(ctx, 'child-build')}
                />
              )}

              {/* ── BUILD LOGS ── */}
              {view === 'build-logs' && buildLogContext && (
                <BuildLogsPage
                  context={buildLogContext}
                  onBack={() => setView(prevView)}
                  onBackToParentDetail={
                    prevView === 'child-build' && childBuildRow
                      ? () => {
                          const parent = rows.find((r) => r.id === childBuildRow.parentId)
                          if (parent) openDetail(parent)
                          else setView('list')
                        }
                      : undefined
                  }
                  onBackToList={() => setView('list')}
                />
              )}
            </main>
          </div>

          <footer className="px-10 py-3 flex items-center gap-6 shrink-0 bg-muted border-t border-border">
            <p className="type-body text-muted-foreground">© 2023 Docker Inc. All rights reserved.</p>
            {['Terms of Service', 'Subscription Service Agreement', 'Cookie Settings', 'Privacy', 'Legal'].map((l) => (
              <a key={l} href="#" className="type-body text-muted-foreground hover:underline">{l}</a>
            ))}
          </footer>
        </div>
      </div>

      <DeleteDialog
        open={deleteDialog.open}
        title={deleteDialog.title}
        body={deleteDialog.body}
        onCancel={() => setDeleteDialog({ open: false, title: '', body: '', ids: [] })}
        onConfirm={confirmDelete}
      />
    </Fragment>
  )
}
