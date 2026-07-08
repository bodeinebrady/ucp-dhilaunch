import { useState, useEffect, Fragment } from 'react'
import EnvironmentPreview, { SCENARIO_LABELS, type Scenario } from '../components/EnvironmentPreview'
import ImageConfigPreview from '../components/ImageConfigPreview'
import PrototypeHeader from '../components/PrototypeHeader'
import { DECISIONS_V2 } from '../data/rationale-v2'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Tag } from '@/components/ui/tag'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
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
import EditIcon from '@docker/icons/react/Edit'
import {
  MoreVertical,
  ChevronRight,
  X,
  Copy,
  Archive,
  ExternalLink,
  CheckCircle2,
  Search,
  ChevronDown,
  Sun,
  Moon,
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
  outputImage?: string
  createdBy: string
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
    createdBy: 'jsmith',
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
    outputImage: 'docker.io/moby/dhi-vault:latest',
    createdBy: 'jsmith',
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
    outputImage: 'docker.io/moby/dhi-node:latest',
    createdBy: 'jsmith',
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
    outputImage: 'docker.io/moby/dhi-php:latest',
    createdBy: 'jsmith',
  },
  {
    id: 'ping-dev-libs',
    type: 'standalone',
    name: 'ping-dev-libs',
    images: [{ name: 'dhi-valkey', linked: true }],
    imageLabel: '1 image',
    os: 'alpine',
    createdBy: 'alopez',
  },
  {
    id: 'payments-team',
    type: 'parent',
    name: 'payments-team',
    images: [{ name: 'dhi-tomcat', linked: true }],
    imageLabel: '1 image',
    os: 'debian',
    childIds: ['payments-team-tomcat'],
    createdBy: 'mchen',
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
    outputImage: 'docker.io/moby/dhi-tomcat:latest',
    createdBy: 'mchen',
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
    createdBy: 'alopez',
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

function TopNav({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  return (
    <header className="h-16 flex items-center px-6 shrink-0 bg-primary">
      <div className="flex items-center gap-1 mr-8">
        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Docker" role="img" className="size-6">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" />
        </svg>
        <span className="text-primary-foreground text-lg tracking-tight font-[Comfortaa,sans-serif]" style={{ fontVariationSettings: "'wght' 700" }}>
          docker hub
        </span>
      </div>

      <div className="flex h-full items-center">
        {['Explore', 'MyHub'].map((label) => (
          <button
            key={label}
            className={`px-3 h-8 rounded type-body cursor-pointer border-none ${
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
        <button
          onClick={onToggleTheme}
          className="p-2 rounded cursor-pointer border-none bg-transparent"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark
            ? <Sun className="size-5 text-primary-foreground" />
            : <Moon className="size-5 text-primary-foreground" />
          }
        </button>
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
    <aside
      className="w-[248px] shrink-0 px-3 py-6 flex flex-col gap-1 bg-sidebar border-r border-sidebar-border"
    >
      <div className="flex items-center gap-2 pb-2">
        <div className="size-10 rounded flex items-center justify-center shrink-0 bg-[#7d2eff]">
          <Users className="size-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="type-body leading-5 text-sidebar-foreground" style={{ fontVariationSettings: "'wght' 520" }}>Moby Inc</p>
          <p className="type-caption text-sidebar-foreground/60 leading-4">Organization</p>
        </div>
        <button className="p-1 rounded cursor-pointer border-none bg-transparent">
          <ChevronDownIcon className="size-4 text-sidebar-foreground/60" />
        </button>
      </div>

      <Separator className="my-1" />

      {navItems.map((item) => (
        <div key={item.label}>
          <div className="flex items-center gap-2 px-2 h-8 rounded-md cursor-pointer hover:bg-sidebar-accent">
            <item.icon className="size-5 text-sidebar-foreground/60 shrink-0" />
            <span className="flex-1 type-body overflow-hidden text-ellipsis whitespace-nowrap text-sidebar-foreground" style={{ fontVariationSettings: "'wght' 520" }}>{item.label}</span>
            {'hasChevron' in item && item.hasChevron && <ChevronDownIcon className="size-4 text-sidebar-foreground/60" />}
            {'expanded' in item && item.expanded && <ChevronDownIcon className="size-4 text-sidebar-foreground/60" />}
            {'external' in item && item.external && <ArrowRight className="size-4 text-sidebar-foreground/60" />}
          </div>
          {'expanded' in item && item.expanded && item.sub && (
            <div className="flex flex-col">
              {item.sub.map((sub, i) => (
                <div
                  key={sub}
                  className={`px-2 pl-10 h-7 flex items-center rounded-md cursor-pointer ${i === item.activeIndex ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent'}`}
                >
                  <span className={`type-label ${i === item.activeIndex ? '' : 'text-muted-foreground'}`} style={i === item.activeIndex ? { fontVariationSettings: "'wght' 520" } : undefined}>
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

// ─── Tree connector ───────────────────────────────────────────────────────────

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
          {DEFINITION_MOCK.scripts.map((s) => <p key={s} className="type-mono-code font-mono">{s}</p>)}
        </div>
      </DefSection>
      <DefSection label="Entrypoint">
        <p className="type-mono-code font-mono">{DEFINITION_MOCK.entrypoint}</p>
      </DefSection>
      <DefSection label="CMD">
        <p className="type-mono-code font-mono">{DEFINITION_MOCK.cmd}</p>
      </DefSection>
      <DefSection label="User">
        <p className="type-body">{DEFINITION_MOCK.user}</p>
      </DefSection>
      <DefSection label="Environment variables">
        <div className="flex flex-col gap-2">
          {DEFINITION_MOCK.envVars.map((env) => (
            <div key={env.key} className="flex gap-6">
              <p className="type-mono-code font-mono" style={{ fontVariationSettings: "'wght' 520" }}>{env.key}</p>
              <p className="type-mono-code font-mono text-muted-foreground">{env.value}</p>
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

// ─── Build runs ───────────────────────────────────────────────────────────────

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

function BuildLogsContent() {
  const [logSearch, setLogSearch] = useState('')
  const [selectedRun, setSelectedRun] = useState(BUILD_RUNS[0])
  const [selectorOpen, setSelectorOpen] = useState(false)

  const filteredLogs = logSearch
    ? LOGS_MOCK.filter((l) => l.message.toLowerCase().includes(logSearch.toLowerCase()))
    : LOGS_MOCK

  return (
    <div>
      <div className="flex items-start gap-6 mb-7">
        {/* Build selector */}
        <div className="relative mt-5">
          <span
            className={`absolute -top-2.5 left-2.5 z-10 bg-background px-1 type-caption leading-none transition-colors ${selectorOpen ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Build
          </span>
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
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

          {selectorOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-popover rounded-xl shadow-lg ring-1 ring-foreground/10 min-w-[300px] overflow-hidden">
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
            </div>
          )}
        </div>

        <div className="flex-1" />

        <div className="relative mt-5">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-8 w-60"
            placeholder="Search logs"
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
          />
        </div>
      </div>

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

              <p
                className="flex-1 type-mono-data text-foreground break-all"
              >
                {log.message}
              </p>

              {log.cached && (
                <span className="shrink-0 type-overline font-mono px-2 py-1 rounded-md bg-blue-500 text-blue-100" style={{ fontVariationSettings: "'wght' 680" }}>
                  CACHED
                </span>
              )}

              <span
                className="shrink-0 type-mono-terminal text-muted-foreground w-10 text-right"
              >
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

function BuildLogsPage({ context, onBack, onBackToParentDetail, onBackToList }: BuildLogsPageProps) {
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
      <BuildLogsContent />
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
            <h1 className="type-display">{row.name}</h1>
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
          <TabsTrigger value="1">{isBulk ? 'Build Logs' : 'Builds'}</TabsTrigger>
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
                  <TableHead>Image / tag</TableHead>
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
                    <TableCell>
                      {child.outputImage ? (
                        <a href="#" className="type-body text-primary hover:underline flex items-center gap-1">
                          {child.outputImage}
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <span className="type-body text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {child.os && <Tag>{child.os}</Tag>}
                    </TableCell>
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

// ─── Edit Wizard ──────────────────────────────────────────────────────────────

const WIZARD_STEPS = ['Select base image', 'Add packages', 'Configure settings', 'Review', 'Preview']

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
  { name: 'moby/dhi-alpine-base',             tags: ['3.22-base', '3.21-base', '3.22-base-fips'] },
  { name: 'moby/dhi-kafka',                   tags: ['4-debian13-fips', '3.9-debian13', '3.8-debian13-fips'] },
  { name: 'moby/dhi-temporalio-admin-tools',  tags: ['1.29.4-debian13-fips', '1.29-debian13-fips', '1.28-debian13', '1.28.3-debian13'] },
  { name: 'moby/dhi-airflow',                 tags: ['2.10-debian13', '2.9-debian13-fips', '2.10.4-debian13'] },
  { name: 'moby/dhi-argocd',                  tags: ['2.14-debian13', '2.13-debian13-fips'] },
  { name: 'moby/dhi-flyway',                  tags: ['11-debian13', '10.22-debian13-fips'] },
  { name: 'moby/dhi-haproxy',                 tags: ['3.1-debian13', '3.0-debian13-fips'] },
  { name: 'moby/ca-certs',                    tags: ['latest', '2024.12'] },
  { name: 'moby/internal-packages',           tags: ['latest', '1.2.0', '1.1.0'] },
]

const SCRIPT_OPTIONS = [
  '/usr/lib/ssl/update-certs.sh',
  '/etc/docker/configure-registry.sh',
  '/usr/local/bin/setup-env.sh',
  '/opt/security/harden.sh',
  '/etc/init.d/configure-logging.sh',
  '/usr/share/scripts/inject-ca.sh',
]

const IMAGE_TABLE_DATA = [
  { id: 'node-deb13',      name: 'dhi-node',   version: 'Node.js 25.x',              tags: '25.0-debian13, 25.1-debian13, 25.2-debian13',               os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'node-alp322',     name: 'dhi-node',   version: 'Node.js 25.x',              tags: '25.0-alpine3.22, 25.1-alpine3.22',                           os: 'alpine 3.22', compliance: ['CIS'],                 pkgMgr: false, shell: false, user: 'nonroot', uid: '65532' },
  { id: 'node-deb13-dev',  name: 'dhi-node',   version: 'Node.js 25.x (dev)',        tags: '25.0-debian13-dev, 25.1-debian13-dev',                       os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: true,  shell: true,  user: 'root',    uid: null     },
  { id: 'node-deb13-fips', name: 'dhi-node',   version: 'Node.js 25.x (fips)',       tags: '25.0-debian13-fips, 25.1-debian13-fips',                     os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'node-fips-dev',   name: 'dhi-node',   version: 'Node.js 25.x (fips, dev)', tags: '25.0-debian13-fips-dev, 25.1-debian13-fips-dev',              os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: true,  shell: true,  user: 'root',    uid: null     },
  { id: 'go-deb13',        name: 'dhi-go',     version: 'Go 1.25.x',                tags: '1.25.0-debian13, 1.25.1-debian13',                           os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'go-deb13-dev',    name: 'dhi-go',     version: 'Go 1.25.x (dev)',          tags: '1.25.0-debian13-dev, 1.25.1-debian13-dev',                   os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: true,  shell: true,  user: 'root',    uid: null     },
  { id: 'go-deb13-fips',   name: 'dhi-go',     version: 'Go 1.25.x (fips)',         tags: '1.25.0-debian13-fips, 1.25.1-debian13-fips',                 os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'tomcat-deb13',    name: 'dhi-tomcat', version: 'Tomcat 10.x',              tags: '10.1.0-debian13, 10.1.1-debian13',                           os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'valkey-deb13',    name: 'dhi-valkey', version: 'Valkey 8.x',               tags: '8.0.0-debian13, 8.0.1-debian13',                             os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: false, user: 'nonroot', uid: '65532' },
  { id: 'redis-deb13',     name: 'dhi-redis',  version: 'Redis 7.x',                tags: '7.4-debian13, 7.2-debian13',                                 os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: false, user: 'nonroot', uid: '65532' },
  { id: 'redis-deb13-fips',name: 'dhi-redis',  version: 'Redis 7.x (fips)',         tags: '7.4-debian13-fips, 7.2-debian13-fips',                       os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: false, user: 'nonroot', uid: '65532' },
  { id: 'rust-deb13',      name: 'dhi-rust',   version: 'Rust 1.85.x',              tags: '1.85-debian13, 1.84-debian13',                               os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'rust-deb13-fips', name: 'dhi-rust',   version: 'Rust 1.85.x (fips)',       tags: '1.85-debian13-fips, 1.84-debian13-fips',                     os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'regctl-deb13',    name: 'dhi-regctl', version: 'regctl 0.8.x',             tags: '0.8.1-debian13, 0.8.0-debian13',                             os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: false, user: 'nonroot', uid: '65532' },
  { id: 'php-deb13',       name: 'dhi-php',    version: 'PHP 8.3.x',               tags: '8.3-debian13, 8.2-debian13',                                 os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'php-deb13-fips',  name: 'dhi-php',    version: 'PHP 8.3.x (fips)',        tags: '8.3-debian13-fips, 8.2-debian13-fips',                       os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'vault-deb13',     name: 'dhi-vault',  version: 'Vault 1.19.x',             tags: '1.19-debian13, 1.18-debian13',                               os: 'debian 13',   compliance: ['CIS'],                 pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
  { id: 'vault-deb13-fips',name: 'dhi-vault',  version: 'Vault 1.19.x (fips)',      tags: '1.19-debian13-fips, 1.18-debian13-fips',                     os: 'debian 13',   compliance: ['CIS', 'FIPS', 'STIG'], pkgMgr: false, shell: true,  user: 'nonroot', uid: '65532' },
]

const WIZARD_NEXT_LABELS = [
  'Next: Add packages',
  'Next: Configure settings',
  'Next: Review',
  'Preview build',
  'Run customization',
]

const WIZARD_SETTINGS = [
  { label: 'ENV variables' },
  { label: 'Labels' },
  { label: 'Annotations' },
]

const MIRRORED_IMAGES = [
  { id: 'mi-node',   name: 'moby/dhi-node',   imageName: 'dhi-node',   customizations: 0, compliance: ['CIS', 'FIPS', 'STIG'] },
  { id: 'mi-redis',  name: 'moby/dhi-redis',  imageName: 'dhi-redis',  customizations: 1, compliance: ['CIS'] },
  { id: 'mi-rust',   name: 'moby/dhi-rust',   imageName: 'dhi-rust',   customizations: 0, compliance: ['CIS', 'FIPS', 'STIG'] },
  { id: 'mi-regctl', name: 'moby/dhi-regctl', imageName: 'dhi-regctl', customizations: 2, compliance: ['CIS'] },
  { id: 'mi-php',    name: 'moby/dhi-php',    imageName: 'dhi-php',    customizations: 0, compliance: ['CIS'] },
]

function EditWizard({ onBack, onSave, name, preselectedImage, editingRow, previewScenario, previewMode, onStepChange }: {
  onBack: () => void; onSave: () => void; name: string | null; preselectedImage?: string; editingRow?: CustomizationRow; previewScenario: Scenario; previewMode: 'env' | 'config'; onStepChange?: (step: number) => void
}) {
  const isEdit = Boolean(name)

  const initialSelectedIds = editingRow
    ? new Set(IMAGE_TABLE_DATA.filter((img) => editingRow.images.some((ri) => ri.name === img.name)).map((img) => img.id))
    : new Set<string>()

  const initialCatalogChoice = editingRow
    ? (editingRow.images[0]?.name ?? null)
    : (preselectedImage ?? null)

  const [step, setStep] = useState(0)

  useEffect(() => { onStepChange?.(step) }, [step, onStepChange])

  const [selectedIds, setSelectedIds] = useState<Set<string>>(initialSelectedIds)
  const [catalogSearch, setCatalogSearch] = useState(initialCatalogChoice ?? '')
  const [expandedImages, setExpandedImages] = useState<Set<string>>(
    initialCatalogChoice ? new Set([initialCatalogChoice]) : new Set()
  )

  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [packageSearch, setPackageSearch] = useState('')
  const [ociSearch, setOciSearch] = useState('')
  const [expandedOciImages, setExpandedOciImages] = useState<Set<string>>(new Set())
  const [selectedArtifacts, setSelectedArtifacts] = useState<Array<{ image: string; tag: string }>>([])
  const [expandedArtifacts, setExpandedArtifacts] = useState<Set<string>>(new Set())
  const [scripts, setScripts] = useState<string[]>([])
  const [pendingScript, setPendingScript] = useState('')
  const [step2ExpandedSections, setStep2ExpandedSections] = useState<Set<string>>(new Set(['packages']))
  const [enabledSettings, setEnabledSettings] = useState<Set<string>>(new Set())
  const [pendingSetting, setPendingSetting] = useState<string | null>(null)
  const [settingRows, setSettingRows] = useState<Record<string, Array<{ key: string; value: string }>>>(
    Object.fromEntries(WIZARD_SETTINGS.map((s) => [s.label, [{ key: '', value: '' }]]))
  )


  const addedImages = IMAGE_TABLE_DATA.filter((img) => selectedIds.has(img.id))

  const imageGroups = Array.from(
    IMAGE_TABLE_DATA.reduce((map, img) => {
      if (!map.has(img.name)) map.set(img.name, [] as typeof IMAGE_TABLE_DATA)
      map.get(img.name)!.push(img)
      return map
    }, new Map<string, typeof IMAGE_TABLE_DATA>()),
  ).map(([n, versions]) => ({ name: n, versions }))

  function toggleId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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

  function toggleSection(key: string) {
    setStep2ExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectionsByImage = imageGroups
    .map((g) => ({ name: g.name, versions: addedImages.filter((img) => img.name === g.name) }))
    .filter((g) => g.versions.length > 0)

  return (
    <div>
      {/* Breadcrumb + close button */}
      <div className="flex items-center gap-1 mb-2">
        <nav className="flex items-center gap-1 type-body">
          <button className="text-primary hover:underline cursor-pointer bg-transparent border-none" onClick={onBack}>
            Docker Hardened Images
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground" style={{ fontVariationSettings: "'wght' 520" }}>{isEdit ? 'Edit customization' : 'New customization'}</span>
        </nav>
        <div className="flex-1" />
        <button
          className="flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors bg-transparent border-none cursor-pointer"
          onClick={onBack}
          aria-label="Close wizard"
        >
          <X className="size-4" />
        </button>
      </div>

      <Separator className="mb-6 -mx-5" />

      <h1 className="type-display mb-6">{isEdit ? `Edit ${name}` : 'New customization'}</h1>

      {/* Custom stepper — completed steps are clickable */}
      <div className="flex items-center gap-2 mb-6">
        {WIZARD_STEPS.map((label, i) => {
          const isCompleted = i < step
          const isActive = i === step
          return (
            <Fragment key={label}>
              <button
                className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0"
                onClick={isCompleted ? () => setStep(i) : undefined}
                style={{ cursor: isCompleted ? 'pointer' : 'default' }}
              >
                <span className={`flex size-6 items-center justify-center rounded-full type-caption transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' :
                  isCompleted ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`} style={{ fontVariationSettings: "'wght' 520" }}>
                  {isCompleted ? <CheckCircle2 className="size-3.5" /> : i + 1}
                </span>
                <span className={`type-body ${isActive ? 'text-foreground' : isCompleted ? 'text-primary' : 'text-muted-foreground'}`} style={isActive ? { fontVariationSettings: "'wght' 520" } : undefined}>
                  {label}
                </span>
              </button>
              {i < WIZARD_STEPS.length - 1 && (
                <div className={`h-px w-8 shrink-0 ${i < step ? 'bg-primary/40' : 'bg-border'}`} />
              )}
            </Fragment>
          )
        })}
      </div>

      <Separator className="mb-8 -mx-5" />

      {/* Step content */}
      <div style={{ maxWidth: step <= 1 ? 'none' : 720, width: '100%' }}>

        {/* ── Step 1: Select base image ── */}
        {step === 0 && (() => {
          const PANEL_H = 360
          const AUTOCOMPLETE_H = 52

          return (
            <div>
              <p className="type-heading mb-1">Select base image or chart</p>
              <p className="text-sm text-muted-foreground mb-4">Browse all base images and select the versions you need. Your selections appear on the right.</p>
              <div className="flex gap-4 items-start" style={{ height: AUTOCOMPLETE_H + PANEL_H }}>

                {/* Left: search + tree */}
                <div className="flex flex-col gap-3 h-full basis-[60%] grow-0 shrink-0">
                  <div className="relative shrink-0">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      className="pl-8"
                      placeholder="Search base images…"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 border border-dashed border-border rounded-xl overflow-y-auto">
                    {(() => {
                      const isSearching = catalogSearch.length > 0
                      const filtered = imageGroups.filter((g) =>
                        !isSearching ||
                        g.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                        g.versions.some((v) =>
                          v.version.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          v.os.toLowerCase().includes(catalogSearch.toLowerCase())
                        )
                      )
                      if (filtered.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center h-full type-body text-muted-foreground">
                            No images match "{catalogSearch}"
                          </div>
                        )
                      }
                      return filtered.map((group, gi) => {
                        const isExpanded = isSearching || expandedImages.has(group.name)
                        const selectedCount = group.versions.filter((v) => selectedIds.has(v.id)).length
                        return (
                          <div key={group.name} className={gi > 0 ? 'border-t border-border' : ''}>
                            <button
                              onClick={() => {
                                if (isSearching) return
                                setExpandedImages((prev) => {
                                  const next = new Set(prev)
                                  if (next.has(group.name)) next.delete(group.name)
                                  else next.add(group.name)
                                  return next
                                })
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-transparent border-none cursor-pointer hover:bg-muted/30 text-left"
                            >
                              <Shield className="size-4 text-primary shrink-0" />
                              <span className="text-sm font-semibold font-mono flex-1">{group.name}</span>
                              {selectedCount > 0 && (
                                <Tag className="type-badge border-primary text-primary bg-transparent shrink-0">{selectedCount}</Tag>
                              )}
                              <span className="text-xs text-muted-foreground shrink-0">{group.versions.length} ver.</span>
                              <ChevronRight className={`size-4 text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                            {isExpanded && group.versions.map((img) => {
                              const checked = selectedIds.has(img.id)
                              return (
                                <div
                                  key={img.id}
                                  onClick={() => toggleId(img.id)}
                                  className={`flex items-center gap-3 pl-9 pr-4 py-2.5 cursor-pointer border-t border-border ${checked ? 'bg-muted/60' : 'hover:bg-muted/30'}`}
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={() => toggleId(img.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>{img.version}</p>
                                    <p className="text-xs text-muted-foreground">{img.os} · {img.tags}</p>
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    {img.compliance.map((c) => <Tag key={c} className="type-badge">{c}</Tag>)}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>

                {/* Right: selected versions */}
                <div className="flex flex-col h-full basis-[calc(40%-16px)] grow-0 shrink-0">
                  <div className="shrink-0" style={{ height: AUTOCOMPLETE_H }} />
                  <div className="flex-1 border border-border rounded-xl overflow-hidden flex flex-col">
                    <div className="px-4 py-2.5 flex items-center justify-between border-b border-border bg-muted/40 shrink-0">
                      <span className="type-overline text-muted-foreground">Selected</span>
                      {selectedIds.size > 0 && (
                        <span className="type-caption text-primary" style={{ fontVariationSettings: "'wght' 520" }}>
                          {selectedIds.size} version{selectedIds.size !== 1 ? 's' : ''} · {selectionsByImage.length} image{selectionsByImage.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {selectionsByImage.map((group, gi) => (
                        <div key={group.name} className={gi < selectionsByImage.length - 1 ? 'border-b border-border' : ''}>
                          <div className="flex items-center gap-2 px-4 py-2 bg-muted/30">
                            <Shield className="size-3.5 text-primary shrink-0" />
                            <span className="text-sm font-bold font-mono flex-1">{group.name}</span>
                            <span className="text-xs text-muted-foreground">{group.versions.length} version{group.versions.length !== 1 ? 's' : ''}</span>
                          </div>
                          {group.versions.map((img) => (
                            <div key={img.id} className="flex items-center gap-3 pl-8 pr-4 py-2.5 border-t border-border">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm">{img.version}</p>
                                <p className="text-xs text-muted-foreground">{img.os}</p>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                {img.compliance.map((c) => <Tag key={c} className="type-badge">{c}</Tag>)}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => toggleId(img.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="size-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))}
                      {selectionsByImage.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center h-full">
                          <Search className="size-6 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No versions selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── Step 2: Add packages ── */}
        {step === 1 && (
          <div className="flex flex-col gap-0">
            <p className="type-heading mb-1">Add packages & artifacts</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add custom packages as an OCI artifact or choose from a predefined list.
            </p>

            {/* Packages card */}
            <div className="border border-border rounded-xl overflow-hidden mb-3">
              <button
                onClick={() => toggleSection('packages')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer hover:bg-muted/30"
              >
                <Archive className="size-4 text-muted-foreground shrink-0" />
                <span className="type-label flex-1 text-left">Packages</span>
                {selectedPackages.length > 0 && (
                  <Tag className="type-badge border-primary text-primary bg-transparent">{selectedPackages.length}</Tag>
                )}
                <ChevronRight className={`size-4 text-muted-foreground transition-transform ${step2ExpandedSections.has('packages') ? 'rotate-90' : ''}`} />
              </button>
              <Collapsible open={step2ExpandedSections.has('packages')}>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-3">
                    <div className="flex gap-4 h-[352px]">
                      {/* Left: search + list */}
                      <div className="flex flex-col gap-3 h-full basis-[60%] grow-0 shrink-0">
                        <div className="relative shrink-0">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                          <Input
                            className="pl-8"
                            placeholder="Search packages…"
                            value={packageSearch}
                            onChange={(e) => setPackageSearch(e.target.value)}
                          />
                        </div>
                        <div
                          className="flex-1 border border-dashed border-border rounded-xl overflow-hidden flex flex-col"
                        >
                          <div className="overflow-y-auto flex-1">
                            {AVAILABLE_PACKAGES.filter((p) =>
                              !packageSearch ||
                              p.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
                              p.description.toLowerCase().includes(packageSearch.toLowerCase())
                            ).map((pkg, i, arr) => {
                              const checked = selectedPackages.includes(pkg.name)
                              return (
                                <div
                                  key={pkg.name}
                                  onClick={() => setSelectedPackages((prev) =>
                                    checked ? prev.filter((p) => p !== pkg.name) : [...prev, pkg.name]
                                  )}
                                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${checked ? 'bg-muted/60' : 'hover:bg-muted/30'} ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={() => setSelectedPackages((prev) => checked ? prev.filter((p) => p !== pkg.name) : [...prev, pkg.name])}
                                    onClick={(e) => e.stopPropagation()}
                                    className="shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold font-mono">{pkg.name}</p>
                                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right: selected packages */}
                      <div className="flex flex-col border border-border rounded-xl overflow-hidden h-full basis-[calc(40%-16px)] grow-0 shrink-0">
                        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
                          <span className="type-overline text-muted-foreground">Selected</span>
                          {selectedPackages.length > 0 && (
                            <span className="text-xs text-muted-foreground">{selectedPackages.length} package{selectedPackages.length !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                        {selectedPackages.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
                            <Archive className="size-6 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No packages selected</p>
                          </div>
                        ) : (
                          <div className="overflow-y-auto flex-1">
                            {selectedPackages.map((pkg, i) => {
                              const meta = AVAILABLE_PACKAGES.find((p) => p.name === pkg)
                              return (
                                <div key={pkg} className={`flex items-center gap-3 pl-4 pr-2 py-3 ${i < selectedPackages.length - 1 ? 'border-b border-border' : ''}`}>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold font-mono">{pkg}</p>
                                    {meta?.description && <p className="text-xs text-muted-foreground">{meta.description}</p>}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => setSelectedPackages((prev) => prev.filter((p) => p !== pkg))}
                                    className="text-muted-foreground hover:text-destructive shrink-0"
                                  >
                                    <X className="size-3.5" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* OCI artifacts card */}
            <div className="border border-border rounded-xl overflow-hidden mb-3">
              <button
                onClick={() => toggleSection('oci')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer hover:bg-muted/30"
              >
                <Shield className="size-4 text-muted-foreground shrink-0" />
                <span className="type-label flex-1 text-left">OCI artifacts</span>
                {selectedArtifacts.length > 0 && (
                  <Tag className="type-badge border-primary text-primary bg-transparent">{selectedArtifacts.length}</Tag>
                )}
                <ChevronRight className={`size-4 text-muted-foreground transition-transform ${step2ExpandedSections.has('oci') ? 'rotate-90' : ''}`} />
              </button>
              <Collapsible open={step2ExpandedSections.has('oci')}>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-3">
                    <div className="flex gap-4 h-[352px]">
                      {/* Left: search + tree */}
                      <div className="flex flex-col gap-3 h-full basis-[60%] grow-0 shrink-0">
                        <div className="relative shrink-0">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                          <Input
                            className="pl-8"
                            placeholder="Search OCI images…"
                            value={ociSearch}
                            onChange={(e) => setOciSearch(e.target.value)}
                          />
                        </div>
                        <div className="flex-1 border border-dashed border-border rounded-xl overflow-y-auto">
                          {(() => {
                            const isSearching = ociSearch.length > 0
                            const filtered = AVAILABLE_OCI_IMAGES.filter((img) =>
                              !isSearching ||
                              img.name.toLowerCase().includes(ociSearch.toLowerCase()) ||
                              img.tags.some((t) => t.toLowerCase().includes(ociSearch.toLowerCase()))
                            )
                            if (filtered.length === 0) {
                              return (
                                <div className="flex flex-col items-center justify-center h-full type-body text-muted-foreground">
                                  No images match "{ociSearch}"
                                </div>
                              )
                            }
                            return filtered.map((img, gi) => {
                              const isExpanded = isSearching || expandedOciImages.has(img.name)
                              const selectedCount = img.tags.filter((t) => selectedArtifacts.some((a) => a.image === img.name && a.tag === t)).length
                              return (
                                <div key={img.name} className={gi > 0 ? 'border-t border-border' : ''}>
                                  <button
                                    onClick={() => {
                                      if (isSearching) return
                                      setExpandedOciImages((prev) => {
                                        const next = new Set(prev)
                                        if (next.has(img.name)) next.delete(img.name)
                                        else next.add(img.name)
                                        return next
                                      })
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-transparent border-none cursor-pointer hover:bg-muted/30 text-left"
                                  >
                                    <Shield className="size-4 text-primary shrink-0" />
                                    <span className="text-sm font-semibold font-mono flex-1">{img.name}</span>
                                    {selectedCount > 0 && (
                                      <Tag className="type-badge border-primary text-primary bg-transparent shrink-0">{selectedCount}</Tag>
                                    )}
                                    <span className="text-xs text-muted-foreground shrink-0">{img.tags.length} tag{img.tags.length !== 1 ? 's' : ''}</span>
                                    <ChevronRight className={`size-4 text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                                  </button>
                                  {isExpanded && img.tags.map((tag, ti) => {
                                    const checked = selectedArtifacts.some((a) => a.image === img.name && a.tag === tag)
                                    return (
                                      <div
                                        key={tag}
                                        onClick={() => {
                                          if (checked) removeArtifact(img.name, tag)
                                          else setSelectedArtifacts((prev) => [...prev, { image: img.name, tag }])
                                        }}
                                        className={`flex items-center gap-3 pl-9 pr-4 py-2.5 cursor-pointer border-t border-border ${checked ? 'bg-muted/60' : 'hover:bg-muted/30'}`}
                                      >
                                        <Checkbox
                                          checked={checked}
                                          onCheckedChange={() => {
                                            if (checked) removeArtifact(img.name, tag)
                                            else setSelectedArtifacts((prev) => [...prev, { image: img.name, tag }])
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="shrink-0"
                                        />
                                        <span className="text-sm font-medium font-mono flex-1">{tag}</span>
                                        <span className="text-xs text-muted-foreground shrink-0">tag {ti + 1}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              )
                            })
                          })()}
                        </div>
                      </div>

                      {/* Right: selected artifacts */}
                      <div className="flex flex-col border border-border rounded-xl overflow-hidden h-full basis-[calc(40%-16px)] grow-0 shrink-0">
                        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
                          <span className="type-overline text-muted-foreground">Selected</span>
                          {selectedArtifacts.length > 0 && (
                            <span className="text-xs text-muted-foreground">{selectedArtifacts.length} tag{selectedArtifacts.length !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                        {selectedArtifacts.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
                            <Shield className="size-6 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No artifacts selected</p>
                          </div>
                        ) : (
                          <div className="overflow-y-auto flex-1">
                            {Array.from(
                              selectedArtifacts.reduce((map, a) => {
                                if (!map.has(a.image)) map.set(a.image, [])
                                map.get(a.image)!.push(a.tag)
                                return map
                              }, new Map<string, string[]>())
                            ).map(([image, tags]) => (
                              <div key={image}>
                                <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border">
                                  <Shield className="size-3.5 text-primary shrink-0" />
                                  <span className="text-xs font-bold font-mono flex-1">{image}</span>
                                  <span className="text-xs text-muted-foreground">{tags.length} tag{tags.length !== 1 ? 's' : ''}</span>
                                </div>
                                {tags.map((tag) => {
                                  const key = `${image}:${tag}`
                                  const isExpanded = expandedArtifacts.has(key)
                                  return (
                                    <div key={tag} className="border-b border-border">
                                      <div className="flex items-center gap-2 pl-6 pr-2 py-2">
                                        <Button
                                          variant="ghost"
                                          size="icon-xs"
                                          onClick={() => toggleArtifactExpand(key)}
                                          className="text-muted-foreground"
                                        >
                                          <ChevronRight className={`size-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </Button>
                                        <span className="text-xs font-mono flex-1">{tag}</span>
                                        <Button
                                          variant="ghost"
                                          size="icon-xs"
                                          onClick={() => removeArtifact(image, tag)}
                                          className="text-muted-foreground hover:text-destructive"
                                        >
                                          <X className="size-3" />
                                        </Button>
                                      </div>
                                      {isExpanded && (
                                        <div className="pl-8 pr-4 pb-3 pt-1 flex flex-col gap-3 bg-muted/30">
                                          <div>
                                            <p className="type-caption mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Include paths</p>
                                            <Input size={undefined} className="h-7 text-xs" placeholder="/path/to/include" />
                                          </div>
                                          <div>
                                            <p className="type-caption mb-1" style={{ fontVariationSettings: "'wght' 520" }}>Exclude paths</p>
                                            <Input size={undefined} className="h-7 text-xs" placeholder="/path/to/exclude" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Scripts card */}
            <div className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection('scripts')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer hover:bg-muted/30"
              >
                <span className="text-sm font-mono text-muted-foreground shrink-0">{'>'}_</span>
                <span className="type-label flex-1 text-left">Scripts</span>
                {scripts.length > 0 && (
                  <Tag className="type-badge border-primary text-primary bg-transparent">{scripts.length}</Tag>
                )}
                <ChevronRight className={`size-4 text-muted-foreground transition-transform ${step2ExpandedSections.has('scripts') ? 'rotate-90' : ''}`} />
              </button>
              <Collapsible open={step2ExpandedSections.has('scripts')}>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
                    {scripts.length > 0 && (
                      <div className="border border-border rounded-xl overflow-hidden">
                        {scripts.map((s, i) => (
                          <div key={s} className={`flex items-center gap-3 px-4 py-3 ${i < scripts.length - 1 ? 'border-b border-border' : ''}`}>
                            <span className="text-sm font-mono flex-1">{s}</span>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => setScripts((prev) => prev.filter((x) => x !== s))}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Input
                          list="script-options"
                          value={pendingScript}
                          onChange={(e) => setPendingScript(e.target.value)}
                          placeholder="Add a script path"
                        />
                        <datalist id="script-options">
                          {SCRIPT_OPTIONS.filter((s) => !scripts.includes(s)).map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pendingScript}
                        onClick={() => {
                          if (pendingScript && !scripts.includes(pendingScript)) {
                            setScripts((prev) => [...prev, pendingScript])
                          }
                          setPendingScript('')
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        )}

        {/* ── Step 3: Configure settings ── */}
        {step === 2 && (
          <div>
            <p className="type-heading mb-1">Configure image settings</p>
            <p className="text-sm text-muted-foreground mb-6">
              Define labels, annotations, and environment variables for your selected images.
            </p>

            <div className="flex flex-col gap-4">
              {WIZARD_SETTINGS.map((setting) => {
                const isEnabled = enabledSettings.has(setting.label)
                const rows = settingRows[setting.label] ?? []
                return (
                  <div key={setting.label} className="border border-border rounded-xl overflow-hidden">
                    {/* Section header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                      <span className="type-label flex-1">{setting.label}</span>
                      <Switch
                        size="sm"
                        checked={isEnabled}
                        onCheckedChange={(checked) => {
                          if (checked) setPendingSetting(setting.label)
                          else setEnabledSettings((prev) => {
                            const next = new Set(prev)
                            next.delete(setting.label)
                            return next
                          })
                        }}
                        aria-label={`Enable ${setting.label}`}
                      />
                    </div>
                    {/* Key/value rows */}
                    <div className={`p-4 flex flex-col gap-2 ${!isEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                      {rows.map((row, ri) => (
                        <div key={ri} className="flex items-center gap-2">
                          <Input
                            placeholder="Key"
                            value={row.key}
                            disabled={!isEnabled}
                            onChange={(e) => setSettingRows((prev) => ({
                              ...prev,
                              [setting.label]: prev[setting.label].map((r, i) =>
                                i === ri ? { ...r, key: e.target.value } : r
                              ),
                            }))}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value"
                            value={row.value}
                            disabled={!isEnabled}
                            onChange={(e) => setSettingRows((prev) => ({
                              ...prev,
                              [setting.label]: prev[setting.label].map((r, i) =>
                                i === ri ? { ...r, value: e.target.value } : r
                              ),
                            }))}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            disabled={!isEnabled}
                            onClick={() => setSettingRows((prev) => ({
                              ...prev,
                              [setting.label]: prev[setting.label].filter((_, i) => i !== ri),
                            }))}
                            className="text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                      <button
                        disabled={!isEnabled}
                        onClick={() => setSettingRows((prev) => ({
                          ...prev,
                          [setting.label]: [...prev[setting.label], { key: '', value: '' }],
                        }))}
                        className="text-sm text-primary hover:underline bg-transparent border-none cursor-pointer self-start mt-1 disabled:pointer-events-none disabled:opacity-40"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Warning dialog */}
            <Dialog open={Boolean(pendingSetting)} onOpenChange={(o) => { if (!o) setPendingSetting(null) }}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Enable {pendingSetting}?</DialogTitle>
                  <DialogDescription>
                    This will affect all {addedImages.length} image{addedImages.length !== 1 ? 's' : ''} in this customization
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-muted-foreground flex flex-col gap-3">
                  <p>
                    The value you set will be applied identically to every image in this customization.
                    If a base image already defines <strong>{pendingSetting}</strong>, it will be overridden —
                    which may cause unexpected behaviour in images that depend on that value.
                  </p>
                  <p>
                    To set different values per image, save this customization and create separate
                    customizations for the affected images.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPendingSetting(null)}>Cancel</Button>
                  <Button
                    onClick={() => {
                      setEnabledSettings((prev) => new Set([...prev, pendingSetting!]))
                      setPendingSetting(null)
                    }}
                  >
                    Enable anyway
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* ── Step 4: Review ── */}
        {step === 3 && (
          <div>
            <p className="type-heading mb-1">Review configuration</p>
            <p className="text-sm text-muted-foreground mb-6">Review your selections before saving.</p>

            <div className="border border-border rounded-2xl overflow-hidden">
              {/* Base image */}
              <div className="px-5 py-2.5 flex items-center gap-3 bg-muted/40 border-b border-border">
                <BaseImages className="size-4 text-muted-foreground shrink-0" />
                <p className="type-label flex-1">Base image</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-xs" onClick={() => setStep(0)} className="text-muted-foreground">
                      <EditIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit base image</TooltipContent>
                </Tooltip>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {addedImages.map((img) => (
                  <div key={img.id} className="flex items-center gap-3">
                    <span className="type-body font-semibold font-mono min-w-20">{img.name}</span>
                    <span className="text-sm text-muted-foreground flex-1">{img.version}</span>
                    <Tag>{img.os}</Tag>
                    <div className="flex gap-1">
                      {img.compliance.map((c) => <Tag key={c} className="type-badge">{c}</Tag>)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Packages & artifacts */}
              <div className="px-5 py-2.5 flex items-center gap-3 bg-muted/40 border-b border-border">
                <Archive className="size-4 text-muted-foreground shrink-0" />
                <p className="type-label flex-1">Packages & artifacts</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-xs" onClick={() => setStep(1)} className="text-muted-foreground">
                      <EditIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit packages</TooltipContent>
                </Tooltip>
              </div>
              <div className="px-5 py-4 flex flex-col gap-4">
                {[
                  { label: 'Packages', items: selectedPackages, mono: true },
                  { label: 'OCI artifacts', items: selectedArtifacts.map((a) => `${a.image}:${a.tag}`), mono: true },
                  { label: 'Scripts', items: scripts, mono: true },
                ].map(({ label, items, mono }) => (
                  <div key={label} className="flex items-start gap-6">
                    <p className="type-body text-muted-foreground shrink-0 pt-0.5" style={{ minWidth: 100, fontVariationSettings: "'wght' 520" }}>{label}</p>
                    {items.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <Tag key={item} className={mono ? 'font-mono text-xs' : ''}>{item}</Tag>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">None added</p>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Settings */}
              <div className="px-5 py-2.5 flex items-center gap-3 bg-muted/40 border-b border-border">
                <SettingsIcon className="size-4 text-muted-foreground shrink-0" />
                <p className="type-label flex-1">Settings</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-xs" onClick={() => setStep(2)} className="text-muted-foreground">
                      <EditIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit settings</TooltipContent>
                </Tooltip>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {WIZARD_SETTINGS.map((setting) => (
                  <div key={setting.label} className="flex items-center gap-6">
                    <p className="type-body text-muted-foreground" style={{ minWidth: 120, fontVariationSettings: "'wght' 520" }}>{setting.label}</p>
                    <p className="text-sm text-muted-foreground italic">Inherit from base image{addedImages.length !== 1 ? 's' : ''}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── Step 5: Preview ── */}
        {step === 4 && (
          <div>
            <p className="type-heading mb-1">Build preview</p>
            <p className="type-body text-muted-foreground mb-4">
              See how your customizations will resolve before committing to a build. No changes are made.
            </p>

            {previewMode === 'env' ? (
              <EnvironmentPreview active={step === 4} scenario={previewScenario} />
            ) : (
              <ImageConfigPreview active={step === 4} scenario={previewScenario} />
            )}
          </div>
        )}

      </div>

      {/* Button bar */}
      <Separator className="mt-8 -mx-5" />
      <div className="flex items-center gap-3 pt-6">
        {/* Back button on the left (where Cancel used to be) */}
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Back</Button>
        ) : (
          <div />
        )}
        <div className="flex-1" />

        {/* Steps 0-2: Next */}
        {step < 3 && (
          <Button
            disabled={step === 0 && selectedIds.size === 0}
            onClick={() => setStep((s) => s + 1)}
          >
            {WIZARD_NEXT_LABELS[step]}
          </Button>
        )}

        {/* Step 3 (Review): Build customization (text link) + Preview build (primary) */}
        {step === 3 && (
          <>
            <Button variant="link" className="text-muted-foreground hover:text-foreground" onClick={onSave}>{isEdit ? 'Save changes' : 'Build customization'}</Button>
            <Button onClick={() => setStep(4)}>Preview build</Button>
          </>
        )}

        {/* Step 4 (Preview): Build customization */}
        {step === 4 && (
          <Button onClick={onSave}>{isEdit ? 'Save changes' : 'Build customization'}</Button>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type View = 'list' | 'edit' | 'detail' | 'child-build' | 'build-logs'

export default function BulkCustomizationsV2() {
  const [isDark, setIsDark] = useState(true)

  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev
      if (next) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      return next
    })
  }

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['ca-certs', 'payments-team']))
  const [rows, setRows] = useState<CustomizationRow[]>(ROWS)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; title: string; body: string; ids: string[] }>({
    open: false, title: '', body: '', ids: [],
  })
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'info' | 'success' }>({
    open: false, message: '', severity: 'info',
  })
  const [view, setView] = useState<View>('list')
  const [manageTab, setManageTab] = useState('0')
  const [editingName, setEditingName] = useState<string | null>(null)
  const [editingRow, setEditingRow] = useState<CustomizationRow | undefined>(undefined)
  const [preselectedImage, setPreselectedImage] = useState<string | undefined>(undefined)
  const [detailRow, setDetailRow] = useState<CustomizationRow | null>(null)
  const [childBuildRow, setChildBuildRow] = useState<CustomizationRow | null>(null)
  const [buildLogContext, setBuildLogContext] = useState<BuildLogContext | null>(null)
  const [prevView, setPrevView] = useState<View>('list')
  const [searchValue, setSearchValue] = useState('')
  const [mirroredSearch, setMirroredSearch] = useState('')
  const [previewScenario, setPreviewScenario] = useState<Scenario>('clean')
  const [previewMode, setPreviewMode] = useState<'env' | 'config'>('config')
  const [wizardStep, setWizardStep] = useState(0)

  useEffect(() => {
    if (toast.open) {
      const t = setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 3000)
      return () => clearTimeout(t)
    }
  }, [toast.open])

  const openEdit = (name: string | null, image?: string, row?: CustomizationRow) => {
    setEditingName(name); setPreselectedImage(image); setEditingRow(row); setView('edit')
  }
  const openDetail = (row: CustomizationRow) => { setDetailRow(row); setView('detail') }
  const openChildBuild = (row: CustomizationRow) => { setChildBuildRow(row); setView('child-build') }
  const openBuildLogs = (context: BuildLogContext, from: View) => {
    setBuildLogContext(context); setPrevView(from); setView('build-logs')
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
      openEdit(row?.name ?? null, undefined, row)
      return
    }
    if (action === 'clone') {
      const row = rows.find((r) => r.id === rowId)
      if (!row) return
      const newParentId = `${row.id}-clone`
      const childRows = rows.filter((r) => row.childIds?.includes(r.id))
      const newChildIds = childRows.map((c) => `${c.id}-clone`)
      const clonedParent: CustomizationRow = { ...row, id: newParentId, name: `${row.name}-clone`, childIds: newChildIds }
      const clonedChildren = childRows.map((c) => ({
        ...c, id: `${c.id}-clone`, name: `${c.name}-clone`,
        parentId: newParentId, parentName: `${row.name}-clone`,
      }))
      setRows((prev) => [...prev, clonedParent, ...clonedChildren])
      setToast({ open: true, message: `Cloned "${row.name}" and ${clonedChildren.length} child customization${clonedChildren.length !== 1 ? 's' : ''}.`, severity: 'success' })
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
    setToast({ open: true, message: ids.length === 1 ? 'Customization deleted.' : `${ids.length} customizations deleted.`, severity: 'success' })
  }

  const visibleRows = rows.filter((row) => {
    if (row.type === 'child' && !expandedRows.has(row.parentId!)) return false
    if (searchValue) return row.name.toLowerCase().includes(searchValue.toLowerCase())
    return true
  })

  const filteredMirrored = mirroredSearch
    ? MIRRORED_IMAGES.filter((img) => img.name.toLowerCase().includes(mirroredSearch.toLowerCase()))
    : MIRRORED_IMAGES

  return (
    <Fragment>
      <PrototypeHeader version="Version 2" status="Current" rationale={DECISIONS_V2}>
        {view === 'edit' && wizardStep === 4 && (
          <div className="flex items-center gap-3">
            {/* Preview mode switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border">
              {([['env', 'Env only'], ['config', 'Full config']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPreviewMode(key)}
                  className={`px-2.5 py-1 rounded-md type-caption cursor-pointer border-none transition-colors ${
                    previewMode === key
                      ? 'bg-background text-foreground shadow-sm'
                      : 'bg-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  style={{ fontVariationSettings: previewMode === key ? "'wght' 520" : "'wght' 420" }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Scenario switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-primary/10 border border-primary/20">
              {(Object.keys(SCENARIO_LABELS) as Scenario[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setPreviewScenario(key)}
                  className={`px-2.5 py-1 rounded-md type-caption cursor-pointer border-none transition-colors ${
                    previewScenario === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent text-primary/70 hover:text-primary'
                  }`}
                  style={{ fontVariationSettings: previewScenario === key ? "'wght' 520" : "'wght' 420" }}
                >
                  {SCENARIO_LABELS[key]}
                </button>
              ))}
            </div>
          </div>
        )}
      </PrototypeHeader>
      <div className="min-h-screen flex justify-center p-12 bg-muted/40">
        <div className="w-[1440px] rounded-2xl overflow-hidden flex flex-col bg-background shadow-[0_4px_40px_rgba(0,0,0,0.25)]">
          <TopNav isDark={isDark} onToggleTheme={toggleTheme} />

          <div className="flex flex-1">
            <SidebarNav />

            <main className="flex-1 min-w-0 pt-7 pr-6 pb-16 pl-5 overflow-y-auto">

              {/* ── LIST ── */}
              {view === 'list' && (
                <>
                  <div className="mb-6">
                    <h1 className="type-display">Manage Hardened Images</h1>
                    <p className="type-body text-muted-foreground mt-1">DHI Enterprise</p>
                  </div>

                  {/* Quota / ELS */}
                  <div className="border border-border rounded p-4 flex items-stretch gap-0 mb-8">
                    {[
                      { label: 'Hardened images', used: 12, total: 20 },
                      { label: 'Customizations', used: 8, total: 15 },
                    ].map((item) => (
                      <div key={item.label} className="flex-1 pr-8 mr-8 border-r border-border flex flex-col">
                        <span className="type-overline text-muted-foreground block mb-1">{item.label}</span>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-2xl" style={{ fontVariationSettings: "'wght' 680" }}>{item.used}</span>
                          <span className="text-sm text-muted-foreground">of {item.total}</span>
                        </div>
                        <div className="mt-auto h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.used / item.total) * 100}%`,
                              background: item.used / item.total >= 0.9 ? 'var(--color-warning)' : 'var(--color-primary)',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex-[2]">
                      <span className="type-overline text-muted-foreground block mb-1">ELS images</span>
                      <p className="type-label mb-1">Not on your plan</p>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                        Extended lifecycle support keeps images patched beyond their upstream EOL.
                      </p>
                      <a href="#" className="text-xs text-primary hover:underline">Contact sales to upgrade</a>
                    </div>
                  </div>

                  <Tabs value={manageTab} onValueChange={setManageTab}>
                    <TabsList variant="line">
                      <TabsTrigger value="0">Mirrored Images</TabsTrigger>
                      <TabsTrigger value="1">Mirrored Helm charts</TabsTrigger>
                      <TabsTrigger value="2">Customizations</TabsTrigger>
                    </TabsList>

                    {/* Mirrored Images tab */}
                    <TabsContent value="0">
                      <div className="flex items-center gap-4 mb-8 mt-4">
                        <div className="relative w-[244px]">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                          <Input
                            className="pl-8"
                            placeholder="Search"
                            value={mirroredSearch}
                            onChange={(e) => setMirroredSearch(e.target.value)}
                          />
                        </div>
                        <div className="flex-1" />
                        <Button onClick={() => openEdit(null)}>Customize image</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Customized</TableHead>
                            <TableHead>Compliance</TableHead>
                            <TableHead className="w-14" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMirrored.map((img) => (
                            <TableRow key={img.id}>
                              <TableCell><p className="type-body" style={{ fontVariationSettings: "'wght' 520" }}>{img.name}</p></TableCell>
                              <TableCell>
                                <p className={`text-sm ${img.customizations === 0 ? 'text-muted-foreground' : ''}`}>
                                  {img.customizations === 0 ? 'No' : `${img.customizations} customization${img.customizations !== 1 ? 's' : ''}`}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-muted-foreground">{img.compliance.join(', ')}</p>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm">
                                      <MoreVertical className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEdit(null, img.imageName)}>Customize</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Stop mirroring</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>

                    {/* Helm charts tab */}
                    <TabsContent value="1">
                      <div className="py-12 text-center type-body text-muted-foreground">No Helm charts configured.</div>
                    </TabsContent>

                    {/* Customizations tab */}
                    <TabsContent value="2">
                      <div className="flex items-center gap-4 mb-8 mt-4">
                        <div className="relative w-[244px]">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                          <Input
                            className="pl-8"
                            placeholder="Search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                        </div>
                        <div className="flex-1" />
                        <Button onClick={() => openEdit(null)}>New customization</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[22%]">Name</TableHead>
                            <TableHead className="w-[44%]">Image/Chart</TableHead>
                            <TableHead className="w-[11%]">OS</TableHead>
                            <TableHead className="w-[22%]">Created by</TableHead>
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
                                  <div className={`flex items-center gap-2 relative ${isChild ? 'pl-12' : ''}`}>
                                    {isChild && <TreeConnector continues={!isLastChild} />}
                                    {isParent && (
                                      <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => toggleExpanded(row.id)}
                                        aria-label={isExpanded ? `Collapse ${row.name}` : `Expand ${row.name}`}
                                      >
                                        {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                      </Button>
                                    )}
                                    <button
                                      className="text-sm text-primary hover:underline cursor-pointer bg-transparent border-none"
                                      onClick={() => isChild ? openChildBuild(row) : openDetail(row)}
                                    >
                                      {row.name}
                                    </button>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  {!isChild && (
                                    <div>
                                      <p className="text-sm">{row.imageLabel}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {row.images.map((img, i) => (
                                          <span key={img.name}>
                                            {i > 0 && ', '}
                                            {img.linked ? (
                                              <a href="#" className="text-primary hover:underline">{img.name}</a>
                                            ) : img.name}
                                          </span>
                                        ))}
                                      </p>
                                    </div>
                                  )}
                                </TableCell>

                                <TableCell>{row.os && <Tag>{row.os}</Tag>}</TableCell>

                                <TableCell>
                                  <p className="text-sm text-muted-foreground">{row.createdBy}</p>
                                </TableCell>

                                <TableCell className="text-right">
                                  {isChild ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon-sm"
                                          aria-label={`Clone ${row.name}`}
                                          onClick={() => {
                                            const standalone: CustomizationRow = {
                                              ...row, id: `${row.id}-clone`, name: `${row.name}-clone`,
                                              type: 'standalone', parentId: undefined, parentName: undefined,
                                              images: [{ name: row.name, linked: true }], imageLabel: '1 image',
                                            }
                                            setRows((prev) => [...prev, standalone])
                                            setToast({ open: true, message: `Cloned "${row.name}" as a standalone customization.`, severity: 'success' })
                                          }}
                                          className="text-muted-foreground hover:text-primary"
                                        >
                                          <Copy className="size-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Clone</TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.name}`}>
                                          <MoreVertical className="size-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleMenuAction('edit', row.id)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleMenuAction('customize', row.id)}>Customize</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleMenuAction('clone', row.id)}>Clone</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => handleMenuAction('delete', row.id)}>Delete</DropdownMenuItem>
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
              {view === 'edit' && (
                <EditWizard
                  onBack={() => { setView('list'); setWizardStep(0) }}
                  onSave={() => {
                    setView('list')
                    setWizardStep(0)
                    setToast({ open: true, message: 'Customization saved.', severity: 'success' })
                  }}
                  name={editingName}
                  preselectedImage={preselectedImage}
                  editingRow={editingRow}
                  previewScenario={previewScenario}
                  previewMode={previewMode}
                  onStepChange={setWizardStep}
                />
              )}

              {/* ── DETAIL ── */}
              {view === 'detail' && detailRow && (
                <CustomizationDetail
                  row={detailRow}
                  onBack={() => setView('list')}
                  onEdit={() => openEdit(detailRow.name, undefined, detailRow)}
                  onViewLogs={(ctx) => openBuildLogs(ctx, 'detail')}
                />
              )}

              {/* ── CHILD BUILD ── */}
              {view === 'child-build' && childBuildRow && (
                <BuildLogsPage
                  context={{ imageName: childBuildRow.name, baseImage: DEFINITION_MOCK.baseImage, parentName: childBuildRow.parentName }}
                  onBack={() => setView('list')}
                  onBackToParentDetail={() => {
                    const parent = rows.find((r) => r.id === childBuildRow.parentId)
                    if (parent) openDetail(parent)
                    else setView('list')
                  }}
                  onBackToList={() => setView('list')}
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

          <footer className="px-10 py-3 flex items-center border-t border-border shrink-0 bg-muted/30">
            <div className="flex gap-6 items-center">
              <p className="text-sm text-muted-foreground">© 2026 Docker Inc. All rights reserved.</p>
              {['Terms of Service', 'Subscription Service Agreement', 'Cookie Settings', 'Privacy', 'Legal'].map((l) => (
                <a key={l} href="#" className="text-sm text-muted-foreground hover:underline">{l}</a>
              ))}
            </div>
          </footer>
        </div>

        <DeleteDialog
          open={deleteDialog.open}
          title={deleteDialog.title}
          body={deleteDialog.body}
          onCancel={() => setDeleteDialog({ open: false, title: '', body: '', ids: [] })}
          onConfirm={confirmDelete}
        />

        {/* Toast */}
        {toast.open && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-foreground text-background shadow-xl type-body">
            {toast.message}
            <button
              className="opacity-60 hover:opacity-100 bg-transparent border-none cursor-pointer text-background"
              onClick={() => setToast((t) => ({ ...t, open: false }))}
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>
    </Fragment>
  )
}
