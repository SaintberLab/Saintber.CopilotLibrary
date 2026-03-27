---
description: Generate comprehensive unit tests for the selected code, covering happy paths, edge cases, and error scenarios.
---

# Generate Unit Tests

Generate comprehensive unit tests for the following code.

## Instructions

1. **Analyze** the code to understand its behavior, inputs, and outputs.
2. **Identify** testable units (functions, methods, classes).
3. **Generate tests** that cover:
   - ✅ Happy path — expected inputs with expected outputs
   - ⚠️ Edge cases — boundary values, empty inputs, maximum values
   - ❌ Error scenarios — invalid inputs, exceptions, failures
4. **Use** the existing test framework and style found in the project.
5. **Mock** external dependencies (databases, APIs, file system) where appropriate.
6. **Name** tests descriptively: `should_<expectedBehavior>_when_<condition>`.

## Code to Test

```
${selection}
```

## Output Requirements

- Include all necessary imports and test setup.
- Add a brief comment explaining the purpose of each test group.
- Ensure tests are independent and can run in any order.
- Follow the Arrange-Act-Assert (AAA) pattern.
