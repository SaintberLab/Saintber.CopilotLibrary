---
agent: docs.hybrid-reviewer
description: 設計 Hybrid Architecture & Specification Review Pipeline，支援 FULL / PARTIAL review、state 持久化與分階段執行。
---

Design an implementation-ready Hybrid Architecture & Specification Review Pipeline.

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
- Additional constraints: `${input:constraints=default:none}`

## Task
Design a multi-stage, stateful review pipeline that:
1. supports full and partial review
2. uses external persistent state
3. writes outputs to files
4. executes in resumable chunks
5. enforces review scope deterministically

## Mandatory output sections
1. System Overview
2. Folder Structure
3. State Schema
4. Review-Scope Schema
5. Phase Design
6. Prompt Templates
7. Execution Workflow
8. Config Strategy
9. Failure Handling

## Constraints
- Do not design a single prompt solution.
- Do not rely on conversation memory.
- Do not skip Phase 0 target resolution.
- Do not allow inventory or analysis to expand beyond scope rules.
- Make the result implementation-ready and file-oriented.