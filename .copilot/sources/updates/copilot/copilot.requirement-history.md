# copilot Requirement History

本檔集中保存 `copilot` namespace 的原始需求歷程，依版本段落保存，並於同一版本內以新到舊反序記錄。

## 條目模板

每筆需求應採用以下正式模板：
- `Recorded At`: 記錄時間
- `Change Summary`: 本次需求摘要
- `Affected Artifacts`: 受影響產物
- `Original Requirement`: 原始需求全文

## [未發布]

### 2026-04-02 10 - restore-maintain-test-prompt-files

- Recorded At: `2026-04-02`
- Change Summary: 重新補回缺失的 `copilot.maintain-test.prompt.md` 與 `.copilot/composed/prompts/copilot.maintain-test.prompt.md`，讓測試用 prompt 與既有 `TOOLS.md`、CHANGELOG 記錄恢復一致，供維護流程 smoke test 使用。
- Affected Artifacts: `copilot.maintain-test.prompt.md`, `.copilot/composed/prompts/copilot.maintain-test.prompt.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
這只是一個流程測試，請加入一個用來測試維護流程的 prompt，我等等就刪除
```

### 2026-04-02 09 - enforce-maintainer-governance-beyond-applyto

- Recorded At: `2026-04-02`
- Change Summary: 確認 `copilot.maintenance.instructions.md` 的 `applyTo` 收斂後，新增的 `.github` 測試 prompt 不會再自動受該 instruction 約束；因此將核心維護治理正式內嵌到 `copilot.maintainer.agent.md`，並同步修正 `copilot.maintain.prompt.md`、`copilot.maintain-test.prompt.md`、`TOOLS.md` 與 composed 對應檔案，確保只要使用此 agent 就必須遵守完整維護流程。
- Affected Artifacts: `copilot.maintainer.agent.md`, `copilot.maintenance.instructions.md`, `copilot.maintain.prompt.md`, `copilot.maintain-test.prompt.md`, `.github/TOOLS.md`, `.copilot/composed/agents/copilot.maintainer.agent.md`, `.copilot/composed/instructions/copilot.maintenance.instructions.md`, `.copilot/composed/prompts/copilot.maintain.prompt.md`, `.copilot/composed/prompts/copilot.maintain-test.prompt.md`, `.copilot/composed/TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
目前修正的 #file:copilot.maintenance.instructions.md 是否已影響到 /copilot.maintain 的適用範圍？我新增測試用的 prompt 並沒有遵守 copilot.maintenance.instructions.md
- 產出的 .github/maintain-test.prompt.md 並非英文版
- 沒有更新 Tools.md
需求：
- 若這只是 test 的特例則略過
- 若適用範圍真的只局限於更新 .github/**/copilot.*、copilot/**/*.md，則應該被修正，我的主要目標是只要用了 #file:copilot.maintainer.agent.md 的命令/對話都應該被遵守，若真的無法透過 applyTo 達成要求，則乾脆將所有 copilot.maintenance.instructions.md 的規範整合至 agent 內，以強迫此 agent 會遵守要求
```

### 2026-04-02 08 - narrow-copilot-maintenance-scope

- Recorded At: `2026-04-02`
- Change Summary: 收斂 `copilot.maintenance.instructions.md` 的 `applyTo` 與治理範圍，避免維護規範自動套用到套件使用者自有 `.github` 規則或外部 vendor AI；並將此邊界同步明確化至 `copilot.maintainer.agent.md`、`copilot.maintain.prompt.md`、`TOOLS.md` 與 composed 對應檔案。
- Affected Artifacts: `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.maintain.prompt.md`, `.github/TOOLS.md`, `.copilot/composed/instructions/copilot.maintenance.instructions.md`, `.copilot/composed/agents/copilot.maintainer.agent.md`, `.copilot/composed/prompts/copilot.maintain.prompt.md`, `.copilot/composed/TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
目的：請收斂 #file:copilot.maintenance.instructions.md  的有效範圍，或移除 instructions 將規範合併至 #file:copilot.maintainer.agent.md 
問題：即使使用套件的使用者只是想變更自己的規則或外部廠商提供的 ai，都會觸發 maintain 流程
需求：請調整 instructions 範圍，或移除 instruction 並將規範合併至 agent
```

---

## [0.2.0]

