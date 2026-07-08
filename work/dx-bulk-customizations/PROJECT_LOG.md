# SCS DHI Bulk Customizations — Project Log

## Summary

**Created:** 2026-03-17
**Status:** active
**Surface:** Hub — DHI management
**Primary persona:** Kevin — Senior Back-End Developer, flow-state-developer
**Secondary personas:** Steph (SecOps), Sam (Dev Manager)
**Business objectives:** dhi-30m

### What this project is

This project explores how platform engineers and security-conscious developers can manage DHI image customizations at scale — applying CVE remediation SLOs, pinning base images, and configuring package allowlists across multiple images in a single operation. The design has iterated from a tree-based navigation UI (V1) to a multi-step wizard (V2) with a search-first autocomplete pattern for image selection, driven by the insight that the catalog will scale to 400+ images and users arrive knowing what they want rather than browsing. It connects directly to user research showing bulk customization was explicitly requested by Merck and Dell during concept testing, and to the dhi-30m objective of reducing time-to-value for enterprise DHI customers.

### Key decisions

- **Step 1 interaction pattern**: search-first autocomplete + version checklist (Option C). Rationale: catalog scale (~400+ images) makes list/table approaches unviable; users know what image they want and don't browse.
- Wizard structure: 4 steps — base image selection → packages/OCI artifacts/scripts → configure settings → review + save.
- V1 (tree-view prototype) preserved alongside V2; both accessible via `/v1` and `/v2` routes with a VersionSwitcher pill bar.

### Context from planning discussions

We discussed DHI bulk customizations in the context of designing catalog and management pages for Kevin (senior back-end dev evaluating DHI Enterprise). The design focus was on letting platform engineers and security-conscious developers manage customizations across multiple DHI images at once. Steph (SecOps) and Sam (Dev Manager) were secondary personas. The prototype used a tree-based UI for navigating image hierarchies and applying bulk operations. LARP critiques were run against the prototype across multiple synthetic users. The work connects to the dhi-30m business objective.

---

## Changelog

### 2026-03-23 — Management page: cloning, Mirrored Images tab, edit flow pre-population, metadata bar

**Cloning:** Added Clone action to parent/standalone kebab (clones parent + all children with `-clone` suffix, children stay linked to new parent). Child rows get a copy icon button (ContentCopyIcon) with "Clone" tooltip that immediately creates a standalone customization with `-clone` suffix — no menu needed.

**Mirrored Images tab:** Built out tab 0 with search, Name/Customized/Compliance table, kebab menu (Customize → launches wizard with that image preselected in Step 1; Stop mirroring). Default landing tab changed from Customizations to Mirrored Images. Added version data for dhi-redis, dhi-rust, dhi-regctl, dhi-php, dhi-vault to IMAGE_TABLE_DATA so preselection works.

**Edit flow pre-population:** EditWizard now accepts `editingRow` prop. When editing a parent customization, Step 1 pre-selects all images/versions from that customization and sets `catalogChoice` to the first image. Save button says "Save changes" in edit mode vs "Save customization" for new.

**Parent detail tabs:** Removed standalone "Build logs" tab (BuildLogsContent). Parent customizations now show only Definition and Build Logs (renamed from Bulk Customizations) — the children table. Child click-through goes directly to BuildLogsPage.

**Metadata bar:** Subscription plan ("DHI Enterprise") moved to subtitle below page heading. Stat bar reduced to 3 items: Hardened images and Customizations with thin progress bars (amber at 90%+), ELS reframed as an upgrade nudge with value prop + "Contact sales to upgrade" link. Vertical dividers between all three sections. "Learn about customizations" link removed.

**Table polish:** Added Created by column; Image/Chart column widened (44%); OS column left-padded flush with Image/Chart end; child rows show copy icon instead of chip in Image/Chart cell; OS chip left-flush with `pl: 0`.

### 2026-03-23 — Step 2 pattern finalised: collapsed section cards

After prototyping two options side-by-side (Option B: unified add-item list; Option C: collapsed section accordion cards), decided on **Option C**. Three cards — Packages, OCI artifacts, Scripts — each with a count badge; Packages defaults open. Rejected Option B because it hid available categories behind a single "+ Add item" button with no affordance for what types of content could be added. Decision recorded in `knowledge/design-decisions/dhi.md`.

### 2026-03-23 — Step 2 package interaction pattern refined

Packages section updated to match OCI artifact pattern: search autocomplete at top (with search icon replacing chevron), selected packages appear as rows below showing name + description + delete button, capped at 5 visible rows with scroll beyond that. Same search icon treatment applied to OCI artifacts and Scripts autocompletes.

### 2026-03-23 — Rationale page added, Step 2 interaction rebuilt to match live Docker Hub

Added `/rationale` route (`RationaleV2.tsx`) documenting 4 design decisions with KB evidence and rejected alternatives. Step 2 in both V1 and V2 updated to match the live Docker Hub customization pattern: Packages as multi-select autocomplete with chips, OCI artifacts as image search + tag select with expandable rows for include/exclude paths, Scripts as add-link empty-state pattern.

### 2026-03-20 — V2 wizard Step 1 interaction pattern decided: search-first + autocomplete + version checklist

After evaluating three options (A: master/detail two-column, B: expandable rows, C: add-to-list), decided on **Option C with autocomplete** replacing the dropdown. Rationale: the catalog will scale to ~400+ images × N versions — no list or table approach is viable at that scale. Research confirms users already know what image they want (they're not browsing), so search-first is the correct mental model. The pattern: autocomplete field to find an image by name → versions appear as a checklist with compliance metadata visible → confirmed selections stack above as removable rows → repeat to add more images.

### 2026-03-20 — V2 wizard built: all 4 steps + version switcher

Built `src/pages/BulkCustomizationsV2.tsx` alongside preserved V1. Routing via React Router (`/v1`, `/v2`). VersionSwitcher pill bar above routes. Wizard covers: Step 1 (base image selection), Step 2 (packages / OCI artifacts / scripts), Step 3 (configure settings), Step 4 (review + save). Step 2 matches Figma screenshot: Packages dropdown, OCI artifacts dual-dropdown + info callout, Scripts empty state. Next button disabled on Step 1 until ≥1 selection made.

### 2026-03-19 — Tree-view prototype built

`scs-dhi-customizations-tree.html` committed to `prototypes/`. Implements a tree-based navigation of DHI image families with bulk customization controls. Uses DDS tokens and light-mode styling.

### 2026-03-18 — LARP critiques run against Bulk Customizations and Management frames

LARP critiques run across 5 synthetic users against 3 frames from the DHI Bulk Customizations Figma file (4zDA4s: dropdown/tag browser frames 11046:16853, 11046:16994, 11008:31577) and 3 frames from DHI Management (MLn1W1: frames 4001:21972, 4014:6076, 4014:6760). Findings written to `artifacts/larp-critiques/`. Key themes: missing DOI discovery entry points, tag lifecycle management gaps, and blocked repository management workflows due to modal overlays.

### 2026-03-17 — Figma compositions extracted

Compositions extracted and written to `knowledge/compositions/` for both the DHI Bulk Customizations file (`scs-dhi-bulk-customisations-4zDA4s.md`) and DHI Management file (`scs-dhi-management-MLn1W1.md`). Both files are in Figma project 211151878. DHI Management has v1–v6 iteration history; the current working version is v5 with a separate research prototype branch.
