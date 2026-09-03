# AI 工具生產流程設計

> **狀態**：預定架構（Intended Architecture）  
> **版本**：1.0.0  
> **最後更新**：2026-04-27

---

## 1. 概覽

本文件定義 `@saintber/copilot-library` 專案中 AI 工具的端對端生產流程，涵蓋建立、演化、佈署與發行的完整生命週期。

主要目標平台為 **GitHub Copilot**（VS Code 擴充套件），並預計擴展至 **Copilot CLI**、**Copilot SDK**，以及未來的 **OpenAI / Gemini CLI** 與 **Hermes Agent**。

AI 工具主要透過 GitHub Copilot 進行生產與演化，以確保與執行環境的一致性。所有正式產物以英文為準；同時維護繁體中文備份供使用者檢視。

---

## 2. 設計原則

| # | 原則 | 說明 |
|---|------|------|
| 1 | **英文為正式語言** | AI 工具以英文撰寫時執行精確度較高 |
| 2 | **中文備份同步產出** | 中文翻譯須與英文產物在同一次 Copilot Request 中產出，不得分次請求，以節省點數消耗 |
| 3 | **中立製作層與平台適配發布** | `ai/` 為正式製作來源；`.github/` 為 Copilot 相容產物的即時讀取目標 |
| 4 | **版本化演化** | 所有異動皆透過版本號追蹤；需求歷史以純文字方式記錄於版本號之下 |
| 5 | **工具身分固定** | 工具檔案名稱遵循 `[模組].[名稱]` 命名規則，建立後不得更名 |
| 6 | **先草稿後佈署，先測試後發行** | 工具必須通過使用者於佈署階段的審閱後，才可進入 Release |
| 7 | **目標態優先（允許破壞性重構）** | 目錄與流程設計不受現有 Repo 結構限制，可先定義理想架構，再規劃遷移 |
| 8 | **不得假設 `.copilot/` 會被自動讀取** | 依目前 GitHub Copilot 文件，repository custom instructions 標準位置是 `.github/`；應採明確佈署目標而非隱含目錄假設 |

---

## 3. 工具分類與命名規則

### 3.1 工具類別

| 類別 | 檔案命名規則 | 目標平台 | 說明 |
|------|------------|---------|------|
| `instructions` | `[模組].[名稱].instructions.md` | Copilot | 常態規則與限制 |
| `agents` | `[模組].[名稱].agent.md` | Copilot、Hermes Agent | 角色導向工作流程 |
| `prompts` | `[模組].[名稱].prompt.md` | Copilot、OpenAI | 可重用任務流程 |
| `skills` | `[模組].[名稱]/SKILL.md` | Copilot | 領域知識套件 |
| `mcp` | `[模組].[名稱].json` | 所有平台 | MCP 伺服器整合 |
| `sdk` | `[模組].[名稱].ts` | Copilot SDK | SDK 程式化工具 |

> `[模組]` = 模組名稱（見 §3.2）；`[名稱]` = kebab-case 語意名稱。

### 3.2 模組命名規則

命名空間依領域分類工具，格式為 `<namespace>[.<sub-namespace>]`：

| 命名空間 | 涵蓋範圍 |
|---------|---------|
| `code` | 產品程式碼慣例 |
| `copilot` | Copilot 產物維護治理 |
| `docs` | 架構文件規則與維護 |
| `speckit` | SDD / Speckit 流程治理 |
| `kb` | 知識庫功能 |
| `migration` | .NET 遷移工具群 |

視需要加入子命名空間（例如 `migration.dotnet-modernizer`）。

### 3.3 目錄配置

目錄採「模組優先、類型其次」，同一模組的所有工具類型集中在該模組下：

```
ai/
└── [模組]/              ← 例如 copilot/、migration/、kb/
   ├── instructions/
   ├── agents/
   ├── prompts/
   ├── skills/
   ├── mcp/
   └── sdk/
```

---

## 4. 目錄結構

以下為**目標態結構**，可與目前 Repo 產生破壞性差異；本設計以長期工具鏈演化最佳化為優先。

`ai/` 為模組優先的唯一來源；`.github/` 為 Copilot 執行目標，依 GitHub 慣例保持平坦結構（不設模組子目錄）；`.copilot/` 可作為相容備份，但不視為預設自動讀取位置。

