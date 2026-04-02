---
description: 依互動或輸入原則建立或更新專案憲章，並確保相依範本同步。
handoffs: 
  - label: Build Specification
    agent: speckit.specify
    prompt: Implement the feature specification based on the updated constitution. I want to build...
---

## 使用者輸入

```text
$ARGUMENTS
```

若使用者輸入不為空，執行前**必須**先納入該輸入內容。

## 流程概述

你正在更新位於 `.specify/memory/constitution.md` 的專案憲章。此檔案是一份包含方括號佔位符號（例如 `[PROJECT_NAME]`、`[PRINCIPLE_1_NAME]`）的範本。你的工作是：(a) 收集或推導具體數值，(b) 精確填入範本，(c) 將修訂內容同步到相依產物。

**注意**：若 `.specify/memory/constitution.md` 尚未存在，應在專案建置時從 `.specify/templates/constitution-template.md` 初始化。若檔案不存在，請先複製範本。

依照以下執行流程操作：

1. 載入 `.specify/memory/constitution.md` 中現有的憲章。
   - 識別所有 `[ALL_CAPS_IDENTIFIER]` 形式的佔位符號。
   **重要**：使用者可能需要比範本更多或更少的原則。若已指定數量，請遵照執行——依循通用範本結構，並據此更新文件。

2. 收集或推導佔位符號的數值：
   - 若使用者的輸入（對話）提供了數值，直接使用。
   - 否則從現有 repository 上下文（README、docs、已嵌入的舊版憲章）推導。
   - 治理日期方面：`RATIFICATION_DATE` 為最初採用日期（若不知道，請詢問或標記 TODO）；`LAST_AMENDED_DATE` 若有修改則為今日，否則保留上次日期。
   - `CONSTITUTION_VERSION` 必須依語意化版本規則遞增：
     - MAJOR：不相容的治理原則移除或重新定義。
     - MINOR：新增原則／章節，或對現有內容做重大實質擴充。
     - PATCH：澄清說明、措辭調整、錯字修正等非語意變更。
   - 若版本升級類型不明確，請先說明理由再確認。
   - **草稿與正式版本管理**：
     - 若使用者**未明確宣告 Release**，憲章版號必須輸出為草稿形式 `<目前版號>-draft`（例如 `1.1.0-draft`）。禁止在 Release 宣告前升格為正式版本。
     - 若使用者**明確宣告 Release**，則依上述 MAJOR/MINOR/PATCH 規則升格為正式新版號。

3. 撰寫更新後的憲章內容：
   - 將每個佔位符號替換為具體文字（不得留下未說明的方括號符號，例外情況須明確說明）。
   - 保留標題層級結構；若注解已被取代，可移除，但仍有說明價值者保留。
   - 每個原則章節須包含：簡潔的名稱行、以非可妥協規則表述的段落或條列清單、明確的理由說明（若不明顯）。
   - 確保治理章節列出修訂程序、版本策略及合規審查期望。

4. 一致性傳播檢查清單（將原有清單轉換為主動驗證步驟）：
   - 讀取 `.specify/templates/plan-template.md`，確保「Constitution Check」或相關規則與更新原則一致。
   - 讀取 `.specify/templates/spec-template.md`，確認範圍與需求符合——若憲章新增或移除了必要章節，一併更新。
   - 讀取 `.specify/templates/tasks-template.md`，確保任務分類反映新增或移除的原則驅動類型（例如可觀測性、版本控制、測試紀律）。
   - 讀取 `.specify/templates/commands/*.md` 中的每個命令檔（含此檔），確認沒有過時的 agent 專屬名稱（例如僅限 CLAUDE）殘留在通用指引中。
   - 讀取任何執行期指引文件（例如 `README.md`、`docs/quickstart.md` 或 agent 專屬指引）。更新其中對已變更原則的參照。

5. 產出同步影響報告（更新憲章後以 HTML 注解形式置於檔案開頭）：
   - 版本變更：舊版 → 新版
   - 已修改原則清單（若有重新命名，標示舊標題 → 新標題）
   - 新增章節
   - 移除章節
   - 需要更新的範本清單（✅ 已更新 / ⚠ 待處理），附檔案路徑
   - 若有蓄意延遲填入的佔位符號，列入後續待辦事項。

6. 最終輸出前的驗證：
   - 無未說明的方括號符號殘留。
   - 版本行與報告一致。
   - 日期格式為 ISO 格式 YYYY-MM-DD。
   - 原則必須具宣示性、可測試，且不含模糊語言（「should」應替換為 MUST/SHOULD 並附理由）。

7. 將完成的憲章寫回 `.specify/memory/constitution.md`（覆寫）。

7.5. **保存原始意圖至 `/docs/constitution/constitution.intent.raw.md`**：
   - 將本次使用者的原始輸入附加至檔案最上方（以時間反序排列）。
   - 若 Release **尚未宣告**，本次條目編號為 `Draft.<下一流水號>`（例如 `Draft.1`、`Draft.2`），歸屬於目前草稿循環。
   - 若 Release **已宣告**，將本次發布循環中累積的所有 `Draft.<seq>` 條目改寫為 `<新版號>.<seq>`（例如 `1.1.0.1`、`1.1.0.2`）。
   - 在檔案開頭維護 Session Index 表格，欄位為：`Session 版號`、`日期`、`對應憲章版本`、`主題摘要`。

8. 輸出最終摘要給使用者，包含：
   - 新版號及版本升級理由。
   - 任何需要人工後續處理的檔案。
   - 建議的 commit 訊息（例如 `docs: amend constitution to vX.Y.Z (principle additions + governance update)`）。

格式與樣式要求：

- 使用與範本完全一致的 Markdown 標題（不得降級或升級標題層次）。
- 長理由行可適當換行以保持可讀性（目標 100 字以內），但不強制以奇怪的方式斷行。
- 章節之間保留單一空行。
- 避免行尾空白。

若使用者僅提供部分更新（例如只修改一個原則），仍須執行驗證與版本決策步驟。

若缺少關鍵資訊（例如確實不知道批准日期），請插入 `TODO(<FIELD_NAME>): 說明` 並在同步影響報告的延遲待辦欄位中列出。

禁止建立新範本；請始終操作現有的 `.specify/memory/constitution.md` 檔案。


