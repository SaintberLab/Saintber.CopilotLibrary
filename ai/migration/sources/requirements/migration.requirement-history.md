# migration 模組需求歷程

| Version | Date | Summary |
|---------|------|---------|
| 未發布 | 2026-04-30 | 新增舊專案 DI/IOC 逐步導入工具鏈：盤點、雙向複檢、分批導入、最終驗證與待釐清輸出 |

---

## [未發布]

### 2026-04-30

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
