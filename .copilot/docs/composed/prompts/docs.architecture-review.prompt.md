---
agent: docs.architecture-documenter
description: 僅審查現有架構文件與程式碼一致性，必要時更新 docs，不修改 source code。
---

以 **documentation-only** 流程審查並更新本儲存庫的架構文件。

# 輸入
- Documentation scope: `${input:documentation_scope=default:/docs/README.md and /docs/policy/*}`
- Code scope: `${input:code_scope=default:entire repository}`
- Inventory mode: `${input:inventory_mode=default:auto}` — `auto`: 若範圍為 `entire repository` 則自動改用 full-repository，否則採 targeted；`targeted`: 僅檢查指定區域；`full-repository`: 在審查文件前，先做一次系統化的全 repository 架構盤點
- Include dependencies: `${input:include_dependencies=default:bounded}`（`none` | `direct` | `bounded` | `full`）
- Mode: `${input:mode=default:full}` — `full`: 直接更新文件；`supplement`: 僅列出 code-doc conflicts，不修改檔案
- Additional constraints: `${input:constraints=default:none}`

# 任務
1. 審查指定範圍內的既有架構文件。
2. 若未指定 documentation scope，預設使用：
   - `/docs/README.md` 作為入口
   - `/docs/policy/*` 作為架構 policy 文件集合
   - `/docs/context/*` 作為專案 context 文件集合
3. 判斷：
   - 文件責任是否不清楚
   - 文件結構是否難以導覽
   - `/docs/README.md` 是否足以說明文件結構
4. 若文件說明不清：
   - 改善 `/docs/README.md`
5. 若文件責任不清或重疊：
   - 重整 `/docs/policy/*`
   - 重整 `/docs/context/*`
   - 更新 `/docs/README.md` 反映最終文件地圖
6. 使用 `inventory_mode` 與 `include_dependencies` 作為證據盤點控制，審查指定 code scope。
7. 若 `inventory_mode=full-repository`，先對整個 repository 做一次架構層級的系統化盤點，再回頭比對文件。
8. 依 `mode` 決定：
   - 若 `mode=supplement`：列出所有 code 與文件之間的衝突，不修改任何 documentation files，回傳給使用者決定。
   - 若 `mode=full`：把程式碼中已驗證的架構事實反映回文件，再繼續後續文件更新；但不可修改 source code。
9. 你可以建立、重新命名、合併、拆分、刪除或編輯架構文件。
10. 更新 `/docs/README.md` 中的文件結構說明。
11. 若使用者需要 persistent review artifacts（`/Architecture/*`、`/Specification/*`、`/Tasks/*`）或 remediation planning，應改用 `/docs.hybrid-review-execute`，不要把這個 docs-only review 流程過度延伸。
12. 最後提供精簡摘要，說明：
   - findings
   - 文件結構決策
   - 變更檔案
   - 尚未解決的模糊點

# 限制
- 僅修改 documentation，不修改 source code。
- 對 code 的檢查是為了取得證據，不代表隱含要求你重構程式。
- 優先使用 repository-specific facts，而不是泛用架構理論。
- 未經證據支持，不得虛構責任分工。
- 不確定內容必須明確標示。
- 保持 README 為文件導航入口。

# 使用者額外限制
${input:constraints}