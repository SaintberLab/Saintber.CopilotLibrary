# docs Module Guide

`docs` 用於架構文件撰寫、審查與精煉。

## Instructions
- `docs.architecture.instructions.md`
  - applyTo：`docs/**`
  - 用途：架構文件審查、撰寫與重整規則；區分現況/目標/建議清理。

## Agents
- `docs.architecture-documenter`
  - 描述：審查、整理並產出 `/docs` 下的架構文件。
  - 典型用途：更新過時文件、補充缺失架構說明、從 code/context/hybrid review 產出架構文件初稿。
- `docs.hybrid-reviewer`
  - 描述：設計多階段、stateful 的 Hybrid Architecture & Specification Review Pipeline。
  - 典型用途：規劃 FULL / PARTIAL review 流程、state schema、phase prompts、failure handling。
- `docs.hybrid-review-executor`
  - 描述：依 `State.json` 與 `Review-Scope.md` 執行 Hybrid Architecture & Specification Review Pipeline。
  - 典型用途：分階段續跑 inventory / analysis / planning / iteration，並在每次執行後更新 state。

## Prompts（Slash Commands）
- `/docs.document-architecture`
  - 說明：依現有程式碼、context 文件與 hybrid review 輸出建立或補齊架構文件初稿。
  - 對應 Agent：`docs.architecture-documenter`
- `/docs.hybrid-review`
  - 說明：設計支援 FULL / PARTIAL review 的 Hybrid Architecture & Specification Review Pipeline。
  - 對應 Agent：`docs.hybrid-reviewer`
- `/docs.hybrid-review-execute`
  - 說明：依 state 檔逐步執行 Hybrid Architecture & Specification Review Pipeline。
  - 對應 Agent：`docs.hybrid-review-executor`

## Skills
- `docs.architecture-refactor.skill.md`
  - 說明：架構文件精煉方法論，供 `docs.architecture-documenter` 按需載入。
- `docs.hybrid-review-pipeline.skill.md`
  - 說明：Hybrid Architecture & Specification Review Pipeline 的分階段、stateful 設計方法。

## 使用案例
### 範例 8：架構文件整理
```text
/docs.document-architecture
documentation_target: /docs/policy/
code_scope: entire repository
source_mode: mixed
output_mode: refresh
```

### 範例 9：完整建立全專案架構文件，不含規格
```text
/docs.document-architecture
documentation_target: /docs/policy/
code_scope: entire repository
source_mode: mixed
output_mode: refresh
```

### 範例 10：初步建立全專案架構文件，不含規格
```text
/docs.document-architecture
documentation_target: /docs/policy/
code_scope: entire repository
source_mode: mixed
output_mode: draft
```

### 範例 11：完整建立全部規格 + 架構
```text
/docs.hybrid-review-execute
review_domain: hybrid
scope: system
depth: deep
strictness: high
target_type: module
targets: all
include_dependencies: full
state_path: /Tasks/State.json
review_scope_path: /Tasks/Review-Scope.md
```

### 範例 12：更新架構文件
```text
/docs.document-architecture
documentation_target: /docs/policy/
documentation_scope: /docs/README.md and /docs/policy/*
code_scope: entire repository
source_mode: mixed
output_mode: refresh
```

### 範例 13：新增指定範圍規格
```text
/docs.hybrid-review-execute
review_domain: specification
scope: module
target_type: feature
targets: Batch Dashboard
include_dependencies: direct
boundary_rules: only batch dashboard related workflows and APIs
excluded_targets: unrelated admin features
```

### 範例 14：更新指定範圍規格
```text
/docs.hybrid-review-execute
review_domain: specification
scope: module
target_type: document
targets: /Specification/Batch-Dashboard.md
include_dependencies: bounded
boundary_rules: keep within batch module and direct API dependencies
excluded_targets: reporting module
```
