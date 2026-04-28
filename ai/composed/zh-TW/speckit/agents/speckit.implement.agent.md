---
description: 依 tasks.md 逐步執行實作計畫中的任務。
---

## 使用者輸入

```text
$ARGUMENTS
```

若使用者輸入不為空，執行前**必須**先納入該輸入內容。

## 執行前檢查

**檢查擴充掛鉤（實作前）**：
- 確認專案根目錄是否存在 `.specify/extensions.yml`。
- 若存在，讀取並尋找 `hooks.before_implement` 鍵下的條目。
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

1. 從 repository 根目錄執行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`，解析 FEATURE_DIR 與 AVAILABLE_DOCS 清單。所有路徑必須使用絕對路徑。若參數含單引號（例如 "I'm Groot"），請使用轉義語法：如 `'I'\''m Groot'`（或改用雙引號 `"I'm Groot"`）。

2. **確認清單狀態**（若 FEATURE_DIR/checklists/ 存在）：
   - 掃描 checklists/ 目錄中的所有清單檔案
   - 對每份清單計算：
     - 總項目數：符合 `- [ ]` 或 `- [X]` 或 `- [x]` 的所有行
     - 已完成項目數：符合 `- [X]` 或 `- [x]` 的行
     - 未完成項目數：符合 `- [ ]` 的行
   - 建立狀態表格：

     ```text
     | Checklist | Total | Completed | Incomplete | Status |
     |-----------|-------|-----------|------------|--------|
     | ux.md     | 12    | 12        | 0          | ✓ PASS |
     | test.md   | 8     | 5         | 3          | ✗ FAIL |
     | security.md | 6   | 6         | 0          | ✓ PASS |
     ```

   - 計算整體狀態：
     - **PASS**：所有清單未完成項目數為 0
     - **FAIL**：一份或多份清單有未完成項目

   - **若有清單未完成**：
     - 顯示附有未完成項目數的表格
     - **暫停**並詢問：「Some checklists are incomplete. Do you want to proceed with implementation anyway? (yes/no)」
     - 等待使用者回應才繼續
     - 若使用者回答「no」、「wait」或「stop」，停止執行
     - 若使用者回答「yes」、「proceed」或「continue」，繼續進行步驟 3

   - **若所有清單均已完成**：
     - 顯示所有清單通過的表格
     - 自動繼續進行步驟 3

3. 載入並分析實作上下文：
   - **必要**：讀取 tasks.md 取得完整任務清單與執行計畫
   - **必要**：讀取 plan.md 取得技術棧、架構與檔案結構
   - **若存在**：讀取 data-model.md 取得實體與關聯
   - **若存在**：讀取 contracts/ 取得 API 規格與測試需求
   - **若存在**：讀取 research.md 取得技術決策與約束
   - **若存在**：讀取 quickstart.md 取得整合情境
   - **若存在** `/docs/policy/**`：載入所有規範文件，作為不可妥協的設計與實作約束。開始執行前，先標記任何違反這些規範的任務並暫停直到解決完畢。

