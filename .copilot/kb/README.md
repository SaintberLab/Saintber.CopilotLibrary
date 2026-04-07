# kb Module Guide

`kb` 用於知識庫治理、寫入、重整與查詢。

## Instructions
- `kb.governance.instructions.md`
  - applyTo：`knowledge/**`
  - 用途：知識庫治理規則，涵蓋知識物件類型、索引設計、取回優先路由、撰寫與維護規則。

## Agents
- `kb.curator`
  - 描述：接收任何形式的知識輸入，自動分類、寫入文章並維護索引。
  - 典型用途：收錄草稿 / 正式知識、自動判斷新建或更新、自動維護索引。
- `kb.organizer`
  - 描述：評估知識庫結構與索引品質，執行文件搬遷、拆分整併與索引重整。
  - 典型用途：重整知識庫資料夾、調整文件邊界、重建索引與路由。
- `kb.researcher`
  - 描述：根據問題自動導覽索引與文章，回傳整合答案。
  - 典型用途：查詢知識庫、取回相關文件、報告知識缺口。
- `kb.advisor`
  - 描述：以知識庫作為主要背景，提供作法建議與取捨分析。
  - 典型用途：根據 KB 內容提供建議、補足 KB 缺口、區分事實與推論。

## Prompts（Slash Commands）
- `/kb.ingest`（對應 Agent：`kb.curator`）
- `/kb.reorganize`（對應 Agent：`kb.organizer`）
- `/kb.query`（對應 Agent：`kb.researcher`）
- `/kb.advise`（對應 Agent：`kb.advisor`）

## 使用案例
### 範例 3：儲存學習筆記或決策記錄
```text
/kb.ingest 今天決定以 PostgreSQL 作為主資料庫，理由是授權費用、開發工具生態系與 GCP 支援度。
```

### 範例 4：查詢知識庫中的決策依據
```text
/kb.query 我們為什麼選擇 PostgreSQL？有沒有記錄過相關決策？
```

### 範例 5：取得超出知識庫範圍的建議
```text
/kb.advise 我們要決定是否導入 Redis 作為快取層，請根據既有架構背景給我建議。
```

### 範例 6：重整知識庫索引結構
```text
/kb.reorganize
```
