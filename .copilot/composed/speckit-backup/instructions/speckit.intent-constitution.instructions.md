---
description: Intent 文件格式與憲章版本管理規則。
applyTo: "docs/intent/**,docs/constitution/**,.specify/**,**/*.intent.md,**/*.intent.raw.md"
---

# Purpose
Define stable rules for maintaining intent documents (`*.intent.md`) and the constitution versioning scheme.

# Intent Document — Original Input Preservation

- Every version block in each `*.intent.md` MUST contain a `### Original Input (Verbatim)` sub-block:
  - Store original input text (meeting minutes, requirement ticket text, SD/architect-specified content) **verbatim — no summarization**.
  - Format: begin the block with `> ⚠️ 以下為原始輸入，逐字記錄。**AI 不得修改本區塊內容。**`
- AI-generated summaries, interpretations, and supplementary content go in the `### Structured Notes (AI)` sub-block of the same version.
- **AI MUST NOT modify any `Original Input (Verbatim)` block.**

## Exception: `constitution.intent.raw.md`

- Constitution intent raw inputs span multiple informal conversations and are managed in a dedicated append-only file (`constitution.intent.raw.md`).
- **This file is append-only. No person or AI may modify or delete existing content.**
- Version blocks in `constitution.intent.md` do NOT use `Original Input (Verbatim)` sub-blocks; instead they use **reference links** pointing to the corresponding session in `constitution.intent.raw.md`.
- Other intent files MUST NOT create a separate `.raw.md`; raw inputs are embedded directly in `Original Input (Verbatim)` blocks.

## Constitution Requirement Adjustment Forms

Two forms are supported:

- **Form 1 (human-first)**: Human appends raw input to `constitution.intent.raw.md` (with version tag), then invokes AI to update `constitution.intent.md` and increment version.
- **Form 2 (AI-assisted)**: User provides raw input directly; AI completes all steps at once:
  1. Verbatim-append raw input to `constitution.intent.raw.md` (with version tag, e.g. `## Session v2.1.0.0 — 2026-03-09`)
  2. Update `constitution.intent.md` (new version block + reference link to `.raw.md` session + Structured Notes)
  3. Increment version (W-code, or X.Y.Z if content warrants)

# Constitution Versioning Rules

- **Constitution body** (`.specify/memory/constitution.md`) and **constitution intent record** (`constitution.intent.md`) both use **3-segment version `X.Y.Z`** (Semantic Versioning); their X.Y.Z MUST stay in sync.
- **Constitution intent raw input** (`constitution.intent.raw.md`) uses **4-segment version `X.Y.Z.W`**:
  - **X.Y.Z**: Constitution version (X = MAJOR governance change, Y = MINOR new principle or substantial expansion, Z = PATCH clarification/wording/typo); matches constitution body X.Y.Z.
  - **W**: Session count under that constitution version (starts at 0; resets to 0 when X.Y.Z changes).
- **One-to-many relationship**: One version entry (X.Y.Z) in `constitution.intent.md` maps to one or more sessions (X.Y.Z.0, X.Y.Z.1…) in `constitution.intent.raw.md`.
  - Appending to `raw.md` alone (follow-up notes) does NOT require a new version entry in `intent.md`.
  - A new `intent.md` version entry is required only when governance intent changes (requiring new Structured Notes) and X.Y.Z is incremented.
- **Intent Index update timing**: Update the Intent Index ONLY when `intent.md` gains a new version entry (X.Y.Z change). Pure `raw.md` appends without a corresponding new `intent.md` version do NOT trigger an index update.
- **Consistency rule**: `constitution.intent.md` X.Y.Z MUST match `.specify/memory/constitution.md` version. If inconsistent, the constitution body is authoritative.
- **`constitution.intent.raw.md`**: Appended by human or AI (Form 2); each session tagged with 4-segment version (e.g. `## Session v2.2.0.0 — 2026-03-09`). Existing content MUST NOT be modified or deleted.
- **Session Index update**: Every new session append MUST also add a row to the Session Index table at the top of the file. Existing rows MUST NOT be modified or deleted.
