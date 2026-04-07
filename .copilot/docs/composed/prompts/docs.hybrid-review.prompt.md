---
agent: docs.hybrid-reviewer
description: 設計 Hybrid Architecture & Specification Review Pipeline；不直接盤點專案，也不修改 docs / code。
---

設計一套可實作的 Hybrid Architecture & Specification Review Pipeline。

# 輸入
- Review domain: `${input:review_domain=default:hybrid}`（`architecture` | `specification` | `hybrid`）
- Scope: `${input:scope=default:system}`（`module` | `solution` | `system`）
- Depth: `${input:depth=default:normal}`（`shallow` | `normal` | `deep`）
- Strictness: `${input:strictness=default:high}`（`low` | `medium` | `high`）
- Target type: `${input:target_type=default:module}`（`module` | `feature` | `document` | `task`）
- Targets: `${input:targets=default:none}`
- Include dependencies: `${input:include_dependencies=default:bounded}`（`none` | `direct` | `bounded` | `full`）
- Boundary rules: `${input:boundary_rules=default:none}`
- Excluded targets: `${input:excluded_targets=default:none}`
- Change mode policy: `${input:change_mode_policy=default:docs-only-first}`（`docs-only-first` | `plan-allowed` | `apply-code-allowed`）
- Additional constraints: `${input:constraints=default:none}`

# 任務
設計一個 multi-stage、stateful 的 review pipeline，且必須：
1. 支援 full review 與 partial review
2. 使用外部 persistent state
3. 將輸出寫入檔案
4. 以可續跑 chunk 方式執行
5. 以 deterministic 規則執行 scope enforcement
6. 清楚分開 docs-only 的 review / reporting 與 optional remediation planning、code alignment

# 必須輸出章節
1. System Overview
2. Folder Structure
3. State Schema
4. Review-Scope Schema
5. Phase Design
6. Prompt Templates
7. Execution Workflow
8. Config Strategy
9. Failure Handling

# 限制
- 不得設計成單一 prompt 解法。
- 不得依賴 conversation memory。
- 不得略過 Phase 0 target resolution。
- 不得讓 inventory 或 analysis 超出 scope 規則。
- 不得從這個 design prompt 直接對當前 repository 進行 review 或套用修正。
- 結果必須 implementation-ready 且 file-oriented。