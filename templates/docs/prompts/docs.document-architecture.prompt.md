---
agent: docs.architecture-documenter
description: 依現有程式碼、context 文件與 hybrid review 輸出建立或補齊架構文件，可做完整盤點但只更新 docs。
---

Create or expand architecture documentation for this repository in a **documentation-only** flow.

## Inputs
- Documentation target: `${input:documentation_target=default:/docs/policy/}`
- Documentation scope: `${input:documentation_scope=default:/docs/README.md and /docs/policy/*}`
- Code scope: `${input:code_scope=default:entire repository}`
- Inventory mode: `${input:inventory_mode=default:auto}` — `auto`: use full-repository inventory when the request or scope is broad; `targeted`: inspect only the requested area; `full-repository`: perform a systematic architecture inventory across the repository before writing docs
- Include dependencies: `${input:include_dependencies=default:bounded}` (`none` | `direct` | `bounded` | `full`)
- Source mode: `${input:source_mode=default:mixed}` — `code`: infer from code only; `docs`: infer from docs only; `mixed`: use code + docs + context; `hybrid-review`: prefer hybrid review outputs when available
- Output mode: `${input:output_mode=default:draft}` — `draft`: create initial draft; `expand`: extend an existing doc; `refresh`: rewrite a doc to match current evidence
- Additional constraints: `${input:constraints=default:none}`

## Task
1. Inspect the specified code scope, docs scope, and any relevant context documents.
2. Use `inventory_mode` and `include_dependencies` to determine whether the inspection should stay targeted or perform a full-repository architecture inventory.
3. If `inventory_mode=full-repository`, perform a systematic architecture-level scan comparable to Hybrid Review Phase 1 inventory, but remain in a documentation-only workflow and do not rely on persistent state.
4. If `source_mode=hybrid-review`, also inspect:
   - `/Architecture/Inventory.md`
   - `/Architecture/Findings.md`
   - `/Architecture/Architecture.md`
   - `/Specification/Gap-Analysis.md`
   - `/Tasks/Unified-Plan.md`
5. Determine whether to create a new architecture document, expand an existing one, or refresh outdated content.
6. Write architecture documentation in Traditional Chinese with English technical keywords.
7. Update `/docs/README.md` if the final document map changes.
8. If the user needs persistent review artifacts, gap analysis files, or optional code-alignment execution, use `/docs.hybrid-review-execute` instead of overloading this docs-only authoring flow.
9. Provide a concise summary of created/updated files, architecture conclusions, the inventory mode used, and unresolved ambiguities.

## Constraints
- Modify documentation only, not source code.
- Prefer code-backed conclusions over speculation.
- Mark uncertain conclusions explicitly.
- Do not copy transient review findings verbatim into long-lived architecture docs.
- Keep documents focused, discoverable, and repository-specific.