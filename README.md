# Saintber.CopilotLibrary

A curated library of GitHub Copilot customizations — **Instructions**, **Agents**, **Prompts**, and **Skills** — designed to improve AI-assisted development workflows.

## 📂 Repository Structure

```
.github/
├── copilot-instructions.md     # Repository-level Copilot instructions
├── agents/                     # Custom Copilot agent definitions
│   ├── code-reviewer.agent.md  # Expert code review agent
│   └── test-writer.agent.md    # Comprehensive test generation agent
└── prompts/                    # Reusable prompt templates
    ├── code-review.prompt.md   # Structured code review prompt
    ├── explain-code.prompt.md  # Code explanation prompt
    ├── generate-tests.prompt.md # Unit test generation prompt
    └── refactor-code.prompt.md # Code refactoring prompt
```

## 🚀 Getting Started

### Instructions

The `.github/copilot-instructions.md` file provides repository-level guidance to Copilot. GitHub Copilot automatically reads this file and uses it as context for all chat and code completion interactions within the repository.

To customize for your project:
1. Copy `.github/copilot-instructions.md` to your repository.
2. Edit the guidelines to reflect your project's conventions and requirements.

### Prompts

Prompt files in `.github/prompts/` are reusable templates you can invoke in GitHub Copilot Chat.

**Usage in VS Code / GitHub Copilot Chat:**
1. Open Copilot Chat.
2. Type `/` to see available prompt commands, or reference the prompt by name.
3. Select the code you want to apply the prompt to.

| Prompt | Description |
|--------|-------------|
| `code-review` | Thorough review identifying bugs, security issues, and style violations |
| `explain-code` | Plain-language explanation of what code does and how it works |
| `generate-tests` | Comprehensive unit tests for happy paths, edge cases, and errors |
| `refactor-code` | Improve readability and maintainability without changing behavior |

### Agents

Agent files in `.github/agents/` define specialized Copilot agents with specific roles, knowledge, and tools.

| Agent | Description |
|-------|-------------|
| `code-reviewer` | Expert code reviewer focusing on correctness, security, and maintainability |
| `test-writer` | Test engineer that generates thorough, well-structured test suites |

## 🤝 Contributing

Contributions are welcome! To add a new Instruction, Agent, or Prompt:

1. **Instructions**: Edit `.github/copilot-instructions.md` following the existing format.
2. **Agents**: Create a new `.agent.md` file in `.github/agents/` with a clear description and role definition.
3. **Prompts**: Create a new `.prompt.md` file in `.github/prompts/` with a `description` front-matter field.

### Guidelines

- Include a `description` in the front-matter of every agent and prompt file.
- Keep prompts focused on a single, well-defined task.
- Test your additions against realistic scenarios before submitting a PR.
- Follow the naming conventions: `<task>.prompt.md` and `<role>.agent.md`.

## 📄 License

See [LICENSE](LICENSE) for details.
