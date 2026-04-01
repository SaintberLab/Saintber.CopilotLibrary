---
description: 維護 Copilot 客製化產物（含 instruction、agent、prompt 及 skill）的穩定規則。
applyTo: ".github/instructions/**/*.md,.github/agents/**/*.md,.github/prompts/**/*.md,.copilot/**/*.md"
---

# Purpose
Define stable repository-wide rules for maintaining Copilot instructions, agents, prompts, skills, and their source materials.

# Scope
These rules apply to Copilot customization artifacts — including instruction, agent, prompt, and skill — and their source, composed, and published forms.

# Stable Rules
- Treat `.copilot/` as the authoring layer and `.github/` as the publish layer.
- Keep instruction, agent, prompt, and skill responsibilities separated.
- Preserve existing rules unless the new requirement explicitly changes them.
- Minimize unrelated edits during updates.
- Prefer additive updates over destructive rewrites.
- Maintain section structure when merging, unless restructuring is explicitly required.
- Keep terminology consistent across instruction, agent, prompt, and skill artifacts.
- Use English as the normalization language during merge and analysis when bilingual processing is required.
- Store finalized Traditional Chinese outputs under `.copilot/composed/` using corresponding relative paths.
- Ensure every update produces clearly sectioned output.
- Write `description` fields in Traditional Chinese; keep technical terms and keywords in English.
- After every maintenance update, record the change in `CHANGELOG.md`. If the user specifies a version number, use it; if the user requests no version increment, update the existing latest version entry instead; if not specified, list the change under `[未發布]`.
- Preserve the original user requirement text when processing updates; store it in a namespace-scoped history file under the user-specified path or the default location (`.copilot/sources/updates/<namespace>/`).
- Requirement history should not be split into date-based files. Use one namespace-based history file (default: `<namespace>.requirement-history.md`) and append the new entry under the matching version section.
- Requirement history entries must be recorded in reverse chronological order within the same version section so iterative changes remain easy to trace.
- If no version is provided, record the requirement under the `[未發布]` section of the namespace history file.
- Requirement history entries should use a formal template with at least: `Recorded At`, `Change Summary`, `Affected Artifacts`, and `Original Requirement`.
- If the user explicitly declares a release, move current `[未發布]` entries into the target version section (or a newly created version section), and keep an empty `[未發布]` section for the next cycle.
- When release is declared, migrate the requirement history entries from `[未發布]` into the matching formal version section in each affected namespace history file, and keep a fresh empty `[未發布]` section for subsequent changes.
- Release publication should include git commit/tag command guidance with complete commit message content; if version control is unavailable, provide commands without forcing execution.
- When release is declared, sync all contents of `.github/` to `/templates/` as the CLI deployment artifact before generating git release commands.
- The `.github/TOOLS.md` file is part of release publication scope and must be included in the `.github/` to `/templates/` sync.
- After every maintenance update, sync-update `.github/TOOLS.md` to reflect any additions, removals, or behavior changes in tools.
- Speckit artifacts are vendor-maintained by Microsoft. Keep only backup copies under `.copilot/composed/speckit-backup/` and do not publish Speckit artifacts under `.github/`.
- If the update target is not under `/.github/`, follow the authoring flow defined in `.copilot/README.md` (sources → base → composed → publish).
- Every `.github/` file update MUST be accompanied by a corresponding update to the matching `.copilot/composed/` file with the complete Traditional Chinese translation in the same operation. Composed file updates are mandatory and must not be skipped or deferred.

# Naming Convention Rules
- All instruction, agent, prompt, and skill artifacts use a namespace-based naming scheme.
- Namespace format: `<namespace>[.<sub-namespace>].<artifact-name>.<type>.md`
- Defined namespaces:

| Namespace | Scope |
|-----------|-------|
| `code` | Product code conventions (tech stack, migration rules) |
| `copilot` | Copilot artifact maintenance governance |
| `docs` | Architecture documentation rules and agents |
| `speckit` | SDD / Speckit process governance |
| `kb` | Knowledge base functionality |
| `migration` | .NET migration toolchain (solution, backend, frontend, DB, review) |

- Namespaces may have sub-categories (e.g., `migration.dotnet-modernizer`).
- Not every word must be forced into a sub-namespace; choose names that balance classification clarity and semantic readability.
- `copilot-instructions.md` is a VS Code reserved filename and is exempt from namespace renaming.

# Responsibility Boundaries
## Instruction
- Contains long-lived rules, constraints, standards, and prohibitions.
- Must not contain single-run task steps unless they are stable governance rules.

## Agent
- Contains role definition, workflow preference, guardrails, and tool behavior.
- Must not replace repository-wide rules already defined in instructions.

## Prompt
- Contains reusable task flow for a specific use case.
- Must not become a dumping ground for all long-term governance rules.

## Skill
- Contains domain-specific knowledge packages and reusable task domain procedures.
- Must not duplicate governance rules already defined in instructions.
- Must not contain role workflows already captured in agents.

# Merge Rules
- Translate incoming Chinese requirements into English before merge analysis when bilingual normalization is needed.
- Merge new requirements into existing artifacts without duplication.
- Preserve unchanged sections whenever possible.
- Do not silently delete old rules.
- If two rules appear to conflict, prefer the explicitly stated existing rule unless the new requirement clearly supersedes it.

# Output Rules
- The update result must include updated instruction, updated agent, updated prompt, and updated skill sections when applicable.
- The final composed output must be written in Traditional Chinese.
- The output should include a concise change summary.
- The output must include CHANGELOG Update and TOOLS.md Update confirmation sections.
- When release is requested, include release execution commands (`git add`, `git commit`, `git tag`, `git push`) with a complete commit message template.

# Forbidden
- Do not rewrite unrelated sections for style only.
- Do not collapse instruction, agent, prompt, or skill into a single artifact.
- Do not change old rules based on inference alone.
