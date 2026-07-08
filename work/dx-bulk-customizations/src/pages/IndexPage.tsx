import { useNavigate } from 'react-router-dom'
import { Tag } from '@/components/ui/tag'

const VERSIONS = [
  {
    id: 'v1',
    num: '01',
    path: '/v1',
    label: 'Version 1',
    status: 'Initial Design',
    isCurrent: false,
    title: 'Inline stepper — all steps on one page',
    description:
      'A single-page progressive disclosure pattern. All wizard steps render on the same page, with completed steps dimming and collapsing into summary cards as the user moves forward. No routing between steps.',
    focus: 'Progressive disclosure',
  },
  {
    id: 'v2',
    num: '02',
    path: '/v2',
    label: 'Version 2',
    status: 'Current',
    isCurrent: true,
    title: 'Step-by-step wizard with dry-run simulation',
    description:
      'A five-step wizard (Select base image → Add packages → Configure settings → Review → Simulate). The review step offers two paths: run the customization directly, or preview the effective merged environment first. The simulation shows env var origins, artifact inheritance, override conflicts, and PATH merge behavior.',
    focus: 'Dry-run preview + step-by-step',
  },
]

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <div className="h-0.5 bg-primary" />
      <div className="flex flex-col items-center px-8 pt-16 pb-24">
        <div className="w-full max-w-[680px]">
          <div className="mb-16">
            <span className="type-overline text-muted-foreground mb-3 block">
              Docker Hub — Docker Hardened Images
            </span>
            <h1 className="text-4xl tracking-tight mb-4" style={{ fontVariationSettings: "'wght' 800" }}>Bulk Customizations</h1>
            <p className="type-body text-muted-foreground max-w-[460px]">
              Design exploration for the DHI bulk customization wizard. Each version represents
              a distinct interaction pattern.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {VERSIONS.map((v) => (
              <div
                key={v.id}
                className={`relative border rounded-xl p-6 cursor-pointer overflow-hidden transition-colors hover:bg-muted/40 ${v.isCurrent ? 'border-primary' : 'border-border'}`}
                onClick={() => navigate(v.path)}
              >
                <span
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[96px] leading-none text-border select-none pointer-events-none tracking-[-4px]"
                  style={{ fontVariationSettings: "'wght' 900" }}
                  aria-hidden
                >
                  {v.num}
                </span>
                <div className="relative z-10 pr-40">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="type-overline text-muted-foreground">{v.label}</span>
                    <Tag className={v.isCurrent ? 'border-primary text-primary bg-transparent' : ''}>
                      {v.status}
                    </Tag>
                  </div>
                  <h2 className="type-heading mb-2">{v.title}</h2>
                  <p className="type-body text-muted-foreground mb-4">{v.description}</p>
                  <Tag className="text-muted-foreground">{v.focus}</Tag>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-6 border-t border-border">
            <span className="type-caption text-muted-foreground">
              {VERSIONS.length} versions · DHI Bulk Customizations · Design prototypes
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
