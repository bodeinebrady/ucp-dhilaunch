function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const ALL_IMAGES = [
  { name: 'Redis Helm Chart',                   type: 'HELM CHART',     icon: 'redis',      desc: 'Redis Exporter · Bash · Redis · kubectl' },
  { name: 'Caddy',                              type: 'HARDENED IMAGE', icon: 'caddy',      desc: 'Debian · linux/amd64, linux/arm64' },
  { name: 'PyTorch',                            type: 'HARDENED IMAGE', icon: 'pytorch',    desc: 'Debian · linux/amd64, linux/arm64', toolsIncluded: 7 },
  { name: 'Dart',                               type: 'HARDENED IMAGE', icon: 'dart',       desc: 'Alpine, Debian · linux/amd64, linux/arm64' },
  { name: 'Traefik Helm chart',                 type: 'HELM CHART',     icon: 'traefik',    desc: 'Traefik' },
  { name: 'HAProxy Helm chart',                 type: 'HELM CHART',     icon: 'haproxy',    desc: 'HAProxy' },
  { name: 'PHP',                                type: 'HARDENED IMAGE', icon: 'php',        desc: 'Alpine, Debian · linux/amd64, linux/arm64', toolsIncluded: 7 },
  { name: 'Tomcat',                             type: 'HARDENED IMAGE', icon: 'tomcat',     desc: 'Alpine, Debian · linux/amd64, linux/arm64' },
  { name: 'HAProxy',                            type: 'HARDENED IMAGE', icon: 'haproxy',    desc: 'Debian · linux/amd64, linux/arm64' },
  { name: 'Traefik',                            type: 'HARDENED IMAGE', icon: 'traefik',    desc: 'Debian · linux/amd64, linux/arm64' },
  { name: 'Redis',                              type: 'HARDENED IMAGE', icon: 'redis',      desc: 'Debian · linux/amd64, linux/arm64', toolsIncluded: 6 },
  { name: 'DHI Build',                          type: 'HARDENED IMAGE', icon: null,         desc: 'Alpine, Debian · linux/amd64, linux/arm64' },
  { name: 'Access Log Exporter',                type: 'HARDENED IMAGE', icon: null,         desc: 'Alpine · linux/amd64, linux/arm64' },
  { name: 'Prometheus Alertmanager',            type: 'HARDENED IMAGE', icon: 'prometheus', desc: 'Alpine · linux/amd64, linux/arm64' },
  { name: 'Prometheus AlertManager Helm chart', type: 'HELM CHART',     icon: 'prometheus', desc: 'Prometheus Alertmanager' },
  { name: 'Grafana Alloy',                      type: 'HARDENED IMAGE', icon: 'grafana',    desc: 'Alpine, Debian · linux/amd64, linux/arm64' },
]

export const CATALOG_BY_SLUG = Object.fromEntries(ALL_IMAGES.map(img => [toSlug(img.name), img]))

export const FEATURED_IMAGES = [
  { name: 'Redis Helm Chart',   type: 'HELM CHART',     icon: 'redis',      desc: 'Redis Exporter · Bash · Redis · kubectl' },
  { name: 'Caddy',              type: 'HARDENED IMAGE', icon: 'caddy',      desc: 'Debian · linux/amd64, linux/arm64' },
  { name: 'PyTorch',            type: 'HARDENED IMAGE', icon: 'pytorch',    desc: 'Debian · linux/amd64, linux/arm64', toolsIncluded: 7 },
  { name: 'Dart',               type: 'HARDENED IMAGE', icon: 'dart',       desc: 'Alpine, Debian · linux/amd64, linux/arm64' },
  { name: 'Traefik Helm chart', type: 'HELM CHART',     icon: 'traefik',    desc: 'Traefik' },
  { name: 'HAProxy Helm chart', type: 'HELM CHART',     icon: 'haproxy',    desc: 'HAProxy' },
  { name: 'PHP',                type: 'HARDENED IMAGE', icon: 'php',        desc: 'Alpine, Debian · linux/amd64, linux/arm64', toolsIncluded: 7 },
  { name: 'Tomcat',             type: 'HARDENED IMAGE', icon: 'tomcat',     desc: 'Alpine, Debian · linux/amd64, linux/arm64' },
  { name: 'HAProxy',            type: 'HARDENED IMAGE', icon: 'haproxy',    desc: 'Debian · linux/amd64, linux/arm64' },
  { name: 'Traefik',            type: 'HARDENED IMAGE', icon: 'traefik',    desc: 'Debian · linux/amd64, linux/arm64' },
  { name: 'Redis',              type: 'HARDENED IMAGE', icon: 'redis',      desc: 'Debian · linux/amd64, linux/arm64', toolsIncluded: 6 },
  { name: 'DHI Build',          type: 'HARDENED IMAGE', icon: null,         desc: 'Alpine, Debian · linux/amd64, linux/arm64' },
]

export const MONITORING_IMAGES = [
  { name: 'Access Log Exporter',                type: 'HARDENED IMAGE', icon: null,         desc: 'Alpine · linux/amd64, linux/arm64' },
  { name: 'Prometheus Alertmanager',            type: 'HARDENED IMAGE', icon: 'prometheus', desc: 'Alpine · linux/amd64, linux/arm64' },
  { name: 'Prometheus AlertManager Helm chart', type: 'HELM CHART',     icon: 'prometheus', desc: 'Prometheus Alertmanager' },
  { name: 'Grafana Alloy',                      type: 'HARDENED IMAGE', icon: 'grafana',    desc: 'Alpine, Debian · linux/amd64, linux/arm64' },
]
