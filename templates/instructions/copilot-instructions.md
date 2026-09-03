# MAS_2026 Copilot Global Rules

## Conversation & Document Language Rules
- 所有 Copilot 會話與摘要過程一律使用繁體中文（zh-TW）。
- 除非 user 或 prompt / agent 明確指定其他語言，AI 產出的文件一律使用繁體中文。

## AI 跨 Session 任務清單規則
- 進行**非 SDD 協作任務**（不透過 Speckit 進行）、且需跨 session 保存任務清單時，
  一律將任務文件建立於 `/tasks/<任務名稱>.tasks.md`。
- **不得**自行放置於 `docs/` 根目錄或其他位置。
- 檔案命名建議使用 kebab-case 英文，或保留中文描述（維持現有檔案風格）。

## Copilot 產物命名空間規則

本專案所有 scoped instruction、agent、prompt、skill 檔案統一使用**命名空間**命名格式：

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
| `kb` | 知識庫功能 |
| `migration` | .NET 遷移工具群（solution、backend、frontend、DB、review） |

規範：
- 命名空間可加子類別（如 `migration.dotnet-modernizer`），命名應同時滿足分類清晰與語意可讀。
- 並非每個字節都強制拆成子命名空間；選擇最能清楚傳達用途的名稱。
- `copilot-instructions.md`（本檔案）為 VS Code 保留檔名，豁免命名空間規則，僅放全域行為規則。
- 技術棧、專案結構等產品技術細節放在 `code.tech-stack.instructions.md`（scoped 至原始碼目錄）。
