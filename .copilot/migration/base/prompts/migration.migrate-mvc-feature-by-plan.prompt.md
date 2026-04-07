---
description: Migrate one MVC feature by first preparing plan files, then executing the migration
agent: migration.solution-architect
---

Migrate the selected MVC feature using the required plan-first workflow.

Required process:
1. Review or update `/Tasks/architecture-migration-template.md`, `/Tasks/backend-migration-template.md`, and `/Tasks/frontend-migration-template.md` as needed
2. Create scope-specific execution plans for architecture, backend, and frontend aspects of the selected feature
3. Locate the target Controller and related Actions
4. Identify required dependent files and components
5. Move or copy required files into the new project structure when needed
6. Update namespaces to match the new structure
7. Perform backend migration tasks
8. Perform frontend migration tasks
9. Validate build/compile and fix blocking issues

Migration policy:
- preserve legacy behavior whenever possible
- avoid unnecessary rewrites
- only replace unsupported patterns with the closest compatible equivalent
- all generated execution plans must comply with the policies defined under `/docs/policy/`. Review relevant policy documents before finalizing each plan.
