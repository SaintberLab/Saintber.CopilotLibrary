# Requirement: Update Copilot Customizations

## Goal
建立一個可重複使用的 prompt，用來更新既有的 Copilot instruction、agent、以及 prompt 檔案；若需要 agent / skill 配合，可同時建立 agent。

## Required Capabilities
1. 接收輸入：
   - 中文撰寫的新需求
   - 既有的 instruction / agent / prompt 內容
2. 將新需求翻譯為英文。
3. 將新需求合併進既有內容：
   - 避免重複
   - 維持原有結構
   - 非明確要求變更舊規則，否則不破壞既有規則
4. 統一語氣與結構（normalization）。
5. 將合併後的內容更新至 instruction、agent、以及 prompt 檔案。
6. 將更新完成的完整內容翻譯為繁體中文，保留至 `/composed` 目錄的相對位置內。
7. 輸出結果需包含：
   - 更新後的 instruction
   - 更新後的 agent
   - 更新後的 prompt
8. 確保三種產物之間的一致性（cross-artifact consistency）。
9. 保留既有設計意圖，不得隨意改寫原有規範。
10. 輸出格式需清楚分段（sectioned output）。
11. 此 prompt 必須設計為可反覆使用（iterative reuse）。

## Notes
- 這是一個治理型 prompt，不是一次性 prompt。
- 這個流程預設先以英文做 merge / normalization，再輸出繁體中文版到 `/composed`。
