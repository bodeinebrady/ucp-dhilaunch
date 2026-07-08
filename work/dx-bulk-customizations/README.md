# scs-dhi-bulk-customizations

Created: 2026-03-18

- **Figma:** https://www.figma.com/design/4zDA4sc6BNg3ZNGjiHBG7U/SCS---DHI---BULK-Customisations?node-id=11220-81316

---

## Folder structure

```
scs-dhi-bulk-customizations/
├── CLAUDE.md          ← Claude Code instructions for this project
├── .mcp.json          ← Points to deanerv2 MCP server (deaner)
├── README.md          ← This file
├── handoffs/          ← Prompts written by Claude Desktop between sessions
│   └── current.md     ← (written by Desktop when handing off to Code)
├── prototypes/        ← HTML/React prototypes
│   └── dds-tokens.css ← Symlinked from deanerv2/prototypes/dds-tokens.css
└── decisions/         ← Project-specific design decisions
```

---

## Shared resources from deanerv2

This project reads (never writes) from the shared deanerv2 knowledge base:

| Resource | Path |
|---|---|
| Design tokens | `../deanerv2/knowledge/tokens/` |
| Patterns & heuristics | `../deanerv2/knowledge/patterns/` |
| Research | `../deanerv2/knowledge/research/` |
| Compositions | `../deanerv2/knowledge/compositions/` |
| Cross-project decisions | `../deanerv2/knowledge/design-decisions/` |

The MCP server (`.mcp.json`) also exposes deanerv2's knowledge base tools directly
in Claude Code sessions.
