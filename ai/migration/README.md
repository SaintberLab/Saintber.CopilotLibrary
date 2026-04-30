# migration Module Guide

`migration` 用於 .NET Framework -> .NET 8 功能遷移、規劃與審查，並提供可重用的 DI/IOC 盤點、複檢、逐步導入流程。

## Agents

- `migration.solution-architect`
  - 規劃舊版 ASP.NET MVC 至 .NET 8 的大規模遷移架構。
- `migration.dotnet-modernizer`
  - 將 .NET Framework / ASP.NET MVC 程式碼現代化至 .NET 8。
- `migration.mvc-kendo-migrator`
  - 將 ASP.NET MVC views 與 Kendo UI 2017 遷移至 ASP.NET Core MVC + Kendo UI 2024。
- `migration.db-architect`
  - 規劃與審查 SQL Server -> PostgreSQL 的資料庫遷移。
- `migration.platform-infra-architect`
  - 設計 Redis、Seq、Cloud Logging、GCS 整合方案。
- `migration.reviewer`
  - 嚴格審查遷移計畫與程式碼變更的正確性與風險。

## Prompts（Slash Commands）

- `/migration.analyze-legacy-solution`
  - 分析舊版 .NET Framework MVC solution 並產出遷移待辦清單。
- `/migration.plan-module`
  - 為單一模組建立詳細遷移計畫。
- `/migration.prepare-architecture-plan`
  - 審查或更新架構遷移範本，再建立指定範圍的架構遷移計畫。
- `/migration.prepare-backend-plan`
  - 審查或更新後端遷移範本，再建立指定範圍的後端遷移計畫。
- `/migration.adopt-di-ioc`
  - 先盤點 DI/IOC 目標並輸出 CSV，再做抽樣複檢、分批導入與最終驗證。
- `/migration.prepare-frontend-plan`
  - 審查或更新前端遷移範本，再建立指定範圍的前端遷移計畫。
- `/migration.migrate-controller-and-view`
  - 將 MVC controller 與 Razor/Kendo views 遷移至 ASP.NET Core MVC。
- `/migration.migrate-mvc-feature-by-plan`
  - 先備妥計畫檔，再依計畫完整遷移一個 MVC 功能。
- `/migration.migrate-sql-to-postgres`
  - 將 SQL Server schema 或 SQL 邏輯改寫為 PostgreSQL 版本。
- `/migration.add-observability-and-infra`
  - 為已遷移功能新增平台整合與可觀測性設計。
- `/migration.review-output`
  - 嚴格審查遷移計畫或程式碼變更的正確性與風險。

## Skills

- `migration.di-ioc-adoption`
  - 定義 DI/IOC 導入的單一參數化流程契約（scope/depth、CSV 欄位、雙向抽樣複檢、待釐清輸出）。

## DI/IOC Adoption Resources

### 工作指南
- [templates/migration/docs/DI-IOC-ADOPTION-GUIDE.md](../../templates/migration/docs/DI-IOC-ADOPTION-GUIDE.md) - 完整工作流程指南，涵蓋參數確認、盤點執行、雙向複檢、分批導入、驗證與待釐清處理

### 樣板與腳本
- [templates/migration/scripts/di-ioc-inventory-script.template.ps1](../../templates/migration/scripts/di-ioc-inventory-script.template.ps1) - PowerShell 盤點指令稿樣板（direct-hit / recursive-search）
- [templates/migration/docs/di-ioc-clarification-template.md](../../templates/migration/docs/di-ioc-clarification-template.md) - Pending Clarification 待釐清文件範本

## 使用案例
### 範例 1：分析一個舊 MVC 模組並產出遷移計畫
```text
/migration.analyze-legacy-solution MAS_Web/Controllers/BatchController.cs
```

### 範例 2：後端遷移實作
```text
/migration.prepare-backend-plan MAS_Web/Controllers/UserController.cs
```

### 範例 3：Kendo View 遷移
```text
/migration.migrate-controller-and-view MAS_Web/Views/Batch/Index.cshtml
```

### 範例 4：SQL Server -> PostgreSQL 改寫
```text
/migration.migrate-sql-to-postgres MAS_DataBase/Procedures/sp_GetBatchList.sql
```

### 範例 5：審查遷移成果
```text
/migration.review-output MAS_Web/Controllers/ReportController.cs
```
