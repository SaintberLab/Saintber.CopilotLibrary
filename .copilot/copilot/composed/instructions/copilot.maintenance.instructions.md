---
description: 維護 Copilot 客製化產物（含 instruction、agent、prompt 及 skill）的穩定規則。
applyTo: ".github/instructions/copilot.maintenance.instructions.md,.github/agents/copilot.maintainer.agent.md,.github/prompts/copilot.maintain.prompt.md,.copilot/**/*.md"
---

# 目的
定義 Copilot 維護工具鏈及其相關 source materials 的穩定規則與責任邊界。

# 適用範圍
本規則僅適用於 Copilot 維護工具鏈本身 - `copilot.maintenance.instructions.md`、`copilot.maintainer.agent.md`、`copilot.maintain.prompt.md` - 與 `.copilot/**` 下相關的 source、composed、publish 產物；不作為套件使用者自有 `.github` 規則或第三方 vendor AI 檔案的預設治理層。

# 穩定規則
- `.copilot/` 為 authoring 層，`.github/` 為 publish 層。
- `.copilot/` 必須採用 module 化目錄：`.copilot/<module>/sources/requirements`、`.copilot/<module>/base`、`.copilot/<module>/composed`。
- 僅在使用者明確要求維護本函式庫 Copilot 產物或執行 release 時，才套用此維護治理流程。
- 因 `applyTo` 範圍被刻意收斂，`copilot.maintainer.agent.md` 也必須在執行時內嵌並強制套用相同維護治理；不可只依賴 `applyTo` 命中與否決定是否遵守規範。
- instruction、agent、prompt、skill 必須維持職責分離。
- 除非新需求明確改動，否則不得破壞既有規則。
- 更新時應最小化不相關修改。
- 優先採取增量更新，避免破壞性重寫。
- 合併需求時，除非必要，不重排既有章節結構。
- instruction、agent、prompt、skill 的術語需一致。
- 涉及雙語處理時，合併分析以 English 作為 normalization 語言。
- 最終繁中輸出需寫入 `.copilot/<module>/composed/` 對應路徑。
- 每次更新都必須產出清楚分段的結果。
- `description` 欄位使用繁體中文；技術名詞與 keyword 保留 English。
- 每次維護後必須更新 `CHANGELOG.md`：有指定 `version` 就寫入該版號；`no-increment` 則更新最新版本段；未指定則寫入 `[未發布]`。
- 每次維護需求時，都應保留使用者原始需求文本，存放在使用者指定路徑或預設位置（`.copilot/<module>/sources/requirements/`）中的命名空間歷程檔。
- 需求歷程不得再以日期分檔；每個 namespace 預設使用單一歷程檔（`<namespace>.requirement-history.md`），並依版本段落集中保存。
- 同一版本段落中的需求條目必須以反序記錄，讓迭代歷程可直接由新到舊追溯。
- 若未提供版本號，則將需求記錄於歷程檔中的 `[未發布]` 段落。
- 需求歷程條目應採正式模板，至少包含：`Recorded At`、`Change Summary`、`Affected Artifacts`、`Original Requirement`。
- 當使用者明確宣告發布新版時，需將 `[未發布]` 內容移入目標版本段，並保留新的空白 `[未發布]` 區塊供下一輪累積。
- 發布新版時，也必須將各 namespace 歷程檔中 `[未發布]` 的需求條目一併移入對應正式版本段落，並保留新的空白 `[未發布]` 段落。
- 若發布時有指定目標版號，必須在同一次發布流程中同步更新 repository `package.json` 的 `version` 欄位為相同版號。
- 發布流程需提供完整 git commit/tag 指令與完整 commit 訊息內容；若環境無版控，僅提供指令引導，不強制執行。
- 一般維護（非 release）只更新 `.copilot/` 與 `.github/`，不得同步更新 `/templates/`。
- 只有在 release 宣告後，才可依 namespace 將 `.github/` 內容同步到 `/templates/<module>/`，必要的 repository-level 維護檔可保留在 `/templates/` 根目錄。
- `.github/TOOLS.md` 已廢止，不再產生。工具說明應維護在 module README：`.copilot/<module>/README.md` 與 `/templates/<module>/README.md`。
- 每次維護後，若命令行為變更，需同步更新 module README。
- 具領域針對性的客製化邏輯，應放在專用 agent / prompt，而不是寫進 repository-wide 的共通維護 instruction。
- 若目標不在 `/.github/`，需遵循 `.copilot/README.md` 定義的流程（sources -> base -> composed -> publish）。
- 每次更新 `.github/` 檔案時，必須在同一次操作同步更新 `.copilot/<module>/composed/` 對應完整繁中檔案，不得略過或延後。

# 命名規則
- instruction、agent、prompt、skill 採 namespace 命名。
- 格式：`<namespace>[.<sub-namespace>].<artifact-name>.<type>.md`
- 已定義 namespace：

| Namespace | 範圍 |
|-----------|------|
| `code` | 產品程式碼規範（技術棧、遷移慣例） |
| `copilot` | Copilot 產物維護治理 |
| `docs` | 架構文件規範與相關 agent |
| `speckit` | SDD / Speckit 流程治理 |
| `kb` | 知識庫功能與治理 |
| `migration` | .NET 遷移工具鏈（solution、backend、frontend、DB、review） |

- 允許子分類（例如：`migration.dotnet-modernizer`）。
- 命名以語意清楚與可讀性為優先，不強制過度分層。
- `copilot-instructions.md` 為 VS Code 保留檔名，不套用 namespace 改名。

# 職責邊界
## Instruction
- 放置長期穩定的規範、限制、標準與禁止事項。
- 不放置一次性任務步驟（除非該步驟是穩定治理規則）。

## Agent
- 放置角色定義、流程偏好、guardrails 與工具行為。
- 不重複 repository-wide 的 instruction 規則。

## Prompt
- 放置可重複使用的任務流程。
- 不應成為長期治理規則的堆疊區。

## Skill
- 放置領域知識包與可重用的領域流程。
- 不重複 instruction 的治理規則。
- 不重複 agent 已定義的角色流程。

# 合併規則
- 若需雙語 normalization，先將繁中需求轉為 English 再做 merge analysis。
- 合併新需求時避免重複內容。
- 儘量保留未改動章節。
- 不可默默刪除既有規則。
- 若規則衝突，優先採用既有明確規則，除非新需求明確覆寫。

# 輸出規則
- 適用時需輸出 updated instruction / agent / prompt / skill。
- composed 層最終輸出必須為繁體中文。
- 需提供精簡但完整的變更摘要。
- 必須包含 CHANGELOG Update 與 Module README Update 確認段落。
- 若為發布情境，需提供 `git add`、`git commit`、`git tag`、`git push` 的完整執行指令與 commit 訊息範本。

# 禁止事項
- 不得僅為風格而重寫不相關段落。
- 不得將 instruction、agent、prompt、skill 混成單一產物。
- 不得僅憑推測更改舊規則。
