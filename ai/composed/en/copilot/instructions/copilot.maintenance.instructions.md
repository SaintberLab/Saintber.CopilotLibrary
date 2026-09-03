---
description: 維護 Copilot 客製化產物（含 instruction、agent、prompt 及 skill）的穩定規則。
applyTo: ".github/instructions/copilot.maintenance.instructions.md,.github/agents/copilot.maintainer.agent.md,.github/prompts/copilot.maintain.prompt.md,ai/**/*.md"
---

# Purpose
Define stable rules for the Copilot maintenance toolchain and its related source materials.

# Scope
These rules apply only to the Copilot maintenance toolchain itself - `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.maintain.prompt.md` - and the related source, composed, and published forms under `.copilot/**`. They should not automatically govern arbitrary downstream project-local `.github` rules or third-party vendor AI artifacts.

# Stable Rules
- Treat `ai/` as the authoring layer and `.github/` as the publish layer.
- Organize `ai/` module-first, type-second. Canonical layout: `ai/<module>/[type]/` for raw artifacts; `ai/<module>/sources/requirements/` for requirement history; `ai/composed/en/<module>/` for deploy-ready English artifacts; `ai/composed/zh-TW/<module>/` for Traditional Chinese backup artifacts.
- `copilot-instructions.md` is a VS Code reserved filename but still belongs to the `copilot` module. Its canonical authoring paths are: raw → `ai/copilot/instructions/copilot-instructions.md`; English deploy → `ai/composed/en/copilot/instructions/copilot-instructions.md`; Chinese backup → `ai/composed/zh-TW/copilot/instructions/copilot-instructions.md`.
- Do not create or maintain a parallel artifact track for `copilot-instructions.md` outside the canonical `ai/copilot/` paths unless the user explicitly requests migration or compatibility handling.
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
- Store Traditional Chinese backup artifacts under `ai/composed/zh-TW/<module>/` and deploy-ready English artifacts under `ai/composed/en/<module>/` using corresponding relative paths.
- Ensure every update produces clearly sectioned output.
- Write `description` fields in Traditional Chinese; keep technical terms and keywords in English.
- After every maintenance update, record the change in `CHANGELOG.md`. If the user specifies a version number, use it; if the user requests no version increment, update the existing latest version entry instead; if not specified, list the change under `[未發布]`.
- Preserve the original user requirement text when processing updates; store it in a namespace-scoped history file under the user-specified path or the default location (`.copilot/<module>/sources/requirements/`).
- Preserve the original user requirement text when processing updates; store it in a namespace-scoped history file under the user-specified path or the default location (`ai/<module>/sources/requirements/`).
- Requirement history should not be split into date-based files. Use one namespace-based history file (default: `<namespace>.requirement-history.md`) and append the new entry under the matching version section.
- Requirement history entries must be recorded in reverse chronological order within the same version section so iterative changes remain easy to trace.
- If no version is provided, record the requirement under the `[未發布]` section of the namespace history file.
- Requirement history entries should use a formal template with at least: `Recorded At`, `Change Summary`, `Affected Artifacts`, and `Original Requirement`.
- For reusable raw requirement recording shared by multiple agents/prompts, prefer a dedicated skill as the primary AI operation. Keep one operation with mode parameters instead of many fragmented handoff flows.
- For usage efficiency in GitHub Copilot (by request), default to direct in-context execution and avoid unnecessary handoff to subagents.
- The reusable requirement recorder should support three modes with a single parameterized contract:
	- `chronological` (default): no version number tracking.
	- `versioned-basic`: versioned logging with index table but no fixed body template.
	- `versioned-structured`: versioned logging with index table and structured sections.
- Unless overridden by explicit user input, the requirement recorder root path defaults to `/docs/histories`.
- If the user explicitly specifies a storage path, index schema, or record template, those external requirements take precedence over defaults.
- `chronological` mode defaults:
	- Preserve original requirements in reverse chronological order.
	- Add/update a top table sorted reverse chronologically with columns: `Time`, `Requirement Summary`.
	- Default path format: `<root>/<yyyy>/<MM>/History_<yyyy-MM-dd>.md`.
