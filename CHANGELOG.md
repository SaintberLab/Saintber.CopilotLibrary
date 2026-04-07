# CHANGELOG

本文件記錄 CopilotLibrary 的版本異動歷程。

---

## [未發布]

---

## [0.2.1] - 2026-04-07

### 新增

- Module README 使用手冊（`.copilot/<module>/README.md`、`templates/<module>/README.md`），取代原有 TOOLS.md 單體說明，涵蓋 `code`、`copilot`、`docs`、`kb`、`migration`、`speckit` 六個命名空間，提供 agents / prompts / instructions / skills 的用途與使用案例。
- `copilot.maintain-test.prompt.md`：臨時維護流程測試用 prompt（`.github/` 為英文版，`.copilot/composed/` 保留繁體中文版，驗證完成後應予移除）。

### 變更

**維護治理流程（copilot 模組）**

- `copilot.maintain` 主流程改為 module 化 authoring 模型：需求歷程預設路徑改為 `.copilot/<module>/sources/requirements/`；維護更新寫入 `.copilot/<module>/base/` 與 `.copilot/<module>/composed/`；release 時同步至 `templates/<module>/`。
- `copilot.maintenance.instructions.md`：`applyTo` 範圍收斂至自有維護產物，避免套件使用者自有規則或外部 vendor AI 誤觸維護流程。
- `copilot.maintainer.agent.md`：核心維護治理內嵌至 agent，確保無論 `applyTo` 是否命中，English normalization、CHANGELOG / composed 同步規則仍強制生效。
- `copilot.maintain.prompt.md`：新增委派契約規則，不得因 `applyTo` 未命中而略過 `copilot.maintainer` 完整維護治理。
- `src/cli.js`：新增 module 化 templates 解析能力，支援 `templates/<module>/{agents|instructions|prompts|skills}` 並維持舊版根目錄模板相容。
- `.copilot/README.md`、`README.md`：更新為 module 目錄結構與新維護流程說明。

**架構文件工具（docs 模組）**

- `docs.architecture-documenter.agent.md`、`docs.hybrid-reviewer.agent.md`、`docs.hybrid-review-executor.agent.md`：釐清三者職責差異，新增 `inventory_mode` / `change_mode` 控制參數。
- `docs.architecture-review.prompt.md`、`docs.document-architecture.prompt.md`：新增 `inventory_mode` 與 `include_dependencies` 控制，支援完整 repository 架構盤點而無需修改 source code。
- `docs.hybrid-review-execute.prompt.md`：新增 `change_mode`（`docs-only` | `docs-and-plan` | `apply-code`），明確區分僅產出報告、提出計畫與實際修正程式碼三種模式。
- `docs.hybrid-review-executor.agent.md`：新增 `terminal/runInTerminal` 工具授權，允許執行 PowerShell 自行驗證結果（build / test / 檔案檢查）；補充 Verification rules 段落，明確禁止執行破壞性或影響共用基礎設施的命令。

### 已移除

- `.github/TOOLS.md`、`.copilot/composed/TOOLS.md`、`templates/TOOLS.md`：廢棄移除；工具說明改由各 module README 承接。

---

## [0.2.0] - 2026-04-02

### 新增
- 新增 `copilot.speckit-customizer` 專用 agent，用於將 Speckit 客製意圖轉為精確 overlay 規格，並在上游 Speckit 升版後重複套用。
- CLI 新增 `list` 命令，可列出目前可安裝的 module selectors，並在目標專案已有 state 時顯示已追蹤的已安裝模組。
- CLI 新增 `remove --module <ns>` 命令，可依模組安全解除安裝已追蹤的 CopilotLibrary 檔案。
- CLI 支援 `remove --module all`，可完整移除所有已追蹤安裝內容並清除 `.copilot-library/` 狀態目錄，同時保留使用者原有的 `.github` 項目。