```
/                                      （Repo 根目錄）
├── ai/                                （製作層 — 模組優先唯一來源）
│   ├── [模組]/                        （例如：copilot/、migration/、kb/）
│   │   ├── instructions/
│   │   ├── agents/
│   │   ├── prompts/
│   │   ├── skills/
│   │   ├── mcp/
│   │   ├── sdk/
│   │   └── sources/
│   │       └── requirements/         （模組內需求歷史）
│   ├── composed/
│   │   ├── en/
│   │   │   └── [模組]/               （可佈署英文產物，模組優先）
│   │   │       ├── instructions/
│   │   │       ├── agents/
│   │   │       └── ...
│   │   └── zh-TW/
│   │       └── [模組]/               （繁體中文備份，模組優先）
│   │           ├── instructions/
│   │           ├── agents/
│   │           └── ...
│   ├── manifest.yaml                  （模組 → composed → 已發布 路徑對應）
│   └── README.md                      （製作層操作說明）
│
├── .github/                           （佈署層 — COPILOT 即時讀取，平坦結構，不設模組子目錄）
│   ├── copilot-instructions.md
│   ├── instructions/                  ← 所有模組的 instructions 合併至此
│   ├── agents/
│   ├── prompts/
│   ├── skills/
│   └── README.md                      （佈署後工具使用總覽）
│
├── .mcp/                              （佈署層 — MCP 執行目標）
│   ├── mcp.json
│   ├── servers/
│   └── profiles/
│
├── sdk/                               （佈署層 — SDK 執行原始碼）
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── templates/                         （發行層 — 模組優先 npm 套件產物）
│   ├── [模組]/                        （例如：copilot/、migration/、kb/）
│   │   ├── .github/                   （此模組的 Copilot 工具，平坦結構）
│   │   │   ├── instructions/
│   │   │   ├── agents/
│   │   │   ├── prompts/
│   │   │   ├── skills/
│   │   │   └── README.md              （模組使用說明）
│   │   ├── .mcp/                      （此模組的 MCP 產物，若有）
│   │   └── sdk/                       （此模組的 SDK 產物，若有）
│   └── install-manifest.json          （可用模組清單與其佈署目標對照）
│
├── docs/                              （流程文件）
│   ├── README.md
│   └── policy/
│       ├── ai-toolchain-workflow.md          （本文件英文正本）
│       └── ai-toolchain-workflow.zh-TW.md   （本文件繁體中文備份）
│
├── src/                               （CLI 實作）
├── bin/
├── package.json
└── CHANGELOG.md
```

### 目錄職責對照

| 目錄 | 所屬層次 | 生命週期狀態 | 使用者 |
|------|--------|------------|--------|
| `ai/[模組]/[類型]/` | 製作層 | Draft | Copilot 製作時 |
| `ai/composed/en/[模組]/` | 製作層 | Draft / 已佈署 | CLI 佈署工具 |
| `ai/composed/zh-TW/[模組]/` | 製作層 | Draft / 已佈署 | 開發者與審閱者 |
| `ai/[模組]/sources/requirements/` | 歷史層 | Draft / 已發行 | 開發者與審閱者 |
| `.github/` | 發布層 | 已佈署 | Copilot（即時讀取，平坦）|
| `.mcp/` | 發布層 | 已佈署 | MCP client/runtime |
| `sdk/` | 發布層 | 已佈署 | Copilot SDK runtime |
| `templates/[模組]/` | 打包層 | 已發行 | npm 模組化安裝器 |

---

## 5. 生命週期：Draft → Deploy → Release

### 5.1 Draft（草稿）

**定義**：工具存在於 `ai/` 製作層，尚未經使用者審閱。

**作業步驟**：
1. 在 `ai/[模組]/[類型]/` 下撰寫或更新工具內容。
2. 同一次 Copilot 操作中，同時產出英文版本（供 `ai/composed/en/[模組]/[類型]/`）與繁體中文備份（供 `ai/composed/zh-TW/[模組]/[類型]/`）。
3. 需求記錄優先透過 `copilot.requirement-recorder` skill 執行。
4. 本流程預設採 `recorder_mode=versioned-basic`，保留原始需求文字且不強制欄位模板。
5. 未指定 `history_root_path` 時，歷史檔輸出至 `ai/[模組]/sources/requirements/`。
6. 版本保持為 `[未發布]` 狀態。

