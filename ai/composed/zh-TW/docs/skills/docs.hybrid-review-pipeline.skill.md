---
name: docs.hybrid-review-pipeline
description: Hybrid Architecture & Specification Review Pipeline 的分階段、stateful、可續跑設計方法。
---

# 技能：Hybrid Architecture & Specification Review Pipeline

## 目的
定義如何設計一套 deterministic、可續跑、以檔案為中心的 review system，同時分析 software architecture 與 system specification。

## 設計目標
此 pipeline 必須：
- 從 code 與相關 artifacts 建立結構化 inventory
- 分別分析 architecture 與 specification，再進行交叉校對
- 偵測 code、documentation、specification 之間的不一致
- 產出統一的改善任務
- 以小批次、可續跑方式迭代
- 同時支援 full review 與 targeted partial review
- 明確區分 documentation / report 輸出與 optional code remediation

## 標準資料夾結構
必要輸出檔案：
- `/Architecture/Inventory.md`
- `/Architecture/Findings.md`
- `/Architecture/Architecture.md`
- `/Specification/Spec-Inventory.md`
- `/Specification/Gap-Analysis.md`
- `/Tasks/Unified-Plan.md`
- `/Tasks/State.json`
- `/Tasks/Review-Scope.md`

## State 模型要求
State 必須外部持久化，且每次執行都需更新。

最低必要欄位：
- `current_phase`
- `review_domain`
- `target_type`
- `targets`
- `completed_steps`
- `remaining_tasks`
- `current_target`

建議補充欄位：
- `run_id`
- `scope`
- `depth`
- `strictness`
- `include_dependencies`
- `boundary_rules`
- `excluded_targets`
- `change_mode`
- `last_updated_at`
- `artifact_map`
- `pending_findings`
- `iteration_count`
- `status`

## Remediation Mode 模型
執行契約應明確支援：
- `docs-only`：只產出 review artifacts 與文件更新；不得修改 source code
- `docs-and-plan`：產出 review artifacts 與有界 remediation plan；仍不得修改 source code
- `apply-code`：只有在明確要求且先完成 evidence / plan 記錄後，才允許進行有界的 source-code alignment

預設姿態：
- 從 `docs-only` 起步
- 任何 source-code 變更都必須明確 opt-in
- 所有 code-alignment 工作都必須能追溯到 findings 與既定 scope

## Phase 模型

### Phase 0 - Target Resolution
責任：
- 解析 target 語意
- 正規化 target 路徑/名稱
- 定義 review boundaries
- 決定可允許的 dependency expansion
- 記錄 excluded targets

輸出：
- `/Tasks/Review-Scope.md`

規則：
- Inventory 前必須先明確 scope
- 若 boundary policy 不允許 traversal，外部參照只能記錄，不可完整展開

### Phase 1 - Inventory
責任：
- 從 code 與 architecture artifacts 建立 architecture inventory
- 從 spec、API、workflow、permission、feature docs 建立 specification inventory
- 全程受 Review-Scope 約束

輸出：
- `/Architecture/Inventory.md`
- `/Specification/Spec-Inventory.md`

### Phase 2 - Analysis
責任：
- 偵測 architecture boundary violations
- 偵測 specification gaps
- 偵測 code/spec mismatches
- 偵測 implementation/documentation inconsistencies

輸出：
- `/Architecture/Findings.md`
- `/Specification/Gap-Analysis.md`

### Phase 3 - Planning
責任：
- 合併 architecture 與 specification findings
- 依 priority、ownership、dependency 進行群組
- 產出可執行的 improvement plan

輸出：
- `/Tasks/Unified-Plan.md`

### Phase 4 - Iteration Loop
責任：
- 逐步精煉 `/Architecture/Architecture.md`
- 逐步精煉受影響的 specification documents
- 僅在 `change_mode=apply-code` 時，才可選擇執行有界的 code-alignment step
- 依變更結果重新回到 inventory/analysis，直到穩定

規則：
- 每輪只處理有界 chunk
- state 必須記錄 iteration 次數與下一步任務
- docs-only review run 不得把 code changes 當成隱性副作用

## Partial Review 規則
必須支援：
- `target_type`: `module` | `feature` | `document` | `task`
- `targets`: 明確名稱或路徑
- `include_dependencies`: `none` | `direct` | `bounded` | `full`
- `boundary_rules`: 明確的 scope constraints
- `excluded_targets`: 忽略清單

行為定義：
- `none`: 不展開依賴
- `direct`: 僅展開立即相鄰的 inbound/outbound relations
- `bounded`: 僅在核准 scope 內展開
- `full`: 沿完整 dependency graph 展開，直到終點或遇到 excluded nodes

## Determinism 規則
- 每次執行先讀 state
- 每次只做一個明確的 phase step 或一小批 bounded tasks
- 每步完成後立即更新 state
- 無法確認時明確記錄 unresolved items，不可默默推論
- 若 phase transition 條件未滿足，不得混合 phase

## Prompt Template 指引
每個 phase prompt 應明確定義：
- input files
- allowed scope
- exact output file
- state fields to read
- state fields to update
- stop conditions
- 本次允許的 remediation modes

## Failure Handling
至少處理：
- missing targets
- ambiguous scope
- state corruption
- partial output writes
- conflicting findings
- dependency expansion overflow
- missing specification sources

建議行為：
- 安全停止
- 將錯誤原因寫入 state
- 保留最後一個成功 phase
- 在 `remaining_tasks` 中排入 remediation task

## Config Strategy
參數與效果：
- `review_domain`: 決定執行 architecture-only、specification-only 或 hybrid reconciliation workflow
- `depth`: 決定 evidence breadth 與 chunk size
- `scope`: 決定系統範圍（`module`、`solution`、`system`）
- `strictness`: 決定模糊容忍度與 evidence threshold
- `change_mode`: 決定本次是維持 docs-only、增加 remediation planning，或允許有界 code alignment
- targeted review 參數：決定 traversal、inventory 規模與 analysis reach

## 品質標準
好的設計必須：
- phase-separated
- 可跨 session 續跑
- file-oriented
- scope-safe
- deterministic
- implementation-ready