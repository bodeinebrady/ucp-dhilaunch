import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Decision } from '../data/rationale-v2'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface Props {
  version: string
  status?: string
  rationale?: Decision[]
  /** Optional controls rendered in the center of the header bar */
  children?: React.ReactNode
}

export default function PrototypeHeader({ version: _version, rationale, children }: Props) {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <div className="sticky top-0 z-[1200] bg-background border-b border-border flex items-center justify-between px-6 py-3">
        <button
          className="flex items-center gap-1.5 type-body text-primary hover:underline cursor-pointer bg-transparent border-none"
          onClick={() => navigate('/')}
        >
          ← Bulk Customizations
        </button>
        <div className="flex items-center gap-3">
          {children}
          {rationale && (
            <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
              View Rationale
            </Button>
          )}
        </div>
      </div>
      <Separator />

      {rationale && (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="right" className="w-[520px] p-0 flex flex-col gap-0">
            {/* Header */}
            <SheetHeader className="px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
              <SheetTitle className="type-heading">{_version}</SheetTitle>
              <p className="type-caption text-muted-foreground -mt-1">Design Rationale</p>
            </SheetHeader>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto flex-1">
              {rationale.map((d, i) => (
                <div key={d.id}>
                  {i > 0 && <Separator className="my-8" />}

                  {/* Number + title */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex size-[22px] items-center justify-center rounded-full bg-primary text-primary-foreground type-overline shrink-0 mt-0.5" style={{ fontVariationSettings: "'wght' 680" }}>
                      {i + 1}
                    </span>
                    <p className="type-label leading-snug">{d.title}</p>
                  </div>

                  {/* Decision */}
                  <div className="bg-muted/50 rounded-lg px-4 py-3 mb-4 border-l-[3px] border-primary">
                    <span className="type-overline text-primary block mb-1">Decision</span>
                    <p className="type-body">{d.decision}</p>
                  </div>

                  {/* Screenshot */}
                  {d.screenshot && (
                    <img
                      src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${d.screenshot}`}
                      alt={`Screenshot: ${d.title}`}
                      className="w-full rounded-lg border border-border block mb-5"
                    />
                  )}

                  {/* Why */}
                  <p className="type-body text-muted-foreground mb-5">{d.why}</p>

                  {/* Evidence */}
                  <span className="type-overline text-muted-foreground block mb-3">Evidence</span>
                  <div className="flex flex-col gap-3 mb-5">
                    {d.evidence.map((e, ei) => (
                      <div key={ei} className="border-l-2 border-border pl-3">
                        <p className="type-body italic mb-1">"{e.quote}"</p>
                        <span className="type-caption text-muted-foreground">{e.source}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rejected */}
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
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
