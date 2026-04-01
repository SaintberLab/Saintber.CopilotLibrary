---
description: /docs 下架構文件的審查、精煉與撰寫規則。
applyTo: "docs/**"
---

# 目的
本 repository 可使用 Copilot 依據兩類資訊來審查、精煉與產生架構文件：
1. `/docs` 下的既有文件
2. repository 中實際存在的程式碼結構

目標是讓架構文件保持正確、可導覽，並與真實系統一致。

# 文件角色
- `/docs/README.md` 是文件入口。
- `/docs/README.md` 必須說明：
	- 文件結構
	- 各架構主題記錄在哪裡
	- 如何導覽整份文件集
- `/docs/policy/*` 用來放置架構政策、責任、邊界與設計文件。
- 若有助於提高清晰度，可調整 policy 文件的命名、拆分、合併、建立、編修或刪除。

# 一般規則
- 優先採信可驗證的架構事實，而非假設。
- 架構文件應從實際程式碼與既有文件推導，不可憑空猜測。
- 不得創造程式碼或文件未能證明的責任邊界。
- 必須清楚區分：
	- 目前已實作架構
	- 目標架構
	- 建議的後續清理方向
- 若無法確認，需明確標示為：
	- `Assumption`
	- `To be confirmed`
	- `Inconsistency detected`

# 審查既有文件時
應評估：
- 文件責任是否清楚分離
- 命名是否一致
- 相關主題是否被正確分組
- 是否存在重複或互相衝突的描述
- `/docs/README.md` 是否正確反映目前文件結構

若文件結構混亂：
- 優先改善 `/docs/README.md`
- 必要時重整 `/docs/policy/*`
- 保持文件層次簡單且易於探索

# 審查程式碼時
應推導並記錄：
- 高階架構分層
- 專案 / 模組責任
- 依賴關係與依賴方向
- composition / integration points
- boundary rules
- cross-cutting concerns
- infrastructure concerns
- 觀察到的 legacy 或模糊區域

除非有助於說明架構，否則不要過度記錄實作細節。

# 文件風格
以精簡、技術性、貼近本 repository 的語言撰寫。
架構文件使用繁體中文；proper nouns 與 technical keywords 使用 English。

建議章節結構：
- Purpose
- Scope
- Responsibility
- Boundaries / What it must not do
- Key interactions / dependency direction
- Notes / exceptions
- Open questions if necessary

# 架構文件更新的必要輸出
更新架構文件時：
1. 先判斷是否需要重整文件結構
2. 再更新 `/docs/README.md` 反映最終文件地圖
3. 再更新或建立相關 policy files
4. 提供簡短變更摘要

# 混合審查工作流規則
- 設計 architecture + specification 的混合審查流程時，必須使用 multi-stage pipeline，不可設計成單一 prompt。
- 流程必須明確分離 target resolution、inventory、analysis、planning、iteration phases。
- 必須使用外部 persistent state，不可依賴 conversation memory。
- Inventory 之前必須先產出明確 scope 文件，並嚴格依其界線執行。
- 輸出應以 deterministic、chunked、file-based 方式產生，不應一次處理整個系統。
- 必須同時支援 full-system review 與 targeted partial review，且需有明確 dependency expansion policy。

# 混合審查必要輸出檔案
- `/Architecture/Inventory.md`
- `/Architecture/Findings.md`
- `/Architecture/Architecture.md`
- `/Specification/Spec-Inventory.md`
- `/Specification/Gap-Analysis.md`
- `/Tasks/Unified-Plan.md`
- `/Tasks/State.json`
- `/Tasks/Review-Scope.md`

# 變更摘要格式
當有變更時，摘要應包含：
- 建立的檔案
- 重新命名的檔案
- 刪除的檔案
- 有實質更新的檔案
- 重要的文件結構決策
- 尚未解決的模糊點

# 安全規則
- 未明確要求時，不要修改 source code。
- 此類任務僅修改 documentation files。
- 不要刪除仍有價值的內容，除非已保留於其他位置或已明確判定為冗餘 / 過時。
- 除非目前結構明顯失效，否則優先採取漸進式清理，而非大幅重寫。