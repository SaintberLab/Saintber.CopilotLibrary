# MAS_2026 Copilot Global Rules

## Conversation & Document Language Rules
- 所有 Copilot 會話、摘要與中途進度更新一律使用繁體中文（zh-TW）。
- 除非使用者明確要求其他語言，否則所有產生的文件與檔案輸出一律使用繁體中文（zh-TW）。
- 專有名詞與技術關鍵字為例外，為保持精確性可保留英文。

## AI 跨 Session 任務清單規則
- 進行非 SDD 協作任務（不透過 Speckit）且需要跨 session 保存任務清單時，任務檔案必須建立於 `/tasks/<task-name>.tasks.md`。
- 任務檔案不得放置於 `docs/` 根目錄或其他任意路徑。
- 檔名建議使用英文 kebab-case，或在符合既有風格時保留中文描述。

## Copilot 產物命名空間規則

本專案所有 scoped instruction、agent、prompt、skill 產物統一採用以下命名空間格式：

```
<namespace>[.<sub-namespace>].<artifact-name>.<type>.md
```

命名空間定義如下：

| 命名空間 | 涵蓋範圍 |
|---|---|
| `code` | 產品程式碼慣例（tech stack、migration conventions） |
| `copilot` | Copilot 產物維護治理 |
| `docs` | 架構文件規則與維護 |
| `speckit` | SDD / Speckit 流程治理 |
| `kb` | 知識庫能力 |
| `migration` | .NET 遷移工具鏈（solution、backend、frontend、DB、review） |

規範：
- 命名空間可加入子類別（例如 `migration.dotnet-modernizer`），但命名需同時維持分類清晰與語意可讀。
- 不必強制把每個詞都拆成子命名空間；請使用最能清楚傳達意圖的名稱。
- `copilot-instructions.md`（本檔案）是 VS Code 保留檔名，豁免命名空間規則，僅用於全域行為規則。
- 技術棧與專案結構等產品技術細節應放在 `code.tech-stack.instructions.md`（scoped 至原始碼目錄）。
