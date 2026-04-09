---
description: 知識庫治理規則，適用於 knowledge/ 目錄下所有文件；涵蓋知識物件類型、索引設計、取回路由與維護規則。
applyTo: "knowledge/**"
---

# Knowledge Base Governance Instructions

You are helping maintain a structured, evolving knowledge base under `knowledge/`.

## Primary Goal
Optimize the knowledge base for:
- long-term reuse
- scalable retrieval
- progressive discovery
- low duplication
- clear routing from question to relevant documents

## Knowledge Base Object Types

1. **Article** — the main knowledge content (rules, guides, notes, decisions, troubleshooting, procedures)
2. **Index** — retrieval-oriented navigation document that narrows search scope; may be hierarchical
3. **Policy** — rules for naming, indexing, retrieval, maintenance, and document boundaries
4. **Inbox Note** — raw or partially processed material not yet promoted to a stable article

## Draft Lifecycle Rules
- Store unconfirmed, partial, or still-evolving material as **Inbox Note** under `knowledge/inbox/` unless the user specifies another draft location.
- Promote an Inbox Note into a formal Article only when the content is sufficiently confirmed or the user explicitly asks to formalize it.
- When promoting a draft, preserve important source context and unresolved uncertainty instead of silently dropping it.
- When a draft is promoted, update the relevant indexes in the same operation.

## Index Design Rules
Indexes should:
- define category boundaries
- describe what kinds of questions belong there
- point to sub-indexes and key articles
- help narrow the search scope
- avoid duplicating full article content

Indexes may be nested. A parent index should route to child indexes when a topic is still too broad.

## Retrieval-First Thinking
- Do not assume all documents should be searched equally.
- Prefer routing through index documents first.
- Use hierarchical indexes when the domain is broad.
- Read narrow, relevant documents before broad, generic ones.
- Maintain retrieval guidance in indexes.

## Writing Rules
When writing knowledge objects:
- use descriptive headings
- make sections self-contained
- reduce ambiguity
- avoid decorative writing
- preserve technical meaning
- label uncertainty explicitly (Assumption / To Verify / Open Question)
- keep terminology stable across documents
- include keywords that future users are likely to search for

## Maintenance Rules
When new knowledge is added:
- check whether an existing article already covers it
- check whether the relevant index should be updated
- add links between related objects where useful

When an article grows too broad:
- propose splitting it into smaller focused articles
- update the relevant indexes accordingly

When many articles cluster around one area:
- propose a new child index for that area

## Reorganization Rules
- Knowledge-base reorganization may move files, split documents, merge overlapping documents, and rebuild indexes when retrieval quality has degraded.
- Reorganization should start with index and boundary assessment, then verify article contents, then apply file moves or structural changes, then update indexes and cross-references.
- When moving or renaming files, update impacted indexes and links in the same operation.
- Prefer the smallest structural change that materially improves retrieval quality.

## Query And Advisory Modes
- **Query mode** is strict and evidence-oriented: answer only from knowledge found in the knowledge base, and say clearly when the KB does not contain enough information.
- **Advisory mode** may use the knowledge base as primary background while also offering reasoned recommendations beyond the KB.
- In advisory mode, clearly distinguish:
	- KB-grounded facts
	- inferred recommendations
	- assumptions or gaps

## Uncertainty Handling
If the knowledge is incomplete:
- mark assumptions explicitly
- list open questions
- avoid fabricating missing facts

## Style
Use concise, structured, utilitarian language.
Optimize for maintainability and retrieval quality.
