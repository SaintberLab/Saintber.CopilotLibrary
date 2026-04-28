# copilot 模組需求歷程

| Version | Date | Summary |
|---------|------|---------|
| 未發布 | 2026-04-28 | 遷移 .copilot 既有內容至 ai 新流程目錄架構：base→ai/<module>/<type>、composed→ai/composed/zh-TW/<module>/<type>、requirements→ai/<module>/sources/requirements |
| 未發布 | 2026-04-28 | 盤點 copilot maintain 三件套參數，移除未被流程使用的 existing_* 參數，並將 new_requirement_zh_tw 更名為 new_requirement |
| 未發布 | 2026-04-28 | 依新 ai-toolchain-workflow 設計建構專案目錄與 ai 演化工具組，authoring 層從 .copilot/ 遷移至 ai/ |

---

## [未發布]

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