### 2026-04-02 07 - speckit-customizer-full-zh-tw-composed-output

- Recorded At: `2026-04-02`
- Change Summary: 強化 `copilot.speckit-customizer` 與 `/copilot.apply-speckit-customizations` 的規則，明確要求寫入 `.copilot/composed/` 的文件必須是對應 `.github/` 產物的全文繁體中文完整版本，而不是只翻譯新增的客製化片段，並同步修正現有 composed 檔案為全文繁體中文。
- Affected Artifacts: `copilot.speckit-customizer.agent.md`, `copilot.apply-speckit-customizations.prompt.md`, `.copilot/composed/agents/copilot.speckit-customizer.agent.md`, `.copilot/composed/prompts/copilot.apply-speckit-customizations.prompt.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
優化 copilot.speckit-customizer.agent.md , copilot.apply-speckit-customizations.prompt.md
問題：
- 更新完成後，保留到 /prompt 的合併版本，只有新加入的內容為繁體中文，應該要是全文為繁體中文

需求：
- 當套用客製化完成後，應該以「全文為繁體中文」的形式保留文件至 /composed 的相對位置，而不是只有客製化的部分
- copilot.speckit-customizer.agent.md, copilot.apply-speckit-customizations.prompt.md 本身的更新仍遵守共通規範
```

### 2026-04-02 06 - release-sync-package-json-version

- Recorded At: `2026-04-02`
- Change Summary: 補充共通 release 維護規範：當使用者明確指定發布版號時，`copilot.maintain` 必須在同一次發布流程中同步更新 `package.json` 的 `version` 欄位，並與 CHANGELOG、requirement history、templates 同步行為保持一致。
- Affected Artifacts: `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.maintain.prompt.md`, `TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
請調整共通規範的 release，當指定要求 release 的時候，應同時將版號寫入 #file:package.json
```

### 2026-04-02 05 - cli-full-remove-all-support

- Recorded At: `2026-04-02`
- Change Summary: `remove` 現在支援 `--module all` 作為完整解除安裝模式；會移除所有已追蹤安裝內容並清除 `.copilot-library/` 狀態目錄，但仍保留使用者自有 `.github` 檔案。
- Affected Artifacts: `src/cli.js`, `src/cli.test.js`, `README.md`, `CHANGELOG.md`, `TOOLS.md`, `copilot.requirement-history.md`

```md
看起來 remove 沒有支援全模組移除的功能，請調整為輸入 --module 參數可以完整移除所有模組，並且移除 copilot-library 目錄/檔案，也就是完整移除所有安裝 (但不可動到 user 的其他 .github 項目)
```

### 2026-04-02 04 - cli-list-and-safe-remove

- Recorded At: `2026-04-02`
- Change Summary: `cli.js` 新增 `list` 與模組級 `remove` 能力，並於 `state.json` 記錄 `installedFiles`，確保解除安裝時只移除由 CopilotLibrary 安裝與追蹤的 `.github` 檔案，同時保留使用者原有內容。
- Affected Artifacts: `src/cli.js`, `src/cli.test.js`, `README.md`, `CHANGELOG.md`, `TOOLS.md`, `copilot.requirement-history.md`

```md
目的：更新 #file:cli.js 以支援 list, remove 功能
問題：目前僅有安裝/更新/確認版本功能，無法列出可安裝模組、無法解除安裝
需求：
- 需支援解除安裝，但不能刪除使用者原本的 .github 內容，故須明確知道當初安裝了哪些內容
- 解除安裝的目標以模組為單位即可
```

### 2026-04-02 03 - simplify-speckit-customizer-workflow

- Recorded At: `2026-04-02`
- Change Summary: 將 `copilot.speckit-customizer` 與 `/copilot.apply-speckit-customizations` 調整為專案級輕量 overlay 流程，不再預設依賴 `copilot.maintenance.instructions.md`、複雜 changelog/release 或 requirement history 步驟，但保留 English normalization、語意合併與 `.copilot/composed/` 繁中同步能力。
- Affected Artifacts: `copilot.speckit-customizer.agent.md`, `copilot.apply-speckit-customizations.prompt.md`, `TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
調整
#file:copilot.apply-speckit-customizations.prompt.md 
#file:copilot.speckit-customizer.agent.md 
問題：
- 此命令用於使用者各自的專案，不需要複雜的 copilot-maintain 流程支援、複雜的 changelog
需求：
- 不須再遵守 #file:copilot.maintenance.instructions.md 
- 擷取共通規範中關於「翻譯為英文、保留語意合併至目標、複製一分繁體中文版本到 /composed 對應目錄」的主要維護功能部分，更新至專屬的 #file:copilot.speckit-customizer.agent.md
```

