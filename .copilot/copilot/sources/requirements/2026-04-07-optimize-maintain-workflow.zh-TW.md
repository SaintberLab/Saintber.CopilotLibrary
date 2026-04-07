---
title: CopilotLibrary 架構最佳化 - 模組級目錄重組與維護流程升級
date: 2026-04-07
version: 未發布
---

# 完整需求：優化 copilot-maintain 主流程

## 核心目標

1. **目錄結構現代化**
   - `.copilot/` 和 `/templates/` 從單一平鋪改為按 module 分組
   - 每個 module（code、copilot、docs、kb、migration、speckit）獨立管理 sources/base/composed
   - 示例: `/.copilot/kb/` 和 `/templates/kb/`

2. **維護策略調整**
   - `.copilot` 和 `.github` 維持時立即更新（不變）
   - `/templates` **只在用戶聲明 release 時才更新**（關鍵變化）

3. **文件組織與說明**
   - `.github` 不再產生 `TOOLS.md`
   - `.copilot/composed/TOOLS.md` 和 `/templates/TOOLS.md` 拆分至各 modules 目錄下的 `README.md`
   - 例: `.copilot/kb/README.md`、`/templates/kb/README.md`

4. **CLI 同步**
   - 修改 `src/cli.js` 以對齐新的模組化目錄結構
   - 完成後需進行測試

5. **層結構重新設計**
   - `.copilot/README.md` 作為層結構說明文檔
   - 原 `sources/base/composed` 路徑修正為 `/<模組>/sources`、`/<模組>/base`、`/<模組>/composed`
   - 原目錄下的內容依 module 搬遷至新目錄

6. **Instructions 設計流程調整**
   - Prompt 來源: `/.copilot/<模組>/base/`
   - 使用者新增/更新要求: `/sources/<模組>/requirements/`
   - 原 `/sources/updates` 的設計與新設計意圖重複，合併為 `/sources/requirements`
   - 更新完成後: 
     - 完整結果 → `/.copilot/<模組>/base/`
     - 繁體中文版本 → `/.copilot/<模組>/composed/`
   - Changelog / README.md / sources 用途規則不變
   - Release 後: 複製更新至 `/.github/`（無 module 目錄）和 `/templates/` （有 module 目錄）
   - 同步更新 `CHANGELOG.md` 和 `/sources/` 內容至發行版本

## 詳細設計

### 新的 `.copilot/` 結構

```
.copilot/
├── README.md                     (新增: 層結構說明)
├── code/
│   ├── sources/
│   │   └── requirements/         (原 sources/updates 改為 requirements)
│   ├── base/                     (authoring layer)
│   │   ├── agents/
│   │   ├── instructions/
│   │   ├── prompts/
│   │   └── skills/
│   └── composed/                 (中文版本)
│       ├── agents/
│       ├── instructions/
│       ├── prompts/
│       └── skills/
├── copilot/
│   ├── sources/requirements/
│   ├── base/
│   │   ├── agents/
│   │   ├── instructions/
│   │   ├── prompts/
│   │   └── skills/
│   ├── composed/
│   └── README.md                 (module 級說明)
├── docs/
│   ├── sources/requirements/
│   ├── base/
│   ├── composed/
│   └── README.md
├── kb/
│   ├── sources/requirements/
│   ├── base/
│   ├── composed/
│   └── README.md
├── migration/
│   ├── sources/requirements/
│   ├── base/
│   ├── composed/
│   └── README.md
└── speckit/
    ├── sources/requirements/
    ├── base/
    ├── composed/
    └── README.md
```

### 新的 `/templates/` 結構

```
templates/
├── README.md                     (updated: 指向 module READMEs)
├── TOOLS.md                      (deprecated: 重定向至 modules)
├── code/
│   ├── agents/
│   ├── instructions/
│   ├── prompts/
│   ├── skills/
│   └── README.md                 (取代 TOOLS.md)
├── copilot/
│   └── README.md
├── docs/
│   └── README.md
├── kb/
│   └── README.md
├── migration/
│   └── README.md
└── speckit/
    └── README.md
```

### 维护流程的改變

**原流程:**
```
需求 → copilot.maintain.prompt → .copilot/sources/updates/<namespace>/
     → .copilot/base/ → .copilot/composed/
     → release 時複製至 .github/ 和 /templates/
```

**新流程:**
```
需求 → copilot.maintain.prompt (with module param)
     → .copilot/<module>/sources/requirements/
     → .copilot/<module>/base/ → .copilot/<module>/composed/
     → release 時複製至 .github/ 和 /templates/<module>/
```

## 實施步驟

### Step 1: 文件遷移（保持不變使用者不感知）
- 將 `.github` 中的所有文件複製到 `.copilot/<module>/base/`
- 將既有 `.copilot/base/<type>/` 遷移至 `.copilot/<module>/base/<type>/`
- 將既有 `.copilot/composed/<type>/` 遷移至 `.copilot/<module>/composed/<type>/`
- 將 `.copilot/sources/` 中的需求遷移至 `.copilot/<module>/sources/requirements/`

### Step 2: 更新維護指令與流程
- 更新 `copilot.maintenance.instructions.md` 說明新結構
- 更新 `copilot.maintainer.agent.md` 支援 `<module>` 參數
- 更新 `copilot.maintain.prompt.md` 支援 module 級操作
- 所有維護工具保持在 `.github/` 發布層內（不進行 module 化）

### Step 3: 修改 CLI
- 調整 `src/cli.js` 的 `collectFiles` 以適應新的 `/templates/<module>/` 結構
- 測試 `init`, `update`, `remove` 命令
- 驗證 `doctor` 命令仍正確無功

### Step 4: 創建 README.md
- 各 module `.copilot/<module>/README.md` （來源層說明）
- 各 module `/templates/<module>/README.md` （發布層說明）
- 各 module `/templates/<module>/agents/README.md` 等詳細說明

### Step 5: 清理與文檔
- 標記原 `.copilot/base/`, `.copilot/composed/`, `.copilot/sources/` 為已廢棄
- 更新主 `.copilot/README.md` 說明層結構
- 更新 CHANGELOG.md

## 所有受影響的文件清單

- `.copilot/README.md` (新增)
- `.copilot/code/`, `.copilot/copilot/`, `.copilot/docs/`, `.copilot/kb/`, `.copilot/migration/`, `.copilot/speckit/` (新增及遷移內容)
- `/templates/code/`, `/templates/copilot/`, `/templates/docs/`, `/templates/kb/`, `/templates/migration/`, `/templates/speckit/` (新增及遷移內容)
- `.copilot/MIGRATION_PLAN.md` (執行計畫)
- `src/cli.js` (修改)
- `.github/instructions/copilot.maintenance.instructions.md` (修改)
- `.github/agents/copilot.maintainer.agent.md` (修改)
- `.github/prompts/copilot.maintain.prompt.md` (修改)
- `CHANGELOG.md` (修改)
- `package.json` (可能修改版本)
- `.github/TOOLS.md` (刪除)
- `/templates/TOOLS.md` (遷移至 modules)

---

*需求記錄時間: 2026-04-07 15:30 UTC*
