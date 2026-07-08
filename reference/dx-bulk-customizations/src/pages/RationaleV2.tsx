import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { DECISIONS_V2 as DECISIONS } from '../data/rationale-v2'

export default function RationaleV2() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState(DECISIONS[0].id)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    DECISIONS.forEach((d) => {
      const el = sectionRefs.current[d.id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(d.id) },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="max-w-[1100px] mx-auto px-8 py-10 flex gap-12 items-start">

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <button
            className="type-body text-primary hover:underline cursor-pointer bg-transparent border-none"
            onClick={() => navigate('/')}
          >
            ← Back to index
          </button>
        </div>

        <div className="mb-10 mt-4">
          <h1 className="type-display mb-2">Design Rationale — Bulk Customizations V2</h1>
          <p className="type-body text-muted-foreground mb-2">
            Documents the reasoning behind the major interaction pattern decisions in this prototype.
            Evidence is drawn from user research, UX pattern libraries, and design system guidelines.
          </p>
          <span className="type-caption text-muted-foreground/60 block">
            Sources: Docker DHI User Research · Carbon Design System · Laws of UX · Nielsen's
            Heuristics · GOV.UK Design System · Baymard Institute · UX Patterns for Developers
          </span>
        </div>

        {DECISIONS.map((d, i) => (
          <div
            key={d.id}
            ref={(el) => { sectionRefs.current[d.id] = el as HTMLElement | null }}
            id={d.id}
          >
            {i > 0 && <Separator className="my-10" />}

            <div className="flex items-start gap-4 mb-5">
              <span className="flex size-[26px] items-center justify-center rounded-full bg-primary text-primary-foreground type-mono-terminal shrink-0 mt-0.5" style={{ fontVariationSettings: "'wght' 680" }}>
                {i + 1}
              </span>
              <h2 className="type-heading text-lg leading-snug">{d.title}</h2>
            </div>

            {/* Decision */}
            <div className="bg-muted/50 rounded-xl px-5 py-3.5 mb-5 border-l-[3px] border-primary">
              <span className="type-overline text-primary block mb-1">Decision</span>
              <p className="type-body">{d.decision}</p>
            </div>

            {/* Why */}
            <p className="type-body text-muted-foreground mb-8">{d.why}</p>

            {/* Screenshot */}
            {d.screenshot && (
              <div className="mb-7 rounded-xl overflow-hidden border border-border">
                <img
                  src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${d.screenshot}`}
                  alt={d.title}
                  className="w-full block"
                />
              </div>
            )}

            {/* Evidence */}
            <span className="type-overline text-muted-foreground block mb-3">Evidence</span>
            <div className="flex flex-col gap-4 mb-7">
              {d.evidence.map((e, ei) => (
                <div key={ei} className="border-l-2 border-border pl-4">
                  <p className="type-body italic mb-1">"{e.quote}"</p>
                  <span className="type-caption text-muted-foreground">{e.source}</span>
                </div>
              ))}
            </div>

            {/* Alternatives rejected */}
            <span className="type-overline text-muted-foreground block mb-3">Alternatives rejected</span>
            <div className="flex flex-col gap-4">
              {d.rejected.map((r, ri) => (
                <div key={ri}>
                  <p className="type-label mb-1">{r.option}</p>
                  <p className="type-body text-muted-foreground">{r.reason}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky ToC */}
      <div className="w-[220px] shrink-0 sticky top-10 self-start">
        <span className="type-overline text-muted-foreground block mb-3">On this page</span>
        <div className="flex flex-col gap-0.5">
          {DECISIONS.map((d, i) => {
            const active = activeId === d.id
            return (
              <a
                key={d.id}
                href={`#${d.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  sectionRefs.current[d.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActiveId(d.id)
                }}
                className={`flex items-start gap-2 py-1.5 px-2 rounded no-underline cursor-pointer border-l-2 transition-colors ${
                  active ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted/40'
                }`}
              >
                <span className={`type-caption leading-snug ${active ? 'text-primary' : 'text-muted-foreground'}`} style={active ? { fontVariationSettings: "'wght' 520" } : undefined}>
                  {i + 1}. {d.title}
                </span>
              </a>
            )
          })}
        </div>
      </div>

    </div>
  )
}
