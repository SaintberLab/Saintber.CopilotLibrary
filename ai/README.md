# AI Toolchain Authoring Layer

This directory is the source-of-truth authoring layer for all AI tool artifacts in `@saintber/copilot-library`.

## Structure

```
ai/
├── [module]/                       ← raw artifact authoring (module-first, type-second)
│   ├── instructions/
│   ├── agents/
│   ├── prompts/
│   ├── skills/
│   ├── mcp/
│   ├── sdk/
│   └── sources/
│       └── requirements/           ← module-scoped requirement history
├── composed/
│   ├── en/[module]/[type]/         ← deploy-ready English artifacts
│   └── zh-TW/[module]/[type]/      ← Traditional Chinese backup artifacts
├── manifest.yaml                   ← module → composed → publish path map
└── README.md                       ← this file
```

## Modules

| Module | Scope |
|--------|-------|
| `copilot` | Copilot artifact maintenance governance |
| `migration` | .NET migration toolchain |
| `kb` | Knowledge base functionality |
| `docs` | Architecture documentation |
| `code` | Product code conventions |
| `speckit` | SDD / Speckit process governance |

## Authoring Flow

```
ai/[module]/[type]/        ← 1. Draft here
    ↓
ai/composed/en/[module]/   ← 2. Produce deploy-ready English artifact
ai/composed/zh-TW/[module/ ← 2. Produce Chinese backup in same operation
    ↓
.github/[type]/            ← 3. Deploy (flat merge, no module subdirs)
    ↓
templates/[module]/        ← 4. Release (module-first npm package artifact)
```

## Rules

- Always produce English and Chinese backup artifacts in the same operation (point conservation).
- Raw requirement history is stored under `ai/[module]/sources/requirements/`.
- `.github/` is the live Copilot runtime target and must remain flat.
- `templates/` is updated only during release publication.
- See `docs/policy/ai-toolchain-workflow.md` for the full lifecycle specification.
