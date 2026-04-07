---
description: Temporary prompt for testing the Copilot maintenance workflow. Remove after verification.
agent: copilot.maintainer
tools:[read/readFile, agent, edit/createFile, edit/editFiles]
status: test
---

# Input
Provide an optional short note describing what part of the maintenance flow you want to verify.

# Task
Use the `copilot.maintainer` subagent to perform a temporary smoke test of the maintenance workflow.

# Expected Validation
- The `.github/` artifact is normalized.
- The matching `.copilot/composed/` artifact is written in full Traditional Chinese.
- `CHANGELOG.md`, requirement history, and `TOOLS.md` are updated when the test introduces a meaningful temporary artifact change.

# Note
This prompt is for temporary workflow verification only. Remove it after the test is complete.
