---
name: migration.backend-modernization
description: 可重用的後端遷移重構技能，支援盤點、雙向複檢、分批導入與最終驗證。
---

# Skill：Legacy Backend Modernization

## 目的
提供單一可參數化且可重用的流程，在保留既有行為前提下，逐步現代化 Legacy 後端程式碼。

## 操作設計
- 主要操作：本 `Skill` 負責可重用契約與品質控制。
- 執行可結合 script-assisted 掃描與 AI-assisted 複檢。
- 預設 script-first 盤點，以提升可重現性。
- AI 僅用於有限範圍分區輔助。

## 輸入契約
- `migration_objective`（必要）：本次遷移重構目標。
- `scan_scope`（必要）：盤點邊界。
- `modify_scope`（必要）：可修改邊界。
- `depth_mode`（選填）：`direct-hit` | `recursive-search`。
- `partition_strategy`（選填）：AI 分區掃描規則。
- `sample_size_table`（選填）：盤點表誤判抽樣數量。
- `sample_size_source`（選填）：原始碼漏判抽樣數量。
- `validation_mode`（選填）：`build-only` | `build-and-smoke`。

## 預設值
- `partition_strategy`：依資料夾/模組
- `validation_mode`：`build-only`

## 深度語意
- 未提供深度：採範圍內直接盤點。
- `direct-hit`：僅檢出指定範圍內的遷移目標。
- `recursive-search`：遞迴追蹤參考物件並檢查遷移狀態，直到無新參考。

## 必要產物
- 盤點表（工作格式）
- 盤點 `.csv`
- 待釐清問題文件
- 最終驗證報告

## CSV 最低欄位
- `File`
- `Line`
- `ReferencedObject`
- `ProcessingStatus`
- `Code`

## ProcessingStatus 最低值
- `Candidate`
- `FalsePositive`
- `MissingCandidate`
- `ReadyForRefactor`
- `InProgress`
- `Pending Clarification`
- `Completed`

## 複檢要求
必須執行雙向複檢：
- 盤點表抽樣：驗證已列目標是否為真陽性。
- 原始碼抽樣：驗證是否仍有未列入的遷移目標。

若複檢未達品質門檻，先改善盤點 script 並重跑盤點，再進入重構。

## 重構規則
- 只在 `modify_scope` 內分批導入。
- 優先保留業務行為。
- 優先採 adapter/composition/DI 型重構，避免侵入式重設計。
- 無法安全判定的項目維持 `Pending Clarification`，不得強行推測修改。

## 輸出期望
請回傳以下分段：
1. 目標與範圍
2. 盤點摘要
3. CSV 路徑
4. 複檢發現
5. 重構進度
6. 驗證結果
7. 待釐清與文件路徑
8. 殘餘風險
