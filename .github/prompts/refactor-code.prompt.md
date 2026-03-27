---
description: Refactor the selected code to improve readability, maintainability, and performance while preserving its existing behavior.
---

# Refactor Code

Refactor the following code to improve its quality without changing its behavior.

## Refactoring Goals

Apply the following improvements where applicable:

### 🔤 Naming & Clarity
- Rename variables, functions, and types to be more descriptive and intention-revealing.
- Replace magic numbers and strings with named constants.

### 🧩 Structure & Design
- Extract long functions into smaller, focused helper functions.
- Apply appropriate design patterns where they simplify the code.
- Remove duplication by extracting shared logic.
- Separate concerns: business logic, data access, and presentation should not be mixed.

### ⚡ Performance
- Replace inefficient loops or data structures where a better alternative exists.
- Avoid redundant computations; cache results when appropriate.

### 🛡️ Robustness
- Add null/undefined checks where inputs are not guaranteed.
- Replace silent failures with explicit error handling.
- Make immutable data structures explicit.

### 📝 Documentation
- Add or improve doc-comments for public APIs.
- Remove stale or misleading comments.

## Code to Refactor

```
${selection}
```

## Output Requirements

- Provide the refactored code in full.
- After the code, include a **Changelog** summarizing each change made and why.
- Do **not** change the observable behavior or public interface.
