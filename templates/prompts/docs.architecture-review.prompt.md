---
mode: agent
agent: docs.architecture-documenter
description: 審查現有文件與程式碼，並重新整理、更新架構文件。
---

Review and update architecture documentation for this repository.

## Inputs
- Documentation scope: `${input:documentation_scope=default:/docs/README.md and /docs/policy/*}`
- Code scope: `${input:code_scope=default:entire repository}`
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
6. Review the specified code scope.
7. If code scope is not specified, inspect the whole repository at architecture level.
8. Based on the mode input:
   - If mode is `supplement`: List all identified conflicts between code and existing documentation. Do not modify any documentation files. Present the conflict list to the user for review and decision. Stop here.
   - If mode is `full`: Extract architecture facts from code and reflect them in the architecture documentation; continue to step 9.
9. You may create, rename, merge, split, delete, or edit architecture documentation files as needed.
10. Update the architecture document structure description in `/docs/README.md`.
11. At the end, provide a concise summary of:
   - findings
   - documentation structure decisions
   - files changed
   - unresolved ambiguities

## Constraints
- Modify documentation only, not source code.
- Prefer repository-specific facts over generic architectural theory.
- Do not invent responsibilities without evidence from code or docs.
- Clearly mark assumptions or unverified conclusions.
- Keep README as the entry point and navigation map for the documentation set.

## Additional constraints from user
${input:constraints}
