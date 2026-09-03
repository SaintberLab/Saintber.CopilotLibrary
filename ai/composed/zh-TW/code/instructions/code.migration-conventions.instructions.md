---
description: 從 .NET Framework 4.7 ASP.NET MVC 遷移至 .NET 8 ASP.NET Core MVC 的穩定慣例、原則、禁止事項與輸出行為規則。
applyTo: "MAS_Batch/**,MAS_Web/**,Mas_Library/**,MAS_Bst/**,MAS_Gov/**,MAS_DataBase/**,Packages/**"
---

# 目的
為 .NET Framework 4.7 ASP.NET MVC 遷移至 .NET 8 ASP.NET Core MVC 提供穩定行為規則、限制與輸出要求。

# 遷移範圍（資訊性）
- **來源平台**: .NET Framework 4.7、ASP.NET MVC、Kendo UI 2017、Microsoft SQL Server
- **目標平台**: .NET 8、ASP.NET Core MVC、Kendo UI 2024、PostgreSQL
- **前端**: ASP.NET MVC + Kendo UI 2017 -> ASP.NET Core MVC + Kendo UI 2024（保留前端技術，不做框架重寫）
- **資料庫遷移**: SQL Server → PostgreSQL
- **新增基礎設施元件**: Redis、Seq、Cloud Logging (GCP)、Google Cloud Storage (GCS)

# 核心原則（穩定行為規則）
- **優先保留業務行為。** 除非為了相容性、正確性或可維護性，不得改動業務邏輯。
- **優先採增量且可回滾的遷移。** 避免一次性大改，應以可獨立部署與可回滾的階段推進。
- **基礎設施橫切關注需顯性化。** 日誌、快取、儲存、外部整合應透過抽象（interface、DI）表達，不可隱藏在實作細節。
- **資料庫遷移需可稽核且可測。** 每次 schema 變更都應可追蹤（如 EF Core migration 或版控 SQL）、可審查、可獨立測試。
- **優先使用 composition、DI、typed configuration、structured logging**，避免 static access、service locator、string-key configuration 與非結構化 log。

# 非目標（禁止事項）
- **不得引入不必要的前端框架重寫。** 除非明確指示，預設保留 Kendo UI + ASP.NET MVC views。
- **不得重設計業務規則**，除非相容性、正確性或可維護性必要。
- **不得預設拆成微服務。** 除非明確指示，預設 monolith-first 遷移。

# 輸出要求（Copilot 輸出行為）
- **遷移相關回覆一律先列出假設。**
- **涉及程式碼變更時**，必須說明相容性風險與後續必要作業（套件升級、設定調整、測試缺口等）。
- **涉及遷移計畫時**，必須提供：分階段步驟、風險、驗證標準、回滾策略。
- **避免模糊建議。** 需提供檔案/模組層級具體指引（改哪個檔、哪個類別、哪個介面）。
- **不得省略 breaking changes。** 若會影響呼叫端或資料契約，必須明確標示。
- **所有執行計畫必須符合 `/docs/policy/`。** 完成計畫前必須檢查相關政策文件。

# 先計畫後實作（Migration Work 必要流程）
對於架構遷移、後端遷移、前端遷移與 MVC 功能遷移：
1. 先檢視 `/Tasks/` 下對應範本
2. 若範本不足，先更新範本
3. 由範本產生範圍專屬執行計畫
4. 依計畫逐步執行
5. 必須產出「更新後範本」與「範圍專屬計畫」的繁中備份

除非使用者明確要求一次性回答，否則不得跳過計畫直接實作。

# 後端通用遷移重構品質迴圈（必要）
對於 Legacy 後端遷移重構任務（包含但不限於 DI/IOC 導入、設定現代化、框架相容替換），遷移回覆必須遵循以下流程：
1. 先盤點遷移目標，且明確指定 `scan_scope` 與 `modify_scope`。
2. 盤點後進行雙向複檢：
	- 由盤點表抽樣（確認誤判）
	- 由原始碼抽樣（確認漏判）
3. 只依據已複檢結果分批導入重構。
4. 每批導入與整體導入後都要做最終驗證（至少 build 驗證；可行時加入執行期 smoke checks）。
5. 對無法安全判定的項目標記 `Pending Clarification`，並產出問題釐清文件。

深度行為（選填）：
- 若未提供 `depth_mode`，預設採範圍內直接盤點與修改。
- `direct-hit`: 僅包含指定範圍內尚未完成本次遷移目標的項目。
- `recursive-search`: 遞迴追蹤參考物件並檢查遷移狀態，直到沒有新參考為止。

通用盤點輸出要求：
- 盤點結果必須包含 `.csv` 成果。
- CSV 必填欄位：`File`、`Line`、`ReferencedObject`、`ProcessingStatus`、`Code`。
- `ProcessingStatus` 至少要可區分：`Candidate`、`FalsePositive`、`MissingCandidate`、`Pending Clarification`、`Completed`。

執行品質要求：
- 預設以 script-assisted 盤點為主。
- 若 script 精準率/召回率不足，先反覆完善 script，再以 AI 對「有限範圍分區」進行輔助分析，避免 context 過載。

# DI/IOC 導入品質迴圈（必要）
對於尚未導入 DI/IOC 的 Legacy 專案，遷移回覆必須遵循以下流程：
1. 先盤點 DI/IOC 目標，且必須有明確 `scope` 與 `depth` 參數。
2. 盤點後進行雙向複檢：
	- 由盤點表抽樣（確認誤判）
	- 由原始碼抽樣（確認漏判）
3. 只依據已複檢結果分批導入 DI/IOC。
4. 導入後做最終驗證（至少 build 驗證；可行時加入執行期 smoke checks）。
5. static `new` 若需額外業務釐清，標記 `Pending Clarification` 並輸出問題釐清文件。

深度參數要求：
- `direct-hit`: 僅盤點指定範圍內尚未導入 DI/IOC 的目標。
- `recursive-search`: 由目標一路遞迴追蹤參考物件並檢查 DI/IOC 狀態，直到無新參考為止。

盤點輸出要求：
- 盤點結果必須包含 `.csv` 成果。
- CSV 必填欄位：`File`、`Line`、`ReferencedObject`、`ProcessingStatus`、`Code`。
- `ProcessingStatus` 至少要可區分：`Candidate`、`FalsePositive`、`MissingCandidate`、`Pending Clarification`、`Completed`。

執行品質要求：
- 預設以 script-assisted 盤點為主。
- 若 script 精準率/召回率不足，先反覆完善 script，再以 AI 對「有限範圍分區」進行輔助分析，避免 context 過載。

# 必要範本
- `/Tasks/architecture-migration-template.md`
- `/Tasks/backend-migration-template.md`
- `/Tasks/frontend-migration-template.md`