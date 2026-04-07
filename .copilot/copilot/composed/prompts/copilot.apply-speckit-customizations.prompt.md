---
description: 以輕量流程將 Speckit 客製需求重套到最新上游產物，適用於使用者各自的專案。
agent: copilot.speckit-customizer
tools: [read/readFile, agent, edit/createFile, edit/editFiles]
---

# 輸入
請提供：
- `customization_requirement_zh_tw`: 要套用的繁體中文客製需求
- `target_speckit_version`（可選）: 目標上游 Speckit 版本標記（供追蹤）
- `additional_requirement_zh_tw`（可選）: 額外繁體中文客製註記
- `target_paths`（可選）: 想優先更新的 Speckit 檔案或資料夾

# 任務
使用 `copilot.speckit-customizer` 子 agent，將本 repository 的 Speckit overlay 客製化，以適合使用者專案的輕量流程重套到最新上游基線。

# 輕量 Overlay 規則
執行此命令時：
1. 除非使用者明確要求 repository-level 維護，否則不依賴 `copilot.maintenance.instructions.md`，也不走完整 `/copilot.maintain` 的 release / changelog 流程。
2. 先將輸入的繁體中文需求翻譯為 English，作為 normalization 與 merge analysis 的基礎。
3. 合併時保留原始語意，但要將需求改寫成精確、可重複套用的 overlay 規格，而不是直接複製使用者原文。
4. 在決定變更前，先比對 `.copilot/composed/speckit-backup/` 的上游基線與目前目標 Speckit 產物。
5. 僅更新受影響的 Speckit 專屬產物。
6. 若 `.github/` 產物有異動，必須在同次操作同步寫入 `.copilot/composed/` 對應檔案，且該 composed 檔案必須是對應 `.github/` 產物的**全文繁體中文**完整版本——而不是只翻譯新增的客製化片段。
7. requirement history、changelog 與 release commands 預設略過；僅在使用者明確要求 repository 維護時才執行。

# 既定 Overlay 目標
請將本 repository 已知的 Speckit 客製意圖改寫為以下精確 overlay 規格：

1. 憲章流程
  - 當 `/speckit.constitution` 更新憲章且使用者未明確宣告 Release 時，輸出的憲章版號必須維持為 draft 形式：`<前版號>-draft`。
  - 使用者輸入的原始憲章意圖，必須保存於 `/docs/constitution/constitution.intent.raw.md`，並以時間反序排列。
  - 在 Release 宣告前，對話條目採用 `Draft.<流水號>` 編號。
  - 當使用者宣告 Release 時，憲章版號必須升為正式新版號，且對應原始意圖條目的編號需由 `Draft.<流水號>` 改寫為 `<新版號>.<流水號>`。
  - `/docs/constitution/constitution.intent.raw.md` 必須維護 Session Index 表格，欄位為：`Session 版號`、`日期`、`對應憲章版本`、`主題摘要`。

2. 規劃流程
  - `/speckit.plan` 在規劃時必須將 `/docs/policy/**` 視為必要的規範與設計上下文。

3. 任務流程
  - `/speckit.tasks` 產出任務時，必須檢查是否違反 `/docs/policy/**` 中的規範或設計。

4. 實作流程
  - `/speckit.implement` 執行實作時，必須檢查是否違反 `/docs/policy/**` 中的規範或設計。

5. 文件產物語言
  - 當客製化結果被保存到 `.copilot/composed/` 相對路徑時，必須保留為對應產物的**全文繁體中文**完整版本，而不是只將新加入的客製化段落翻譯為中文。

# 輸出格式
## Overlay Summary
- 簡述本次精煉後的 overlay 意圖，以及相對上游的行為差異。

## Affected Artifacts
- 列出本次檢視的 Speckit 產物，以及實際有異動的檔案。

## Updated Files
- 針對每個異動檔案，提供更新後內容或精簡摘要。

## Composed Output Paths
- 列出本次寫入的 `.copilot/composed/` 繁體中文檔案路徑。

## Optional Notes
- 僅在需要人工後續處理時補充說明。
