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
```

### 參數說明

- `--target <directory>`：目標目錄。
	- 未帶入時，預設為目前目錄（`.`）。
- `--module <ns1,ns2>`：只處理指定命名空間（可逗號分隔，支援 sub-namespace）。
	- 未帶入時，預設為所有命名空間。
- `--modules <ns1,ns2>`：`--module` 的相容別名。

範例：

```bash
npx @saintber/copilot-library init --target . --module copilot,docs
npx @saintber/copilot-library update --module migration.dotnet-modernizer
npx @saintber/copilot-library doctor
```

## 三個命令會做什麼

- `init`：把套件內 `templates/` 的內容安裝到 `target/.github`，並建立 `.copilot-library/state.json`。
- `update`：把最新 `templates/` 內容覆蓋更新到 `target/.github`，並更新 state。
- `doctor`：檢查目標目錄、state 檔案、安裝版本與目標檔案缺漏。

## 目錄概要

- `bin/`：CLI 入口。
- `src/`：CLI 實作。
- `templates/`：要部署到目標專案的 `.github` 內容。

## AI 使用手冊

完整的 AI 工具與 Slash Commands 使用手冊位於 [/.github/TOOLS.md](.github/TOOLS.md)。