# CHANGELOG

本文件記錄 CopilotLibrary 的版本異動歷程。

---

## [未發布]

*（本段為下一個發布週期的暫存區）*

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
