# AI 工具目錄（Instructions / Agents / Prompts / Skills）

本文件說明目前在線（`.github/` 目錄下）的所有 Copilot 客製化工具的用途、適用情境與使用範例。

> **工具類型速覽**
>
> | 類型 | 路徑 | 作用 |
> |------|------|------|
> | **Instructions** | `.github/instructions/` | 長效行為規則，自動套用至特定範圍的所有 Copilot 對話 |
> | **Agents** | `.github/agents/` | 自訂 AI 角色，含工作流程、工具授權與 handoff 設定 |
> | **Prompts** | `.github/prompts/` | 可重複呼叫的任務型 Slash Command（`/指令名稱`） |
> | **Skills** | `.github/skills/` | 領域知識包，由 Agent 或 Prompt 按需載入 |

## 命名空間（Namespace）說明

本專案採用命名空間前綴管理 Copilot 產物，格式為：`<namespace>.<name>`。

| Namespace | 主要用途 | 常見產物範例 |
|-----------|----------|--------------|
| `code` | 產品程式碼規範、技術棧與遷移準則 | `code.tech-stack.instructions.md`, `code.migration-conventions.instructions.md` |
| `copilot` | Copilot 客製化產物維護與治理 | `copilot.maintenance.instructions.md`, `/copilot.maintain`, `copilot.maintainer` |
| `docs` | 架構文件撰寫、審查與精煉 | `docs.architecture.instructions.md`, `/docs.document-architecture`, `docs.architecture-documenter` |
| `migration` | .NET Framework → .NET 8 功能遷移、規劃與審查 | `/migration.prepare-backend-plan`, `migration.dotnet-modernizer`, `migration.reviewer` |
| `kb` | 知識庫治理、寫入、重整與查詢 | `kb.governance.instructions.md`, `/kb.query`, `kb.researcher` |
| `speckit` | 微軟官方維運（保留上游基線並支援客製覆蓋重套） | 上游基線：`.copilot/composed/speckit-backup/`、覆蓋工具：`/copilot.apply-speckit-customizations` |

> `copilot-instructions.md` 為 VS Code 保留檔名，屬全域規則，不使用 namespace 前綴。

## CLI 安裝與維護命令

除了在對話中使用 Instructions / Agents / Prompts / Skills 外，也可使用 `@saintber/copilot-library` CLI 管理目標專案的 `.github` 內容。

| 命令 | 用途 |
|------|------|
| `npx @saintber/copilot-library list` | 列出目前可安裝的 module selectors；若目標專案已有 `.copilot-library/state.json`，也會顯示已追蹤的已安裝模組 |
| `npx @saintber/copilot-library remove --module <ns|all>` | 依模組解除安裝；若使用 `all`，會完整移除所有已追蹤安裝內容並清除 `.copilot-library/` 狀態目錄；整個過程都不會刪除使用者原本的 `.github` 內容 |

> 若為舊版安裝且尚未記錄 `installedFiles`，請先執行一次 `update` 再使用 `remove`，以確保安全解除安裝。

---

## Instructions（指令規則）

Instructions 為**長效、自動套用**的規則集。Copilot 在匹配 `applyTo` 的檔案範圍內工作時，會自動遵守對應的指令規則，無需手動觸發。

### 全域規則

| 檔案 | applyTo | 用途 |
|------|---------|------|
| `copilot-instructions.md` | 全域（所有對話） | 語言規範（繁體中文）、跨 session 任務清單規則（`/tasks/` 存放位置）、namespace 命名治理規則 |

### 產品程式碼規則（Scoped: 原始碼目錄）

> 套用範圍：`MAS_Batch/**`, `MAS_Web/**`, `Mas_Library/**`, `MAS_Bst/**`, `MAS_Gov/**`, `MAS_DataBase/**`, `Packages/**`

| 檔案 | 用途 |
|------|------|
| `code.tech-stack.instructions.md` | 當前技術棧（.NET 8 / .NET 4.7 過渡期）、專案結構、程式碼風格 |
| `code.migration-conventions.instructions.md` | .NET 4.7 → .NET 8 遷移慣例、禁止事項、輸出行為要求、必要的計畫先行流程 |

### Copilot 產物維護規則

