# copilot Requirement History

本檔集中保存 `copilot` namespace 的原始需求歷程，依版本段落保存，並於同一版本內以新到舊反序記錄。

## 條目模板

每筆需求應採用以下正式模板：
- `Recorded At`: 記錄時間
- `Change Summary`: 本次需求摘要
- `Affected Artifacts`: 受影響產物
- `Original Requirement`: 原始需求全文

## [未發布]

*（本段為下一個發布週期的暫存區）*

---

## [0.1.0] - 2026-04-01

### 2026-04-01 09 - release-0.1.0

- Recorded At: `2026-04-01`
- Change Summary: 正式發布 0.1.0 版；將 CHANGELOG `[未發布]` 全部內容重整為有條理的初版新增功能，分為「基礎建置、CLI 工具、Copilot 產物庫、維護治理流程、文件與知識庫工具、Speckit 外部廠商管理」六大群組；同步執行 `.github/` → `/templates/` 部署產物更新；需求歷程條目 01-08 移轉至本版本段落。
- Affected Artifacts: `CHANGELOG.md`, `copilot.requirement-history.md`, `templates/**`

```md
請協助發布為初版 0.1.0，並請重整 changelog 全部內容為新增功能
```

### 2026-04-01 08 - translate-speckit-backup-to-composed

- Recorded At: `2026-04-01`
- Change Summary: 將 `.copilot/composed/speckit-backup/` 的 Speckit instruction/agents/prompts 同步到 `.copilot/composed/` 對應目錄，並完成繁體中文化（description 與常見章節標題）。
- Affected Artifacts: `.copilot/composed/instructions/speckit.intent-constitution.instructions.md`, `.copilot/composed/agents/speckit.*.agent.md`, `.copilot/composed/prompts/speckit.*.prompt.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
請協助將 /.copilot/composed/speckit-backup 的內容，翻譯為繁體中文並保存至 /composed 對應目錄內
```

### 2026-04-01 07 - deprecate-speckit-from-github-keep-zh-backup

- Recorded At: `2026-04-01`
- Change Summary: 因 Speckit 為微軟官方維運，將 Speckit instruction/agent/prompt 自 `.github/` 移除；於 `.copilot/composed/speckit-backup/` 保留備份並新增繁體中文說明；同步更新 TOOLS 與維運規則。
- Affected Artifacts: `TOOLS.md`, `copilot.maintenance.instructions.md`, `CHANGELOG.md`, `copilot.requirement-history.md`, `.github/instructions/speckit.intent-constitution.instructions.md`, `.github/agents/speckit.*.agent.md`, `.github/prompts/speckit.*.prompt.md`, `.copilot/composed/speckit-backup/**`

```md
因為 speckit 為微軟官方維運，請協助留下一份繁體中文副本後，自 .github 移除
```

### 2026-04-01 06 - cli-default-target-module-and-user-readme

- Recorded At: `2026-04-01`
- Change Summary: CLI 支援在未提供 `--target` 時預設使用目前目錄，未提供 `--module` 時預設套用所有命名空間；補齊 README 一般使用者安裝與使用說明；明確化 release 時 `.github/TOOLS.md` 會一併同步發布。
- Affected Artifacts: `src/cli.js`, `README.md`, `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.maintain.prompt.md`, `TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
請再協助更新 cli，目前版本無法不帶任何參數執行

需求：
- 當 --target 未帶入視為目前目錄
- 當 --module 未帶入視為所有命名空間
- 請以單純使用者的角度，將安裝/使用說明寫入 /README.md，並註明 AI 使用手冊位於 /.github/TOOLS.md
- 請確認目前的維運規則，當 release 的時候會不會一併發布 TOOLS.md，若不會請加入規則
```

### 2026-04-01 05 - npm-cli-publishing-and-templates-sync

- Recorded At: `2026-04-01`
- Change Summary: 完整實作 CLI 命令（init / update / doctor）、新增 `--modules` 參數用於 namespace 篩選；維護流程新增發布時同步 `.github/` 至 `/templates/` 的規則；`scope` 參數更名為 `--modules`。
- Affected Artifacts: `cli.js`, `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.maintain.prompt.md`, `TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```
目的：我想將這個專案調整成可以 npm + cli 發布 (透過 npx @saintber/copilot-library init 安裝到指定目錄)
需求：
1. 調整維護流程，當使用者提出要發布這一版的時候，除了會更改 changelog 外(更新時應重整 changelog 的未發布內容為整理過的版本)，還會將 .github 的內容更新至 /templates 目錄下(佈署目錄)
2. 完善佈署命令 cli.js，命令要求如下
	- npx @saintber/copilot-library init --target . 
		- 安裝至指定目錄，複製 /templates 內容至 target/.github
	- npx @saintber/copilot-library update --target .
		 - 更新指定目錄
	- npx @saintber/copilot-library doctor --target .
		- 檢查目標目錄是否存在
		- 檢查 .copilot-library/state.json 是否存在
		- 目前安裝版本
		- 目標檔案是否缺漏
	-  npx @saintber/copilot-library doctor --target . --scope kb
		- scope 可以建議更好的名字並替換
		- scope 參數可以決應安裝的 namespace，可包含 subnamespace
		- 可用, 分隔多個 space
		- 如果窒礙難行請告知，我們再討論
```

### 2026-04-01 04 - remove-nonexistent-docs-command-reference

- Recorded At: `2026-04-01`
- Change Summary: 修正 `TOOLS.md` 中 `docs` 範例與清單，移除不存在方法的引用。
- Affected Artifacts: `TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
#file:TOOLS.md 剛剛補充的說明有問題，docs.architecture-review 方法並不存在，請注意不要使用不存在的方法
```

### 2026-04-01 03 - docs-namespace-examples-and-changelog-dedup

- Recorded At: `2026-04-01`
- Change Summary: 補充 docs 命名空間應用範例，並整理 `CHANGELOG.md` 未發布段落去重。
- Affected Artifacts: `TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
- 請先幫我補充 docs 命名空間的應用範例，至少須包含
1. 完整建立全專案架構文件，不含規格
2. 初步建立全專案架構文件，不含規格
3. 完整建立全部規格+架構
4. 更新架構文件
5. 新增指定範圍規格
6. 更新指定範圍規格
- 也請一併順手針對 changelog 去重整李
```

### 2026-04-01 02 - requirement-history-template-and-release-migration

- Recorded At: `2026-04-01`
- Change Summary: 補上 requirement history 正式模板，並定義發布時將 `[未發布]` 條目移轉到正式版本段落。
- Affected Artifacts: `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.maintain.prompt.md`, `TOOLS.md`, `copilot.requirement-history.md`, `docs.requirement-history.md`

```md
1. 好的，請協助我補充為正式模板
2. 好的，請順手補充升版時移轉到正式版本段落
```

### 2026-04-01 01 - requirement-history-normalization

- Recorded At: `2026-04-01`
- Change Summary: 將 updates 保存策略改為 namespace 單一歷程檔，並依版本段落反序累積。
- Affected Artifacts: `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.maintain.prompt.md`, `TOOLS.md`

```md
請優化 copilot.maintain 規則
- 保留原始需求時 (updates)，依據命名空間為基礎，但後續分檔時不要依據日期分檔，應該依照版本號為基礎，將要求反序記載於同一份文件內，以看出逐步迭代的歷程
- 請同時整理目前已記錄的歷程文件
```