### 變更
- `/copilot.apply-speckit-customizations`：改為由 `copilot.speckit-customizer` 執行，並將原始 Speckit 客製需求改寫成精確 overlay 契約，而非直接內嵌需求原文。
- `copilot.maintenance.instructions.md`：移除 Speckit 專屬細節，回復為共通維護規範；改以「vendor 基線保留」與「領域邏輯放專用 agent/prompt」兩條通則表達。
- `copilot.maintainer.agent.md`：移除 Speckit 專屬目標與流程，維持為通用維護 agent。
- `copilot.speckit-customizer.agent.md` 與 `/copilot.apply-speckit-customizations`：簡化為使用者專案適用的輕量 overlay 流程；預設不再依賴完整 `/copilot.maintain`、複雜 changelog/release 或 requirement history 步驟，但仍保留 English normalization、語意合併與 `.copilot/composed/` 繁中同步。
- `copilot.speckit-customizer.agent.md`：新增明確規則，要求寫入 `.copilot/composed/` 的文件必須是對應 `.github/` 產物的全文繁體中文完整版本，不得只翻譯新增的客製化片段；並於 Guardrails 補充禁止產出中英混雜或部分翻譯版本。
- `copilot.apply-speckit-customizations.prompt.md`：強化輕量 Overlay 規則第 6 條，明確指出 composed 檔案必須是整份文件的全文繁體中文版本；同步補回「文件產物語言」既定 Overlay 目標（第 5 項）。
- `.copilot/composed/agents/copilot.speckit-customizer.agent.md`、`.copilot/composed/prompts/copilot.apply-speckit-customizations.prompt.md`：修正為全文繁體中文的完整版本，反映對應 `.github/` 產物目前最新內容。
- `.github/TOOLS.md`：新增 `copilot.speckit-customizer` agent，並更新 `/copilot.apply-speckit-customizations` 說明與對應 agent。
- `src/cli.js`：`state.json` 會額外記錄 `installedFiles`，`doctor` 會優先依追蹤清單檢查，避免模組化安裝時誤判缺漏。
- `copilot.maintain` release 規則：當使用者明確指定發布版號時，除 CHANGELOG 封版與 `.github/` → `/templates/` 同步外，也必須同步更新 `package.json` 的 `version` 欄位。

---

## [0.1.0] - 2026-04-01

初版正式發布，整合 Copilot 客製化函式庫完整基礎建置、CLI 工具、產物命名空間化、維護治理流程，以及 Speckit 外部廠商管理。

### 新增

#### 基礎建置
- `.copilot/` 製作層初始化：含 `sources/`、`base/`、`composed/`、`changelog/`、`manifest.yaml` 子目錄結構。
- `.github/instructions/`、`.github/agents/`、`.github/prompts/`、`.github/skills/` 初始發布目錄建立。
- `AGENTS.md`：Copilot Coding Agent 全域入口規則。
- `CHANGELOG.md`：建立版本異動記錄。

#### CLI 工具
- `cli.js`：完整實作 `init`、`update`、`doctor` 三個 CLI 命令；`init`/`update` 將 `/templates` 內容複製至 `target/.github`，並於 `.copilot-library/state.json` 記錄版本、安裝時間與已安裝模組；`doctor` 檢查目標目錄、state.json、已安裝版本與缺漏檔案。
- CLI 新增 `--modules`/`--module` 參數，支援以逗號分隔的多個 namespace（含 sub-namespace），適用於 `init`、`update`、`doctor` 命令。範例：`--modules kb,copilot`、`--modules migration.dotnet-modernizer`。
- CLI 參數預設值：`--target` 未提供時預設使用目前目錄（`.`）；`--module`/`--modules` 未提供時預設套用所有命名空間。
- `README.md`：以一般使用者視角撰寫安裝與使用說明，並指向 AI 使用手冊 `/.github/TOOLS.md`。

