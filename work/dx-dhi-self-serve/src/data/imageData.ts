// ── Images tab data ──────────────────────────────────────────────────────────

export interface ImageVersion {
  id: string;
  name: string;
  distro: string;
  distroColor: string;
  tags: string;
  type: string;
  compliance: string;
  packageManager: boolean;
  shell: boolean;
  user: string;
  lastPushed: string;
  vulns: { c: number; h: number; m: number; l: number; u: number };
  // version detail fields
  size: string;
  support: 'Active' | 'Approaching EOL' | 'EOL';
  indexDigest: string;
  manifestDigest: string;
  packages: PackageRow[];
}

export interface PackageRow {
  name: string;
  namespace: string;
  type: string;
  version: string;
  license: string;
}

const DART_PACKAGES: PackageRow[] = [
  { name: 'acl', namespace: 'debian', type: 'deb', version: '2.3.2-2', license: 'GPL-2.0-only, GPL-2.0-or-later, LGPL-2.0-or-later, LGPL-2.1-only' },
  { name: 'apt', namespace: 'debian', type: 'deb', version: '3.0.3', license: 'BSD-3-Clause, GPL-2.0-only, GPL-2.0-or-later, curl' },
  { name: 'attr', namespace: 'debian', type: 'deb', version: '1:2.5.2-3', license: 'GPL-2.0-only, GPL-2.0-or-later, LGPL-2.0-or-later, LGPL-2.1-only' },
  { name: 'audit', namespace: 'debian', type: 'deb', version: '1:4.0.2-2', license: 'GPL-1.0-only, GPL-2.0-only, LGPL-2.1-only' },
  { name: 'base-files', namespace: 'debian', type: 'deb', version: '13.8+deb13u5', license: 'GPL-2.0-or-later' },
  { name: 'base-passwd', namespace: 'debian', type: 'deb', version: '3.6.7', license: 'GPL-2.0-only' },
  { name: 'bash', namespace: 'debian', type: 'deb', version: '5.2.37-2+b9', license: 'BSD-4-Clause-UC, GFDL-1.3-only, GPL-2.0-only, GPL-3.0-only, Latex2e' },
  { name: 'bzip2', namespace: 'debian', type: 'deb', version: '1.0.8-6', license: 'GPL-2.0-only' },
  { name: 'ca-certificates', namespace: 'debian', type: 'deb', version: '20250419', license: 'GPL-2.0-only, GPL-2.0-or-later, MPL-2.0' },
  { name: 'cdebconf', namespace: 'debian', type: 'deb', version: '0.280', license: 'BSD-2-Clause, GPL-2.0-only, GPL-2.0-or-later' },
  { name: 'coreutils', namespace: 'debian', type: 'deb', version: '9.7-3', license: 'BSD-4-Clause-UC, FSFULLR, GFDL-1.3-only, GPL-3.0-only, ISC' },
  { name: 'dart', namespace: '', type: 'dhi', version: '3.12.0', license: 'BSD-3-Clause' },
  { name: 'dart', namespace: 'dhi', type: 'docker', version: '3.12.0-debian13-dev', license: '-' },
  { name: 'db5.3', namespace: 'debian', type: 'deb', version: '5.3.28+dfsg-9', license: 'BSD-3-Clause, GPL-3.0-only, MS-PL, Sleepycat, X11, Zlib' },
  { name: 'debconf', namespace: 'debian', type: 'deb', version: '1.5.87', license: 'BSD-2-Clause' },
  { name: 'debian-archive-keyring', namespace: 'debian', type: 'deb', version: '2023.4', license: 'GPL-2.0-only' },
  { name: 'debianutils', namespace: 'debian', type: 'deb', version: '5.21', license: 'GPL-2.0-only, SMAIL' },
  { name: 'diffutils', namespace: 'debian', type: 'deb', version: '1:3.10-1', license: 'GFDL-1.3-only, GPL-3.0-only' },
  { name: 'dpkg', namespace: 'debian', type: 'deb', version: '1.22.18', license: 'BSD-2-Clause, GPL-2.0-only, GPL-2.0-or-later' },
  { name: 'e2fsprogs', namespace: 'debian', type: 'deb', version: '1.47.2-1', license: 'GPL-2.0-only, LGPL-2.0-only, MIT' },
];

