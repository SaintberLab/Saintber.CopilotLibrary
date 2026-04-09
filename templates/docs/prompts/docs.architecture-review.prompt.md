---
agent: docs.architecture-documenter
description: 僅審查現有架構文件與程式碼一致性，必要時更新 docs，不修改 source code。
---

Review and update architecture documentation for this repository in a **documentation-only** flow.

## Inputs
- Documentation scope: `${input:documentation_scope=default:/docs/README.md and /docs/policy/*}`
- Code scope: `${input:code_scope=default:entire repository}`
- Inventory mode: `${input:inventory_mode=default:auto}` — `auto`: choose full-repository when the scope is `entire repository`, otherwise targeted; `targeted`: inspect only the requested area; `full-repository`: perform a systematic repository-wide architecture inventory before reviewing docs
- Include dependencies: `${input:include_dependencies=default:bounded}` (`none` | `direct` | `bounded` | `full`)
- Mode: `${input:mode=default:full}` — `full`: apply documentation updates; `supplement`: list code-doc conflicts only, do not modify files
- Additional constraints: `${input:constraints=default:none}`

## Task
1. Review the existing architecture documentation in the specified documentation scope.
2. If documentation scope is not specified, use:
   - `/docs/README.md` as the documentation entry
   - `/docs/policy/*` as the architecture policy document set
   - `/docs/context/*` as the project context document set
3. Determine whether:
   - document responsibilities are unclear
   - document structure is confusing
   - `/docs/README.md` does not adequately explain the documentation structure
4. If documentation is unclear:
   - improve `/docs/README.md`
5. If document responsibilities are unclear or overlapping:
   - reorganize `/docs/policy/*`
   - reorganize `/docs/context/*`
   - update `/docs/README.md` to reflect the final document structure
6. Review the specified code scope using `inventory_mode` and `include_dependencies` as evidence-gathering controls.
7. If `inventory_mode=full-repository`, perform a systematic architecture-level scan of the whole repository before comparing docs.
8. Based on the mode input:
   - If mode is `supplement`: list all identified conflicts between code and existing documentation. Do not modify any documentation files. Present the conflict list to the user for review and decision. Stop here.
   - If mode is `full`: extract verified architecture facts from code and reflect them in the architecture documentation; continue to step 9, but do not change source code.
9. You may create, rename, merge, split, delete, or edit architecture documentation files as needed.
10. Update the architecture document structure description in `/docs/README.md`.
11. If the user needs persistent review artifacts (`/Architecture/*`, `/Specification/*`, `/Tasks/*`) or remediation planning, use `/docs.hybrid-review-execute` instead of overloading this docs-only review flow.
12. At the end, provide a concise summary of:
   - findings
   - documentation structure decisions
   - files changed
   - unresolved ambiguities

## Constraints
- Modify documentation only, not source code.
- Use code inspection as evidence gathering, not as an implicit request to refactor the codebase.
- Prefer repository-specific facts over generic architectural theory.
- Do not invent responsibilities without evidence from code or docs.
- Clearly mark assumptions or unverified conclusions.
- Keep README as the entry point and navigation map for the documentation set.

## Additional constraints from user
${input:constraints}