**狀態指標**：CHANGELOG 中目前的異動尚未有版本號，或記錄於 `[Unreleased]`。

---

### 5.2 Deploy（佈署）

**定義**：工具從製作層發行至目標平台目錄，供使用者測試。版本仍屬草稿，尚未正式發行。

**觸發條件**：開發者明確宣告 Deploy。

**作業步驟**：
1. 將 `ai/composed/en/[模組]/` 產物同步至平台執行目標（見 §10）。佈署目標保持平坦，不保留模組子目錄：
   - Copilot 類產物（instructions/、agents/、prompts/、skills/）→ `.github/`（所有模組的檔案平坦合併）
   - MCP 產物 → `.mcp/`
   - SDK 產物 → `sdk/`
2. 尚未定義 adapter 的平台，維持 composed 狀態不佈署。
3. 更新 `.github/README.md`，反映新增或異動的工具。
4. 在 `CHANGELOG.md` 的 `[Unreleased]` 區段新增記錄。
5. 工具版本標記維持 `[未發布]`（frontmatter 中不含版本號）。

**各平台預設佈署目標**：

| 平台 | 佈署目標 |
|------|---------|
| GitHub Copilot | `.github/` |
| Copilot CLI | `.github/`（沿用 repository custom instructions 慣例） |
| Copilot SDK | `sdk/` |
| MCP | `.mcp/` |
| OpenAI / Gemini CLI | 待確認 |
| Hermes Agent | 待確認 |

---

### 5.3 Release（發行）

**定義**：工具正式賦予版本號、打包並透過 npm 提供安裝。

**觸發條件**：開發者明確宣告 Release 並指定版本號。

**作業步驟**：
1. 在 `package.json` 中指定正式版本號 `[主版號].[功能版號].[修正版號]`。
2. 重整 `CHANGELOG.md`：
   - 將所有 `[Unreleased]` 記錄移入新的 `[x.y.z] - YYYY-MM-DD` 區段。
   - 移除重複記錄。
   - 合併同一周期內「新增後立即修改」的記錄，合併為單一 Added 記錄。
   - 遵循 Keep a Changelog 格式（Added / Changed / Fixed / Removed）。
3. 執行 `copilot.requirement-recorder` 並帶入 `release=true`、`version=<x.y.z>`，將 `Draft.<sequence>` 轉為 `<version>.<sequence>`。
4. 各歷史檔案的 `sequence` 維持單調遞增，且條目維持逆序排列（新到舊）。
5. 以模組為單位同步：`ai/composed/en/[模組]/` → `templates/[模組]/`（模組優先 npm 套件產物）。
6. 產生 git commit 與 tag 指令：
   ```bash
   git add .
   git commit -m "release: v[x.y.z] - [簡短說明]"
   git tag v[x.y.z]
   git push origin main --tags
   ```

**下游專案安裝方式**（模組化 — 僅安裝所需模組）：
```bash
# 安裝全部模組
npx @saintber/copilot-library install

# 安裝指定模組
npx @saintber/copilot-library install --module migration

# 更新指定模組
npx @saintber/copilot-library update --module migration

# 移除指定模組
npx @saintber/copilot-library remove --module migration

# 列出可用模組
npx @saintber/copilot-library list
```

CLI 會讀取套件中的 `install-manifest.json` 以取得可用模組清單與其佈署目標對照。

---

## 6. 雙語策略

| 產物 | 語言 | 位置 |
|------|------|------|
| 已發布 Copilot 工具 | 英文 | `.github/[類型]/`（平坦，所有模組合併）|
| 已發布 MCP 產物 | 英文 | `.mcp/` |
| 已發布 SDK 產物 | 英文 | `sdk/` |
| 繁體中文備份 | 繁體中文 | `ai/composed/zh-TW/[模組]/[類型]/` |
| 需求歷史 | 繁體中文 | `ai/[模組]/sources/requirements/` |
| CHANGELOG | 英文 | `CHANGELOG.md`（Repo 根目錄） |

