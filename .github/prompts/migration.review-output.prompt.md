---
description: 嚴格審查遷移計畫或程式碼變更的正確性與風險。
agent: migration.reviewer
argument-hint: feature/module/path or generated output
---

Review the selected migration output.

Check:
- hidden compatibility gaps
- missing test coverage
- database semantic risks
- deployment and rollback risks
- observability omissions
- maintainability issues

Return:
- blockers
- major issues
- minor issues
- suggested fixes
