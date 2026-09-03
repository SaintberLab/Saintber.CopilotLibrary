---
description: 盤點與逐步導入後端遷移重構（通用版），含 CSV 盤點、雙向抽樣複檢與最終驗證。
agent: migration.dotnet-modernizer
---

# Input
Provide:
- `migration_objective` (required): modernization objective for this run (for example `di-ioc-adoption`, `config-modernization`, `compatibility-replacement`)
- `scan_scope` (required): folders/files/modules to inventory
- `modify_scope` (required): folders/files/modules allowed to be modified
- `depth_mode` (optional): `direct-hit` | `recursive-search`
- `partition_strategy` (optional): partitioning rule for bounded scans (default: by folder/module)
- `sample_size_table` (optional): sample size for inventory-table false-positive checks
- `sample_size_source` (optional): sample size for source-code missing-target checks
- `validation_mode` (optional): `build-only` | `build-and-smoke` (default: `build-only`)

# Task
Build and execute a reusable backend modernization workflow for legacy code refactoring under the selected `migration_objective`.

## Required Workflow
1. Run script-assisted target inventory under `scan_scope`.
2. Output an inventory table and `.csv` file with at least: `File`, `Line`, `ReferencedObject`, `ProcessingStatus`, `Code`.
3. Re-check inventory quality:
   - sample from inventory table to find false positives
   - sample from source code to find missing candidates
4. Refine script rules if checks find gaps, then re-run inventory.
5. Apply modernization changes incrementally only inside `modify_scope`.
6. Perform final validation based on `validation_mode`.
7. Generate a clarification question document for `Pending Clarification` items.

## Depth Rules
- If `depth_mode` is omitted: run scope-only inventory and refactoring.
- `direct-hit`: only inventory/modify non-compliant targets directly inside the selected scope.
- `recursive-search`: recursively trace referenced objects and verify modernization status until no new references remain.

## Bounded-Context Rule
If AI assistance is required, split scanning and review into bounded partitions according to `partition_strategy` to avoid oversized context windows.

## DI/IOC Specific Note
For DI/IOC-only work, prefer `/migration.adopt-di-ioc` to keep task-specific precision while reusing the same quality loop.

# Required Output
Return clearly sectioned results:
1. Objective and Scope
2. Inventory Summary
3. Inventory CSV Path
4. Verification Findings (false positives / missing candidates)
5. Refactoring Batches Applied
6. Validation Result
7. Pending Clarification Items
8. Clarification Document Path
9. Remaining Risks and Next Actions
