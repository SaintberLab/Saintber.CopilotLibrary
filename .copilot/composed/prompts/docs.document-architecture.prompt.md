---
agent: docs.architecture-documenter
description: 依現有程式碼、context 文件與 hybrid review 輸出建立或補齊架構文件初稿。
---

建立或補強本 repository 的架構文件。

# 輸入
- Documentation target: `${input:documentation_target=default:/docs/policy/}`
- Documentation scope: `${input:documentation_scope=default:/docs/README.md and /docs/policy/*}`
- Code scope: `${input:code_scope=default:entire repository}`
- Source mode: `${input:source_mode=default:mixed}` — `code`: 只依程式碼推導；`docs`: 只依既有文件推導；`mixed`: 綜合 code + docs + context；`hybrid-review`: 優先使用 hybrid review outputs
- Output mode: `${input:output_mode=default:draft}` — `draft`: 建立初稿；`expand`: 擴充既有文件；`refresh`: 依現況重寫文件
- Additional constraints: `${input:constraints=default:none}`

# 任務
1. 檢查指定 code scope、docs scope 與 relevant context documents。
2. 若 `source_mode=hybrid-review`，同時檢查：
   - `/Architecture/Inventory.md`
   - `/Architecture/Findings.md`
   - `/Architecture/Architecture.md`
   - `/Specification/Gap-Analysis.md`
   - `/Tasks/Unified-Plan.md`
3. 判斷應建立新文件、擴充既有文件，或刷新過時內容。
4. 以繁體中文撰寫架構文件，technical keywords 使用 English。
5. 若文件地圖改變，需同步更新 `/docs/README.md`。
6. 最後提供精簡摘要，說明建立 / 更新檔案、架構結論與尚未解決的模糊點。

# 限制
- 僅修改 documentation files，不修改 source code。
- 優先採信可由 code 驗證的結論。
- 不確定結論需明確標示。
- 不可把暫時性的 review findings 原封不動貼進長期文件。
- 文件必須聚焦、可導覽，且貼近 repository 實況。