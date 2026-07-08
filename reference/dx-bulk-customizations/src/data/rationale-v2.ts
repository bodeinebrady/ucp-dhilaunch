export interface EvidenceItem {
  quote: string
  source: string
}

export interface Decision {
  id: string
  title: string
  decision: string
  why: string
  evidence: EvidenceItem[]
  rejected: Array<{ option: string; reason: string }>
  screenshot?: string
}

export const DECISIONS_V2: Decision[] = [
  {
    id: 'stepper',
    title: 'Step-by-step wizard, not all sections on one page',
    decision:
      'The bulk customizations flow is split into 4 sequential steps (base image selection → packages & artifacts → settings → review), rendered one at a time with a stepper progress indicator.',
    why: 'The 4 phases cover structurally different tasks with different interaction models. Showing all at once creates an overwhelming, hard-to-scan layout and obscures the required completion order. The wizard pattern is designed for long processes that must be completed in sequence — and this task qualifies on both counts.',
    evidence: [
      {
        quote:
          'Use multi-step (wizard) forms when tasks are too long for a single page and must be completed in sequence. Show progress using a progress indicator.',
        source: 'Carbon Design System — Forms Pattern',
      },
      {
        quote:
          'Do not overload the default view with secondary options. Do not let state changes shift unrelated content unexpectedly.',
        source: "Nielsen's 10 Usability Heuristics — #8 Aesthetic and Minimalist Design",
      },
      {
        quote:
          'Multiple questions on a page works well for internal services where users switch between tasks quickly — but groupings should be coherent.',
        source: 'GOV.UK Design System — Question Pages',
      },
    ],
    screenshot: '/rationale/stepper.png',
    rejected: [
      {
        option: 'All sections on one page (accordion)',
        reason:
          'Four structurally different phases compete for attention; required sequence is not clear and users skip ahead to later sections before completing dependencies.',
      },
      {
        option: 'Page-per-step with URL routing',
        reason:
          'Adds routing complexity with no user benefit for a modal-style configuration task. In-memory state is simpler and avoids data loss on navigation.',
      },
    ],
  },
  {
    id: 'autocomplete',
    title: 'Search-first autocomplete for base image selection',
    decision:
      'Users type to search for a base image by name rather than scrolling a flat list, table, tree, or dropdown.',
    why:
      'The catalog is expected to scale to 400+ images × N versions. Users arrive knowing what image they want — this is a confirmation step, not a discovery step. Flat list and table approaches fail at that scale; users experience choice overload before they can find the relevant row.',
    evidence: [
      {
        quote:
          '36% of participants use 5–10 base images in their stack. Users are not browsing — they already know what image they need.',
        source: 'Docker Trusted Content Survey (N=44, 2023) — knowledge/research/dhi.md',
      },
      {
        quote:
          'The tendency for people to get overwhelmed when presented with a large number of options. We can avoid choice overload by providing tools for narrowing down choices up front (e.g. search and filtering).',
        source: 'Laws of UX — Choice Overload',
      },
      {
        quote:
          "Minimize the user's memory load by making objects, actions, and options visible. The user should not have to remember information from one part of the interface to another.",
        source: "Nielsen's 10 Usability Heuristics — #6 Recognition Rather Than Recall",
      },
    ],
    screenshot: '/rationale/autocomplete.png',
    rejected: [
      {
        option: 'Flat table of all images and versions',
        reason:
          'Does not scale to 400+ images. Scanning a full table to find a specific image is impractical, especially with multiple version rows per image.',
      },
      {
        option: 'Two-column master/detail list',
        reason:
          'Left panel still shows all 400 image rows. Same scaling problem — just split across two panes.',
      },
      {
        option: 'Expandable accordion rows',
        reason:
          'Images × versions makes the list even longer when expanded. Navigation becomes harder, not easier.',
      },
      {
        option: 'Tree-view navigation (V1)',
        reason:
          "Hierarchical browsing is the wrong mental model when users already know what they want. Search is the right entry point for expert users who aren't discovering.",
      },
    ],
  },
  {
    id: 'version-checklist',
    title: 'Version checklist with compliance metadata visible',
    decision:
      'Once a base image is selected via autocomplete, its versions appear as a scannable checklist with OS, available tags, and compliance badges (FIPS, CIS, STIG) visible inline on each row.',
    why:
      "Compliance metadata is the primary driver of which version gets selected — it's not decorative. Hiding it behind tooltips, a details panel, or a subsequent step would force users to make selections blind or add back-and-forth to check each version's compliance posture.",
    evidence: [
      {
        quote:
          'Compliance with security frameworks (FIPS, SOC 2, ISO 27001, HIPAA) — top customer priority. 4 competitive wins were compliance-driven (FedRAMP, SOX, FIPS).',
        source: 'DHI Onboarding Survey + EAP Report (2025) — knowledge/research/dhi.md',
      },
      {
        quote:
          '3 users wanted compliance/certification info. Opportunity: make compliance a "checkbox" — abstract the certification process, surface it directly.',
        source: 'DHI Discovery & Concept Testing (2025) — knowledge/research/dhi.md',
      },
      {
        quote:
          "Our brains are good at recognizing something we've seen before but not at keeping new information ready to be used. Place burden of memory on the system, not the user.",
        source: "Laws of UX — Recognition over Recall",
      },
    ],
    screenshot: '/rationale/version-checklist.png',
    rejected: [
      {
        option: 'Versions without compliance badges',
        reason:
          'Compliance is the primary selection signal for security-conscious users (Kevin, Steph personas). Removing it forces context switching to a separate reference.',
      },
      {
        option: 'Compliance shown on hover/tooltip only',
        reason:
          'Hover is unreliable for keyboard users and increases interaction cost for the most important decision signal on this step.',
      },
      {
        option: 'Compliance on a separate detail pane',
        reason:
          'Requires an extra click per version to verify compliance posture. Users selecting across 5–10 images × multiple versions would click through dozens of detail views.',
      },
    ],
  },
  {
    id: 'split-layout',
    title: 'Split layout: picker left, selections right',
    decision:
      'Steps 1 and 2 both use a fixed two-column layout: search and checklist on the left, a persistent Selected panel on the right that accumulates chosen items. The pattern is the same in both steps because the underlying problem is the same.',
    why:
      'Both steps involve many-to-many selection: Step 1 picks multiple images × multiple versions; Step 2 picks multiple packages, OCI tags, and scripts. In both cases selections must stay visible while the user keeps searching — otherwise choices scroll out of view and users lose track of what they have already added. A persistent right panel solves this without interrupting the picker. The pattern is reused deliberately so the interaction model is learnable across the whole wizard.',
    evidence: [
      {
        quote:
          'Place burden of memory on the system, not the user. Lessen the burden of memorizing critical information by carrying it over from screen to screen (e.g. comparison tables that make comparing multiple items easy).',
        source: "Laws of UX — Recognition over Recall",
      },
      {
        quote:
          'Keep the pattern stable across common breakpoints. Do not let layout rearrangements hide the current state.',
        source: 'UX Patterns for Developers — Wizard/Stepper, Layout & Positioning',
      },
      {
        quote:
          'Bulk customization actions across multiple images — mentioned explicitly by 2 enterprise customers (Merck and Dell) during concept testing.',
        source: 'DHI Management Page Concept Testing (2025) — knowledge/research/dhi.md',
      },
    ],
    screenshot: '/rationale/split-layout.png',
    rejected: [
      {
        option: 'Selections appear above the autocomplete (floating)',
        reason:
          "Early exploration — selections felt disconnected from the picker and 'floating' without clear relationship to the current action.",
      },
      {
        option: 'Summary table below the picker',
        reason:
          'Pushes the page down on each selection, causing layout instability and an unstable button bar position.',
      },
      {
        option: 'Selections in a collapsible side panel',
        reason:
          'Hides the most important state (what has been chosen) behind an extra interaction. Users would need to toggle it open to verify selections before proceeding.',
      },
    ],
  },
  {
    id: 'step2-design',
    title: 'Step 2: Section cards for customization type discoverability',
    decision:
      'Step 2 opens with three collapsed section cards — Packages, OCI artifacts, Scripts — each showing a count badge. Packages defaults open. The split layout from Step 1 is reused inside each card for the same reason: selections must stay visible while searching.',
    why:
      'The section cards solve a specific discoverability problem: a single "+ Add item" button gave no signal that three distinct content types were available — users had no map of the step until they clicked. Cards make the full scope visible before any interaction. The split layout inside each card is not a new decision — it reuses the established pattern from Step 1 because the problem (many-to-many selection, keep choices in view) is identical.',
    evidence: [
      {
        quote:
          'The system should always keep users informed about what is going on through appropriate feedback within reasonable time.',
        source: "Nielsen's 10 Usability Heuristics — #1 Visibility of System Status",
      },
      {
        quote:
          'All 10 customers required some form of image customization. Common needs: adding packages (JDK, curl), injecting CA certificates, custom scripts, environment/system-level config.',
        source: 'DHI Customer Research (2025) — knowledge/research/dhi.md',
      },
    ],
    rejected: [
      {
        option: 'Unified add-item list',
        reason:
          'A single "+ Add item" button hid the three available categories until clicked. Users had no map of what the step contained before interacting.',
      },
      {
        option: 'Flat sections always expanded',
        reason:
          'Three fully expanded sections on load felt long and overwhelming when all were empty. Collapsed default keeps the step compact while still signalling structure.',
      },
      {
        option: 'Two-dropdown approach for OCI (image + tag)',
        reason:
          'Selecting image then tag in separate dropdowns is a weaker pattern than image-search → tag checklist, which matches Step 1 directly and removes a redundant interaction step.',
      },
    ],
    screenshot: '/rationale/step2-split-packages.png',
  },
  {
    id: 'review-step',
    title: 'Review step: summary card with per-section edit shortcuts',
    decision:
      'Step 4 uses a single unified card divided into sections (Base image, Packages, OCI artifacts, Scripts), each with a section header and an icon button that jumps directly back to the relevant step. Sections with no selections show "None added" rather than being hidden.',
    why:
      'The review step serves two functions: error prevention (catching mistakes before committing a bulk operation across multiple images) and confidence-building (confirming the full scope of what will be applied). A unified card with dividers makes the complete configuration scannable in one view. Per-section edit shortcuts let users correct a specific section and return directly to the review step without redoing unrelated steps. Icon buttons (pencil, with tooltips) keep the header row compact — the section label already provides context, and a full "Edit" text button would add width without adding meaning.',
    evidence: [
      {
        quote:
          'Check answers pages increase users\' confidence as they can clearly see that they have completed all the sections, and reduce error rates as users are given a second chance to notice and correct errors.',
        source: 'GOV.UK Design System — Check Answers Pattern',
      },
      {
        quote:
          'Provide a change option next to each section. When users edit answers, make sure information they\'ve already entered is pre-populated. After editing, return users directly to the check answers page without repeating prior steps.',
        source: 'GOV.UK Design System — Check Answers Pattern',
      },
      {
        quote:
          'Good error messages are important, but the best designs carefully prevent problems from occurring in the first place.',
        source: "Nielsen's 10 Usability Heuristics — #5 Error Prevention",
      },
      {
        quote:
          'A confirmation dialog must restate the user\'s request and explain what the computer is about to do, with specific information that allows users to understand the effects of their action.',
        source: 'Nielsen Norman Group — Confirmation Dialog Design',
      },
    ],
    rejected: [
      {
        option: 'Three separate bordered cards (one per section)',
        reason:
          'More visual noise and harder to scan as a unified whole. Separate cards imply independence; dividers within one card communicate that all sections belong to a single operation.',
      },
      {
        option: 'Text "Edit" buttons per section',
        reason:
          'Adds horizontal width to header rows without adding meaning — the section label already identifies what will be edited. Icon buttons with tooltips cover the accessibility need in a compact layout.',
      },
      {
        option: 'Hide empty sections',
        reason:
          'Hiding empty sections removes the signal that those customization types were available and not used. "None added" confirms a deliberate choice rather than a missed step.',
      },
    ],
    screenshot: '/rationale/review-step.png',
  },
]
