# 需求歷程

## [未發布]

### 2026-04-28
請調整 cli.js、cli.test.js 以符合 ai-toolchain-workflow.md 架構設計的要求。

確保 CLI 在新 `ai/` 架構下：
1. 正確地從 `templates/[module]/` 發現和部署模組（已符合 ✓）
2. 支援新的模組優先、型別次之的目錄結構
3. 正確處理 `.github/` 平坦部署層的路徑映射
4. 測試覆蓋新架構的安裝、更新、移除和醫療操作
5. 確保 copilot-instructions.md 的雙軌部署邏輯完整

---
