---
name: migration.backend-modernization
description: 可重用的後端遷移重構技能，支援盤點、雙向複檢、分批導入與最終驗證。
---

# Skill: Legacy Backend Modernization

## Purpose
Provide one reusable, parameterized operation to modernize legacy backend code incrementally while preserving behavior.

## Operation Design
- Primary operation: this `Skill` for reusable contract and quality controls.
- Execution may combine script-assisted scanning and AI-assisted review.
- Prefer script-first scanning for deterministic coverage.
- Use AI assistance on bounded partitions only.

## Input Contract
- `migration_objective` (required): modernization objective for this run.
- `scan_scope` (required): inventory target boundaries.
- `modify_scope` (required): allowed refactor boundaries.
- `depth_mode` (optional): `direct-hit` | `recursive-search`.
- `partition_strategy` (optional): partitioning rule for bounded AI scans.
- `sample_size_table` (optional): sample size from inventory table for false-positive checks.
- `sample_size_source` (optional): sample size from source files for missing-target checks.
- `validation_mode` (optional): `build-only` | `build-and-smoke`.

## Defaults
- `partition_strategy`: by folder/module
- `validation_mode`: `build-only`

## Depth Semantics
- depth omitted: scope-only direct inventory.
- `direct-hit`: detect modernization targets only within selected scope.
- `recursive-search`: recursively trace object references and evaluate modernization status until no new references remain.

## Required Artifacts
- Inventory table (working format)
- Inventory `.csv` file
- Clarification questions document for unresolved targets
- Final validation report

## CSV Schema (Minimum)
Required columns:
- `File`
- `Line`
- `ReferencedObject`
- `ProcessingStatus`
- `Code`

## Processing Status Values
At minimum include:
- `Candidate`
- `FalsePositive`
- `MissingCandidate`
- `ReadyForRefactor`
- `InProgress`
- `Pending Clarification`
- `Completed`

## Verification Requirements
Two-sided verification is mandatory:
- Table-driven sample checks: validate whether listed targets are true modernization candidates.
- Source-driven sample checks: validate whether source code still contains missing modernization targets.

If verification fails quality thresholds, improve scanning scripts and rerun inventory before refactoring.

## Refactoring Rules
- Apply changes incrementally and only within `modify_scope`.
- Preserve business behavior.
- Prefer adapter/composition/DI-based modernization over invasive redesign.
- Keep uncertain cases in `Pending Clarification`; do not force speculative refactors.

## Output Expectations
Return sections:
1. Objective and Scope
2. Inventory Summary
3. CSV Output Path
4. Verification Findings
5. Refactoring Progress
6. Validation Result
7. Pending Clarification + Question Doc Path
8. Remaining Risks
