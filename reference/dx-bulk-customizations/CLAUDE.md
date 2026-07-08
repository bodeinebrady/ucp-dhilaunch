# scs-dhi-bulk-customizations — Claude Code Instructions

## Session start

1. If `handoffs/current.md` exists, read it first. It was written by Claude Desktop
   and contains the persona in focus, what to build, and key decisions from that
   session. Use it to orient — do not ask the designer to re-explain.
2. Check `decisions/` for project-specific design decisions that apply to this work.

---

## Shared resources (read-only)

Pull context from deanerv2 — **never write to it**:

| Resource | Path |
|---|---|
| Design tokens reference | `../deanerv2/knowledge/tokens/` |
| Patterns & heuristics | `../deanerv2/knowledge/patterns/` |
| Research | `../deanerv2/knowledge/research/` |
| Compositions | `../deanerv2/knowledge/compositions/` |
| Cross-project design decisions | `../deanerv2/knowledge/design-decisions/` |

---

## Project output goes LOCAL — never to deanerv2

| Artifact | Write here |
|---|---|
| HTML/React prototypes | `prototypes/` |
| Project design decisions | `decisions/` |
| Handoff prompts from Desktop | `handoffs/` |

**NEVER write to `../deanerv2/`** — it is a shared resource, read-only from this project.

---

## Design System — Trident

This project uses **Trident** (Docker Design System): Radix UI + Tailwind CSS v4 + CSS custom properties.
Trident infrastructure is installed alongside MUI — both stacks coexist during transition.
**New components** should use Trident. **Existing MUI components** continue to work.

### Stack

| Layer | What it is |
|---|---|
| New components | shadcn-style source in `src/components/ui/` (from Docker Trident registry) |
| Tokens | CSS custom properties in `src/styles/tokens/dds-*.css` (already imported in `index.css`) |
| Styling | Tailwind CSS v4 utility classes + `cn()` from `src/lib/utils` |
| Icons | `@docker/icons` |
| Existing code | MUI + `@docker/dds-components` (keep working, migrate when touched) |

### Before writing any new component

1. Check Trident MCP (`list-all-documentation`, `get-documentation`) for the real API
2. Check `src/components/ui/` — install if missing: `bunx shadcn add @docker/<name>`
3. Use actual component with correct props — no approximations

### Token usage

```tsx
<div className="bg-background text-foreground" />
<span className="text-muted-foreground" />
<div className="bg-primary text-primary-foreground" />
<div className="p-dds-400 gap-dds-200" />
```

### Figma icons

Prefer `@docker/icons`. If only available as Figma asset, use CSS `mask-image` — not hand-drawn SVG.

Figma asset URLs expire after 7 days — re-fetch with `get_design_context` to refresh.
