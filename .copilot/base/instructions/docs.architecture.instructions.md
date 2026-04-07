---
description: /docs 下架構文件的審查、精煉與撰寫規則。
applyTo: "docs/**"
---

# Purpose
This repository may use Copilot to review, refine, and generate architecture documentation from both:
1. existing documentation under `/docs`
2. actual code structure in the repository

The goal is to keep architecture documentation accurate, navigable, and aligned with the real system.

# Documentation Roles
- `/docs/README.md` is the documentation entry point.
- `/docs/README.md` must describe:
  - the documentation structure
  - where each architecture topic is documented
  - how to navigate the documentation
- `/docs/policy/*` contains architecture-specific policy, responsibility, boundary, and design documents.
- Policy documents may be renamed, split, merged, created, edited, or deleted if necessary to improve clarity.

# General Rules
- Prefer architecture facts over assumptions.
- Derive documentation from actual code and existing docs, not from guesswork.
- Do not invent responsibilities that are not evidenced by code or documents.
- Distinguish clearly between:
  - current implemented architecture
  - intended architecture
  - recommended future cleanup
- If something cannot be confirmed, mark it explicitly as:
  - `Assumption`
  - `To be confirmed`
  - `Inconsistency detected`

# When Reviewing Existing Docs
Evaluate whether:
- document responsibilities are clearly separated
- naming is consistent
- related topics are grouped appropriately
- duplicated or conflicting descriptions exist
- `/docs/README.md` accurately reflects the current document structure

If documentation structure is confusing:
- improve `/docs/README.md`
- reorganize `/docs/policy/*` when necessary
- keep the documentation hierarchy simple and discoverable

# When Reviewing Code
Infer and document:
- high-level architectural layers
- project/module responsibilities
- dependencies and dependency direction
- composition/integration points
- boundary rules
- cross-cutting concerns
- infrastructure concerns
- known legacy or ambiguous areas when clearly observed

Do not over-document implementation details unless they materially explain architecture.

# Documentation Style
Write documentation in concise, technical, repository-specific language.
Write architecture documentation in Traditional Chinese. Use English for proper nouns and technical keywords.

Prefer the following structure:
- Purpose
- Scope
- Responsibility
- Boundaries / What it must not do
- Key interactions / dependency direction
- Notes / exceptions
- Open questions if necessary

# Required Outputs for Documentation Updates
When updating architecture docs:
1. first determine whether document restructuring is needed
2. then update `/docs/README.md` to reflect the final document map
3. then update or create the relevant policy files
4. provide a brief change summary

# Hybrid Review Workflow Rules
When designing or maintaining a hybrid architecture and specification review workflow:
- Use a multi-stage pipeline, not a single prompt.
- Separate target resolution, inventory, analysis, planning, and iteration phases.
- Use external persistent state files; do not rely on conversation memory.
- Keep review execution bounded by an explicit scope document before inventory begins.
- Prefer deterministic, chunked, file-based outputs over monolithic analysis.
- Support both full-system and targeted partial reviews with explicit dependency-expansion policy.

# Required Persistent Files for Hybrid Review
Hybrid review workflows should standardize on file-based outputs for traceability. Required files:
- `/Architecture/Inventory.md`
- `/Architecture/Findings.md`
- `/Architecture/Architecture.md`
- `/Specification/Spec-Inventory.md`
- `/Specification/Gap-Analysis.md`
- `/Tasks/Unified-Plan.md`
- `/Tasks/State.json`
- `/Tasks/Review-Scope.md`

# Change Summary Format
When changes are made, summarize:
- files created
- files renamed
- files deleted
- files materially updated
- major documentation structure decisions
- unresolved ambiguities

# Safety Rules
- Do not modify source code unless explicitly requested.
- Only modify documentation files for this task.
- Do not delete useful content without either preserving it elsewhere or explicitly concluding it is redundant/obsolete.
- Prefer incremental cleanup over unnecessary large rewrites unless the current structure is clearly broken.
