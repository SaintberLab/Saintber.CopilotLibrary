# AI Toolchain Authoring Layer

This directory is the source-of-truth authoring layer for all AI tool artifacts in `@saintber/copilot-library`.

Draft updates must stay inside `ai/` and must not modify `.github/` unless Deploy is explicitly declared.

## Structure

```
ai/
├── [module]/
│   ├── en/[type]/                  ← Draft (English)
│   ├── zh-TW/[type]/               ← Draft (Traditional Chinese)
│   └── sources/
│       └── requirements/           ← module-scoped requirement history
├── manifest.yaml                   ← module → draft → deploy/release path map
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
ai/[module]/en/[type]/     ← 1. Draft in English
ai/[module]/zh-TW/[type]/  ← 1. Draft in Traditional Chinese
    ↓
.github/[type]/            ← 2. Deploy only when explicitly declared
    ↓
templates/[module]/        ← 3. Release only when explicitly declared
```

## Rules

- Draft stage writes only to `ai/[module]/en/` and `ai/[module]/zh-TW/`.
- Do not modify `.github/` during Draft unless the current prompt explicitly declares Deploy.
- Do not modify `templates/` unless Release is explicitly declared.
- Raw requirement history is stored under `ai/[module]/sources/requirements/`.
- `.github/` is the live Copilot runtime target and must remain flat.
- See `docs/policy/ai-toolchain-workflow.md` for the full lifecycle specification.
