---
agent: docs.hybrid-review-executor
description: 執行 Hybrid Architecture & Specification Review Pipeline，預設 docs-only；依 `change_mode` 決定是否只出報告、加 remediation plan 或處理 code alignment。
---

執行 Hybrid Architecture & Specification Review Pipeline。

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
- Change mode: `${input:change_mode=default:docs-only}`（`docs-only` | `docs-and-plan` | `apply-code`）
- State path: `${input:state_path=default:/Tasks/State.json}`
- Review scope path: `${input:review_scope_path=default:/Tasks/Review-Scope.md}`
- Additional constraints: `${input:constraints=default:none}`

# 任務
每次執行只完成 Hybrid Architecture & Specification Review Pipeline 的一個有界 phase step 或小型 chunk，並遵守本次指定的 `change_mode`。

# 強制執行規則
1. 若 `State.json` 存在，必須先讀取。
2. 若 state 不存在，必須初始化並從 Phase 0 Target Resolution 開始。
3. 一旦 `Review-Scope.md` 存在，就必須嚴格遵守。
4. 不得超出 `include_dependencies`、`boundary_rules` 與 `excluded_targets`。
5. 必須把當前 phase 的輸出寫入對應檔案。
6. 每次執行後都必須更新 `State.json`。
7. 單次執行後必須停止，不可一次跑完整個 full review。
8. 若 `change_mode=docs-only`，只能產出 review artifacts 與文件輸出；不得修改 source code。
9. 若 `change_mode=docs-and-plan`，可產出 review artifacts 與 remediation planning，但仍不得修改 source code。
10. 若 `change_mode=apply-code`，只有在 scope 明確且有界時，才允許處理 source code 變更；且必須先完成 evidence 與 state 更新。

# 預期輸出
- Current Phase
- Executed Step
- Change Mode Used
- Files Updated
- State Update Summary
- Next Step
- Blockers / Open Questions