4. **專案準備驗證**：
   - **必要**：依實際專案設定建立或確認 ignore 檔案：

   **偵測與建立邏輯**：
   - 透過以下命令確認是否為 git repository（若是，建立或確認 .gitignore）：

     ```sh
     git rev-parse --git-dir 2>/dev/null
     ```

   - 若存在 Dockerfile* 或 plan.md 提及 Docker → 建立或確認 .dockerignore
   - 若存在 .eslintrc* → 建立或確認 .eslintignore
   - 若存在 eslint.config.* → 確認 config 的 `ignores` 條目涵蓋必要模式
   - 若存在 .prettierrc* → 建立或確認 .prettierignore
   - 若存在 .npmrc 或 package.json → 建立或確認 .npmignore（若有發佈需求）
   - 若存在 terraform 檔案（*.tf）→ 建立或確認 .terraformignore
   - 若需要 .helmignore（存在 helm charts）→ 建立或確認 .helmignore

   **若 ignore 檔案已存在**：確認含有必要模式，僅補充缺少的關鍵模式
   **若 ignore 檔案不存在**：依偵測到的技術建立完整模式集

   **各技術常見模式**（來自 plan.md 技術棧）：
   - **Node.js/JavaScript/TypeScript**：`node_modules/`、`dist/`、`build/`、`*.log`、`.env*`
   - **Python**：`__pycache__/`、`*.pyc`、`.venv/`、`venv/`、`dist/`、`*.egg-info/`
   - **Java**：`target/`、`*.class`、`*.jar`、`.gradle/`、`build/`
   - **C#/.NET**：`bin/`、`obj/`、`*.user`、`*.suo`、`packages/`
   - **Go**：`*.exe`、`*.test`、`vendor/`、`*.out`
   - **Ruby**：`.bundle/`、`log/`、`tmp/`、`*.gem`、`vendor/bundle/`
   - **PHP**：`vendor/`、`*.log`、`*.cache`、`*.env`
   - **Rust**：`target/`、`debug/`、`release/`、`*.rs.bk`、`*.rlib`、`*.prof*`、`.idea/`、`*.log`、`.env*`
   - **Kotlin**：`build/`、`out/`、`.gradle/`、`.idea/`、`*.class`、`*.jar`、`*.iml`、`*.log`、`.env*`
   - **C++**：`build/`、`bin/`、`obj/`、`out/`、`*.o`、`*.so`、`*.a`、`*.exe`、`*.dll`、`.idea/`、`*.log`、`.env*`
   - **C**：`build/`、`bin/`、`obj/`、`out/`、`*.o`、`*.a`、`*.so`、`*.exe`、`*.dll`、`autom4te.cache/`、`config.status`、`config.log`、`.idea/`、`*.log`、`.env*`
   - **Swift**：`.build/`、`DerivedData/`、`*.swiftpm/`、`Packages/`
   - **R**：`.Rproj.user/`、`.Rhistory`、`.RData`、`.Ruserdata`、`*.Rproj`、`packrat/`、`renv/`
   - **通用**：`.DS_Store`、`Thumbs.db`、`*.tmp`、`*.swp`、`.vscode/`、`.idea/`

   **工具專屬模式**：
   - **Docker**：`node_modules/`、`.git/`、`Dockerfile*`、`.dockerignore`、`*.log*`、`.env*`、`coverage/`
   - **ESLint**：`node_modules/`、`dist/`、`build/`、`coverage/`、`*.min.js`
   - **Prettier**：`node_modules/`、`dist/`、`build/`、`coverage/`、`package-lock.json`、`yarn.lock`、`pnpm-lock.yaml`
   - **Terraform**：`.terraform/`、`*.tfstate*`、`*.tfvars`、`.terraform.lock.hcl`
   - **Kubernetes/k8s**：`*.secret.yaml`、`secrets/`、`.kube/`、`kubeconfig*`、`*.key`、`*.crt`

5. 解析 tasks.md 結構並提取：
   - **任務 Phase**：準備、測試、核心、整合、精煉
   - **任務相依**：循序與平行執行規則
   - **任務詳情**：ID、說明、檔案路徑、平行標記 [P]
   - **執行流程**：順序與相依需求

6. 依任務計畫執行實作：
   - **逐 Phase 執行**：完成每個 Phase 後才進入下一個
   - **遵守相依關係**：循序任務依序執行，平行任務 [P] 可同時執行
   - **遵循 TDD 方式**：先執行測試任務，再執行對應的實作任務
   - **基於檔案的協調**：影響相同檔案的任務必須循序執行
   - **驗證檢查點**：在繼續前確認每個 Phase 已完成

7. 實作執行規則：
   - **先準備**：初始化專案結構、相依套件、設定
   - **先測試後寫碼**：若需要為契約、實體和整合情境撰寫測試
   - **核心開發**：實作模型、服務、CLI 命令、端點
   - **整合工作**：資料庫連線、中介軟體、日誌、外部服務
   - **精煉與驗證**：單元測試、效能最佳化、文件

8. 進度追蹤與錯誤處理：
   - 每完成一個任務後回報進度
   - 若任何非平行任務失敗，停止執行
   - 對於平行任務 [P]，繼續執行成功的任務，回報失敗的任務
   - 提供清晰的錯誤訊息與除錯上下文
   - 若無法繼續實作，建議下一步行動
   - **重要**：對已完成的任務，務必在任務檔中將其標記為 [X]。

9. 完成驗證：
   - 驗證所有必要任務均已完成
   - 確認實作的功能符合原始規格
   - 驗證測試通過且覆蓋率符合要求
   - 確認實作遵循技術計畫
   - 回報最終狀態以及已完成工作的摘要

注意：此命令假設 tasks.md 中已有完整的任務分解。若任務不完整或找不到，建議先執行 `/speckit.tasks` 重新產生任務清單。

10. **檢查擴充掛鉤**：完成驗證後，確認專案根目錄是否存在 `.specify/extensions.yml`。
    - 若存在，讀取並尋找 `hooks.after_implement` 鍵下的條目。
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


