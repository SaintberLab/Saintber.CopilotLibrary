---
description: 以繁體中文需求維護本函式庫自身 Copilot instruction、agent、prompt 及 skill 產物的 repository-level 可重複 prompt。本 prompt 必須在 agent 模式執行，並將實作委派給 copilot.maintainer 自訂 agent。
agent: copilot.maintainer
tools:[read/readFile, agent, edit/createFile, edit/editFiles]
status: active
---

# Input
Provide the following:
- `new_requirement_zh_tw`: the new requirement in Traditional Chinese
- `requirement_storage_path` (optional): path to store original requirement history; defaults to `.copilot/sources/updates/<namespace>/`
- `requirement_file_format` (optional): filename format for requirement history; defaults to `<namespace>.requirement-history.md` (e.g., `copilot.requirement-history.md`)
- `existing_instruction`: the current instruction content (optional)
- `existing_agent`: the current agent content (optional)
- `existing_prompt`: the current prompt content (optional)
- `existing_skill`: the current skill content (optional)
- `composed_path` (optional): Traditional Chinese output path (defaults to `.copilot/composed/`)
- `version` (optional): target version number for CHANGELOG.md entry; use `no-increment` to update the latest version entry in-place; omit to list under `[未發布]`
- `release` (optional): set to `true` when the user explicitly declares release publication

# Task
Use the `copilot.maintainer` subagent to update the library’s own Copilot customization artifacts or execute explicit release maintenance using the new requirement.

Do not use this as the default flow for arbitrary downstream project-local `.github` rule edits or third-party vendor AI updates unless the user explicitly requests `/copilot.maintain`.

# Delegation Contract
When invoking the `copilot.maintainer` subagent, require it to:
1. Read the Traditional Chinese requirement.
1.5. Preserve original requirement text in the specified/default namespace history file, grouped by version section, recorded in reverse chronological order, and formatted using the standard history template for traceability.
1.6. Regardless of whether the touched files are matched by `copilot.maintenance.instructions.md` `applyTo`, enforce the full maintenance governance embedded in `copilot.maintainer.agent.md` across all affected artifacts.
2. Translate the requirement into English for merge analysis.
3. Merge the new requirement into the existing instruction, agent, prompt, and skill artifacts.
4. Avoid duplication.
5. Preserve original structure as much as possible.
6. Do not break old rules unless the new requirement explicitly changes them.
7. Normalize wording and section structure.
8. Verify cross-artifact consistency.
9. Update the target files directly when write access is available.
10. Produce full Traditional Chinese outputs for the composed layer including skill when applicable, and write them to the corresponding `.copilot/composed/` files. This is a mandatory step and must not be skipped.
11. Return the final result in clearly sectioned output.
12. Update `CHANGELOG.md` with a change record using the version behavior: if `version` input is provided, use it as the version tag; if `version` is `no-increment`, update the current latest version entry in-place; otherwise list under `[未發布]`.
13. Sync-update `.github/TOOLS.md` to reflect any additions, removals, or behavior changes in tools resulting from this update.
14. If release is declared, convert current `[未發布]` changes into the target version section and keep a fresh `[未發布]` section for next-cycle changes.
14.5. If release is declared, also migrate the requirement history entries in affected namespace history files from `[未發布]` into the target version section.
14.6. If release is declared with a target version, update `package.json` so its `version` field matches that release number in the same operation.
14.7. If release is declared, sync all contents of `.github/` to `/templates/` as the CLI deployment artifact, including `.github/TOOLS.md`.
15. For release publication, provide complete git release commands (commit + tag + push) with a complete commit message; if git context is unavailable, provide command guidance without forcing execution.

# Responsibility Rules
- Put stable governance rules into the instruction.
- Put role, workflow, and guardrails into the agent.
- Put reusable task flow into the prompt.
- Write `description` fields in Traditional Chinese; keep technical terms and keywords in English.

# Required File Update Behavior
- When target paths are provided and write access is available, update the corresponding files directly.
- If `release=true` and a concrete `version` is provided, update `package.json` so its `version` field matches that release number.
- Write the full Traditional Chinese outputs to the matching `composed_path` paths.
- Do not silently skip file updates. If a file cannot be updated, explicitly report which path failed and why.

# Output Format
## Change Summary
- Summarize only meaningful changes.

## Requirement Preservation
- Storage path: <path used>
- Filename: <filename used>
- Version section: <version tag or "未發布">
- Entry template: <formal template used>
- Purpose: Source traceability for future updates and audit trail

## Updated Instruction
```md
<full updated instruction content>
```

## Updated Agent
```md
<full updated agent content>
```

## Updated Prompt
```md
<full updated prompt content>
```

## Updated Skill
```md
<full updated skill content>
```

## CHANGELOG Update
- Version used: <version tag or "未發布">
- Entry added or updated at: CHANGELOG.md

## TOOLS.md Update
- Changes applied: <summary of what was added/removed/updated in TOOLS.md>

## Release Commands
- Git context: <available|unavailable>
- Commands: <full `git add` / `git commit` / `git tag` / `git push` commands or guidance>

## File Update Result
- instruction: <updated|skipped|failed> - <path>
- agent: <updated|skipped|failed> - <path>
- prompt: <updated|skipped|failed> - <path>
- skill: <updated|skipped|failed|not-applicable> - <path>
- changelog: <updated|skipped|failed> - CHANGELOG.md
- tools: <updated|skipped|failed> - .github/TOOLS.md
- package: <updated|skipped|failed> - package.json
