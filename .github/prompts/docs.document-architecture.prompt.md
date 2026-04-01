---
agent: docs.architecture-documenter
description: 依現有程式碼、context 文件與 hybrid review 輸出建立或補齊架構文件初稿。
---

Create or expand architecture documentation for this repository.

## Inputs
- Documentation target: `${input:documentation_target=default:/docs/policy/}`
- Documentation scope: `${input:documentation_scope=default:/docs/README.md and /docs/policy/*}`
- Code scope: `${input:code_scope=default:entire repository}`
- Source mode: `${input:source_mode=default:mixed}` — `code`: infer from code only; `docs`: infer from docs only; `mixed`: use code + docs + context; `hybrid-review`: prefer hybrid review outputs when available
- Output mode: `${input:output_mode=default:draft}` — `draft`: create initial draft; `expand`: extend an existing doc; `refresh`: rewrite a doc to match current evidence
- Additional constraints: `${input:constraints=default:none}`

## Task
1. Inspect the specified code scope, docs scope, and any relevant context documents.
2. If `source_mode=hybrid-review`, also inspect:
   - `/Architecture/Inventory.md`
   - `/Architecture/Findings.md`
   - `/Architecture/Architecture.md`
   - `/Specification/Gap-Analysis.md`
   - `/Tasks/Unified-Plan.md`
3. Determine whether to create a new architecture document, expand an existing one, or refresh outdated content.
4. Write architecture documentation in Traditional Chinese with English technical keywords.
5. Update `/docs/README.md` if the final document map changes.
6. Provide a concise summary of created/updated files, architecture conclusions, and unresolved ambiguities.

## Constraints
- Modify documentation only, not source code.
- Prefer code-backed conclusions over speculation.
- Mark uncertain conclusions explicitly.
- Do not copy transient review findings verbatim into long-lived architecture docs.
- Keep documents focused, discoverable, and repository-specific.