| 檔案 | applyTo | 用途 |
|------|---------|------|
| `copilot.maintenance.instructions.md` | `copilot.maintenance.instructions.md`、`copilot.maintainer.agent.md`、`copilot.maintain.prompt.md`、`.github/TOOLS.md`、`.copilot/**` | 僅限 Copilot 維護工具鏈本身的職責邊界、合併規則與輸出規範；避免自動影響套件使用者自有 `.github` 規則或第三方 vendor AI 檔案 |

### 文件規則

| 檔案 | applyTo | 用途 |
|------|---------|------|
| `docs.architecture.instructions.md` | `docs/**` | 架構文件審查、撰寫與重整規則；區分現況/目標/建議清理 |

### 知識庫規則

| 檔案 | applyTo | 用途 |
|------|---------|------|
| `kb.governance.instructions.md` | `knowledge/**` | 知識庫治理規則：知識物件類型、索引設計、取回優先路由、撰寫與維護規則 |

---

## Agents（自訂角色）

Agents 定義特定 **AI 角色**的工作流程、工具授權與 handoff 路徑。在 Copilot Chat 的 Agent 模式下，選擇對應角色即可啟用。

### 遷移專家群

| Agent 名稱 | 描述 | 典型用途 |
|------------|------|----------|
| `migration.solution-architect` | 規劃舊版 ASP.NET MVC 至 .NET 8 的大規模遷移架構 | 分析整體 solution、提出分階段遷移計畫、識別風險與耦合點 |
| `migration.dotnet-modernizer` | 將 .NET Framework / ASP.NET MVC 程式碼現代化至 .NET 8 | 後端遷移實作：DI、middleware、config、套件相容性 |
| `migration.mvc-kendo-migrator` | 將 ASP.NET MVC views 與 Kendo UI 2017 遷移至 ASP.NET Core MVC + Kendo UI 2024 | Razor views、HtmlHelper、Kendo widget API 升級 |
| `migration.db-architect` | 規劃與審查 SQL Server → PostgreSQL 的資料庫遷移 | Schema 改寫、型別映射、語意差異分析、rollback 策略 |
| `migration.platform-infra-architect` | 設計 Redis、Seq、Cloud Logging、GCS 整合方案 | 結構化 logging、cache 策略、GCS 存取抽象化 |
| `migration.reviewer` | 嚴格審查遷移計畫與程式碼變更的正確性與風險 | 挑戰假設、找出相容性缺口、補測試漏洞、驗收計畫品質 |

### 架構文件群

| Agent 名稱 | 描述 | 典型用途 |
|------------|------|----------|
| `docs.architecture-documenter` | 文件優先的架構盤點與文件維護 agent | 可做 targeted 或 full-repository inventory，再更新 `/docs`；僅調整文件，不修改 source code |
| `docs.hybrid-reviewer` | 設計多階段、stateful 的 Hybrid review pipeline 契約 | 規劃 FULL / PARTIAL review 流程、state schema、phase prompts、remediation mode 與 failure handling；不直接執行盤點 |
| `docs.hybrid-review-executor` | 實際執行 Hybrid review pipeline 的單一步驟或小型 chunk | 產出 inventory / findings / plan / architecture docs；預設 `docs-only`，只有明確指定 `change_mode=apply-code` 才允許修正程式碼；可透過 PowerShell 自行驗證（build / test / 檔案檢查） |

### Copilot 維運群

| Agent 名稱 | 描述 | 典型用途 |
|------------|------|----------|
| `copilot.maintainer` | 以受控合併與雙語 normalization 方式維護 Copilot 產物 | 僅在明確要求維護本函式庫 Copilot 產物或進行 release 時使用；新增/修改 instruction / agent / prompt / skill，確保跨產物一致性，並自動保存原始需求文本以供追蹤 |
| `copilot.speckit-customizer` | 以專案級輕量流程將 Speckit 客製意圖轉為精確 overlay 規格並重複套用 | Speckit 升版後重套本地客製行為；先將繁中需求轉為 English 做 merge normalization；更新 `.github/` 後同步寫入 `.copilot/composed/` 繁中副本；預設不走完整 `/copilot.maintain` / changelog 流程 |

### 知識庫群

