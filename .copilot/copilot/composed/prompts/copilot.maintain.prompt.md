---
description: 以繁體中文需求維護本函式庫自身 Copilot instruction、agent、prompt 及 skill 產物的 repository-level 可重複 prompt。本 prompt 必須在 agent 模式執行，並委派給 copilot.maintainer。
agent: copilot.maintainer
tools:[read/readFile, agent, edit/createFile, edit/editFiles]
status: active
---

# 輸入
請提供：
- `new_requirement_zh_tw`: 繁體中文新需求
- `module`（可選）: 目標 module（`code`、`copilot`、`docs`、`kb`、`migration`、`speckit`）；未提供時僅用於 repository-level 治理檔調整
- `requirement_storage_path`（可選）: 原始需求歷程路徑；預設 `.copilot/<module>/sources/requirements/`（可回退 `.copilot/sources/requirements/`）
- `requirement_file_format`（可選）: 歷程檔名格式；預設 `<namespace>.requirement-history.md`
- `existing_instruction` / `existing_agent` / `existing_prompt` / `existing_skill`（可選）
- `composed_path`（可選）: 繁中輸出路徑；預設 `.copilot/<module>/composed/`（可回退 `.copilot/composed/`）
- `version`（可選）: CHANGELOG 目標版號；`no-increment` 代表就地更新最新版本；未提供則寫入 `[未發布]`
- `release`（可選）: 使用者明確宣告發布新版時設為 `true`

# 任務
使用 `copilot.maintainer` 子 agent，依新需求更新本函式庫自身 Copilot 客製化產物，或執行明確宣告的 release 維護流程。

若只是下游專案本地 `.github` 規則調整或第三方 vendor AI 更新，除非使用者明確要求 `/copilot.maintain`，否則不應將此 prompt 視為預設流程。

# 委派契約
委派 `copilot.maintainer` 時，要求其：
1. 讀取繁中需求。
1.5. 在指定或預設命名空間歷程檔保留原始需求文本（預設 module 路徑），依版本段落保存並反序寫入正式模板。
1.6. 不論 touched files 是否被 `applyTo` 命中，都必須對所有受影響產物強制套用 `copilot.maintainer.agent.md` 內嵌治理。
1.7. 編輯前先解析 canonical 路徑。`copilot-instructions.md` 只能寫入 `.copilot/copilot/base/instructions/copilot-instructions.md` 與 `.copilot/copilot/composed/instructions/copilot-instructions.md`；若偵測到 `.copilot/copilot-instructions/**`，除非使用者明確要求遷移，否則標記為 non-canonical 並略過雙寫。
2. 先轉為 English 再做 merge analysis。
3. 合併至 instruction、agent、prompt、skill。
4. 避免重複。
5. 儘量保留原結構。
6. 除非新需求明確要求，否則不破壞既有規則。
7. 正規化語句與章節結構。
8. 驗證跨產物一致性。
9. 在可寫入時直接更新目標檔案。
10. 產出完整繁中 composed 對應檔（含 skill）到 `.copilot/<module>/composed/`（必要時回退 `.copilot/composed/`），不得略過。
11. 以分段格式回傳結果。
12. 更新 `CHANGELOG.md`（版號行為依 `version`）。
13. 同步更新 module README（`.copilot/<module>/README.md`、`/templates/<module>/README.md`）。
14. 若為發布情境，將 `[未發布]` 封版到目標版本，並保留新的 `[未發布]`。
14.5. 發布時同步移轉受影響 namespace 歷程檔中的 `[未發布]` 條目。
14.6. 發布且指定版號時同步更新 `package.json`。
14.7. 發布時依 namespace 將 `.github/` 發布內容同步到 `/templates/<module>/`，必要的 repository-level 維護檔保留在 `/templates/` 根目錄。
15. 發布時提供完整 git 指令；若無版控環境，僅提供指令引導。

# 責任邊界
- 穩定治理規則放 instruction。
- 角色流程與 guardrails 放 agent。
- 可重複任務流程放 prompt。
- `description` 使用繁體中文，技術名詞與 keyword 保留 English。

# 必要檔案更新行為
- 有目標路徑且具備寫入權限時，必須直接更新對應檔案。
- 若 `release=true` 且有明確 `version`，必須同步更新 `package.json`。
- 必須寫入對應 `composed_path` 的完整繁中版本。
- 不可默默略過更新；若失敗需明確指出路徑與原因。

# 輸出格式
## Change Summary
- 只摘要有意義的變更。

## Requirement Preservation
- Storage path: <使用路徑>
- Filename: <使用檔名>
- Version section: <使用版本段落>
- Entry template: <使用正式模板>
- Purpose: 供後續更新追蹤與稽核

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

## Module README Update
- Changes applied: <summary of updated module README files>

## Release Commands
- Git context: <available|unavailable>
- Commands: <full git commands or guidance>

## File Update Result
- instruction: <updated|skipped|failed> - <path>
- agent: <updated|skipped|failed> - <path>
- prompt: <updated|skipped|failed> - <path>
- skill: <updated|skipped|failed|not-applicable> - <path>
- changelog: <updated|skipped|failed> - CHANGELOG.md
- module_readme: <updated|skipped|failed> - <path(s)>
- package: <updated|skipped|failed> - package.json
