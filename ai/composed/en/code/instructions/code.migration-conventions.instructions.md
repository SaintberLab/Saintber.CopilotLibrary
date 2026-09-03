---
description: 從 .NET Framework 4.7 ASP.NET MVC 遷移至 .NET 8 ASP.NET Core MVC 的穩定慣例、原則、禁止事項與輸出行為規則。
applyTo: "MAS_Batch/**,MAS_Web/**,Mas_Library/**,MAS_Bst/**,MAS_Gov/**,MAS_DataBase/**,Packages/**"
---

# Purpose
Provide Copilot with stable behavioral rules, constraints, and output requirements for the ongoing migration from .NET Framework 4.7 ASP.NET MVC to .NET 8 ASP.NET Core MVC.

# Migration Scope (Informational)
- **Source platform**: .NET Framework 4.7、ASP.NET MVC、Kendo UI 2017、Microsoft SQL Server
- **Target platform**: .NET 8、ASP.NET Core MVC、Kendo UI 2024、PostgreSQL
- **Frontend**: ASP.NET MVC + Kendo UI 2017 -> ASP.NET Core MVC + Kendo UI 2024（retain frontend framework; no frontend framework rewrite）
- **Database migration**: SQL Server → PostgreSQL
- **New infrastructure components**: Redis, Seq, Cloud Logging (GCP), Google Cloud Storage (GCS)

# Core Principles (Stable Behavioral Rules)
- **Preserve business behavior first.** Do not alter business logic unless required for compatibility, correctness, or maintainability.
- **Prefer incremental, reversible migration.** Suggest phased steps over big-bang rewrites. Each step must be independently deployable and rollback-capable.
- **Make infrastructure cross-cutting concerns explicit.** Logging, caching, storage, and external integrations must be expressed through abstractions (interfaces, DI), not hidden in implementation details.
- **Database migrations must be auditable and testable.** Every schema change must be trackable (e.g., EF Core migrations or versioned SQL scripts), reviewable, and independently testable.
- **Prefer composition, DI, typed configuration, and structured logging** over static access, service locator, string-keyed configuration, and unstructured log outputs.

# Non-Goals (Prohibitions)
- **Do NOT introduce unnecessary frontend framework rewrites.** Kendo UI + ASP.NET MVC views are retained unless explicitly instructed otherwise.
- **Do NOT redesign business rules** unless required by compatibility, correctness, or maintainability constraints.
- **Do NOT default to microservices decomposition.** Assume a monolith-first migration unless explicitly directed to introduce service boundaries.

# Output Requirements (Copilot Output Behavior)
- **Always state assumptions** at the start of any migration-related response.
- **For code changes**, explain compatibility risks and required follow-up actions (e.g., package upgrades, configuration changes, test coverage gaps).
- **For migration plans**, provide: phased steps, identified risks, validation criteria, and rollback strategy.
- **Avoid vague suggestions.** Give concrete, file-level or module-level guidance (e.g., specify which file to edit, which class to update, which interface to introduce).
- **Do not omit breaking changes.** If a migration step introduces a breaking change to existing code, callers, or data contracts, state it explicitly.
- **All generated execution plans must comply with the policies defined under `/docs/policy/`.** Review relevant policy documents before finalizing each plan.

# Mandatory Plan-First Process for Migration Work
For architecture migration, backend migration, frontend migration, and MVC feature migration:
1. Review the corresponding template under `/Tasks/`
2. Create or update the template if it does not satisfy the migration needs
3. Generate a scope-specific execution plan from the template
4. Execute the scope-specific plan step by step
5. Always produce a Traditional Chinese backup copy of both the updated template and the scope-specific plan.

Do not start implementation directly without a plan unless the user explicitly requests a one-off answer only.

# Mandatory Backend Modernization Quality Loop
For legacy backend modernization tasks (including but not limited to DI/IOC adoption, configuration modernization, and framework compatibility replacements), migration responses must follow this loop:
1. Inventory migration targets first with explicit `scan_scope` and `modify_scope`.
2. Re-check inventory quality with both:
   - sampled validation from the inventory table (false-positive check)
   - sampled validation from original source files (missing-target check)
3. Introduce changes incrementally by verified inventory status.
4. Perform final validation after each batch and after full rollout (at minimum build validation; include runtime smoke checks when available).
5. Mark ambiguous items as `Pending Clarification` and generate a clarification issue document for developers.

Depth behavior (optional):
- If `depth_mode` is not provided, run direct scope-only inventory and refactoring.
- `direct-hit`: only include targets inside the selected scope that have not completed the selected modernization objective.
- `recursive-search`: continue tracing referenced objects and verify modernization status recursively until no new reference remains.

Common inventory output requirements:
- The inventory result must include a `.csv` artifact.
- Required CSV columns: `File`, `Line`, `ReferencedObject`, `ProcessingStatus`, `Code`.
- `ProcessingStatus` should explicitly differentiate at least: `Candidate`, `FalsePositive`, `MissingCandidate`, `Pending Clarification`, `Completed`.

Execution quality requirements:
- Prefer script-assisted inventory as the baseline.
- If script precision/recall is insufficient, iteratively improve scripts and apply AI-assisted analysis only to bounded scan partitions to avoid context overflow.

# Mandatory DI/IOC Adoption Quality Loop
For legacy projects that have not adopted DI/IOC yet, migration responses must follow this loop:
1. Inventory DI/IOC targets first, using explicit `scope` and `depth` parameters.
2. Re-check inventory quality with both:
   - sampled validation from the inventory table (false-positive check)
   - sampled validation from original source files (missing-target check)
3. Introduce DI/IOC incrementally based on the verified inventory only.
4. Perform final validation after refactoring (at minimum build validation; include runtime smoke checks when available).
5. Mark ambiguous static `new` instantiations as `Pending Clarification` and generate a clarification issue document for developers.

Depth parameter requirements:
- `direct-hit`: only include targets inside the selected scope that have not adopted DI/IOC.
- `recursive-search`: continue tracing referenced objects and verify DI/IOC status recursively until no new reference remains.

Inventory output requirements:
- The inventory result must include a `.csv` artifact.
- Required CSV columns: `File`, `Line`, `ReferencedObject`, `ProcessingStatus`, `Code`.
- `ProcessingStatus` should explicitly differentiate at least: `Candidate`, `FalsePositive`, `MissingCandidate`, `Pending Clarification`, `Completed`.

Execution quality requirements:
- Prefer script-assisted inventory as the baseline.
- If script precision/recall is insufficient, iteratively improve scripts and apply AI-assisted analysis only to bounded scan partitions to avoid context overflow.

# Required Templates
- `/Tasks/architecture-migration-template.md`
- `/Tasks/backend-migration-template.md`
- `/Tasks/frontend-migration-template.md`