| Agent 名稱 | 描述 | 典型用途 |
|------------|------|----------|
| `kb.curator` | 接收任何形式的知識輸入，自動分類、寫入文章並維護索引 | 收錄草稿 / 正式知識、自動判斷新建或更新、自動維護索引 |
| `kb.organizer` | 評估知識庫結構與索引品質，執行文件搬遷、拆分整併與索引重整 | 重整知識庫資料夾、調整文件邊界、重建索引與路由 |
| `kb.researcher` | 根據問題自動導覽索引與文章，回傳整合答案 | 查詢知識庫、取回相關文件、報告知識缺口 |
| `kb.advisor` | 以知識庫作為主要背景，提供作法建議與取捨分析 | 根據 KB 內容提供建議、補足 KB 缺口、區分事實與推論 |

## Prompts（Slash Commands）

Prompts 為可在 Copilot Chat 以 `/指令名稱` 方式觸發的**一次性任務流程**。多數 Prompt 會啟動對應的 Agent 角色執行工作。

### 遷移類

| Slash Command | 說明 | 對應 Agent |
|---------------|------|------------|
| `/migration.analyze-legacy-solution` | 分析舊版 .NET Framework MVC solution，產出遷移待辦清單 | `migration.solution-architect` |
| `/migration.plan-module` | 為單一模組建立詳細遷移計畫 | `migration.solution-architect` |
| `/migration.prepare-architecture-plan` | 審查或更新架構遷移範本，再建立範圍特定計畫 | `migration.solution-architect` |
| `/migration.prepare-backend-plan` | 審查或更新後端遷移範本，再建立後端遷移計畫 | `migration.dotnet-modernizer` |
| `/migration.prepare-frontend-plan` | 審查或更新前端遷移範本，再建立前端遷移計畫 | `migration.mvc-kendo-migrator` |
| `/migration.migrate-controller-and-view` | 將 MVC controller 與 Razor/Kendo views 整組遷移至 .NET 8 | `migration.mvc-kendo-migrator` |
| `/migration.migrate-mvc-feature-by-plan` | 依既有遷移計畫執行 MVC feature 遷移 | `migration.mvc-kendo-migrator` |
| `/migration.migrate-sql-to-postgres` | 將 SQL Server schema 或 SQL 邏輯改寫為 PostgreSQL 版本 | `migration.db-architect` |
| `/migration.add-observability-and-infra` | 為已遷移功能新增 logging、cache、GCS 整合設計 | `migration.platform-infra-architect` |
| `/migration.review-output` | 嚴格審查遷移計畫或程式碼變更的正確性與風險 | `migration.reviewer` |

### 架構文件類

| Slash Command | 說明 | 對應 Agent |
|---------------|------|------------|
| `/docs.architecture-review` | 僅審查現有架構文件是否與程式碼一致；可只回報衝突，或直接更新 docs | `docs.architecture-documenter` |
| `/docs.document-architecture` | 依 code / docs / context 建立或刷新架構文件，可做 targeted 或 full-repository inventory，但只更新 docs | `docs.architecture-documenter` |
| `/docs.hybrid-review` | 設計支援 FULL / PARTIAL review 的 Hybrid Architecture & Specification Review Pipeline；不直接盤點專案 | `docs.hybrid-reviewer` |
| `/docs.hybrid-review-execute` | 依 state 檔逐步執行 Hybrid Architecture & Specification Review Pipeline；預設僅產出 report / docs，必要時再依 `change_mode` 決定是否進入 code alignment | `docs.hybrid-review-executor` |

### docs 系列命令怎麼選？

| 命令 | 主要用途 | 盤點方式 | 主要輸出 | 是否修改 source code |
|------|----------|----------|----------|----------------------|
| `/docs.architecture-review` | 檢查既有架構文件是否過時、衝突或責任不清 | 依 `documentation_scope` + `code_scope` 做證據比對；可用 `inventory_mode=full-repository` 做完整盤點 | 衝突清單，或更新後的 `/docs/README.md`、`/docs/policy/*` | **否** |
| `/docs.document-architecture` | 從 code / docs / context 建立、補齊或刷新架構文件 | 可做 targeted 或 full-repository inventory；偏向文件產出與重整 | 新增/更新的架構文件、更新後的 `/docs/README.md` | **否** |
| `/docs.hybrid-review` | 設計可續跑的 review pipeline 契約 | 不直接盤點專案；重點是 workflow / state / phase 設計 | `System Overview`、`State Schema`、`Review-Scope Schema`、`Prompt Templates` 等設計輸出 | **否** |
| `/docs.hybrid-review-execute` + `change_mode=docs-only` | 實際執行 review pipeline，但只做報告 / docs 更新 | 依 `State.json` / `Review-Scope.md` 分階段盤點與分析 | `/Architecture/Inventory.md`、`/Architecture/Findings.md`、`/Specification/Gap-Analysis.md`、`/Tasks/Unified-Plan.md`、必要的架構文件更新 | **否** |
| `/docs.hybrid-review-execute` + `change_mode=apply-code` | 在 review artifacts 之外，明確允許有界的 code alignment | 與上列相同，但需先有清楚 scope 與 evidence，再處理當前 chunk 的修正 | 上述 review artifacts + code change summary + 更新後 state | **是，但必須明確 opt-in** |

