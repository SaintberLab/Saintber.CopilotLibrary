---
description: 合併與去重 .github/instructions/copilot-instructions.md 到 .github/copilot-instructions.md 的維護流程。
agent: copilot.maintainer
tools: [read/readFile, edit/createFile, edit/editFiles]
status: active
---

# 輸入
請提供：
- `merge_reason_zh_tw`（可選）：本次執行合併的原因
- `source_path`（可選）：預設 `.github/instructions/copilot-instructions.md`
- `target_path`（可選）：預設 `.github/copilot-instructions.md`
- `cleanup_source`（可選）：若為 `true`，合併成功後刪除來源檔；預設 `false`

# 任務
將 `.github/instructions/copilot-instructions.md` 內容合併並去重到 `.github/copilot-instructions.md`。

# 規則
1. 若來源檔不存在，停止並回報 `skipped` 與原因。
2. 若目標檔不存在，直接以來源檔完整內容建立目標檔。
3. 若來源與目標皆存在，需在保留雙方語意下合併內容。
4. 可安全判定為重複的整行、條列項與章節區塊需去重。
5. 最終生效檔必須是 `.github/copilot-instructions.md`，以符合 VS Code 保留檔名行為。
6. 語言政策需維持一致：對話規範仍以繁體中文（zh-TW）要求為準。
7. 僅在目標檔成功更新後，且 `cleanup_source=true` 時才可刪除來源檔。

# 輸出格式
## 合併摘要
- source: <path>
- target: <path>
- action: <created-target|merged|skipped>

## 去重說明
- 列出被移除的重複段落或行。

## 檔案更新結果
- source: <updated|deleted|kept|skipped|failed> - <path>
- target: <updated|created|skipped|failed> - <path>
