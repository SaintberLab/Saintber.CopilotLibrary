# docs Requirement History

本檔集中保存 `docs` namespace 的原始需求歷程，依版本段落保存，並於同一版本內以新到舊反序記錄。

## 條目模板

每筆需求應採用以下正式模板：
- `Recorded At`: 記錄時間
- `Change Summary`: 本次需求摘要
- `Affected Artifacts`: 受影響產物
- `Original Requirement`: 原始需求全文

## [未發布]

### 2026-04-07 05 - docs-hybrid-review-executor-terminal-verification

- Recorded At: `2026-04-07`
- Change Summary: 為 `docs.hybrid-review-executor` agent 新增 `terminal/runInTerminal` 工具授權，使其能透過 PowerShell 自行驗證執行結果（build / test / 檔案檢查等），並訂義驗證觸發時機與範圍規則。
- Affected Artifacts: `docs.hybrid-review-executor.agent.md`, `TOOLS.md`
- Original Requirement:

```md
請再更新 docs.hybrid 系列，讓 pipeline 的 agent 有權限執行 powershell 自行驗證結果(更新 tools 項目)
```

### 2026-04-07 04 - docs-hybrid-review-role-clarification

- Recorded At: `2026-04-07`
- Change Summary: 釐清 `docs.architecture-documenter`、`docs.hybrid-reviewer`、`docs.hybrid-review-executor` 與四個 docs prompts 的職責差異，新增 `inventory_mode` / `change_mode` 等控制，並補強 TOOLS 使用情境說明。
- Affected Artifacts: `docs.architecture-documenter.agent.md`, `docs.hybrid-reviewer.agent.md`, `docs.hybrid-review-executor.agent.md`, `docs.architecture-review.prompt.md`, `docs.document-architecture.prompt.md`, `docs.hybrid-review.prompt.md`, `docs.hybrid-review-execute.prompt.md`, `docs.hybrid-review-pipeline.skill.md`, `TOOLS.md`
- Original Requirement:

```md
針對 docs.hybrid-review 系列(包含純 review 與 execute) 進行調整
- 請確認 docs.architecture-documenter、docs.architecture-documenter、docs.hybrid-review-executor、docs.hybrid-reviewer 工作職責進行盤點，是否有重工、是否需要合併？若職責各異不需要合併，請在 Tools.md 補充清楚職責差異並補充案例說明什麼情境該用此命令、產生的輸出結果有什麼差異
- 我原本對 review 的認知只是產出 review 報告或調整架構文件，但執行結果似乎還會修正程式以符合架構設計，這是應該的嗎？若 review 的定義原本就包含程式碼修正以符合架構，請保留參數給我讓我決定是否修正程式架構，並請考慮有參數的狀況確認 prompt 名稱是否需要調整。
- 若原本的四個 prompt 的設計就包含僅 review 架構文件與同時修正程式架構的兩種狀況，請說明清楚哪種情境該使用哪種命令。
- 原本的架構盤點命令(如 docs.architecture-documenter) 並不包含完整盤點所有程式碼的做法，若是透過不同命令拆分僅更新文件與同時更新程式碼兩種狀況，請調整原本的盤點作法，以達到同樣能完整盤點的需求，保持兩者作法的一致性
- 以上需求若有不清楚的地方請先與我討論再執行調整
```

### 2026-04-01 03 - architecture-documenter-enhancement

- Recorded At: `2026-04-01`
- Change Summary: 補強 `docs.architecture-documenter`，並補上可呼叫的架構文件產生 prompt。
- Affected Artifacts: `docs.architecture-documenter.agent.md`, `docs.document-architecture.prompt.md`, `TOOLS.md`
- Original Source: `docs.2026-04-01.architecture-documenter-enhancement.requirement.md`

```md
好的，請補強 #file:docs.architecture-documenter.agent.md 
- 請評估 agent 名稱是否設計合宜，若有更佳名稱請更正
- 請補上呼叫用的 prompt
```

### 2026-04-01 02 - hybrid-review-execute

- Recorded At: `2026-04-01`
- Change Summary: 新增 hybrid review execute 類型 prompt，並評估既有 docs agent/prompt 是否應保留。
- Affected Artifacts: `docs.hybrid-review-executor.agent.md`, `docs.hybrid-review-execute.prompt.md`, `docs.document-architecture.prompt.md`, `docs.architecture-documenter.agent.md`, `TOOLS.md`
- Original Source: `docs.2026-04-01.hybrid-review-execute.requirement.md`

```md
1. 請再補上 execute 類型的 prompt
2. 請同時評估 #file:docs.document-architecture.prompt.md , #file:docs.architecture-documenter.agent.md 是否還有價值，若職責已經足以被取代請協助移除
```

### 2026-04-01 01 - hybrid-review-pipeline

