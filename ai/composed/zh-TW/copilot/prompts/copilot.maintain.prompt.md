---
description: 以繁體中文需求維護本函式庫自身 Copilot instruction、agent、prompt 及 skill 產物的 repository-level 可重複 prompt。本 prompt 必須在 agent 模式執行，並將實作委派給 copilot.maintainer 自訂 agent。
agent: copilot.maintainer
tools: [read/readFile, agent, edit/createFile, edit/editFiles]
status: active
---

# 輸入
請提供以下參數：
- `new_requirement`：繁體中文的新需求
- `module`（選填）：目標模組（`code`、`copilot`、`docs`、`kb`、`migration`、`speckit`）；repository-level 治理變更時才省略
- `requirement_storage_path`（選填）：需求歷程保存路徑；預設為 `ai/<module>/sources/requirements/`（fallback `ai/sources/requirements/`）
- `requirement_file_format`（選填）：需求歷程檔名格式；預設 `<namespace>.requirement-history.md`（例如 `copilot.requirement-history.md`）
- `composed_path`（選填）：繁中輸出路徑；預設 `ai/composed/zh-TW/<module>/`（fallback `ai/composed/zh-TW/`）
- `version`（選填）：`CHANGELOG.md` 目標版號；`no-increment` 表示就地更新最新版本段；省略則列入 `[未發布]`
- `release`（選填）：明確宣告發布時設為 `true`
- `recorder_mode`（選填）：需求記錄器模式（`chronological` | `versioned-basic` | `versioned-structured`），預設 `chronological`
- `history_root_path`（選填）：記錄器根路徑；預設 `/docs/histories`
- `trigger_label`（選填）：`versioned-structured` 模式的 Trigger 欄位中文標籤

# 任務
使用 `copilot.maintainer` subagent，依照新需求更新本函式庫自身的 Copilot 客製化產物，或執行明確的 release 維護作業。

除非使用者明確執行 `/copilot.maintain`，否則不得將此流程用於下游專案自有 `.github` 規則編輯或第三方 vendor AI 更新。

# 委派契約
呼叫 `copilot.maintainer` subagent 時，要求其：
1. 閱讀繁中需求。
1.5. 在指定/預設 namespace 歷程檔中保留原始需求文本（預設 module-scoped），以反序分版本段落記錄，使用標準歷程模板確保可追溯性。
1.6. 無論受影響檔案是否在 `copilot.maintenance.instructions.md` `applyTo` 範圍內，均強制執行 `copilot.maintainer.agent.md` 內嵌的完整維護治理。
1.7. 解析 canonical artifact 路徑再編輯。對 `copilot-instructions.md`，只使用 `ai/copilot/instructions/copilot-instructions.md`（raw）、`ai/composed/en/copilot/instructions/`（English deploy）、`ai/composed/zh-TW/copilot/instructions/`（Chinese backup）；若存在非 canonical 路徑，標記為 skipped，除非明確要求遷移。
2. 將需求翻譯為 English 進行合併分析。
2.5. 對可重用原始需求記錄設計，優先推薦並實作 skill-first 操作，以單一參數化流程處理；除非明確要求，否則不拆分為多段 handoff。
3. 將新需求合併到現有 instruction、agent、prompt、skill 產物。
4. 避免重複。
5. 儘量保留原有結構。
6. 除非新需求明確改動，否則不破壞舊規則。
7. Normalize 措辭與章節結構。
8. 驗證跨產物一致性。
9. 有寫入權限時直接更新目標檔案。
10. 產出 composed 層的完整繁中輸出（含 skill，如適用），並寫入對應 `ai/composed/zh-TW/<module>/` 檔案（fallback `ai/composed/zh-TW/`）。此步驟為必要，不得略過。同時寫入 `ai/composed/en/<module>/` English deploy-ready 版本。
11. 以清楚分段的結果回傳。
12. 依版本行為更新 `CHANGELOG.md`。
13. 同步更新 module README 檔案（`ai/<module>/README.md`、`/templates/<module>/README.md`），反映行為/工具變更。
14. Release 宣告時，將現有 `[未發布]` 變更移入目標版本段，並保留新的空白 `[未發布]` 段落。
14.5. Release 宣告時，將各 namespace 歷程檔中 `[未發布]` 條目移入目標版本段。
14.6. Release 宣告且有指定版號時，更新 `package.json` `version` 欄位。
14.7. Release 宣告時，將所有 `ai/composed/en/<module>/` 產物同步至 `/templates/<module>/`；必要的 repository-level 治理檔可保留在 `/templates/` 根目錄。
15. Release 宣告時，提供完整 git release 指令（commit + tag + push）；若無 git 環境，提供指令引導而非強制執行。
16. 需求記錄器預設值適用時，除非外部需求明確覆寫，否則強制執行模式預設與路徑預設。

# 職責規則
- 穩定治理規則放入 instruction。
- 角色、流程、guardrails 放入 agent。
- 可重複使用的任務流程放入 prompt。
- `description` 欄位使用繁體中文；技術名詞與 keyword 保留 English。

# 必要的檔案更新行為
- 提供目標路徑且有寫入權限時，直接更新對應檔案。
- `release=true` 且有指定版號時，更新 `package.json` `version`。
- 繁中輸出寫入對應 `ai/composed/zh-TW/` 路徑；English deploy-ready 輸出寫入 `ai/composed/en/` 路徑。
- 不得默默略過檔案更新；若無法更新某路徑，必須明確說明路徑與原因。

# 輸出格式
## 變更摘要
- 只列出有意義的變更。

## 需求保存
- 保存路徑：<使用的路徑>
- 檔名：<使用的檔名>
- 版本段落：<版本標籤或「未發布」>
- 條目模板：<使用的正式模板>
- 用途：未來更新與稽核追蹤的來源可追溯性

## Updated Instruction
```md
<完整更新後的 instruction 內容>
```

## Updated Agent
```md
<完整更新後的 agent 內容>
```

## Updated Prompt
```md
<完整更新後的 prompt 內容>
```

## Updated Skill
```md
<完整更新後的 skill 內容>
```

## CHANGELOG Update
- 使用版本：<版本標籤或「未發布」>
- 新增或更新位置：CHANGELOG.md

## Module README Update
- 套用的變更：<module README 檔案中新增/移除/更新的摘要>

## Release Commands
- Git 環境：<可用|不可用>
- 指令：<完整的 `git add` / `git commit` / `git tag` / `git push` 指令或引導>

## File Update Result
- instruction: <updated|skipped|failed> - <path>
- agent: <updated|skipped|failed> - <path>
- prompt: <updated|skipped|failed> - <path>
- skill: <updated|skipped|failed|not-applicable> - <path>
- changelog: <updated|skipped|failed> - CHANGELOG.md
- module_readme: <updated|skipped|failed> - <path(s)>
- package: <updated|skipped|failed> - package.json
