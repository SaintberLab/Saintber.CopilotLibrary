---
description: 維護 Copilot 客製化產物（含 instruction、agent、prompt 及 skill）的穩定規則。
applyTo: ".github/instructions/copilot.maintenance.instructions.md,.github/agents/copilot.maintainer.agent.md,.github/prompts/copilot.maintain.prompt.md,ai/**/*.md"
---

# Purpose
Define stable rules for the Copilot maintenance toolchain and its related source materials.

# Scope
These rules apply only to the Copilot maintenance toolchain itself - `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.maintain.prompt.md` - and the related draft, deploy, and release artifacts under `ai/**`. They should not automatically govern arbitrary downstream project-local `.github` rules or third-party vendor AI artifacts.

# Stable Rules
- Treat `ai/` as the authoring layer and `.github/` as the deploy target.
- Organize draft artifacts module-first, language-second, type-third. Canonical layout is `ai/<module>/en/[type]/`, `ai/<module>/zh-TW/[type]/`, and `ai/<module>/sources/requirements/`.
- `copilot-instructions.md` is a VS Code reserved filename but still belongs to the `copilot` module. Its canonical draft paths are `ai/copilot/en/instructions/copilot-instructions.md` and `ai/copilot/zh-TW/instructions/copilot-instructions.md`.
- Do not create or maintain a parallel artifact track for `copilot-instructions.md` outside canonical `ai/copilot/en|zh-TW/` paths unless the user explicitly requests migration or compatibility handling.
- If multiple candidate paths exist for the same namespace artifact, always update the canonical module path and explicitly report non-canonical paths as skipped.
- Use this maintenance governance only for explicit maintenance or release work on the library's own Copilot artifacts.
- Because the `applyTo` scope is intentionally narrow, `copilot.maintainer.agent.md` must also embed and enforce the same maintenance governance during execution; compliance must not rely on `applyTo` alone.
- Keep instruction, agent, prompt, and skill responsibilities separated.
- Preserve existing rules unless the new requirement explicitly changes them.
- Minimize unrelated edits during updates.
- Prefer additive updates over destructive rewrites.
- Maintain section structure when merging, unless restructuring is explicitly required.
- Keep terminology consistent across instruction, agent, prompt, and skill artifacts.
- Use English as the normalization language during merge and analysis when bilingual processing is required.
- Keep both draft language tracks in sync: English draft under `ai/<module>/en/[type]/` and Traditional Chinese draft under `ai/<module>/zh-TW/[type]/`.
- Ensure every update produces clearly sectioned output.
- Write `description` fields in Traditional Chinese; keep technical terms and keywords in English.
- After every maintenance update, record the change in `CHANGELOG.md`. If the user specifies a version number, use it; if the user requests no version increment, update the existing latest version entry instead; if not specified, list the change under `[未發布]`.
- Preserve the original user requirement text when processing updates; store it in a namespace-scoped history file under the user-specified path or the default location (`ai/<module>/sources/requirements/`).
- Requirement history should not be split into date-based files. Use one namespace-based history file (default: `<namespace>.requirement-history.md`) and append the new entry under the matching version section.
- Requirement history entries must be recorded in reverse chronological order within the same version section so iterative changes remain easy to trace.
- If no version is provided, record the requirement under the `[未發布]` section of the namespace history file.
- Requirement history entries should use a formal template with at least: `Recorded At`, `Change Summary`, `Affected Artifacts`, and `Original Requirement`.
- If the user explicitly declares a release, move current `[未發布]` entries into the target version section (or a newly created version section), and keep an empty `[未發布]` section for the next cycle.
- When release is declared, migrate the requirement history entries from `[未發布]` into the matching formal version section in each affected namespace history file, and keep a fresh empty `[未發布]` section for subsequent changes.
- If release is declared with a target version, update the repository `package.json` `version` field to the same release number in the same release operation.
- Release publication should include git commit/tag command guidance with complete commit message content; if version control is unavailable, provide commands without forcing execution.
- During normal maintenance (non-release), update `ai/` draft artifacts only; do not update `.github/` or `/templates/` unless explicitly declared.
- Deploy is an explicit stage. Update `.github/` only when the current prompt explicitly declares `deploy=true`.
- When release is declared, sync `.github/` artifacts into `/templates/<module>/` by namespace, and keep repository-level Copilot governance artifacts in `/templates/` root as needed.
- `.github/TOOLS.md` is deprecated and must not be generated. Tooling guide content must be maintained in module-level `README.md` files under `ai/<module>/README.md` and `/templates/<module>/README.md`.
- After every maintenance update, sync-update module-level `README.md` files if command behavior changes.
- Domain-specific customization logic should be implemented in dedicated agents/prompts instead of being embedded into repository-wide maintenance instructions.
- If the update target is Draft, follow `ai/README.md` flow (`ai/<module>/en` + `ai/<module>/zh-TW` -> Deploy -> Release).
- Draft updates MUST NOT write to `.github/` unless Deploy was explicitly declared in the same prompt.
- If Deploy is declared and `.github/` is updated, ensure both draft language files were updated in the same operation.

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
- The final Traditional Chinese draft output must be complete and up to date.
- The output should include a concise change summary.
- The output must include CHANGELOG Update and Module README Update confirmation sections.
- When release is requested, include release execution commands (`git add`, `git commit`, `git tag`, `git push`) with a complete commit message template.

# Forbidden
- Do not rewrite unrelated sections for style only.
- Do not collapse instruction, agent, prompt, or skill into a single artifact.
- Do not change old rules based on inference alone.
- Do not dual-write the same artifact to both canonical and non-canonical `ai/` paths in the same maintenance operation.
