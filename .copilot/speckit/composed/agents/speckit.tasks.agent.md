---
description: 依可用設計產物產生可執行且具相依序的 tasks.md。
handoffs: 
  - label: Analyze For Consistency
    agent: speckit.analyze
    prompt: Run a project analysis for consistency
    send: true
  - label: Implement Project
    agent: speckit.implement
    prompt: Start the implementation in phases
    send: true
---

## 使用者輸入

```text
$ARGUMENTS
```

若使用者輸入不為空，執行前**必須**先納入該輸入內容。

## 執行前檢查

**檢查擴充掛鉤（任務產生前）**：
- 確認專案根目錄是否存在 `.specify/extensions.yml`。
- 若存在，讀取並尋找 `hooks.before_tasks` 鍵下的條目。
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

1. **準備**：從 repository 根目錄執行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json`，解析 FEATURE_DIR 與 AVAILABLE_DOCS 清單。所有路徑必須使用絕對路徑。若參數含單引號（例如 "I'm Groot"），請使用轉義語法：如 `'I'\''m Groot'`（或改用雙引號 `"I'm Groot"`）。

2. **載入設計文件**：從 FEATURE_DIR 讀取：
   - **必要**：plan.md（技術棧、函式庫、結構）、spec.md（使用者故事及優先級）
   - **選用**：data-model.md（實體）、contracts/（介面契約）、research.md（決策）、quickstart.md（測試情境）
   - 注意：並非所有專案都有全部文件。依現有文件產生任務。

3. **執行任務產生流程**：
   - 載入 plan.md，提取技術棧、函式庫、專案結構
   - 載入 spec.md，提取使用者故事及其優先級（P1、P2、P3 等）
   - 若 data-model.md 存在：提取實體並映射至使用者故事
   - 若 contracts/ 存在：將介面契約映射至使用者故事
   - 若 research.md 存在：提取決策以供準備任務使用
   - 依使用者故事組織任務（見下方任務產生規則）
   - 產出使用者故事完成順序的相依圖
   - 為每個使用者故事建立平行執行範例
   - 驗證任務完整性（每個使用者故事具有所有必要任務，且可獨立測試）
   - **規範檢查**：載入 `/docs/policy/**` 下的所有檔案，驗證所有已產生的任務均未違反其中定義的規範或設計約束。若發現違規，須標記並要求解決後才能完成 tasks.md。

4. **產出 tasks.md**：以 `.specify/templates/tasks-template.md` 為結構，填入：
   - 來自 plan.md 的正確功能名稱
   - Phase 1：準備任務（專案初始化）
   - Phase 2：基礎任務（所有使用者故事的必要先決條件）
   - Phase 3+：依優先級順序每個使用者故事一個 Phase（來自 spec.md）
   - 每個 Phase 包含：故事目標、獨立測試標準、測試（若有要求）、實作任務
   - 最後 Phase：精煉與跨切點關注
   - 所有任務必須遵循嚴格的檢查清單格式（見下方任務產生規則）
   - 每個任務包含清晰的檔案路徑
   - 顯示故事完成順序的相依章節
   - 每個故事的平行執行範例
   - 實作策略章節（MVP 優先，漸進交付）

5. **回報**：輸出 tasks.md 路徑及摘要：
   - 任務總數
   - 每個使用者故事的任務數
   - 識別到的平行機會
   - 每個故事的獨立測試標準
   - 建議的 MVP 範圍（通常為使用者故事 1）
   - 格式驗證：確認所有任務遵循檢查清單格式（核取方塊、ID、標籤、檔案路徑）

6. **檢查擴充掛鉤**：tasks.md 產出後，確認專案根目錄是否存在 `.specify/extensions.yml`。
   - 若存在，讀取並尋找 `hooks.after_tasks` 鍵下的條目。
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

任務產生上下文：$ARGUMENTS

tasks.md 必須可立即執行——每個任務必須足夠具體，讓語言模型無需額外上下文即可完成。

## 任務產生規則

**重要**：任務必須依使用者故事組織，以支援獨立實作與測試。

**測試為選用**：僅在功能規格明確要求或使用者要求 TDD 方式時才產生測試任務。

### 清單格式（必要）

每個任務必須嚴格遵循以下格式：

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**格式元件**：

1. **核取方塊**：始終以 `- [ ]` 開頭（Markdown 核取方塊）
2. **任務 ID**：執行順序的流水號（T001、T002、T003…）
3. **[P] 標記**：僅在任務可平行執行時包含（不同檔案、無對未完成任務的相依）
4. **[Story] 標籤**：僅在使用者故事 Phase 任務中必要
   - 格式：[US1]、[US2]、[US3] 等（對應 spec.md 中的使用者故事）
   - 準備 Phase：不加故事標籤
   - 基礎 Phase：不加故事標籤
   - 使用者故事 Phase：必須加故事標籤
   - 精煉 Phase：不加故事標籤
5. **說明**：清晰的操作說明附精確的檔案路徑

**範例**：

- ✅ 正確：`- [ ] T001 Create project structure per implementation plan`
- ✅ 正確：`- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ 正確：`- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ 正確：`- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
- ❌ 錯誤：`- [ ] Create User model`（缺少 ID 和故事標籤）
- ❌ 錯誤：`T001 [US1] Create model`（缺少核取方塊）
- ❌ 錯誤：`- [ ] [US1] Create User model`（缺少任務 ID）
- ❌ 錯誤：`- [ ] T001 [US1] Create model`（缺少檔案路徑）

### 任務組織

1. **來自使用者故事（spec.md）** — 主要組織依據：
   - 每個使用者故事（P1、P2、P3…）各自一個 Phase
   - 將所有相關元件映射至其故事：
     - 該故事需要的模型
     - 該故事需要的服務
     - 該故事需要的介面／UI
     - 若有要求測試：該故事專屬的測試
   - 標記故事相依（大多數故事應相互獨立）

2. **來自契約**：
   - 每個介面契約 → 映射至其服務的使用者故事
   - 若有要求測試：每個介面契約 → 在該故事 Phase 中對應實作前的契約測試任務 [P]

3. **來自資料模型**：
   - 將每個實體映射至需要它的使用者故事
   - 若實體服務多個故事：放入最早的故事或準備 Phase
   - 關聯 → 在適當故事 Phase 中的服務層任務

4. **來自準備／基礎設施**：
   - 共用基礎設施 → 準備 Phase（Phase 1）
   - 基礎性阻塞任務 → 基礎 Phase（Phase 2）
   - 故事專屬準備 → 放入對應故事 Phase

### Phase 結構

- **Phase 1**：準備（專案初始化）
- **Phase 2**：基礎（所有使用者故事的必要阻塞先決條件）
- **Phase 3+**：依優先級順序的使用者故事（P1、P2、P3…）
  - 每個故事內部：測試（若有要求）→ 模型 → 服務 → 端點 → 整合
  - 每個 Phase 應為可獨立測試的完整交付增量
- **最後 Phase**：精煉與跨切點關注


