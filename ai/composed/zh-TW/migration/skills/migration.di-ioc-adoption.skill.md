---
name: migration.di-ioc-adoption
description: 可重用的 DI/IOC 導入技能，支援盤點、雙向複檢、分批導入與最終驗證。
---

# Skill: Legacy DI/IOC Adoption

## 目的
提供單一、可參數化且可重用的 DI/IOC 導入作業，用於仍採 manual construction、static construction 或 service locator 的 legacy 專案。

## 作業設計
- 主要操作：使用本 `Skill` 作為可重用契約與品質控管。
- 執行可結合 script-assisted 掃描與 AI-assisted 複檢。
- 預設以 script-first 取得可重現的覆蓋率。
- AI 輔助僅能在有界分區下進行。

## 輸入契約
- `scan_scope`（必要）：盤點目標範圍。
- `modify_scope`（必要）：允許重構範圍。
- `depth_mode`（可選）：`direct-hit` | `recursive-search`。
- `partition_strategy`（可選）：AI 分區掃描規則。
- `sample_size_table`（可選）：盤點表誤判抽樣數。
- `sample_size_source`（可選）：原始碼漏判抽樣數。
- `validation_mode`（可選）：`build-only` | `build-and-smoke`。

## 預設值
- `depth_mode`: `direct-hit`
- `partition_strategy`: 依資料夾/模組
- `validation_mode`: `build-only`

## 深度語意
- `direct-hit`: 僅偵測選定範圍內未導入 DI 的目標。
- `recursive-search`: 遞迴追蹤物件參考並檢查 DI/IOC 狀態，直到沒有新參考。

## 必要產物
- 盤點表（工作格式）
- 盤點 `.csv`
- 待釐清項目的問題文件
- 最終驗證報告

## CSV Schema（最低要求）
必填欄位：
- `File`
- `Line`
- `ReferencedObject`
- `ProcessingStatus`
- `Code`

## 處理狀態值
至少包含：
- `Candidate`
- `FalsePositive`
- `MissingCandidate`
- `ReadyForRefactor`
- `InProgress`
- `Pending Clarification`
- `Completed`

## 複檢要求
必須執行雙向複檢：
- 盤點表抽樣：確認列出的目標是否真為 DI/IOC 候選。
- 原始碼抽樣：確認是否仍有漏列的未導入 DI 目標。

若複檢未達品質門檻，先改善掃描 script，再重跑盤點後才可進入重構。

## 重構規則
- 只能在 `modify_scope` 內分批調整。
- 必須保留業務行為。
- 優先採 constructor injection 與 interface abstraction。
- static class 模糊案例保留在 `Pending Clarification`，不得以猜測硬改。

## 輸出期望
回傳分節內容：
1. 盤點摘要
2. CSV 輸出路徑
3. 複檢發現
4. 導入進度
5. 驗證結果
6. 待釐清項目與問題文件路徑
7. 剩餘風險
