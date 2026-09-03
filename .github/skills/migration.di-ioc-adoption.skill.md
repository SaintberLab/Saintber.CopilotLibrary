---
name: migration.di-ioc-adoption
description: 可重用的 DI/IOC 導入技能，支援盤點、雙向複檢、分批導入與最終驗證。
---

# Skill: Legacy DI/IOC Adoption

## Purpose
Provide one reusable, parameterized operation to adopt DI/IOC in legacy projects that currently rely on manual construction, static construction, or service locator patterns.

## Operation Design
- Primary operation: this `Skill` for reusable contract and quality controls.
- Execution may combine script-assisted scanning and AI-assisted review.
- Prefer script-first scanning for deterministic coverage.
- Use AI assistance on bounded partitions only.

## Input Contract
- `scan_scope` (required): inventory target boundaries.
- `modify_scope` (required): allowed refactor boundaries.
- `depth_mode` (optional): `direct-hit` | `recursive-search`.
- `partition_strategy` (optional): partitioning rule for bounded AI scans.
- `sample_size_table` (optional): sample size from inventory table for false-positive checks.
- `sample_size_source` (optional): sample size from source files for missing-target checks.
- `validation_mode` (optional): `build-only` | `build-and-smoke`.

## Defaults
- `depth_mode`: `direct-hit`
- `partition_strategy`: by folder/module
- `validation_mode`: `build-only`

## Depth Semantics
- `direct-hit`: detect non-DI targets only within selected scope.
- `recursive-search`: recursively trace object references and evaluate DI/IOC status until no new references remain.

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
- Table-driven sample checks: validate whether listed targets are true DI/IOC candidates.
- Source-driven sample checks: validate whether source code still contains missing non-DI targets.

If verification fails quality thresholds, improve scanning scripts and rerun inventory before refactoring.

## Refactoring Rules
- Apply changes incrementally and only within `modify_scope`.
- Preserve business behavior.
- Prefer constructor injection and interface abstraction.
- Keep uncertain static-instantiation cases in `Pending Clarification`; do not force speculative refactors.

## Output Expectations
Return sections:
1. Inventory Summary
2. CSV Output Path
3. Verification Findings
4. Refactoring Progress
5. Validation Result
6. Pending Clarification + Question Doc Path
7. Remaining Risks