**節省點數規則**：英文產物與繁體中文備份**必須在同一次 Copilot Request 中**同步產出。不得另外發出翻譯請求。維護 Agent 需在同一個回應中同時輸出兩份內容。

---

## 7. 版本號格式

格式：`[主版號].[功能版號].[修正版號]`

| 段落 | 遞增時機 |
|------|---------|
| `主版號` | 架構性重大變更；現有工具出現不相容的破壞性修改 |
| `功能版號` | 新增工具或功能；向下相容 |
| `修正版號` | 錯誤修正、措辭調整、細微調整 |

未發行狀態不含版本號標記（歷史檔中記為 `[未發布]`，CHANGELOG 中記為 `[Unreleased]`）。

---

## 8. 需求歷史記錄

### 目的
保留每次異動的原始使用者需求文字，供 AI 演化時參照原始意圖。

### 主要記錄器
需求記錄預設優先使用 `copilot.requirement-recorder`。

**本流程的有效預設值**：
- `recorder_mode`: `versioned-basic`
- `history_root_path`: `ai/[模組]/sources/requirements`
- `release`: 僅在明確宣告 Release 時設定 `true`
- `raw_requirement`: 必填，且需原文保存

### 格式
歷史檔由 recorder 的模式與版本路徑規則產生，並輸出至 `ai/[模組]/sources/requirements/`。

```markdown
# 需求歷史

## Draft

### YYYY-MM-DD
<原始需求文字 — 無格式限制，直接貼上>

---

## [1.0.0]

### YYYY-MM-DD
<原始需求文字>

---
```

**規則**：
- 條目以**逆序**排列（最新在最前）。
- 在 `versioned-basic` 模式下，除日期標題外無強制欄位要求。
- 若單次變更涉及多個模組，需在每個受影響模組的 `ai/[模組]/sources/requirements/` 各寫一筆需求記錄。
- 各模組記錄之間需互相引用（例如：`相關模組：copilot、migration`，並附相對路徑或連結）。
- Release 前若未指定正式版本，條目使用 `Draft.<sequence>`。
- 明確 Release 時，將 `Draft.<sequence>` 轉換為 `<version>.<sequence>`。

---

## 9. CHANGELOG 管理

Repo 根目錄的 `CHANGELOG.md` 遵循 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 格式。

```markdown
# Changelog

## [Unreleased]
### Added
### Changed
### Fixed
### Removed

## [1.0.0] - 2026-04-27
### Added
- 初始 instructions、agents、prompts、skills 工具集。
```

**Release 時重整規則**：
- 將 `[Unreleased]` 內容移入新的版本區段。
- 移除同一周期內新增後又立即移除的記錄（淨變更為零的項目）。
- 同一周期內新增後又修改的項目，合併為單一 Added 記錄。
- 已發行版本的空白子區段（Added / Changed / Fixed / Removed）可省略不顯示。

---

## 10. 平台支援與擴充

### 依工具類型的佈署與發行路徑

來源採模組優先；佈署目標（`.github/`）保持平坦 — CLI 在安裝/佈署時負責合併所有模組的檔案。

| 工具類型 | 來源（製作層） | 佈署目標（平坦） | 發行目標（模組優先） |
|---------|-------------|----------------|--------------------|
| `instructions` | `ai/composed/en/[模組]/instructions/` | `.github/instructions/` | `templates/[模組]/.github/instructions/` |
| `agents` | `ai/composed/en/[模組]/agents/` | `.github/agents/` | `templates/[模組]/.github/agents/` |
| `prompts` | `ai/composed/en/[模組]/prompts/` | `.github/prompts/` | `templates/[模組]/.github/prompts/` |
| `skills` | `ai/composed/en/[模組]/skills/` | `.github/skills/` | `templates/[模組]/.github/skills/` |
| `mcp` | `ai/composed/en/[模組]/mcp/` | `.mcp/` | `templates/[模組]/.mcp/` |
| `sdk` | `ai/composed/en/[模組]/sdk/` | `sdk/` | `templates/[模組]/sdk/` |

### 模組安裝行為

