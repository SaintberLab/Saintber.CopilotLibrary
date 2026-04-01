---
id: update-customizations
version: 1.2.0
description: Reusable prompt for updating Copilot instruction, agent, prompt, and skill artifacts from a new Chinese requirement. This prompt must run in agent mode and delegate the implementation to the prompt-maintainer custom agent.
mode: agent
tools:
  - runSubagent
  - read_file
  - create_file
  - replace_string_in_file
  - insert_edit_into_file
status: active
---

# Execution Rule
- This prompt must run in agent mode.
- This prompt must delegate the artifact update work to the `prompt-maintainer` subagent.
- Do not complete the merge in plain ask mode or plain edit mode.
- If the `prompt-maintainer` subagent is unavailable, stop and report that the required custom agent is not configured.

# Input
Provide the following:
- `new_requirement_zh_tw`: the new requirement in Traditional Chinese
- `existing_instruction`: the current instruction content (optional)
- `existing_agent`: the current agent content (optional)
- `existing_prompt`: the current prompt content (optional)
- `existing_skill`: the current skill content (optional)
- `composed_path` (optional): Traditional Chinese output path (defaults to `.copilot/composed/`)

# Task
Use the `prompt-maintainer` subagent to update the existing Copilot customization artifacts using the new requirement.

# Delegation Contract
When invoking the `prompt-maintainer` subagent, require it to:
1. Read the Traditional Chinese requirement.
2. Translate the requirement into English for merge analysis.
3. Merge the new requirement into the existing instruction, agent, prompt, and skill artifacts.
4. Avoid duplication.
5. Preserve original structure as much as possible.
6. Do not break old rules unless the new requirement explicitly changes them.
7. Normalize wording and section structure.
8. Verify cross-artifact consistency.
9. Update the target files directly when write access is available.
10. Produce full Traditional Chinese outputs for the composed layer including skill when applicable.
11. Return the final result in clearly sectioned output.

# Responsibility Rules
- Put stable governance rules into the instruction.
- Put role, workflow, and guardrails into the agent.
- Put reusable task flow into the prompt.

# Required File Update Behavior
- When target paths are provided and write access is available, update the corresponding files directly.
- Write the full Traditional Chinese outputs to the matching `.copilot/composed/` paths.
- Do not silently skip file updates. If a file cannot be updated, explicitly report which path failed and why.

# Output Format
## Change Summary
- Summarize only meaningful changes.

## Updated Instruction
```md
<full updated instruction content>
```

## Updated Agent
```md
<full updated agent content>
```

## Updated Prompt
```md
<full updated prompt content>
```

## Updated Skill
```md
<full updated skill content>
```

## File Update Result
- instruction: <updated|skipped|failed> - <path>
- agent: <updated|skipped|failed> - <path>
- prompt: <updated|skipped|failed> - <path>
- skill: <updated|skipped|failed|not-applicable> - <path>

## Composed Output Paths
- instruction: <path>
- agent: <path>
- prompt: <path>

# Constraints
- Keep the result reusable.
- Keep the result deterministic and reviewable.
- Preserve intent.
- Minimize unrelated rewrites.
