# Saintber.CopilotLibrary

用來安裝與更新 Copilot 客製化資產（Instructions / Agents / Prompts / Skills）的 CLI 工具。

## 快速安裝（建議用 npx）

不需要先全域安裝，直接在目標專案目錄執行：

```bash
npx @saintber/copilot-library init
```

## 常用指令

```bash
npx @saintber/copilot-library init
npx @saintber/copilot-library update
npx @saintber/copilot-library doctor
npx @saintber/copilot-library list
npx @saintber/copilot-library remove --module kb
npx @saintber/copilot-library remove --module all
```

### 參數說明

- `--target <directory>`：目標目錄。
  - 未帶入時，預設為目前目錄（`.`）。
- `--module <ns1,ns2>`：只處理指定命名空間（可逗號分隔，支援 sub-namespace）。
  - 未帶入時，預設為所有命名空間。
- `--modules <ns1,ns2>`：`--module` 的相容別名。

## 五個命令會做什麼

- `init`：把套件內 templates 內容安裝到 `target/.github`，並建立 `.copilot-library/state.json`。
- `update`：把最新 templates 內容覆蓋更新到 `target/.github`，並更新 state。
- `doctor`：檢查目標目錄、state 檔案、安裝版本與目標檔案缺漏；若 state 內有安裝清單，會優先依安裝清單檢查。
- `list`：列出目前可安裝的 module selectors；若目標專案已有 state，也會顯示已追蹤的已安裝模組。
- `remove`：依 `--module` 解除安裝指定模組；若使用 `--module all`，會完整移除所有已追蹤安裝內容，並刪除 `.copilot-library/` 狀態目錄，但不會碰觸使用者原本未由本工具安裝的 `.github` 內容。

## 目錄概要

- `bin/`：CLI 入口。
- `src/`：CLI 實作。
- `templates/`：要部署到目標專案的 `.github` 內容（module 化）。

## AI 使用手冊

工具說明已改為 module README：
- `templates/code/README.md`
- `templates/copilot/README.md`
- `templates/docs/README.md`
- `templates/kb/README.md`
- `templates/migration/README.md`
- `templates/speckit/README.md`
