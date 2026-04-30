# copilot Module Guide

`copilot` 用於 Copilot 客製化產物維護與治理。

Draft 階段只在 `ai/copilot/en/` 與 `ai/copilot/zh-TW/` 內更新，只有明確宣告 Deploy 才寫入 `.github/`。

## Instructions
- `copilot.maintenance.instructions.md`
  - 用途：instruction / agent / prompt / skill 的職責邊界、合併規則、輸出規範。
- `copilot-instructions.md`（VS Code 保留檔名）
  - 用途：全域規則（語言規範、任務清單與通用互動規則）。
  - canonical draft 路徑：`ai/copilot/en/instructions/copilot-instructions.md`（English）、`ai/copilot/zh-TW/instructions/copilot-instructions.md`（Traditional Chinese）。

## Agents
- `copilot.maintainer`
  - 描述：以受控合併與雙語 normalization 方式維護 Copilot 產物。
  - 典型用途：新增/修改 instruction / agent / prompt / skill，確保跨產物一致性；支援發布封版與 git commit/tag 指令產出；自動保存原始需求文本以供追蹤。
- `copilot.speckit-customizer`
  - 描述：以專案級輕量流程將 Speckit 客製意圖轉為精確 overlay 規格並重複套用。
  - 典型用途：Speckit 升版後重套本地客製行為；先將繁中需求轉為 English 做 merge normalization；Draft 僅更新 `ai/`，宣告 Deploy 後才寫入 `.github/`；預設不走完整 release 流程。

## Prompts（Slash Commands）
- `/copilot.maintain`
  - 說明：從新的繁體中文需求更新 instruction / agent / prompt / skill；預設為 Draft（只更新 `ai/<module>/en/` 與 `ai/<module>/zh-TW/`）；宣告 Deploy 才同步寫入 `.github/`；宣告 release 時再封版 CHANGELOG、更新 `package.json` 並同步至 `/templates/`。
  - 對應 Agent：`copilot.maintainer`
- `/copilot.apply-speckit-customizations`
  - 說明：以使用者專案適用的輕量流程，將 Speckit 客製意圖改寫為精確 overlay 規格並重套到最新上游產物；預設不依賴 `/copilot.maintain` 或複雜 changelog/release 流程。
  - 對應 Agent：`copilot.speckit-customizer`
- `/copilot.merge-copilot-instructions`
  - 說明：將 `.github/instructions/copilot-instructions.md` 去重後合併到 `.github/copilot-instructions.md`；若目標不存在，直接以來源內容建立目標檔。
  - 對應 Agent：`copilot.maintainer`

## Skills
- `copilot.requirement-recorder`
  - 說明：提供可重複使用的原始需求記錄能力，供多個 agent/prompt 共用；預設模式為 `chronological`，預設根路徑為 `/docs/histories`，並支援 `versioned-basic`、`versioned-structured`。
  - 使用建議：優先使用單一參數化流程（mode + path + release），避免為同一任務拆分多段 handoff 以降低 by-request usage。

## Authoring Paths

| Artifact | Raw Authoring | English Deploy-Ready | Chinese Backup |
|----------|---------------|----------------------|----------------|
| instructions | `ai/copilot/en/instructions/` | `.github/instructions/` (Deploy only) | `ai/copilot/zh-TW/instructions/` |
| agents | `ai/copilot/en/agents/` | `.github/agents/` (Deploy only) | `ai/copilot/zh-TW/agents/` |
| prompts | `ai/copilot/en/prompts/` | `.github/prompts/` (Deploy only) | `ai/copilot/zh-TW/prompts/` |
| skills | `ai/copilot/en/skills/` | `.github/skills/` (Deploy only) | `ai/copilot/zh-TW/skills/` |

## Requirement History
- Storage: `ai/copilot/sources/requirements/copilot.requirement-history.md`

## CLI 安裝與維護命令
- `npx @saintber/copilot-library list`
  - 用途：列出所有可安裝的模組（含模組說明）；說明文字直接取自各模組 README 的第一段描述，確保與文件同步。
- `npx @saintber/copilot-library install --module copilot`
  - 用途：安裝 copilot 模組的工具至目標專案。
- `npx @saintber/copilot-library remove --module copilot`
  - 用途：解除安裝 copilot 模組。

## 使用案例
### 案例：更新 Copilot 工具規則
```text
/copilot.maintain
new_requirement: 新增規則：所有 Agent 回應一律附上「假設說明」區塊
```
Copilot 以 `copilot.maintainer` 角色：
1. 分析需求應放入哪個 instruction/agent。
2. Draft 階段更新 `ai/copilot/en/` 與 `ai/copilot/zh-TW/` 對應檔案。
3. 若宣告 Deploy，才同步寫入 `.github/`。
4. 若宣告 Release，才同步到 `templates/copilot/`。