export const IMAGE_VERSIONS_DATA: ImageVersion[] = [
  {
    id: 'dart-3x-dev-debian13',
    name: 'Dart 3.x (dev)',
    distro: 'Debian 13',
    distroColor: '#1d63ed',
    tags: '3-debian13-dev, 3-dev, 3.12-debian13-dev, 3.12-dev, 3.12.0-debian13-dev, 3.12.0-d...',
    type: 'Active support',
    compliance: 'CIS',
    packageManager: true,
    shell: true,
    user: 'root',
    lastPushed: '2 days ago',
    vulns: { c: 0, h: 0, m: 0, l: 0, u: 0 },
    size: '209.10 MB',
    support: 'Active',
    indexDigest: 'sha256:98fde8566cb...',
    manifestDigest: 'sha256:73e681f877c...',
    packages: DART_PACKAGES,
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
    size: '196.40 MB',
    support: 'Active',
    indexDigest: 'sha256:a1b2c3d4e5f6...',
    manifestDigest: 'sha256:f6e5d4c3b2a1...',
    packages: DART_PACKAGES,
  },
  {
    id: 'dart-3x-dev-alpine322',
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
    size: '114.20 MB',
    support: 'Active',
    indexDigest: 'sha256:c3d4e5f6a1b2...',
    manifestDigest: 'sha256:b2a1f6e5d4c3...',
    packages: DART_PACKAGES,
  },
  {
    id: 'dart-3x-alpine322',
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
    size: '98.60 MB',
    support: 'Active',
    indexDigest: 'sha256:e5f6a1b2c3d4...',
    manifestDigest: 'sha256:d4c3b2a1f6e5...',
    packages: DART_PACKAGES,
  },
];

// Image CVE/size comparison data
export const IMAGE_DATA: Record<string, {
  enterprise: { cves: { c: number; h: number; m: number; l: number }; pkgs: number; size: string };
  community: { cves: { c: number; h: number; m: number; l: number }; pkgs: number; size: string };
}> = {
  'node:20-bookworm': {
    enterprise: { cves: { c: 0, h: 0, m: 1, l: 1 }, pkgs: 89, size: '952 MB' },
    community:  { cves: { c: 7, h: 18, m: 34, l: 0 }, pkgs: 562, size: '1.1 GB' },
  },
  'node:20-alpine': {
    enterprise: { cves: { c: 0, h: 0, m: 0, l: 0 }, pkgs: 27, size: '114 MB' },
    community:  { cves: { c: 2, h: 6, m: 9, l: 0 }, pkgs: 48, size: '133 MB' },
  },
  'node:18-bookworm-fips': {
    enterprise: { cves: { c: 0, h: 0, m: 0, l: 0 }, pkgs: 107, size: '881 MB' },
    community:  { cves: { c: 14, h: 31, m: 47, l: 0 }, pkgs: 533, size: '1.0 GB' },
  },
  'node:18-alpine': {
    enterprise: { cves: { c: 0, h: 0, m: 0, l: 0 }, pkgs: 35, size: '114 MB' },
    community:  { cves: { c: 1, h: 4, m: 7, l: 0 }, pkgs: 48, size: '133 MB' },
  },
  'node:20-bookworm-slim': {
    enterprise: { cves: { c: 0, h: 0, m: 0, l: 1 }, pkgs: 71, size: '211 MB' },
    community:  { cves: { c: 3, h: 8, m: 15, l: 0 }, pkgs: 128, size: '245 MB' },
  },
};

export const IMAGE_VERSIONS = Object.keys(IMAGE_DATA);

// Mirrored repos for entitled users
export const MIRRORED_REPOS = [
  { name: 'projectsteam/dhi-nodejs', tag: '20-bookworm', pullCommand: 'docker pull registry.corp.io/projectsteam/dhi-nodejs:20-bookworm', lastPulled: '2 hours ago' },
  { name: 'projectsteam/dhi-nodejs', tag: '20-alpine', pullCommand: 'docker pull registry.corp.io/projectsteam/dhi-nodejs:20-alpine', lastPulled: '1 day ago' },
  { name: 'projectsteam/dhi-nodejs', tag: '18-bookworm-fips', pullCommand: 'docker pull registry.corp.io/projectsteam/dhi-nodejs:18-bookworm-fips', lastPulled: '3 days ago' },
];

