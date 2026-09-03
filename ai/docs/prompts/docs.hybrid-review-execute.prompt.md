---
agent: docs.hybrid-review-executor
description: 執行 Hybrid Architecture & Specification Review Pipeline，預設 docs-only；依 `change_mode` 決定是否只出報告、加 remediation plan 或處理 code alignment。
---

Execute a Hybrid Architecture & Specification Review Pipeline.

## Inputs
- Review domain: `${input:review_domain=default:hybrid}` (`architecture` | `specification` | `hybrid`)
- Scope: `${input:scope=default:system}` (`module` | `solution` | `system`)
- Depth: `${input:depth=default:normal}` (`shallow` | `normal` | `deep`)
- Strictness: `${input:strictness=default:high}` (`low` | `medium` | `high`)
- Target type: `${input:target_type=default:module}` (`module` | `feature` | `document` | `task`)
- Targets: `${input:targets=default:none}`
- Include dependencies: `${input:include_dependencies=default:bounded}` (`none` | `direct` | `bounded` | `full`)
- Boundary rules: `${input:boundary_rules=default:none}`
- Excluded targets: `${input:excluded_targets=default:none}`
- Change mode: `${input:change_mode=default:docs-only}` (`docs-only` | `docs-and-plan` | `apply-code`)
- State path: `${input:state_path=default:/Tasks/State.json}`
- Review scope path: `${input:review_scope_path=default:/Tasks/Review-Scope.md}`
- Additional constraints: `${input:constraints=default:none}`

## Task
Execute exactly one bounded phase step or one small chunk from the Hybrid Architecture & Specification Review Pipeline, following the selected `change_mode`.

## Mandatory execution rules
1. Read `State.json` first if it exists.
2. If state does not exist, initialize state and begin with Phase 0 Target Resolution.
3. Respect `Review-Scope.md` strictly once it exists.
4. Do not expand beyond `include_dependencies`, `boundary_rules`, and `excluded_targets`.
5. Write outputs to the required files for the active phase.
6. Update `State.json` after every run.
7. Stop after one bounded chunk; do not attempt full review in one execution.
8. If `change_mode=docs-only`, produce review artifacts and documentation outputs only; do not modify source code.
9. If `change_mode=docs-and-plan`, produce review artifacts and remediation planning outputs, but still do not modify source code.
10. If `change_mode=apply-code`, source-code changes are allowed only when the requested scope is explicit and bounded; write the evidence and state updates first.

## Expected outputs
- Current Phase
- Executed Step
- Change Mode Used
- Files Updated
- State Update Summary
- Next Step
- Blockers / Open Questions