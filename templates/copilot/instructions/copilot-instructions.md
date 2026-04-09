# MAS_2026 Copilot Global Rules

## Conversation and Document Language Rules
- All Copilot conversations, summaries, and intermediary updates MUST be conducted in Traditional Chinese (zh-TW).
- Unless the user explicitly requests another language, all generated documents and file outputs MUST use Traditional Chinese (zh-TW).
- Proper nouns and technical keywords are exceptions and may remain in English when needed for accuracy.

## AI Cross-Session Task List Rules
- For non-SDD collaboration work (not using Speckit) that requires cross-session task persistence, task files MUST be created at `/tasks/<task-name>.tasks.md`.
- Task files MUST NOT be placed under the `docs/` root or other arbitrary locations.
- Filenames are recommended to use English kebab-case, or keep Chinese descriptions when consistent with existing style.

## Copilot Artifact Namespace Rules

All scoped instruction, agent, prompt, and skill artifacts in this repository use the namespace naming format below:

```
<namespace>[.<sub-namespace>].<artifact-name>.<type>.md
```

Namespace definitions:

| Namespace | Coverage |
|---|---|
| `code` | Product code conventions (tech stack, migration conventions) |
| `copilot` | Copilot artifact maintenance governance |
| `docs` | Architecture documentation rules and maintenance |
| `speckit` | SDD / Speckit process governance |
| `kb` | Knowledge base capabilities |
| `migration` | .NET migration toolchain (solution, backend, frontend, DB, review) |

Rules:
- Namespaces may include sub-categories (for example, `migration.dotnet-modernizer`) as long as naming stays both clear and semantically readable.
- Not every term must be forced into a sub-namespace; choose names that best communicate intent.
- `copilot-instructions.md` (this file) is a VS Code reserved filename and is exempt from namespace naming rules; it is for global behavior rules only.
- Product technical details such as tech stack and project structure belong in `code.tech-stack.instructions.md` (scoped to source-code directories).