### 2026-04-02 02 - refine-speckit-customizer-boundaries

- Recorded At: `2026-04-02`
- Change Summary: 將 Speckit 專屬邏輯自 `copilot.maintenance.instructions.md` 與 `copilot.maintainer.agent.md` 抽離，新增 `copilot.speckit-customizer` 專用 agent，並把 `copilot.apply-speckit-customizations.prompt.md` 改寫為精確 overlay 契約，避免直接內嵌原始需求原文。
- Affected Artifacts: `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.speckit-customizer.agent.md`, `copilot.apply-speckit-customizations.prompt.md`, `TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
請再優化 copilot.apply-speckit-customizations.prompt
問題：
1. 調整時汙染了 copilot.maintenance.instructions.md
2. Prompt 本身不夠精確
需求：
1. copilot.maintenance.instructions.md 作為維護 copilot 的基本規範，應該制定的是共通的規範而不該有針對性的內容
2. 本客製化需求若有需要可打造一個 agent，不一定只靠 prompt
3. 我提出的調整 speckit 的需求，應該轉化為更精確、有針對性地描述去修正 speckit，而不是把我需求原文直接放進去
```

### 2026-04-01 01 - speckit-overlay-prompt-and-policy-checks

- Recorded At: `2026-04-01`
- Change Summary: 新增可重複套用 Speckit 客製覆蓋的 prompt，納入憲章 draft/release 版號規則、`constitution.intent.raw.md` 原文留存與 Session Index，以及 `/speckit.plan`、`/speckit.tasks`、`/speckit.implement` 對 `/docs/policy/**` 的自動合規檢查要求。
- Affected Artifacts: `copilot.maintenance.instructions.md`, `copilot.maintainer.agent.md`, `copilot.apply-speckit-customizations.prompt.md`, `TOOLS.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
我想製作一個 prompt，目的是套用我習慣的客製化內容，更新到 speckit agents 上，並遵守 /copilot.maintain 的規範

原因：
speckit 會定期更版，我想簡單的用一個 prompt 就可以將我的客製內容，套用到新版的 speckit agents 上

想套用的需求：
== Constitution ==
- 使用 /speckit.consitution 更新憲章時，使用者尚未宣告 Release(定稿)，憲章版號應標記為舊版號-draft，表示還會被更新
- 將使用者透過 /speckit.consitution 輸入的憲章需求，保存原文在 /docs/constitutions/constitution.intent.raw.md，依照時間先後反序排列，並編版號為 Draft.[編號]
- 使用 /speckit.consitution 更新憲章時，使用者宣告 Release(定稿)，憲章版號應標記為新版號，並將 constitution.intent.raw.md 的 Draft.[編號] 改為 [新版號].[編號]
- constitution.intent.raw.md 應加上索引，欄位如下
	## 對話記錄索引（Session Index）

	| Session 版號 | 日期 | 對應憲章版本 | 主題摘要 |
	|-------------|------|------------|----------|


== Plan ==

- 使用者執行 /speckit.plan 的時候，會自動將 /docs/policy/** 的規範與設計納入計畫

== Task ==

- 使用者執行 /speckit.tasks 的時候，會自動檢查是否違背 /docs/policy/** 的規範與設計

== Implements ==

- 使用者執行 /speckit.implement 的時候，會自動檢查是否違背 /docs/policy/** 的規範與設計
```

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

### 2026-04-02 09 - add-maintain-test-prompt

- Recorded At: `2026-04-02`
- Change Summary: 新增 copilot.maintain-test.prompt.md 測試用 prompt，僅供驗證維護流程，請勿於正式環境保留。
- Affected Artifacts: `copilot.maintain-test.prompt.md`, `.copilot/composed/prompts/copilot.maintain-test.prompt.md`, `CHANGELOG.md`, `copilot.requirement-history.md`

```md
這只是一個流程測試，請加入一個用來測試維護流程的 prompt，我等等就刪除
```