---
description: 使用 plan 模板執行實作規劃流程並產出設計產物。
handoffs: 
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: speckit.checklist
    prompt: Create a checklist for the following domain...
---

## 使用者輸入

```text
$ARGUMENTS
```

若使用者輸入不為空，執行前**必須**先納入該輸入內容。

## 執行前檢查

**檢查擴充掛鉤（規劃前）**：
- 確認專案根目錄是否存在 `.specify/extensions.yml`。
- 若存在，讀取並尋找 `hooks.before_plan` 鍵下的條目。
- 若 YAML 無法解析或格式無效，靜默跳過掛鉤檢查，繼續正常執行。
- 將 `enabled` 明確設為 `false` 的掛鉤過濾掉；未設定 `enabled` 欄位的掛鉤預設視為啟用。
- 對於每個剩餘掛鉤，**不得**嘗試解譯或評估 `condition` 運算式：
  - 若掛鉤無 `condition` 欄位，或值為 null／空，視為可執行。
  - 若掛鉤定義了非空 `condition`，跳過該掛鉤，將條件評估留給 HookExecutor 實作。
- 依 `optional` 旗標輸出以下內容：
  - **可選掛鉤**（`optional: true`）：
    ```
    ## Extension Hooks

    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **強制掛鉤**（`optional: false`）：
    ```
    ## Extension Hooks

    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}

    Wait for the result of the hook command before proceeding to the Outline.
    ```
- 若無已登錄掛鉤或 `.specify/extensions.yml` 不存在，靜默跳過。

## 流程概述

1. **準備**：從 repository 根目錄執行 `.specify/scripts/powershell/setup-plan.ps1 -Json`，解析 JSON 取得 FEATURE_SPEC、IMPL_PLAN、SPECS_DIR、BRANCH。若參數含單引號（例如 "I'm Groot"），請使用轉義語法：如 `'I'\''m Groot'`（或改用雙引號 `"I'm Groot"`）。

2. **載入上下文**：讀取 FEATURE_SPEC 與 `.specify/memory/constitution.md`。載入 IMPL_PLAN 範本（已複製）。
   - 同時載入 `/docs/policy/**` 下的所有檔案，作為必要的規範與設計約束。填寫計畫範本及評估閘門時，這些約束屬於不可妥協的要求。

3. **執行規劃流程**：依 IMPL_PLAN 範本結構執行：
   - 填寫技術上下文（未知項目標記為「NEEDS CLARIFICATION」）
   - 從憲章填寫 Constitution Check 章節
   - 評估閘門（違規且無正當理由時輸出 ERROR）
   - Phase 0：產出 research.md（解決所有 NEEDS CLARIFICATION）
   - Phase 1：產出 data-model.md、contracts/、quickstart.md
   - Phase 1：執行 agent 腳本更新 agent 上下文
   - 設計後重新評估 Constitution Check

4. **停止並回報**：命令在 Phase 2 規劃後結束。回報分支、IMPL_PLAN 路徑及已產出的產物。

5. **檢查擴充掛鉤**：回報後，確認專案根目錄是否存在 `.specify/extensions.yml`。
   - 若存在，讀取並尋找 `hooks.after_plan` 鍵下的條目。
   - 若 YAML 無法解析或格式無效，靜默跳過掛鉤檢查，繼續正常執行。
   - 將 `enabled` 明確設為 `false` 的掛鉤過濾掉；未設定 `enabled` 欄位的掛鉤預設視為啟用。
   - 對於每個剩餘掛鉤，**不得**嘗試解譯或評估 `condition` 運算式：
     - 若掛鉤無 `condition` 欄位，或值為 null／空，視為可執行。
     - 若掛鉤定義了非空 `condition`，跳過該掛鉤，將條件評估留給 HookExecutor 實作。
   - 依 `optional` 旗標輸出以下內容：
     - **可選掛鉤**（`optional: true`）：
       ```
       ## Extension Hooks

       **Optional Hook**: {extension}
       Command: `/{command}`
       Description: {description}

       Prompt: {prompt}
       To execute: `/{command}`
       ```
     - **強制掛鉤**（`optional: false`）：
       ```
       ## Extension Hooks

       **Automatic Hook**: {extension}
       Executing: `/{command}`
       EXECUTE_COMMAND: {command}
       ```
   - 若無已登錄掛鉤或 `.specify/extensions.yml` 不存在，靜默跳過。

## 階段

### Phase 0：概述與研究

1. **從上方技術上下文中提取未知項目**：
   - 每個 NEEDS CLARIFICATION → 研究任務
   - 每個相依套件 → 最佳實踐任務
   - 每個整合點 → 模式任務

2. **產出並分派研究 agents**：

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. 以下列格式在 `research.md` 中**彙整研究結果**：
   - Decision：（所選方案）
   - Rationale：（選擇理由）
   - Alternatives considered：（評估過的其他方案）

**輸出**：research.md，且所有 NEEDS CLARIFICATION 已解決。

### Phase 1：設計與契約

**先決條件：** `research.md` 已完成

1. **從功能規格中提取實體** → `data-model.md`：
   - 實體名稱、欄位、關聯
   - 來自需求的驗證規則
   - 適用時的狀態轉移

2. **定義介面契約**（若專案有對外介面）→ `/contracts/`：
   - 識別專案對使用者或其他系統暴露的介面
   - 依專案類型記錄合適的契約格式
   - 範例：函式庫的公開 API、CLI 的命令結構、Web 服務的端點、解析器的語法規則、應用程式的 UI 契約
   - 若專案為純內部用途（建置腳本、一次性工具等），則跳過此步驟

3. **Agent 上下文更新**：
   - 執行 `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
   - 此腳本會偵測目前使用的 AI agent
   - 更新對應的 agent 專屬上下文檔案
   - 僅新增目前計畫中出現的新技術
   - 保留標記之間的手動新增內容

**輸出**：data-model.md、/contracts/*、quickstart.md、agent 專屬檔案

## 關鍵規則

- 使用絕對路徑
- 閘門違規或未解決的 NEEDS CLARIFICATION 時輸出 ERROR