export const ORG_USER = {
  org: 'projectsteam',
  plan: 'Docker Business',
  registry: 'registry.corp.io',
  entitlements: {
    total: 1000,
    used: 56,
  },
};

// Catalog data matching the production DHI catalog screenshot
export interface CatalogImage {
  name: string;
  type: 'HARDENED IMAGE' | 'HELM CHART';
  icon: string;
  iconBg: string;
  os?: string;
  architecture?: string;
  compliance?: string;
  dependencies?: string;
  toolsIncluded?: number;
}

export const RECENTLY_ADDED: { name: string; icon: string }[] = [
  { name: 'HTTP Echo', icon: '🔄' },
  { name: 'Dapr Sentry', icon: '⚡' },
  { name: 'Dapr Scheduler', icon: '⚡' },
  { name: 'Grafana Loki Helm chart', icon: '📊' },
  { name: 'Piraeus CSI NFS Server', icon: '💾' },
  { name: 'Dapr Placement Service', icon: '⚡' },
];

export const FEATURED_IMAGES: CatalogImage[] = [
  { name: 'Redis Helm Chart', type: 'HELM CHART', icon: '🔴', iconBg: '#DC2626', dependencies: 'Redis Exporter · Bash · Redis · kubectl' },
  { name: 'DHI Build', type: 'HARDENED IMAGE', icon: '🐳', iconBg: '#1D63ED', os: 'Alpine, Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS' },
  { name: 'Caddy', type: 'HARDENED IMAGE', icon: '🔒', iconBg: '#16A34A', os: 'Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS, FIPS, STIG' },
  { name: 'PyTorch', type: 'HARDENED IMAGE', icon: '🔥', iconBg: '#EA580C', os: 'Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS', toolsIncluded: 7 },
  { name: 'Dart', type: 'HARDENED IMAGE', icon: '🎯', iconBg: '#0EA5E9', os: 'Alpine, Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS' },
  { name: 'Traefik Helm chart', type: 'HELM CHART', icon: '🌐', iconBg: '#7C3AED', dependencies: 'Traefik' },
  { name: 'HAProxy Helm chart', type: 'HELM CHART', icon: '⚖️', iconBg: '#059669', dependencies: 'HAProxy' },
  { name: 'PHP', type: 'HARDENED IMAGE', icon: '🐘', iconBg: '#6366F1', os: 'Alpine, Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS, FIPS, STIG', toolsIncluded: 7 },
  { name: 'Tomcat', type: 'HARDENED IMAGE', icon: '🐱', iconBg: '#F59E0B', os: 'Alpine, Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS, FIPS, STIG' },
  { name: 'HAProxy', type: 'HARDENED IMAGE', icon: '⚖️', iconBg: '#059669', os: 'Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS, FIPS, STIG' },
  { name: 'Traefik', type: 'HARDENED IMAGE', icon: '🌐', iconBg: '#7C3AED', os: 'Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS, FIPS, STIG' },
  { name: 'Redis', type: 'HARDENED IMAGE', icon: '🔴', iconBg: '#DC2626', os: 'Debian', architecture: 'linux/amd64, linux/arm64', compliance: 'CIS, FIPS, STIG', toolsIncluded: 6 },
];

export const MONITORING_IMAGES: CatalogImage[] = [
  { name: 'Access Log Exporter', type: 'HARDENED IMAGE', icon: '📊', iconBg: '#0EA5E9' },
  { name: 'Prometheus Alertmanager', type: 'HARDENED IMAGE', icon: '🔔', iconBg: '#EA580C' },
  { name: 'Prometheus AlertManager Helm...', type: 'HELM CHART', icon: '🔔', iconBg: '#EA580C' },
  { name: 'Grafana Alloy', type: 'HARDENED IMAGE', icon: '📈', iconBg: '#F59E0B' },
];
