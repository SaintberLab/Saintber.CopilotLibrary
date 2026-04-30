---
description: 合併與去重 .github/instructions/copilot-instructions.md 到 .github/copilot-instructions.md 的維護流程。
agent: copilot.maintainer
tools: [read/readFile, edit/createFile, edit/editFiles]
status: active
---

# Input
Provide the following:
- `merge_reason_zh_tw` (optional): why this merge is requested
- `source_path` (optional): defaults to `.github/instructions/copilot-instructions.md`
- `target_path` (optional): defaults to `.github/copilot-instructions.md`
- `cleanup_source` (optional): `true` to remove source after a successful merge, default `false`

# Task
Merge and deduplicate Copilot global instructions from `.github/instructions/copilot-instructions.md` into `.github/copilot-instructions.md`.

# Rules
1. If source does not exist, stop and report `skipped` with reason.
2. If target does not exist, create target with full source content.
3. If both files exist, merge content while preserving intent from both files.
4. Deduplicate exact duplicate lines, bullets, and section blocks where safe.
5. Keep VS Code reserved filename behavior by ensuring final merged output is in `.github/copilot-instructions.md`.
6. Keep language rules consistent: conversation requirements stay in Traditional Chinese (zh-TW) policy terms.
7. If `cleanup_source=true`, delete source only after target merge succeeds.

# Output Format
## Merge Summary
- source: <path>
- target: <path>
- action: <created-target|merged|skipped>

## Dedupe Notes
- List what duplicate sections or lines were removed.

## File Update Result
- source: <updated|deleted|kept|skipped|failed> - <path>
- target: <updated|created|skipped|failed> - <path>