#### Copilot 產物庫（命名空間化）
- 命名空間版 instructions 發布：`code.tech-stack.instructions.md`、`code.migration-conventions.instructions.md`、`copilot.maintenance.instructions.md`、`docs.architecture.instructions.md`、`kb.governance.instructions.md`。
- 命名空間版 agents 發布：`migration.solution-architect.agent.md`、`migration.dotnet-modernizer.agent.md`、`migration.mvc-kendo-migrator.agent.md`、`migration.db-architect.agent.md`、`migration.platform-infra-architect.agent.md`、`migration.reviewer.agent.md`、`docs.architecture-documenter.agent.md`、`docs.hybrid-reviewer.agent.md`、`docs.hybrid-review-executor.agent.md`、`copilot.maintainer.agent.md` 及 `kb.*` 群組各 agent。
- 命名空間版 prompts 發布：`migration.*`、`docs.*`、`kb.*`、`copilot.maintain.prompt.md`。
- `.github/TOOLS.md`：建立完整命名空間工具說明，涵蓋 `copilot`、`docs`、`migration`、`kb`、`code` 各系列能力、使用方式與應用範例。
- `.copilot/composed/`：建立所有 `.github/` 產物的繁體中文對應副本（含 instructions / agents / prompts / skills）。
- 舊版非命名空間 artifacts 完成清理，轉為對應 namespace 指令與檔案。
- `.copilot/README.md`：重寫，加入目錄職責表與三步驟產製流程（Step 1 建立需求 → Step 2 確認來源 → Step 3 執行 `/copilot-maintain`）。

#### 維護治理流程
- Copilot 維護流程三件套建立：`copilot.maintenance.instructions.md`、`copilot.maintainer.agent.md`、`copilot.maintain.prompt.md`，含 release workflow、requirement history 正式模板（`Recorded At`、`Change Summary`、`Affected Artifacts`、`Original Requirement`）與 release 時 `[未發布]` 條目移轉規則。
- Requirement history 管理：以命名空間為單位，統一記錄於 `.copilot/sources/updates/<namespace>/<namespace>.requirement-history.md`，依版本段落反序累積。
- Release 同步範圍明確化：release 時須將 `.github/` 全部內容（含 `TOOLS.md`）一併同步至 `/templates/`。

#### 文件與知識庫工具
- Docs 架構審查能力：`docs.architecture.instructions.md` 新增 Hybrid Architecture & Specification Review Pipeline 規則；`docs.architecture-documenter.agent.md` 支援 review 與 authoring 雙模式。
- Hybrid review pipeline 產物：`docs.hybrid-reviewer.agent.md`、`docs.hybrid-review-executor.agent.md`、`docs.hybrid-review.prompt.md`、`docs.hybrid-review-execute.prompt.md`、`docs.document-architecture.prompt.md`、`docs.hybrid-review-pipeline.skill.md`。
- `docs/` SDD 文件初始化：`constitution/`、`context/`、`intent/`、`plan/`、`policy/` 各子目錄。

#### Speckit 外部廠商管理
- Speckit 產物自 `.github/` 移除：因 Speckit 改由微軟官方維運，將 speckit instruction / agents / prompts（共 19 個）移出 `.github/`。
- 繁體中文備份保留於 `.copilot/composed/speckit-backup/`，含 `README.zh-TW.md` 說明。
- `.copilot/composed/instructions/`、`agents/`、`prompts/` 下建立 speckit 繁中翻譯版本（description 與常見章節標題 zh-TW 化）。
- `copilot.maintenance.instructions.md`：新增廠商維運規則，Speckit 只保留 `.copilot/composed/speckit-backup/` 備份，不在 `.github/` 發布。

---

## 記錄規則

- 後續發版時，請自 `[未發布]` 切出版號，格式為 `[x.x.x] - YYYY-MM-DD`。
- 每版僅保留與公開行為相關的變更；詳細需求歷程請見 `.copilot/sources/updates/` 各命名空間歷程檔。
