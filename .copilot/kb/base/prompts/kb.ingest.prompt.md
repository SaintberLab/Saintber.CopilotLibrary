---
description: 將草稿筆記、正式知識或修正內容輸入知識庫，自動判斷保存為 draft 或正式化為文章，並維護索引。
agent: KB Curator
---

# Ingest Knowledge

You are adding knowledge to the knowledge base.

## Task
Take the user's input — whether rough notes, formal documentation, corrections, updates, or an existing draft that now needs confirmation — and ensure it is properly stored in the knowledge base.

## What You Handle Automatically
- Deciding whether the content should remain as a draft or become formal KB content
- Deciding whether to create a new article or update an existing one
- Choosing the right document structure based on content type
- Updating relevant indexes after writing or promotion
- Flagging incomplete information

The user does not need to specify any of the above.

## Output Requirements
Return:
1. What was created or changed (with file paths)
2. Whether the result is still a draft or has become formal KB content
3. What indexes were updated
4. Any items that still need confirmation or are marked as uncertain

## User Input
${input}
