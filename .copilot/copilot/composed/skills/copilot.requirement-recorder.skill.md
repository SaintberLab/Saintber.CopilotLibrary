---
name: copilot.requirement-recorder
description: 可重複使用的原始需求記錄流程，提供三種模式與低 usage 的單一參數化操作。
---

# Skill：可重複使用的原始需求記錄器

## 目的
提供一個可被多個 agent / prompt 共用、且低成本的需求記錄操作，不強制依賴 handoff。

## AI 操作建議
- 主要操作：`Skill`（本檔），因為可重用、可被探索，且適合多步驟但邊界明確的檔案流程。
- 次要操作：可由 `Prompt` 包裝此 skill 契約，提供 slash command 入口。
- 可選輔助：若流程擴大且需更強可重現性，可加入 `Script` 處理路徑與檔名計算。
- 預設不需要 MCP。僅在需求記錄必須寫入 repo 外部系統時才建議使用 MCP。

## Usage 節省規則
- 以 GitHub Copilot 的 by-request usage 為優先。
- 除非明確要求隔離上下文，否則避免 subagent handoff。
- 優先採用單一參數化操作，而非拆成多個零碎流程。

## 輸入契約
- `recorder_mode`（可選）：`chronological` | `versioned-basic` | `versioned-structured`
- `history_root_path`（可選）：歷程根目錄
- `version`（可選）：發布版號
- `release`（可選）：使用者明確宣告發布時為 `true`
- `trigger_label`（可選）：structured 模式的 Trigger 中文欄位名
- `user_overrides`（可選）：使用者外部指定的路徑 / 表格 / 版型需求
- `raw_requirement`（必要）：要保留的使用者原始輸入

## 預設值
- `recorder_mode`：`chronological`
- `history_root_path`：`/docs/histories`
- `trigger_label`：`觸發來源`

## 覆寫規則
若使用者輸入已明確指定保存路徑、歷程表格或記錄版型，必須以外部需求為準，預設值僅作為 fallback。

## 模式 A：`chronological`（無版號記錄）
行為：
- 以反序保留原始需求。
- 文件頂部維護反序歷程表。
- 預設表格欄位：`時間`、`需求摘要`。
- 預設路徑：`<root>/<yyyy>/<MM>/History_<yyyy-MM-dd>.md`。

## 模式 B：`versioned-basic`（有版號無格式記錄）
行為：
- 以反序保留原始需求。
- 文件頂部維護反序歷程表。
- 預設表格欄位：`版本號`、`日期`、`摘要`。
- 未指定版本號時，版本號使用 `Draft.<序號>`。
- 使用者明確要求發布到 `<version>` 時，將所有 `Draft.<序號>` 轉為 `<version>.<序號>`。
- 未指定保存路徑時，預設為：`<root>/v<major>/v<major>.<minor>/.../History-<major>.<minor>.<patch>.md`。

## 模式 C：`versioned-structured`（有版號有格式記錄）
行為：
- 以反序保留原始需求。
- 文件頂部維護反序歷程表。
- 預設表格欄位：`版本號`、`日期`、`觸發來源`、`摘要`。
- 未指定版本號時，版本號使用 `Draft.<序號>`。
- 使用者明確要求發布到 `<version>` 時，將所有 `Draft.<序號>` 轉為 `<version>.<序號>`。
- 記錄本文必須包含：`觸發來源`、`背景`、`需求`、`原始輸入`。
- 未指定保存路徑時，預設路徑與 `versioned-basic` 相同。

## 序號規則
- `序號` 為對話/會話記錄序號，不是語意版號位數。
- 同一歷程檔內應維持單調遞增。
- 新條目需插在舊條目前方（反序）。

## 輸出要求
在維護流程中使用本 skill 時，應回報：
- 實際採用模式
- 實際根目錄與檔案路徑
- 是否套用外部覆寫
- 是否執行發布遷移
- 任何 skipped/failed 的檔案更新與原因
