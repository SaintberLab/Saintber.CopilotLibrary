---
name: docs.hybrid-review-pipeline
description: Hybrid Architecture & Specification Review Pipeline 的分階段、stateful、可續跑設計方法。
---

# Skill: Hybrid Architecture & Specification Review Pipeline

## Purpose
Define how to design a deterministic, resumable, file-based review system that analyzes both software architecture and system specifications.

## Design goals
The pipeline must:
- build structured inventory from code and related artifacts
- analyze architecture and specification separately but reconcile them together
- detect mismatches between code, documentation, and specifications
- generate unified improvement tasks
- iterate in small chunks with persistent state
- support both full and targeted partial review

## Standard folder structure
Required persisted outputs:
- `/Architecture/Inventory.md`
- `/Architecture/Findings.md`
- `/Architecture/Architecture.md`
- `/Specification/Spec-Inventory.md`
- `/Specification/Gap-Analysis.md`
- `/Tasks/Unified-Plan.md`
- `/Tasks/State.json`
- `/Tasks/Review-Scope.md`

## State model requirements
State must be external, persisted, and updated every run.

Minimum required fields:
- `current_phase`
- `review_domain`
- `target_type`
- `targets`
- `completed_steps`
- `remaining_tasks`
- `current_target`

Recommended additional fields:
- `run_id`
- `scope`
- `depth`
- `strictness`
- `include_dependencies`
- `boundary_rules`
- `excluded_targets`
- `last_updated_at`
- `artifact_map`
- `pending_findings`
- `iteration_count`
- `status`

## Phase model

### Phase 0 - Target Resolution
Responsibilities:
- resolve target meaning
- normalize target paths/names
- define review boundaries
- determine allowed dependency expansion
- record excluded targets

Output:
- `/Tasks/Review-Scope.md`

Rules:
- inventory must not start before scope is explicit
- external references may be recorded without full expansion when boundary policy forbids traversal

### Phase 1 - Inventory
Responsibilities:
- build architecture inventory from code and architecture artifacts
- build specification inventory from specs, APIs, workflow docs, permission docs, and feature docs
- remain bounded by review scope

Outputs:
- `/Architecture/Inventory.md`
- `/Specification/Spec-Inventory.md`

### Phase 2 - Analysis
Responsibilities:
- detect architecture boundary violations
- detect specification gaps
- detect code/spec mismatches
- detect implementation/documentation inconsistencies

Outputs:
- `/Architecture/Findings.md`
- `/Specification/Gap-Analysis.md`

### Phase 3 - Planning
Responsibilities:
- merge architecture and specification findings
- group by priority, ownership, and dependency
- generate an actionable improvement plan

Output:
- `/Tasks/Unified-Plan.md`

### Phase 4 - Iteration Loop
Responsibilities:
- incrementally refine `/Architecture/Architecture.md`
- incrementally refine affected specification documents
- re-enter inventory/analysis for changed targets until stable

Rules:
- each loop handles bounded chunks only
- state must record current iteration and next tasks

## Partial review rules
Partial review must support:
- `target_type`: `module` | `feature` | `document` | `task`
- `targets`: explicit names or paths
- `include_dependencies`: `none` | `direct` | `bounded` | `full`
- `boundary_rules`: explicit scope constraints
- `excluded_targets`: ignore list

Behavior:
- `none`: no dependency expansion
- `direct`: immediate inbound/outbound relations only
- `bounded`: expand only within approved scope boundaries
- `full`: follow complete dependency graph until terminal or excluded nodes

## Determinism rules
- read state first on every execution
- perform exactly one planned chunk or small bounded batch per run
- update state after each phase step
- record unresolved items explicitly instead of inferring silently
- avoid cross-phase mixing in one step unless transition criteria are met

## Prompt template guidance
Each phase prompt should define:
- input files
- allowed scope
- exact output file
- state fields to read
- state fields to update
- stop conditions

## Failure handling
Handle at least:
- missing targets
- ambiguous scope
- state corruption
- partial output writes
- conflicting findings
- dependency expansion overflow
- missing specification sources

Recommended behavior:
- stop safely
- write error reason into state
- preserve last successful phase
- queue remediation task in `remaining_tasks`

## Configuration strategy
Parameters and expected effect:
- `review_domain`: selects architecture-only, specification-only, or combined reconciliation workflow
- `depth`: controls evidence breadth and chunk size
- `scope`: controls system breadth (`module`, `solution`, `system`)
- `strictness`: controls tolerance for ambiguity and evidence threshold
- targeted-review parameters: constrain traversal, inventory size, and analysis reach

## Output quality bar
A good design must be:
- phase-separated
- resumable across sessions
- file-oriented
- scope-safe
- deterministic
- implementation-ready