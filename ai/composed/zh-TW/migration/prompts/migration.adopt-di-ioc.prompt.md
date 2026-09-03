---
description: 盤點與逐步導入 DI/IOC，含 CSV 盤點、抽樣複檢與最終驗證。
agent: migration.dotnet-modernizer
---

# 輸入
請提供：
- `scan_scope`（必要）：要盤點的檔案/資料夾/模組範圍
- `modify_scope`（必要）：允許修改的檔案/資料夾/模組範圍
- `depth_mode`（可選）：`direct-hit` | `recursive-search`（預設：`direct-hit`）
- `partition_strategy`（可選）：分區掃描規則（預設：依資料夾/模組）
- `sample_size_table`（可選）：盤點表抽樣檢核數量（誤判檢查）
- `sample_size_source`（可選）：原始碼抽樣檢核數量（漏判檢查）
- `validation_mode`（可選）：`build-only` | `build-and-smoke`（預設：`build-only`）

# 任務
針對尚未導入 DI/IOC 的 legacy 程式碼，建立並執行可追蹤的 DI/IOC 導入流程。

## 必要流程
1. 在 `scan_scope` 內先以 script-assisted 方式進行 DI/IOC 盤點。
2. 產出盤點表與 `.csv`，欄位至少包含：`File`、`Line`、`ReferencedObject`、`ProcessingStatus`、`Code`。
3. 進行盤點品質複檢：
   - 從盤點表抽樣，檢查誤判
   - 從原始碼抽樣，檢查漏判
4. 若複檢發現缺失，先完善 script 規則後再重跑盤點。
5. 僅在 `modify_scope` 內依盤點狀態分批導入 DI/IOC。
6. 依 `validation_mode` 執行最終驗證。
7. 針對 `Pending Clarification` 項目（例如 static class 的模糊實例化），產出問題釐清文件。

## 深度規則
- `direct-hit`：只盤點/修改所選範圍內直接命中的未導入 DI 目標。
- `recursive-search`：遞迴追蹤參考物件並檢查 DI/IOC 狀態，直到沒有新參考為止。

## 有界 Context 規則
若需要 AI 輔助，必須依 `partition_strategy` 分區掃描與分區複檢，避免單次 context 過大導致品質下降。

# 必要輸出
請以清楚分節回傳：
1. 盤點摘要
2. 盤點 CSV 路徑
3. 複檢發現（誤判/漏判）
4. 分批導入結果
5. 驗證結果
6. 待釐清項目
7. 問題釐清文件路徑
8. 剩餘風險與下一步
