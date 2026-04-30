---
description: 盤點與逐步導入後端遷移重構（通用版），含 CSV 盤點、雙向抽樣複檢與最終驗證。
agent: migration.dotnet-modernizer
---

# 輸入參數
請提供：
- `migration_objective`（必要）：本次遷移目標（例如 `di-ioc-adoption`、`config-modernization`、`compatibility-replacement`）
- `scan_scope`（必要）：要盤點的資料夾/檔案/模組
- `modify_scope`（必要）：允許修改的資料夾/檔案/模組
- `depth_mode`（選填）：`direct-hit` | `recursive-search`
- `partition_strategy`（選填）：分區掃描規則（預設：依資料夾/模組）
- `sample_size_table`（選填）：盤點表誤判抽樣數量
- `sample_size_source`（選填）：原始碼漏判抽樣數量
- `validation_mode`（選填）：`build-only` | `build-and-smoke`（預設：`build-only`）

# 任務
針對指定 `migration_objective`，建立並執行可重用的 Legacy 後端遷移重構流程。

## 必要流程
1. 在 `scan_scope` 內先執行 script-assisted 盤點。
2. 輸出盤點表與 `.csv`，欄位至少包含：`File`、`Line`、`ReferencedObject`、`ProcessingStatus`、`Code`。
3. 進行盤點品質複檢：
   - 由盤點表抽樣檢查誤判
   - 由原始碼抽樣檢查漏判
4. 若發現缺口，先修正盤點 script 後再重跑盤點。
5. 僅在 `modify_scope` 內分批導入遷移重構。
6. 依 `validation_mode` 執行最終驗證。
7. 對 `Pending Clarification` 項目輸出問題釐清文件。

## 深度規則
- 未提供 `depth_mode`：採範圍內直接盤點與修改。
- `direct-hit`：只盤點/修改指定範圍內直接命中的未完成目標。
- `recursive-search`：遞迴追蹤參考物件並檢查遷移狀態，直到沒有新參考為止。

## 有界內容規則
若需 AI 輔助，必須依 `partition_strategy` 分區盤點與複檢，避免 context 過大導致品質下降。

## DI/IOC 專用說明
若任務僅為 DI/IOC，優先使用 `/migration.adopt-di-ioc` 以維持任務精度，同時沿用相同品質迴圈。

# 必要輸出
請以分段方式回傳：
1. 目標與範圍
2. 盤點摘要
3. 盤點 CSV 路徑
4. 複檢發現（誤判/漏判）
5. 已套用的分批重構
6. 驗證結果
7. 待釐清項目
8. 釐清文件路徑
9. 殘餘風險與後續建議