> 若你只是要「review 報告」或「調整架構文件」，請優先使用 `/docs.architecture-review` 或 `/docs.document-architecture`。只有在你需要 **stateful、可續跑、分階段的架構/規格盤點與 gap analysis** 時，才使用 `/docs.hybrid-review-execute`。

### Copilot 維運類

| Slash Command | 說明 | 對應 Agent |
|---------------|------|------------|
| `/copilot.maintain` | 用於本函式庫自身 Copilot 產物治理或 release：從新的繁體中文需求更新 instruction / agent / prompt / skill；可在宣告 release 時同步封版 CHANGELOG、同步更新 `package.json` 版號、同步 `.github/`（包含 `.github/TOOLS.md`）至 `/templates/` 部署目錄並產出 git 發布命令；自動以正式模板保存原始需求至 `.copilot/sources/updates/<namespace>/<namespace>.requirement-history.md`，依版本反序累積，並在發布時移轉至正式版本段落；即使 target files 不在 `copilot.maintenance.instructions.md` 的 `applyTo` 內，也會由 `copilot.maintainer` 自身強制套用完整維護治理 | `copilot.maintainer` |
| `/copilot.apply-speckit-customizations` | 以使用者專案適用的輕量流程，將 Speckit 客製意圖改寫為精確 overlay 規格並重套到最新上游產物；預設不依賴 `/copilot.maintain` 或複雜 changelog/release 流程 | `copilot.speckit-customizer` |

### 知識庫類

| Slash Command | 說明 | 對應 Agent |
|---------------|------|------------|
| `/kb.ingest` | 輸入草稿、正式知識或修正內容，自動判斷保存為 draft 或正式化為文章，並維護索引 | `kb.curator` |
| `/kb.reorganize` | 評估索引與現有知識庫內容，重整結構、搬遷檔案並同步調整索引 | `kb.organizer` |
| `/kb.query` | 給定問題，嚴格依據知識庫內容查詢並回傳整合答案 | `kb.researcher` |
| `/kb.advise` | 以知識庫作為背景提供建議，即使 KB 不完整也能提出作法 | `kb.advisor` |

## Skills（領域知識包）

Skills 是可由 Agent 或 Prompt 按需載入的**領域知識包**，不直接觸發，而是在對應工作情境中自動引用。

| 檔案 | 說明 |
|------|------|
| `docs.architecture-refactor.skill.md` | 架構文件精煉方法論，供 `docs.architecture-documenter` 按需載入 |
| `docs.hybrid-review-pipeline.skill.md` | Hybrid Architecture & Specification Review Pipeline 的分階段、stateful 設計方法 |

---

## 使用範例

### 範例 1：分析一個舊 MVC 模組並產出遷移計畫

```
/migration.analyze-legacy-solution MAS_Web/Controllers/BatchController.cs
```

Copilot 以 `migration.solution-architect` 角色分析指定路徑，輸出：  
（1）現況架構摘要、（2）依賴熱點、（3）遷移阻礙、（4）建議分階段計畫。

---

### 範例 2：後端遷移實作

```
/migration.prepare-backend-plan MAS_Web/Controllers/UserController.cs
```

Copilot 以 `migration.dotnet-modernizer` 角色：  
（1）確認 `/tasks/backend-migration-template.md` 是否存在並符合需求；  
（2）產生針對該 Controller 的後端遷移計畫；  
（3）逐步執行（DI、config、HttpContext 替換、套件升級）。

---

### 範例 3：儲存學習筆記或決策記錄

```
/kb.ingest 今天決定以 PostgreSQL 作為主資料庫，理由是授權費用、開發工具生態系與 GCP 支援度。
```

