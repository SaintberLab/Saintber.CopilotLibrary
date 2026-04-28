---
description: 暫時用於測試 Copilot 維護流程的 prompt。驗證完成後請移除。
agent: copilot.maintainer
tools:[read/readFile, agent, edit/createFile, edit/editFiles]
status: test
---

# 輸入
可選擇提供一段簡短說明，描述你想驗證維護流程的哪個部分。

# 任務
使用 `copilot.maintainer` 子 agent，對維護流程執行一次暫時性的 smoke test。

# 預期驗證項目
- `.github/` 產物已完成 normalization。
- 對應的 `.copilot/composed/` 產物已寫入完整繁體中文版本。
- 當測試引入有意義的暫時性產物變更時，`CHANGELOG.md`、requirement history 與 `TOOLS.md` 會一併更新。

# 備註
本 prompt 僅供暫時驗證流程使用；測試完成後請刪除此檔案。
