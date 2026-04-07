# Copilot Authoring Workspace

本目錄為 Copilot 客製化產物的 authoring layer，採 module 化管理。

## 目錄結構
- `.copilot/<module>/sources/requirements/`: 原始需求與 namespace history（append-only）
- `.copilot/<module>/base/`: 維護後的正規化產物（主要編修層）
- `.copilot/<module>/composed/`: 對應 base 的完整繁體中文版本

## 流程
1. 讀取 `.copilot/<module>/base/` 既有產物作為 merge baseline。
2. 將新需求寫入 `.copilot/<module>/sources/requirements/` 的 `<namespace>.requirement-history.md`。
3. 完成維護後，同步更新 `.github/`（publish layer）與 `.copilot/<module>/composed/`。
4. 只有在使用者明確宣告 release 時，才同步 `.github/` 至 `/templates/<module>/`。

## 模組
- `code`
- `copilot`
- `docs`
- `kb`
- `migration`
- `speckit`