Copilot 以 `kb.curator` 角色：  
（1）判斷內容是否達到正式知識標準；  
（2）若尚不完整，儲存為 `knowledge/inbox/` 草稿；  
（3）若內容完整，寫入正式 KB 文章並更新所屬索引。

---

### 範例 4：查詢知識庫中的決策依據

```
/kb.query 我們為什麼選擇 PostgreSQL？有沒有記錄過相關決策？
```

Copilot 以 `kb.researcher` 角色：  
（1）導覽相關 KB 索引；  
（2）讀取最少必要文章；  
（3）整合答案並標注來源；若知識庫中無對應資料，明確說明知識缺口。

---

### 範例 5：取得超出知識庫範圍的建議

```
/kb.advise 我們要決定是否導入 Redis 作為快取層，請根據既有架構背景給我建議。
```

Copilot 以 `kb.advisor` 角色：  
（1）讀取 KB 中與架構相關的背景；  
（2）整合 KB 事實與推論性建議；  
（3）明確區分 KB 依據 / 建議作法 / 假設與缺口。

---

### 範例 6：重整知識庫索引結構

```
/kb.reorganize
```

Copilot 以 `kb.organizer` 角色：  
（1）評估所有索引品質（廣度、陳舊度、孤立文章）；  
（2）產出重整計畫（搬遷 / 拆分 / 整併 / 保留）；  
（3）執行變更並同步更新所有索引。

---

### 範例 3：Kendo View 遷移

```
/migration.migrate-controller-and-view MAS_Web/Views/Batch/Index.cshtml
```

Copilot 以 `migration.mvc-kendo-migrator` 角色：  
（1）列出 view 依賴；（2）說明需要調整的 Controller / ViewModel；  
（3）列出 Kendo UI 2017 → 2024 的 widget API 變更點。

---

### 範例 4：SQL Server → PostgreSQL 改寫

```
/migration.migrate-sql-to-postgres MAS_DataBase/Procedures/sp_GetBatchList.sql
```

Copilot 以 `migration.db-architect` 角色輸出：  
型別映射表、語法改寫說明、語意差異警告（如 NULL 排序行為）、rollback 策略。

---

### 範例 5：審查遷移成果

```
/migration.review-output MAS_Web/Controllers/ReportController.cs
```

Copilot 以 `migration.reviewer` 角色產出：  
blockers（阻斷問題）、major issues（重大問題）、minor issues（次要問題）。

---

### 範例 6：更新 Copilot 工具規則

```
/copilot.maintain
new_requirement_zh_tw: 新增規則：所有 Agent 回應一律附上「假設說明」區塊
```

Copilot 以 `copilot.maintainer` 角色：  
（1）分析需求應放入哪個 instruction/agent；（2）合併後更新對應檔案；  
（3）輸出繁體中文版至 `.copilot/composed/`。

---

### 範例 8：架構文件整理（文件優先，不改程式）

```
/docs.document-architecture
documentation_target: /docs/policy/
code_scope: entire repository
inventory_mode: full-repository
include_dependencies: bounded
source_mode: mixed
output_mode: refresh
```

Copilot 以 `docs.architecture-documenter` 角色：
（1）完整盤點 repository 的主要模組、依賴方向與整合點；
（2）比對 `/docs/README.md` 與 `/docs/policy/*`；
（3）刷新過時或不一致的架構內容；
（4）必要時同步更新文件導覽與結構說明。
**輸出重點：** 更新後的架構文件與文件結構摘要，不修改 source code。

---

### 範例 8B：先看 review 報告，不直接改文件

```
/docs.architecture-review
documentation_scope: /docs/README.md and /docs/policy/*
code_scope: entire repository
inventory_mode: full-repository
mode: supplement
```

Copilot 以 `docs.architecture-documenter` 角色：
（1）完整盤點實際架構；
（2）列出 code-doc conflicts、責任重疊與過時內容；
（3）先回傳補強建議，讓你決定是否進一步更新文件。
**輸出重點：** review 報告 / 衝突清單，不修改 docs 與 source code。

---

## docs 命名空間應用範例

### 範例 9：完整建立全專案架構文件，不含規格

```
/docs.document-architecture
documentation_target: /docs/policy/
code_scope: entire repository
source_mode: mixed
output_mode: refresh
```

