# Copilot Customization Workspace

本目錄為 Copilot 客製化產物的**製作層（Authoring Layer）**。  
所有 AI 工具（instructions、agents、prompts、skills）的需求撰寫、組裝與版本追蹤均在此進行，最終發布至 `/.github/` 供 Copilot 即時套用。

---

## 目錄職責

| 目錄 | 職責 | 存放內容 |
|------|------|----------|
| `sources/requirements/` | 原始需求層 | 每次需求變更的原始輸入，格式 `YYYY-MM-DD-<topic>.zh-TW.md` |
| `base/` | 可重用片段層 | 類似 prompt partials：可被多份產物共用的 instruction / agent / prompt 片段 |
| `composed/` | 組裝結果層 | 合併完成、尚未發布的繁體中文版產物（對應 `.github/` 的鏡像結構） |
| `changelog/` | 變更紀錄層 | 各版本異動紀錄 |
| `manifest.yaml` | 產物索引 | 記錄每份產物的 source → composed → published 路徑對應關係 |

> **發布層**為 Repo 根目錄的 `/.github/`（instructions / agents / prompts / skills），  
> Copilot 直接從該目錄讀取，不讀取 `.copilot/`。

---

## 產製流程（從需求到發布）

### Step 1：建立新需求檔

每次有新需求，先在 `sources/requirements/` 新增一份需求文件：

```
.copilot/sources/requirements/YYYY-MM-DD-<topic>.zh-TW.md
```

**格式範例：**

```markdown
# Requirement: <簡短標題>

## Goal
用繁體中文說明這次需求的目的。

## Required Capabilities
1. 需要 instruction / agent / prompt 做到哪些事
2. ...

## Notes
- 補充背景或限制條件
```

**範例檔案：** [`sources/requirements/2026-03-23-update-customizations.zh-TW.md`](sources/requirements/2026-03-23-update-customizations.zh-TW.md)

---

### Step 2：確認讀取來源

執行前需確認要更新的現有產物從哪裡讀取：

| 情境 | 讀取來源 |
|------|----------|
| 已有穩定版本在線 | 從 `.github/instructions/`、`.github/agents/`、`.github/prompts/` 讀取 |
| 有可重用片段尚未發布 | 從 `.copilot/base/` 讀取對應片段 |
| 兩者皆有 | 以 `.github/` 為準（已發布版為最新）；`base/` 為補充用片段 |

---

### Step 3：執行 `/copilot-maintain`

在 Copilot Chat 中觸發：

```
/copilot-maintain
new_requirement_zh_tw: <貼上或描述需求>
```

`copilot-maintainer` agent 會依序：

1. 將繁體中文需求翻譯為英文進行分析
2. 讀取現有 instruction / agent / prompt 內容
3. 將新需求合併（不重複、不破壞既有規則）
4. 正規化（normalize）結構與語氣
5. 更新 `.github/` 下的發布檔案
6. 將完整繁體中文版產物存入 `.copilot/composed/` 對應路徑

---

### 產物路徑對應

```
.copilot/composed/instructions/  →  .github/instructions/
.copilot/composed/agents/        →  .github/agents/
.copilot/composed/prompts/       →  .github/prompts/
```

`manifest.yaml` 記錄每份產物從 source 到 composed 到 published 的完整路徑對應，可作為產物追蹤索引。

---

## 注意事項

- `sources/` 下的需求文件**不得**由 AI 修改；為人工撰寫的原始輸入，屬 append-only。
- `base/` 存放片段，不直接發布；發布前需經 composed 組裝。
- 每次需求變更完成後，建議同步更新 `manifest.yaml` 的 source 欄位，方便追蹤。
