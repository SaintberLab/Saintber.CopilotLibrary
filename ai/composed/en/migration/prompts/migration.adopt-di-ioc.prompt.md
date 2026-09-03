---
description: 盤點與逐步導入 DI/IOC，含 CSV 盤點、抽樣複檢與最終驗證。
agent: migration.dotnet-modernizer
---

# Input
Provide:
- `scan_scope` (required): folders/files/modules to inventory
- `modify_scope` (required): folders/files/modules allowed to be modified
- `depth_mode` (optional): `direct-hit` | `recursive-search` (default: `direct-hit`)
- `partition_strategy` (optional): partitioning rule for bounded scans (default: by folder/module)
- `sample_size_table` (optional): sample size for inventory-table false-positive checks
- `sample_size_source` (optional): sample size for source-code missing-target checks
- `validation_mode` (optional): `build-only` | `build-and-smoke` (default: `build-only`)

# Task
Build and execute a DI/IOC adoption workflow for legacy code that has not adopted DI/IOC yet.

## Required Workflow
1. Run script-assisted DI/IOC inventory under `scan_scope`.
2. Output an inventory table and `.csv` file with at least: `File`, `Line`, `ReferencedObject`, `ProcessingStatus`, `Code`.
3. Re-check inventory quality:
   - sample from inventory table to find false positives
   - sample from source code to find missing candidates
4. Refine script rules if checks find gaps, then re-run inventory.
5. Apply DI/IOC changes incrementally only inside `modify_scope`.
6. Perform final validation based on `validation_mode`.
7. Generate a clarification question document for `Pending Clarification` items (for example ambiguous static class instantiations).

## Depth Rules
- `direct-hit`: only inventory/modify non-DI targets directly inside the selected scope.
- `recursive-search`: recursively trace referenced objects and verify DI/IOC status until no new references remain.

## Bounded-Context Rule
If AI assistance is required, split scanning and review into bounded partitions according to `partition_strategy` to avoid oversized context windows.

# Required Output
Return clearly sectioned results:
1. Inventory Summary
2. Inventory CSV Path
3. Verification Findings (false positives / missing candidates)
4. Refactoring Batches Applied
5. Validation Result
6. Pending Clarification Items
7. Clarification Document Path
8. Remaining Risks and Next Actions
