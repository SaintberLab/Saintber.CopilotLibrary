---
agent: docs.architecture-documenter
description: 依現有程式碼、context 文件與 hybrid review 輸出建立或補齊架構文件，可做完整盤點但只更新 docs。
---

以 **documentation-only** 流程建立或補強本 repository 的架構文件。

# 輸入
- Documentation target: `${input:documentation_target=default:/docs/policy/}`
- Documentation scope: `${input:documentation_scope=default:/docs/README.md and /docs/policy/*}`
- Code scope: `${input:code_scope=default:entire repository}`
- Inventory mode: `${input:inventory_mode=default:auto}` — `auto`: 若需求或範圍很廣，改用 full-repository inventory；`targeted`: 僅檢查指定範圍；`full-repository`: 在寫文件前，先對整個 repository 做系統化架構盤點
- Include dependencies: `${input:include_dependencies=default:bounded}`（`none` | `direct` | `bounded` | `full`）
- Source mode: `${input:source_mode=default:mixed}` — `code`: 只依程式碼推導；`docs`: 只依既有文件推導；`mixed`: 綜合 code + docs + context；`hybrid-review`: 優先使用 hybrid review outputs
- Output mode: `${input:output_mode=default:draft}` — `draft`: 建立初稿；`expand`: 擴充既有文件；`refresh`: 依現況重寫文件
- Additional constraints: `${input:constraints=default:none}`

# 任務
1. 檢查指定 code scope、docs scope 與 relevant context documents。
2. 使用 `inventory_mode` 與 `include_dependencies` 判斷本次要做 targeted 檢查還是 full-repository architecture inventory。
3. 若 `inventory_mode=full-repository`，需以與 Hybrid Review Phase 1 類似的架構層級盤點方式掃描整個 repository，但仍維持在 documentation-only 工作流，且不依賴 persistent state。
4. 若 `source_mode=hybrid-review`，同時檢查：
   - `/Architecture/Inventory.md`
   - `/Architecture/Findings.md`
   - `/Architecture/Architecture.md`
   - `/Specification/Gap-Analysis.md`
   - `/Tasks/Unified-Plan.md`
5. 判斷應建立新文件、擴充既有文件，或刷新過時內容。
6. 以繁體中文撰寫架構文件，technical keywords 使用 English。
7. 若文件地圖改變，需同步更新 `/docs/README.md`。
8. 若使用者需要 persistent review artifacts、gap analysis files 或 optional code-alignment execution，應改用 `/docs.hybrid-review-execute`，不要把這個 docs-only authoring 流程過度延伸。
9. 最後提供精簡摘要，說明建立 / 更新檔案、架構結論、本次使用的 inventory mode 與尚未解決的模糊點。

# 限制
- 僅修改 documentation files，不修改 source code。
- 優先採信可由 code 驗證的結論。
- 不確定結論需明確標示。
- 不可把暫時性的 review findings 原封不動貼進長期文件。
- 文件必須聚焦、可導覽，且貼近 repository 實況。