- Recorded At: `2026-04-01`
- Change Summary: 設計 Hybrid Architecture & Specification Review Pipeline，支援 FULL / PARTIAL review、state 管理與分階段執行。
- Affected Artifacts: `docs.architecture.instructions.md`, `docs.hybrid-reviewer.agent.md`, `docs.hybrid-review.prompt.md`, `docs.hybrid-review-pipeline.skill.md`, `TOOLS.md`
- Original Source: `docs.2026-04-01.hybrid-review-pipeline.requirement.md`

```md
You are an expert AI system architect specializing in designing multi-stage, stateful AI workflows for software system analysis and governance.

Your task is to DESIGN (not execute) a complete "Hybrid Architecture & Specification Review Pipeline" that supports both FULL and PARTIAL reviews.

The system must analyze:

* software architecture (layers, dependencies, boundaries)
* system specifications (features, APIs, permissions, workflows)

and produce a unified, iterative improvement process.

---

# 🎯 Objectives

Design a system that can:

1. Build a structured inventory from codebase and related artifacts
2. Analyze architecture (layering, dependencies, violations)
3. Analyze specifications (features, API contracts, permissions, workflows)
4. Detect inconsistencies between:

   * code vs specification
   * implementation vs documentation
5. Generate a unified improvement plan
6. Iteratively refine architecture and specification documents
7. Continue execution across sessions (context window boundaries)
8. Support BOTH full-system review and targeted (partial) review

---

# ⚠️ Mandatory Constraints

## 1. Multi-Stage Pipeline REQUIRED

Do NOT design a single prompt solution.

---

## 2. External State Management REQUIRED

The system MUST maintain a persistent state file (JSON/YAML) including:

* current_phase
* review_domain
* target_type
* targets
* completed_steps
* remaining_tasks
* current_target

Each execution MUST:

* read state
* perform next step
* update state

---

## 3. File-Based Persistence REQUIRED

Outputs MUST be written to files:

/Architecture/Inventory.md
/Architecture/Findings.md
/Architecture/Architecture.md
/Specification/Spec-Inventory.md
/Specification/Gap-Analysis.md
/Tasks/Unified-Plan.md
/Tasks/State.json
/Tasks/Review-Scope.md

---

## 4. Iterative / Chunked Execution REQUIRED

* break work into small chunks
* process incrementally
* update state after each step

---

## 5. Deterministic & Traceable Behavior

Prioritize:

* consistency
* reproducibility
* traceability

---

# 🧩 Review Domains

* architecture
* specification
* hybrid

---

# 🧩 Targeted Review Support (CRITICAL)

The system MUST support precise partial review.

## Required Parameters

* target_type: module | feature | document | task
* targets: list of names or paths
* include_dependencies: none | direct | bounded | full
* boundary_rules: list of constraints
* excluded_targets: list

---

## Target Resolution Phase (MANDATORY)

Before Inventory, the system MUST execute:

### Phase 0: Target Resolution

Responsibilities:

* interpret targets
* define scope boundaries
* determine allowed dependency expansion

Output:
/Tasks/Review-Scope.md

---

## Scope Enforcement Rules

The system MUST:

* strictly follow Review-Scope.md
* NOT expand beyond allowed boundaries
* only include external modules if dependency policy allows
* record references to external systems without full expansion

---

# 🧩 Pipeline Phases

## Phase 0: Target Resolution

→ produce Review-Scope.md

---

## Phase 1: Inventory

→ produce Inventory.md + Spec-Inventory.md
→ LIMITED to Review-Scope

---

## Phase 2: Analysis

→ detect:

* architecture violations
* specification gaps
* inconsistencies

→ outputs:

* Findings.md
* Gap-Analysis.md

---

## Phase 3: Planning

→ unify tasks

→ output:

* Unified-Plan.md

---

## Phase 4: Iteration Loop

→ incrementally refine:

* Architecture.md
* specification documents

→ repeat until stable

---

# 🧠 Required Outputs

You MUST provide:

1. Folder Structure
2. State Schema
3. Review-Scope Schema
4. Phase Design
5. Prompt Templates
6. Execution Workflow
7. Config Strategy
8. Failure Handling

---

# ⚙️ Configurability

The system MUST support:

* review_domain: architecture | specification | hybrid
* depth: shallow | normal | deep
* scope: module | solution | system
* strictness: low | medium | high

AND targeted review parameters.

Explain how each parameter affects behavior.

---

# 🚫 Anti-Patterns

DO NOT:

* rely on conversation memory
* process full system in one step
* ignore scope boundaries
* skip state tracking
* mix phases

---

# 📦 Output Format

Return:

1. System Overview
2. Folder Structure
3. State Schema
4. Review-Scope Schema
5. Phase Design
6. Prompt Templates
7. Execution Workflow
8. Config Strategy
9. Failure Handling

Ensure implementation-ready detail.
```