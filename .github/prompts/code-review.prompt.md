---
description: Perform a thorough code review on selected code, identifying bugs, security issues, performance problems, and style violations.
---

# Code Review

Review the following code thoroughly and provide structured feedback.

## Instructions

Analyze the code and report findings in these categories:

### 🐛 Bugs & Correctness
- Identify any logic errors, off-by-one errors, or incorrect assumptions.
- Flag null/undefined dereferences or unhandled exceptions.

### 🔒 Security
- Identify injection vulnerabilities (SQL, XSS, command injection, etc.).
- Check for exposed secrets, insecure defaults, or improper input validation.
- Flag insecure use of cryptography or authentication.

### ⚡ Performance
- Identify inefficient algorithms or unnecessary loops.
- Flag unnecessary allocations, memory leaks, or blocking I/O in async contexts.

### 🎨 Code Style & Maintainability
- Check adherence to naming conventions.
- Identify overly complex functions that should be refactored.
- Flag missing or misleading comments and documentation.

### ✅ Test Coverage
- Note any code paths that lack test coverage.
- Suggest additional test cases for edge cases and error scenarios.

## Code to Review

```
${selection}
```

## Output Format

For each issue found, provide:
- **Severity**: Critical / High / Medium / Low
- **Category**: One of the categories above
- **Location**: Line number or function name
- **Issue**: Clear description of the problem
- **Suggestion**: How to fix or improve it

End with a brief **Summary** of overall code quality.
