# copilot 模組需求歷程

| Version | Date | Summary |
|---------|------|---------|
| 未發布 | 2026-04-30 | 補齊 copilot maintain 三件套在新流程目錄下的英文 Draft 檔案至 ai/copilot/en/ |
| 未發布 | 2026-04-30 | 補齊 copilot maintain 三件套在新流程目錄下的繁體中文 Draft 檔案至 ai/copilot/zh-TW/ |
| 未發布 | 2026-04-30 | 調整 AI 工具生產流程為 module 內雙語 Draft（en/zh-TW），取消 composed 目錄，並明確 Draft/Deploy/Release 階段寫入邊界 |
| 未發布 | 2026-04-28 | 遷移 .copilot 既有內容至 ai 新流程目錄架構：base→ai/<module>/<type>、composed→ai/composed/zh-TW/<module>/<type>、requirements→ai/<module>/sources/requirements |
| 未發布 | 2026-04-28 | 盤點 copilot maintain 三件套參數，移除未被流程使用的 existing_* 參數，並將 new_requirement_zh_tw 更名為 new_requirement |
| 未發布 | 2026-04-28 | 依新 ai-toolchain-workflow 設計建構專案目錄與 ai 演化工具組，authoring 層從 .copilot/ 遷移至 ai/ |

---

## [未發布]

### 2026-04-30

**Recorded At**: 2026-04-30  
**Change Summary**: 補齊 `copilot.maintenance.instructions.md`、`copilot.maintainer.agent.md`、`copilot.maintain.prompt.md` 的英文 Draft 版本至新流程目錄 `ai/copilot/en/`，使新流程的雙語 Draft 結構完整。  
**Affected Artifacts**: ai/copilot/en/instructions/copilot.maintenance.instructions.md, ai/copilot/en/agents/copilot.maintainer.agent.md, ai/copilot/en/prompts/copilot.maintain.prompt.md, CHANGELOG.md  
**Original Requirement**:
```
請將英文 Draft 也建立到 ai/copilot/en
```

---

### 2026-04-30

**Recorded At**: 2026-04-30  
**Change Summary**: 補齊 `copilot.maintenance.instructions.md`、`copilot.maintainer.agent.md`、`copilot.maintain.prompt.md` 的繁體中文 Draft 版本至新流程目錄 `ai/copilot/zh-TW/`，使 Deploy 後的中文 Draft 產物與新流程路徑一致。  
**Affected Artifacts**: ai/copilot/zh-TW/instructions/copilot.maintenance.instructions.md, ai/copilot/zh-TW/agents/copilot.maintainer.agent.md, ai/copilot/zh-TW/prompts/copilot.maintain.prompt.md, CHANGELOG.md  
**Original Requirement**:
```
剛剛還沒 deploy 所以沒有套用新流程產出中文版本，請補上中文版本在符合新流程的目錄位智
```

---

### 2026-04-30

**Recorded At**: 2026-04-30  
**Change Summary**: 調整 AI 工具生產流程，將 Draft 目錄改為 `ai/<module>/en/[type]` 與 `ai/<module>/zh-TW/[type]`，取消 `composed` 流程語意；新增明確階段規則：未宣告 Deploy/Release 時僅可更新 Draft，不得寫入 `.github/`，宣告 Deploy 後才可寫入 `.github/`。  
**Affected Artifacts**: ai/README.md, ai/manifest.yaml, ai/copilot/instructions/copilot.maintenance.instructions.md, ai/copilot/agents/copilot.maintainer.agent.md, ai/copilot/prompts/copilot.maintain.prompt.md, ai/copilot/README.md, CHANGELOG.md  
**Original Requirement**:
```
目的：調整 AI 工具生產流程

背景：
- 目前生產流程如 README
- 原 Draft 在 [module]/，Deploy 會到 Composed，但目前發現意義不大因為使用者是中文閱讀為主，而且都是透過 AI 直接更新設計
- .github/ 是已經佈署後的目錄，用以實測調整結果

需求
- 調整流程目錄架構，Draft 在 [module]/en/[type], [module]/zh-TW/[type], 取消 composed 目錄
- 請務必記得 Draft 階段不修改 /.github，那是 Deploy 階段的事情；只要沒宣告現在的 prompt 是 Deploy / Release，都只是 Draft
- 宣告 Deploy 後才會寫入 /.github
```

---

### 2026-04-28

**Recorded At**: 2026-04-28  
**Change Summary**: 執行 `.copilot` 到 `ai/` 的非破壞性遷移，將 `base` 內容搬至 `ai/<module>/<type>/`、`composed` 內容搬至 `ai/composed/zh-TW/<module>/<type>/`、`sources/requirements` 搬至 `ai/<module>/sources/requirements/`；既有新架構檔案採 skip 策略避免覆蓋。  
**Affected Artifacts**: ai/** (code, copilot, docs, kb, migration, speckit), migration-log-copilot-to-ai.txt  
**Original Requirement**:
```
請遷移原有的 /.copilot 內容至新流程目錄架構
```

---

### 2026-04-28

**Recorded At**: 2026-04-28  
**Change Summary**: 檢查 copilot maintain 三件套（instruction/agent/prompt）參數有效性，移除未被流程使用的 `existing_instruction`、`existing_agent`、`existing_prompt`、`existing_skill`，並將 `new_requirement_zh_tw` 更名為 `new_requirement` 以避免非必要語系後綴。  
**Affected Artifacts**: copilot.maintainer.agent.md, copilot.maintain.prompt.md  
**Original Requirement**:
```
請檢查 copilot maintain 的三件套，是否有參數是無效(未被使用)的
請移除無效參數
參數名稱若不是有必要(因同時有不同語言的輸入參數)，請不要加上在地化語系的字樣如 _zh_TW
```

---

### 2026-04-28

**Recorded At**: 2026-04-28  
**Change Summary**: 依 ai-toolchain-workflow.md 新設計，建構 ai/ 目錄骨架並更新 copilot 維護工具鏈三件套，將 authoring 層從 .copilot/ 遷移至 ai/；composed 層拆分為 ai/composed/en/（英文）與 ai/composed/zh-TW/（中文備份）。  
**Affected Artifacts**: copilot.maintenance.instructions.md, copilot.maintainer.agent.md, copilot.maintain.prompt.md  
**Original Requirement**:
```
請依照新設計的流程建構專案目錄
請依照新設計的需求建構 ai 演化工具組
後續我會在下一個 context window 做舊有工具搬遷
```

---