Copilot 以 `docs.architecture-documenter` 角色：  
（1）檢查整個 repository 與現有 `/docs`；  
（2）完整刷新全專案架構文件；  
（3）同步更新 `/docs/README.md` 反映最終文件地圖。  

### 範例 10：初步建立全專案架構文件，不含規格

```
/docs.document-architecture
documentation_target: /docs/policy/
code_scope: entire repository
source_mode: mixed
output_mode: draft
```

Copilot 以 `docs.architecture-documenter` 角色：  
（1）從 code、docs 與 context 建立初稿；  
（2）補齊缺漏的架構主題；  
（3）將不確定處標示為 `Assumption` 或 `To be confirmed`。  

### 範例 11：完整建立全部規格 + 架構（只做 review / docs）

```
/docs.hybrid-review-execute
review_domain: hybrid
scope: system
depth: deep
strictness: high
target_type: module
targets: all
include_dependencies: full
change_mode: docs-only
state_path: /Tasks/State.json
review_scope_path: /Tasks/Review-Scope.md
```

Copilot 以 `docs.hybrid-review-executor` 角色：
（1）依 `State.json` / `Review-Scope.md` 分階段續跑；
（2）建立 architecture inventory、spec inventory、gap analysis 與 unified plan；
（3）逐步產出架構與規格所需文件。
**輸出重點：** `/Architecture/*`、`/Specification/*`、`/Tasks/*` 等 review artifacts 與必要文件更新；**不修改 source code**。

### 範例 11B：review 後明確允許進行有界程式碼對齊

```
/docs.hybrid-review-execute
review_domain: architecture
scope: module
target_type: feature
targets: Batch Dashboard
include_dependencies: direct
boundary_rules: only batch dashboard related workflows and APIs
change_mode: apply-code
state_path: /Tasks/State.json
review_scope_path: /Tasks/Review-Scope.md
```

Copilot 會先輸出對應的 findings / plan / state 更新，再只針對已界定範圍的當前 chunk 進行 code alignment。
**輸出重點：** review artifacts + code change summary；適用於你已明確同意要修正程式架構的情境。

### 範例 12：更新架構文件

```
/docs.document-architecture
documentation_target: /docs/policy/
documentation_scope: /docs/README.md and /docs/policy/*
code_scope: entire repository
source_mode: mixed
output_mode: refresh
```

Copilot 以 `docs.architecture-documenter` 角色：  
（1）比對現況 code 與既有文件；  
（2）修正過時或不一致的架構內容；  
（3）保持文件結構清楚且可導覽。  

### 範例 13：新增指定範圍規格

```
/docs.hybrid-review-execute
review_domain: specification
scope: module
target_type: feature
targets: Batch Dashboard
include_dependencies: direct
boundary_rules: only batch dashboard related workflows and APIs
excluded_targets: unrelated admin features
```

Copilot 以 `docs.hybrid-review-executor` 角色：  
（1）先建立該 feature 的 Review-Scope；  
（2）只在指定範圍內建立 spec inventory 與 gap analysis；  
（3）逐步補出該範圍的規格文件。  

### 範例 14：更新指定範圍規格

```
/docs.hybrid-review-execute
review_domain: specification
scope: module
target_type: document
targets: /Specification/Batch-Dashboard.md
include_dependencies: bounded
boundary_rules: keep within batch module and direct API dependencies
excluded_targets: reporting module
```

Copilot 以 `docs.hybrid-review-executor` 角色：  
（1）讀取既有 state 與 Review-Scope；  
（2）只更新指定規格文件與其必要相依範圍；  
（3）把變更結果回寫至 specification 相關輸出檔。  

---

## 職責邊界速查

| 我想要… | 正確的工具類型 | 範例 |
|---------|--------------|------|
| 讓 Copilot 永遠套用某個規則 | **Instruction** | 加入 `code.tech-stack.instructions.md` |
| 定義一個 AI 工作角色與流程 | **Agent** | 新增 `.github/agents/xxx.agent.md` |
| 建立一個可重複呼叫的任務指令 | **Prompt** | 新增 `.github/prompts/xxx.prompt.md` |
| 封裝一個領域的知識供 Agent 引用 | **Skill** | 新增 `.github/skills/xxx.skill.md` |
| 以上任何內容需要異動 | `/copilot.maintain` | 詳見 Slash Command 說明 |
