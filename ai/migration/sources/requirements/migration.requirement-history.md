# migration 模組需求歷程

| Version | Date | Summary |
|---------|------|---------|
| 0.3.0 | 2026-04-30 | 擴大 DI/IOC 流程為通用後端遷移重構工具：新增可重用 prompt/skill、保留 DI/IOC 專用 prompt，並強化盤點/複檢/分批導入/驗證迴圈規範 |
| 0.3.0 | 2026-04-30 | 整合 templates 與 scripts 安裝至 AI 演化流程：擴展 CLI 支援 `scripts` 與 `docs` 文件類型，遷移 DI/IOC 工具相關資源至 `/templates/migration/` |
| 0.3.0 | 2026-04-30 | 新增舊專案 DI/IOC 逐步導入工具鏈：盤點、雙向複檢、分批導入、最終驗證與待釐清輸出 |

---

## [未發布]

（本區段保留供下一輪需求記錄）

---

## [0.3.0] - 2026-04-30

### 2026-04-30（第三筆）

**Recorded At**: 2026-04-30  
**Change Summary**: 將既有 DI/IOC 導入流程擴大為可重用的後端通用遷移重構工具鏈；新增 `/migration.adopt-backend-modernization` prompt 與 `migration.backend-modernization` skill，支援盤點、雙向抽樣複檢、分批導入與最終驗證；補強 `code.migration-conventions.instructions.md` 與 `migration.dotnet-modernizer.agent.md` 的通用品質迴圈規範，並保留 `/migration.adopt-di-ioc` 作為 DI/IOC 精準專用命令。  
**Affected Artifacts**: code.migration-conventions.instructions.md, migration.dotnet-modernizer.agent.md, migration.adopt-backend-modernization.prompt.md, migration.backend-modernization.skill.md, ai/migration/prompts/migration.adopt-backend-modernization.prompt.md, ai/migration/skills/migration.backend-modernization.skill.md, ai/composed/en/**, ai/composed/zh-TW/**, ai/migration/README.md, CHANGELOG.md  
**Original Requirement**:
```
目的：製作一套遷移 C# 後端程式碼的 AI 工具
背景：
- 原本已有 DI/IOC 遷移工具，發現流程符合大多數遷移需求
- 太多重構需求需一套流程來逐步導入
- 可參考原本 DI/IOC 遷移工具，或改寫/擴大原本 DI/IOC 遷移工具的適用範圍
需求：
- 需先進行遷移目標的盤點
- 盤點後需再複檢是否正確清點出所有遷移目標以及是否誤判目標
- 盤點/檢視後依據盤點結果逐步導入
- 最後應再檢視導入結果是否正確
- 應保留參數決定修改範圍
- 不一定有深度參數，若符合深度參數，則 => 深度為直接命中目標，只盤點/修改範圍內沒有遷移目標；深度為遞迴搜尋，則尋找每個物件的參考物件是否導，直到沒有參考物件為止
- 盤點結果應包含 .csv 檔案
- 盤點結果欄位至少應包含檔案、行數、參考物件、處理狀態、程式碼
- 應考量適合做成 skill 與 agent 的部分，以利未來可以 reuse
- 可依你的評估，考慮新增一套通用遷移工具，或擴大 DI/IOC 工具為通用遷移工具
- 針對 DI/IOC 仍應保有自己的 prompt 以精確執行 DI/IOC 任務

預計項目(可再建議更好作法，與我討論後再進行)：
- 預計盤點會使用 Script 進行盤點，若檢核結果有缺失再反覆完善 Script 進行盤點
- 若有 Script 無法精確命中，需要 AI 支援的部分則修正 AI 以正確盤點
- 若須 AI 支援則應規劃掃瞄範圍逐範圍掃描，以免 context 過大造成品質下降
- 檢視盤點結果應包含「盤點結果表」的抽樣檢核(確認已盤出的結果是否誤判)、「原始程式碼」的抽樣檢核(確認是否有遺漏未列入盤點表的項目)
- 檢視修改結果我只想到 build 檢核
```

---

### 2026-04-30（第二筆）

**Recorded At**: 2026-04-30  
**Change Summary**: 整合 templates 與 scripts 安裝至 AI 演化流程，擴展 CLI `src/cli.js` 新增 `scripts` 與 `docs` artifact 類型，支援 `templates/[module]/scripts/` 與 `templates/[module]/docs/` 目錄結構；遷移 DI/IOC 工具相關文件（盤點指令稿、導入指南、待釐清範本）至 `/templates/migration/` 新目錄結構，使 CLI 命令可直接管理腳本與文件資源；更新 `ai/migration/README.md` 指向新的發行路徑。  
**Affected Artifacts**: src/cli.js, templates/migration/scripts/di-ioc-inventory-script.template.ps1, templates/migration/docs/DI-IOC-ADOPTION-GUIDE.md, templates/migration/docs/di-ioc-clarification-template.md, ai/migration/README.md, CHANGELOG.md  
**Original Requirement**:
```
需求：整合 template 發行/安裝至 AI 演化流程內

規劃與調整：
- 決定 template/script 安裝目錄結構：建議 `/templates/migration/scripts/` 與 `/templates/migration/docs/` 
- 更新 cli.js 以將 templates 納入安裝/更新/移除等流程：
  - 增加 ARTIFACT_DIRS 以支援 `scripts` 與 `docs` 兩種類型
  - 更新 collectTemplateEntries / resolveTemplateEntry 以支援新類型
  - 更新 resolveDestinationPath 以正確映射到 templates/[module]/ 結構
- 遷移檔案：
  - `/templates/migration/scripts/` 下放 PowerShell / bash 指令稿（di-ioc-inventory-script.template.ps1 等）
  - `/templates/migration/docs/` 下放 Markdown 文件（DI-IOC-ADOPTION-GUIDE.md, di-ioc-clarification-template.md）
- 同步更新 migration 工具：
  - README 指向 templates/ 路徑
  - 指南中的相對路徑改為 templates 發行路徑
```

---

### 2026-04-30（第一筆）

**Recorded At**: 2026-04-30  
**Change Summary**: 建立可重用的 DI/IOC 導入流程，新增 `migration.di-ioc-adoption` skill 與 `/migration.adopt-di-ioc` prompt，並補強 `migration.dotnet-modernizer` agent 與 `code.migration-conventions.instructions.md` 的穩定規範；流程包含 scope/depth 參數、CSV 盤點輸出、雙向抽樣複檢、分批導入與最終驗證，另對 static class 的模糊實例化案例以 `Pending Clarification` 輸出問題釐清文件。  
**Affected Artifacts**: code.migration-conventions.instructions.md, migration.dotnet-modernizer.agent.md, migration.adopt-di-ioc.prompt.md, migration.di-ioc-adoption.skill.md, ai/composed/en/**, ai/composed/zh-TW/**, ai/migration/README.md, CHANGELOG.md  
**Original Requirement**:
```
目的：製作一套將未導入 DI/IOC 導入 DI/IOC 的 AI 工具
需求：
- 有舊專案未導入 DI/IOC，需一套流程來逐步導入 DI/IOC
- 因為是精確工作，需先進行 DI/IOC 目標的盤點
- 盤點後需再複檢是否正確清點出所有 DI/IOC 目標以及是否誤判目標
- 盤點/檢視後依據盤點結果逐步導入 DI/IOC
- 最後應再檢視導入結果是否正確
- 應保留參數決定修改範圍
- 應保留參數決定深度，若深度為直接命中目標，則只盤點/修改範圍內沒有 DI/IOC 的目標，若深度為遞迴搜尋，則尋找每個物件的參考物件是否導入 DI/IOC，直到沒有參考物件為止
- 盤點結果應包含 .csv 檔案
- 盤點結果欄位至少應包含檔案、行數、參考物件、處理狀態、程式碼
- 應考量適合做成 skill 與 agent 的部分，以利未來可以 reuse

預計項目(可再建議更好作法，與我討論後再進行)：
- 預計盤點會使用 Script 進行盤點，若檢核結果有缺失再反覆完善 Script 進行盤點
- 若有 Script 無法精確命中，需要 AI 支援的部分則修正 AI 以正確盤點
- 若須 AI 支援則應規劃掃瞄範圍逐範圍掃描，以免 context 過大造成品質下降
- 檢視盤點結果應包含「盤點結果表」的抽樣檢核(確認已盤出的結果是否誤判)、「原始程式碼」的抽樣檢核(確認是否有遺漏未列入盤點表的項目)
- 檢視修改結果我只想到 build 檢核
- 被寫進 static class 的 new 物件，若有需要釐清才能調整的，可定義為待釐清的狀態，並產生問題釐清的文件，由開發人員回覆後一併或逐步調整
```

---
