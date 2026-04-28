---
description: 以輕量流程將 Speckit overlay 客製化重套到最新上游產物，適用於使用者專案。
agent: copilot.speckit-customizer
tools: [read/readFile, agent, edit/createFile, edit/editFiles]
---

# Input
Provide the following:
- `customization_requirement_zh_tw`: the Traditional Chinese customization request to apply
- `target_speckit_version` (optional): target upstream Speckit version label for tracking
- `additional_requirement_zh_tw` (optional): additional Traditional Chinese customization notes
- `target_paths` (optional): specific Speckit files or folders to update first

# Task
Use the `copilot.speckit-customizer` subagent to reapply this repository's reusable Speckit overlay customizations to the latest upstream baseline for a user project.

# Lightweight Overlay Rules
When running this command:
1. Do not depend on `copilot.maintenance.instructions.md` or the full `/copilot.maintain` release/changelog workflow unless the user explicitly asks for repository-level maintenance.
2. Translate the incoming Traditional Chinese requirement into English for normalization and merge analysis.
3. Preserve intent while rewriting the customization into precise, reusable overlay requirements instead of copying the user's raw wording into reusable artifacts.
4. Compare the upstream baseline under `ai/composed/zh-TW/speckit-backup/` with the current target Speckit artifacts before deciding what to change.
5. Update only the affected Speckit-specific artifacts.
6. If a `.github/` artifact is updated, also write the **complete full-document** Traditional Chinese version to the matching `ai/composed/zh-TW/` path in the same run. The composed file must be a complete re-translation of the full artifact — not a partial translation covering only the newly added customization sections.
7. Skip requirement-history, changelog, and release-command steps by default unless the user explicitly requests those repository-maintenance actions.

# Established Overlay Targets
Translate the repository's established customization intent into these precise overlay requirements:

1. Constitution flow
  - When `/speckit.constitution` updates the constitution without an explicit Release declaration, the resulting constitution version must remain in draft form as `<previous-version>-draft`.
  - Preserve original constitution intent input in `/docs/constitution/constitution.intent.raw.md` using reverse-chronological entries.
  - Draft session entries must use `Draft.<sequence>` numbering until Release is declared.
  - When Release is declared, the constitution version must move to the new formal version and the related raw-intent session numbering must be rewritten from `Draft.<sequence>` to `<new-version>.<sequence>`.
  - `/docs/constitution/constitution.intent.raw.md` must maintain a Session Index table with columns: `Session 版號`, `日期`, `對應憲章版本`, `主題摘要`.

2. Planning flow
  - `/speckit.plan` must include `/docs/policy/**` as required policy and design context during planning.

3. Task generation flow
  - `/speckit.tasks` must check generated tasks against `/docs/policy/**` for design or policy violations.

4. Implementation flow
  - `/speckit.implement` must check implementation work against `/docs/policy/**` for design or policy violations.

5. Document artifact language
  - When writing customization results to `ai/composed/zh-TW/` relative paths, the output must be the **complete full-document** Traditional Chinese version of the corresponding artifact, not only the newly added customization sections.

# Output Format
## Overlay Summary
- Briefly describe the refined overlay intent and the behavioral delta from upstream.

## Affected Artifacts
- List the Speckit artifacts that were reviewed and which ones changed.

## Updated Files
- Provide the updated content or a concise summary for each changed file.

## Composed Output Paths
- List each `ai/composed/zh-TW/` file written in Traditional Chinese.

## Optional Notes
- Mention any manual follow-up only if needed.