- `versioned-basic` mode defaults:
	- Preserve original requirements in reverse chronological order.
	- Add/update a top table sorted reverse chronologically with columns: `Version`, `Date`, `Summary`.
	- If version is not specified, use `Draft.<sequence>`.
	- On explicit release to `<version>`, migrate all `Draft.<sequence>` entries to `<version>.<sequence>`.
	- If no explicit path is provided, default to nested version path and file: `<root>/v<major>/v<major>.<minor>/.../History-<major>.<minor>.<patch>.md`.
- `versioned-structured` mode defaults:
	- Preserve original requirements in reverse chronological order.
	- Add/update a top table sorted reverse chronologically with columns: `Version`, `Date`, `Trigger`, `Summary`.
	- If version is not specified, use `Draft.<sequence>`.
	- On explicit release to `<version>`, migrate all `Draft.<sequence>` entries to `<version>.<sequence>`.
	- Record body should include: `Trigger` (Chinese label), `Background`, `Requirements`, `Original Input`.
	- If no explicit path is provided, use the same default as `versioned-basic` mode.
- If the user explicitly declares a release, move current `[未發布]` entries into the target version section (or a newly created version section), and keep an empty `[未發布]` section for the next cycle.
- When release is declared, migrate the requirement history entries from `[未發布]` into the matching formal version section in each affected namespace history file, and keep a fresh empty `[未發布]` section for subsequent changes.
- If release is declared with a target version, update the repository `package.json` `version` field to the same release number in the same release operation.
- Release publication should include git commit/tag command guidance with complete commit message content; if version control is unavailable, provide commands without forcing execution.
- During normal maintenance (non-release), update `.copilot/` and `.github/` only; do not update `/templates/`.
- During normal maintenance (non-release), update `ai/` and `.github/` only; do not update `/templates/`.
- When release is declared, sync `.github/` artifacts into `/templates/<module>/` by namespace, and keep repository-level Copilot governance artifacts in `/templates/` root as needed.
- `.github/TOOLS.md` is deprecated and must not be generated. Tooling guide content must be maintained in module-level `README.md` files under `.copilot/<module>/README.md` and `/templates/<module>/README.md`.
- `.github/TOOLS.md` is deprecated and must not be generated. Tooling guide content must be maintained in module-level `README.md` files under `ai/<module>/README.md` and `/templates/<module>/README.md`.
- The first paragraph immediately following the H1 title in each module README is consumed by the CLI `list` command as the module description. Keep this paragraph accurate when the module's purpose or capabilities change.
- After every maintenance update, sync-update module-level `README.md` files if command behavior changes.
- Domain-specific customization logic should be implemented in dedicated agents/prompts instead of being embedded into repository-wide maintenance instructions.
- If the update target is not under `/.github/`, follow the authoring flow defined in `.copilot/README.md` (sources -> base -> composed -> publish).
- If the update target is not under `/.github/`, follow the authoring flow defined in `ai/README.md` (sources -> composed/en -> composed/zh-TW -> deploy).
- Every `.github/` file update MUST be accompanied by corresponding updates to `ai/composed/en/<module>/` (English deploy-ready) and `ai/composed/zh-TW/<module>/` (Traditional Chinese backup) files in the same operation. Composed file updates are mandatory and must not be skipped or deferred.

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
- The output must include CHANGELOG Update and Module README Update confirmation sections.
- When release is requested, include release execution commands (`git add`, `git commit`, `git tag`, `git push`) with a complete commit message template.

# Forbidden
- Do not rewrite unrelated sections for style only.
- Do not collapse instruction, agent, prompt, or skill into a single artifact.
- Do not change old rules based on inference alone.
- Do not dual-write the same artifact to both canonical and non-canonical `.copilot` paths in the same maintenance operation.
- Do not dual-write the same artifact to both canonical and non-canonical `ai/` paths in the same maintenance operation.
