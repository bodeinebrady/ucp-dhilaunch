import { NavLink, useLocation } from 'react-router-dom'

const VERSIONS = [
  { id: 'v1', label: 'Version 1', path: '/v1' },
  { id: 'v2', label: 'Version 2', path: '/v2' },
  { id: 'rationale', label: 'Rationale', path: '/rationale' },
]

export default function VersionSwitcher() {
  const { pathname } = useLocation()

  const isActive = (path: string) =>
    pathname === path || (pathname === '/' && path === '/v2') || pathname.startsWith(path + '/')

  return (
    <div className="bg-muted border-b border-border flex items-center px-4 py-2 gap-2.5 shrink-0">
      <span className="type-caption text-muted-foreground mr-0.5">
        Prototype versions
      </span>

      {VERSIONS.map((version) => {
        const active = isActive(version.path)
        return (
          <NavLink
            key={version.id}
            to={version.path}
            className={`inline-flex items-center px-3 py-0.5 rounded-full border-[1.5px] border-primary type-caption no-underline transition-colors ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-primary hover:bg-primary/10'
            }`}
            style={{ fontVariationSettings: "'wght' 520" }}
          >
            {version.label}
          </NavLink>
        )
      })}
    </div>
  )
}