| 操作 | CLI 指令 | 行為 |
|------|---------|------|
| 安裝全部 | `install` | 將所有 `templates/[模組]/` 複製至目標專案 |
| 安裝指定 | `install --module <name>` | 僅複製 `templates/<name>/` |
| 更新全部 | `update` | 重新複製所有模組；覆蓋現有檔案 |
| 更新指定 | `update --module <name>` | 僅重新複製指定模組 |
| 移除指定 | `remove --module <name>` | 依登錄清單刪除該模組在佈署目標的檔案 |
| 列出模組 | `list` | 從 `install-manifest.json` 列出可用模組 |

### 命名衝突與檔案歸屬政策

- 在本函式庫內，工具檔名應透過 `[模組].[名稱]` 規則保持唯一；跨模組重名視為打包錯誤。
- 即使模組命名唯一，安裝/佈署時仍可能與目標專案既有同路徑檔案衝突（該檔案不一定來自本函式庫）。
- 首次安裝時，對既有檔案的歸屬不可自動判斷，應視為 unmanaged 檔案。
- 預設安全行為：不得覆寫 unmanaged 衝突檔案，需明確列出衝突清單。
- 僅允許覆寫 installer state 已追蹤的檔案，或由使用者明確要求強制覆寫。

### Installer state 最小欄位規格

為了讓檔案歸屬與衝突判斷具可重現性，installer state 至少應保存以下欄位：

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `module` | `string` | 是 | 安裝的模組名稱（例如 `copilot`、`migration`）。 |
| `targetPath` | `string` | 是 | 本次 install/update 解析後的目標專案根路徑。 |
| `sourceVersion` | `string` | 是 | 執行安裝/更新時使用的套件版本。 |
| `installedAt` | `string`（ISO 8601） | 是 | 安裝/更新時間戳，供追蹤使用。 |
| `trackedFiles` | `array<object>` | 是 | 該模組由 installer 管理的檔案清單。 |
| `trackedFiles[].path` | `string` | 是 | 目標專案內的相對路徑。 |
| `trackedFiles[].hash` | `string` | 建議 | 安裝/更新當下的內容雜湊值。 |
| `trackedFiles[].artifactType` | `string` | 是 | 工具類型（`instructions`、`agents`、`prompts`、`skills`、`mcp`、`sdk`）。 |
| `trackedFiles[].status` | `string` | 是 | 歸屬狀態：`managed` 或 `external-conflict`。 |

判讀規則：
- 若 `trackedFiles[].path` 在 state 中標記為 `managed`，update 可覆寫。
- 若目標檔案存在但未被 state 標記為 `managed`，視為 unmanaged，需回報衝突。
- 若 `managed` 檔案發生 hash 不一致，覆寫前需先回報 drift（或依政策要求明確 force 才覆寫）。

### 新增平台的擴充方式

新增平台時，需定義以下內容：
1. **工具類型對應**：該平台支援哪些工具類型。
2. **佈署目標**：平台特定的目錄或設定位置。
3. **發行打包**：模組的產物放置於 `templates/[模組]/` 的哪個子目錄。
4. **CLI adapter**：擴充 `saintber-copilot` 以將該類型路由至新的佈署目標。

| 平台 | 狀態 | 備註 |
|------|------|------|
| GitHub Copilot | ✅ 使用中 | 主要平台 |
| Copilot CLI | 🔲 規劃中 | 終端機工作流程工具定義 |
| Copilot SDK | 🔲 規劃中 | 程式化 Agent / Tool API |
| OpenAI / Gemini CLI | 🔲 擴充點 | 系統提示、工具定義 |
| Hermes Agent | 🔲 擴充點 | Agent 定義 |

---

## 11. Copilot 點數節省規則

所有流程規則均設計以降低 Copilot Request 消耗：

| 情境 | 規則 |
|------|------|
| 建立 / 更新工具 | 英文版本與中文備份在同一個 Request 中產出 |
| 翻譯現有工具 | 將所有需翻譯的工具批次納入單一 Request |
| 需求記錄 | 優先以 `copilot.requirement-recorder` 單一參數化操作執行 |
| CHANGELOG 更新 | 附加至 `[Unreleased]`，整合工作延至 Release 時集中執行 |
| Release 整合 | 以一次專用 Request 完成 CHANGELOG 整合與歷史移轉 |
