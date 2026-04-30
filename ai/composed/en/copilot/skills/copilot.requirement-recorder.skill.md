---
name: copilot.requirement-recorder
description: 可重複使用的原始需求記錄流程，提供三種模式與低 usage 的單一參數化操作。
---

# Skill: Reusable Requirement Recorder

## Purpose
Provide one reusable, low-cost requirement logging operation that can be used by multiple agents/prompts without mandatory handoff.

## Operation Recommendation
- Primary operation: `Skill` (this file), because it is reusable, discoverable, and suitable for multi-step but bounded file workflows.
- Secondary operation: `Prompt` wrappers may call this skill contract for user-facing slash commands.
- Optional deterministic helper: `Script` for file naming/path generation if the workflow grows and strict reproducibility is required.
- MCP is not required by default. Use MCP only when requirement records must be stored in external systems beyond repository files.

## Usage Efficiency Rules
- Optimize for GitHub Copilot by-request usage.
- Avoid subagent handoff unless explicit isolation is required.
- Prefer one parameterized operation over multiple fragmented operations.

## Input Contract
- `recorder_mode` (optional): `chronological` | `versioned-basic` | `versioned-structured`
- `history_root_path` (optional): root folder for history outputs
- `version` (optional): release version
- `release` (optional): `true` when user explicitly declares release
- `trigger_label` (optional): Chinese label for Trigger in structured mode
- `user_overrides` (optional): explicit storage path/table/template directives from user input
- `raw_requirement` (required): original user input to preserve

## Defaults
- `recorder_mode`: `chronological`
- `history_root_path`: `/docs/histories`
- `trigger_label`: `觸發來源`

## Override Rule
If user input explicitly defines storage path, index schema, or body template, follow those external directives and treat defaults as fallback only.

## Mode A: `chronological`
Behavior:
- Preserve raw requirements in reverse chronological order.
- Maintain a top history table in reverse chronological order.
- Default table columns: `Time`, `Requirement Summary`.
- Default path: `<root>/<yyyy>/<MM>/History_<yyyy-MM-dd>.md`.

## Mode B: `versioned-basic`
Behavior:
- Preserve raw requirements in reverse chronological order.
- Maintain a top history table in reverse chronological order.
- Default table columns: `Version`, `Date`, `Summary`.
- If no version is supplied, assign `Draft.<sequence>`.
- On explicit release to `<version>`, convert all `Draft.<sequence>` entries to `<version>.<sequence>`.
- Default path when not provided: `<root>/v<major>/v<major>.<minor>/.../History-<major>.<minor>.<patch>.md`.

## Mode C: `versioned-structured`
Behavior:
- Preserve raw requirements in reverse chronological order.
- Maintain a top history table in reverse chronological order.
- Default table columns: `Version`, `Date`, `Trigger`, `Summary`.
- If no version is supplied, assign `Draft.<sequence>`.
- On explicit release to `<version>`, convert all `Draft.<sequence>` entries to `<version>.<sequence>`.
- Required body sections: `Trigger`, `Background`, `Requirements`, `Original Input`.
- Default path when not provided: same as `versioned-basic`.

## Sequence Rules
- `sequence` is a conversation/session log number, not semantic version digits.
- Keep sequence monotonic within the same target history file.
- New entries are inserted above older entries.

## Output Expectations
When used in maintenance operations, report:
- mode used
- effective root path and file path
- whether overrides were applied
- whether release migration was applied
- any skipped/failed file updates with reasons
