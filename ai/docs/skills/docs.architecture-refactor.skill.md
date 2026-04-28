---
name: docs.architecture-refactor
description: 將現有程式庫與文件集轉化為結構一致的架構文件集的領域知識與方法。
---

# Skill: Architecture Documentation Refactor

## Purpose
This skill defines how to convert an existing codebase and an existing document set into a coherent architecture documentation structure.

## Core principle
Architecture documentation should explain:
- what parts exist
- why they exist
- what each part is responsible for
- how parts depend on each other
- what boundaries must not be crossed

It should not become:
- a class-by-class reference
- an API manual
- a generic clean architecture essay
- a duplicate of the code

## Review method

### A. Review the document set first
For each existing document, determine:
- what is its primary responsibility?
- does it overlap with another document?
- is its title aligned with its actual content?
- does it contain mixed scopes?
- is it discoverable from `/docs/README.md`?

Typical problems:
- one file contains multiple unrelated concerns
- multiple files describe the same boundary differently
- README does not explain where to find things
- naming reflects history instead of current meaning
- policy documents mix rules, implementation notes, and migration backlog

### B. Review the codebase second
Infer architecture from:
- solution/project boundaries
- folder/module boundaries
- dependency references
- composition root / host setup
- runtime integration points
- persistence implementation placement
- abstractions vs implementations
- legacy compatibility layers
- duplicated patterns that imply architectural conventions

### C. Compare documentation against code
Classify findings into:
- confirmed and documented
- confirmed but undocumented
- documented but not evidenced
- inconsistent
- unclear

## How to structure documents

### README role
`/docs/README.md` should contain:
- purpose of the docs folder
- document map
- short description of each architecture document
- recommended reading order when useful
- notes about current vs legacy sections if relevant

### Policy document role
Each policy document should ideally cover one coherent topic, such as:
- layering and dependency rules
- project/module responsibilities
- composition and runtime hosting
- data access boundaries
- authorization boundary rules
- integration/infrastructure placement
- legacy transition rules

### When to merge files
Merge when:
- two files are too small and strongly related
- one file exists only because of old naming
- multiple files repeat the same rules

### When to split files
Split when:
- one file mixes unrelated topics
- one file is too large to navigate
- different audiences or maintenance cadences clearly exist

### When to rename files
Rename when:
- current name is vague
- current name reflects implementation history rather than architectural meaning
- current name causes misunderstanding about ownership or scope

## Writing rules
For each architecture topic, prefer this structure:

### Purpose
What this part/document exists for.

### Scope
What is included.

### Responsibility
What it must own.

### Non-responsibility / Boundary
What it must not do.

### Dependency direction
What it may depend on and what may depend on it.

### Notes
Exceptions, migration notes, or legacy caveats.

## Evidence rules
Acceptable evidence:
- multiple consistent code patterns
- project references
- DI/composition setup
- existing documentation that aligns with code
- naming and usage context when strong enough

Weak evidence:
- a single isolated class name
- speculative folder naming
- comments that contradict actual dependency usage

When evidence is weak, mark as:
- `Assumption`
- `To be confirmed`

## Final output expectations
After refactoring docs:
- `/docs/README.md` must accurately describe the documentation structure
- every policy document should have a distinct purpose
- duplicated architecture explanations should be minimized
- unresolved inconsistencies should be called out explicitly
