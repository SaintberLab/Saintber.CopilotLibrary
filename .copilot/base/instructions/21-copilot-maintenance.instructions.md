---
id: copilot-maintenance
version: 1.1.0
description: Stable rules for maintaining Copilot customization artifacts including instruction, agent, prompt, and skill.
applyTo: ".github/instructions/**/*.md,.github/agents/**/*.md,.github/prompts/**/*.md,.copilot/**/*.md"
status: active
---

# Purpose
Define stable repository-wide rules for maintaining Copilot instructions, agents, prompts, skills, and their source materials.

# Scope
These rules apply to Copilot customization artifacts — including instruction, agent, prompt, and skill — and their source, composed, and published forms.

# Stable Rules
- Treat `.copilot/` as the authoring layer and `.github/` as the publish layer.
- Keep instruction, agent, prompt, and skill responsibilities separated.
- Preserve existing rules unless the new requirement explicitly changes them.
- Minimize unrelated edits during updates.
- Prefer additive updates over destructive rewrites.
- Maintain section structure when merging, unless restructuring is explicitly required.
- Keep terminology consistent across instruction, agent, prompt, and skill artifacts.
- Use English as the normalization language during merge and analysis when bilingual processing is required.
- Store finalized Traditional Chinese outputs under `.copilot/composed/` using corresponding relative paths.
- Ensure every update produces clearly sectioned output.
- Write `description` fields in Traditional Chinese; keep technical terms and keywords in English.

# Responsibility Boundaries
## Instruction
- Contains long-lived rules, constraints, standards, and prohibitions.
- Must not contain single-run task steps unless they are stable governance rules.

## Agent
- Contains role definition, workflow preference, guardrails, and tool behavior.
- Must not replace repository-wide rules already defined in instructions.

## Prompt
- Contains reusable task flow for a specific use case.
- Must not become a dumping ground for all long-term governance rules.

## Skill
- Contains domain-specific knowledge packages and reusable task domain procedures.
- Must not duplicate governance rules already defined in instructions.
- Must not contain role workflows already captured in agents.

# Merge Rules
- Translate incoming Chinese requirements into English before merge analysis when bilingual normalization is needed.
- Merge new requirements into existing artifacts without duplication.
- Preserve unchanged sections whenever possible.
- Do not silently delete old rules.
- If two rules appear to conflict, prefer the explicitly stated existing rule unless the new requirement clearly supersedes it.

# Output Rules
- The update result must include updated instruction, updated agent, updated prompt, and updated skill sections when applicable.
- The final composed output must be written in Traditional Chinese.
- The output should include a concise change summary.

# Forbidden
- Do not rewrite unrelated sections for style only.
- Do not collapse instruction, agent, prompt, or skill into a single artifact.
- Do not change old rules based on inference alone.
