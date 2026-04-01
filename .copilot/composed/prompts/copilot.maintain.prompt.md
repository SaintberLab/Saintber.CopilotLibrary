---
description: 以繁體中文需求更新 Copilot instruction、agent、prompt 及 skill 產物的可重複 prompt。本 prompt 必須在 agent 模式執行，並委派給 copilot.maintainer。
agent: copilot.maintainer
tools:[read/readFile, agent, edit/createFile, edit/editFiles]
status: active
---

# 輸入
請提供：
- `new_requirement_zh_tw`: 繁體中文新需求
- `requirement_storage_path`（可選）: 儲存原始需求歷程的路徑；非指定時預設 `.copilot/sources/updates/<namespace>/`
- `requirement_file_format`（可選）: 需求歷程檔名格式；預設 `<namespace>.requirement-history.md`（例：`copilot.requirement-history.md`）
- `existing_instruction`: 現有 instruction 內容（可選）
- `existing_agent`: 現有 agent 內容（可選）
- `existing_prompt`: 現有 prompt 內容（可選）
- `existing_skill`: 現有 skill 內容（可選）
- `composed_path`（可選）: 繁中輸出路徑（預設 `.copilot/composed/`）
- `version`（可選）: CHANGELOG 目標版號；`no-increment` 代表就地更新最新版本；未提供則寫入 `[未發布]`
- `release`（可選）: 若使用者明確宣告發布新版，設為 `true`

# 任務
使用 `copilot.maintainer` 子 agent，依新需求更新既有 Copilot 客製化產物。

# 委派契約
委派 `copilot.maintainer` 時，要求其：
1. 讀取繁中需求。
1.5. 在指定或預設的命名空間歷程檔保留原始需求文本，依版本段落保存，並以正式模板反序寫入作為追蹤記錄。
2. 先轉為 English 再做 merge analysis。
3. 合併至 instruction、agent、prompt、skill。
4. 避免重複。
5. 儘量保留原結構。
6. 除非新需求明確要求，否則不破壞既有規則。
7. 正規化語句與章節結構。
8. 驗證跨產物一致性。
9. 在可寫入時直接更新目標檔案。
10. 產出完整繁中 composed 對應檔（含 skill），且不得略過。
11. 以分段格式回傳結果。
12. 更新 `CHANGELOG.md`（版號行為依 `version`）。
13. 同步更新 `.github/TOOLS.md`。
14. 若為發布情境，將 `[未發布]` 內容封版到目標版本，並保留新的 `[未發布]` 區塊。
14.5. 若為發布情境，也將受影響 namespace 歷程檔中的 `[未發布]` 條目移入目標版本段落。
14.7. 若為發布情境，將 `.github/` 所有內容（包含 `.github/TOOLS.md`）同步至 `/templates/` 作為 CLI 部署產物。
15. 提供完整 git 發布命令（commit + tag + push）；若無版控環境，僅提供指令，不強制執行。

# 責任邊界
- 穩定治理規則放 instruction。
- 角色流程與 guardrails 放 agent。
- 可重複任務流程放 prompt。
- `description` 使用繁體中文，技術名詞與 keyword 保留 English。

# 必要檔案更新行為
- 當有目標路徑且具備寫入權限時，必須直接更新對應檔案。
- 必須寫入對應 `composed_path` 的完整繁中版本。
- 不可默默略過更新；若失敗需明確指出路徑與原因。

# 輸出格式
## Change Summary
- 只摘要有意義的變更。

## Requirement Preservation
- Storage path: <使用的路徑>
- Filename: <使用的檔名>
- Version section: <使用的版本段落>
- Entry template: <使用的正式模板>
- Purpose: 供日後更新追蹤與審計稽核

## Updated Instruction
```md
<full updated instruction content>
```

## Updated Agent
```md
<full updated agent content>
```

## Updated Prompt
```md
<full updated prompt content>
```

## Updated Skill
```md
<full updated skill content>
```

## CHANGELOG Update
- Version used: <version tag or "未發布">
- Entry added or updated at: CHANGELOG.md

## TOOLS.md Update
- Changes applied: <summary of what was added/removed/updated in TOOLS.md>

## Release Commands
- Git context: <available|unavailable>
- Commands: <full `git add` / `git commit` / `git tag` / `git push` commands or guidance>

## File Update Result
- instruction: <updated|skipped|failed> - <path>
- agent: <updated|skipped|failed> - <path>
- prompt: <updated|skipped|failed> - <path>
- skill: <updated|skipped|failed|not-applicable> - <path>
- changelog: <updated|skipped|failed> - CHANGELOG.md
- tools: <updated|skipped|failed> - .github/TOOLS.md