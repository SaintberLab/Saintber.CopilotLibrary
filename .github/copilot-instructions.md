# Copilot Instructions for Saintber.CopilotLibrary

## Repository Purpose

This repository is a **Copilot AI Customization Library** containing reusable Instructions, Agents, Prompts, and Skills designed to enhance GitHub Copilot's behavior across projects.

## General Guidelines

- Write clean, maintainable, and well-documented code.
- Follow language-specific conventions and best practices.
- Prefer clarity over cleverness; code should be easy to understand.
- Always consider edge cases and error handling.
- Write tests alongside implementation code.

## Code Style

- Use meaningful variable and function names that describe intent.
- Keep functions small and focused on a single responsibility.
- Add comments for complex logic, but prefer self-documenting code.
- Avoid magic numbers and strings; use named constants instead.

## Security

- Never commit secrets, credentials, API keys, or sensitive data.
- Validate and sanitize all user inputs.
- Follow the principle of least privilege.
- Be cautious with dependencies; check for known vulnerabilities.

## Repository Structure

```
.github/
  copilot-instructions.md   # This file — global Copilot instructions
  agents/                   # Custom agent definitions (.agent.md files)
  prompts/                  # Reusable prompt templates (.prompt.md files)
```

## How to Use This Library

- **Instructions**: Customize `.github/copilot-instructions.md` for repository-specific guidance.
- **Agents**: Use agent files in `.github/agents/` to define specialized AI assistants.
- **Prompts**: Leverage prompt templates in `.github/prompts/` for common development tasks.

## Contribution Guidelines

When adding new Instructions, Agents, or Prompts:
1. Follow existing naming conventions.
2. Add a clear description of the purpose and usage.
3. Include example inputs/outputs where applicable.
4. Test the prompt/agent against real scenarios before committing.
