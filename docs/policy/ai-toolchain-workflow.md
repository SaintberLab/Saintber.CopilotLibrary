# AI Toolchain Production Workflow

> **Status**: Intended Architecture  
> **Version**: 1.0.0  
> **Last Updated**: 2026-04-27

---

## 1. Overview

This document defines the end-to-end production workflow for creating, evolving, deploying, and releasing AI tools in the `@saintber/copilot-library` project.

The primary target platform is **GitHub Copilot** (VS Code extension), with planned support for **Copilot CLI**, **Copilot SDK**, and future expansion to **OpenAI / Gemini CLI** and **Hermes Agent**.

AI tools are produced and evolved primarily through GitHub Copilot to maximize consistency with the execution environment. All production artifacts are English; Traditional Chinese backup copies are maintained for user review.

---

## 2. Guiding Principles

| # | Principle | Rationale |
|---|-----------|-----------|
| 1 | **English as the canonical language** | AI tools execute more precisely when written in English. |
| 2 | **Chinese backup in the same operation** | Translation is co-produced with the English artifact in a single Copilot request — never as a separate request — to minimize point consumption. |
| 3 | **Neutral authoring layer; platform adapters for publish** | `ai/` is the canonical authoring workspace; `.github/` is the live runtime target for Copilot-compatible artifacts. |
| 4 | **Version-controlled evolution** | All changes are tracked with version numbers. Requirement history is stored in plain text alongside version numbers. |
| 5 | **Tool identity is stable** | Tool filenames follow the `[module].[name]` convention and never change after initial creation. |
| 6 | **Draft before deploy; test before release** | No tool reaches release without user review at the deploy stage. |
| 7 | **Target-state first (breaking redesign allowed)** | Directory/workflow design is not constrained by current repository layout; migration is planned after design finalization. |
| 8 | **Do not assume `.copilot/` auto-discovery** | Current GitHub Copilot documentation standardizes repository custom instructions under `.github/`; use explicit deploy targets instead of implicit folder assumptions. |

---

## 3. Tool Classification & Naming Convention

### 3.1 Artifact Types

Each tool belongs to one artifact type, which determines the file convention and compatible platforms.

| Type | File Convention | Target Platform | Description |
|------|----------------|-----------------|-------------|
| `instructions` | `[module].[name].instructions.md` | Copilot | Always-on rules and constraints |
| `agents` | `[module].[name].agent.md` | Copilot, Hermes Agent | Role-based workflows |
| `prompts` | `[module].[name].prompt.md` | Copilot, OpenAI | Reusable task flows |
| `skills` | `[module].[name]/SKILL.md` | Copilot | Domain knowledge packages |
| `mcp` | `[module].[name].json` | All platforms | MCP server integrations |
| `sdk` | `[module].[name].ts` | Copilot SDK | Programmatic SDK tools |

> `[module]` = module name (see §3.2). `[name]` = semantic tool name in kebab-case.

### 3.2 Module Convention

Modules are the primary organizational unit. Each module is an independently installable domain package. Use `<module>[.<sub-module>]` as a filename prefix.

| Module | Scope |
|--------|-------|
| `code` | Product code conventions |
| `copilot` | Copilot artifact maintenance |
| `docs` | Architecture documentation |
| `speckit` | SDD / Speckit process governance |
| `kb` | Knowledge base functionality |
| `migration` | .NET migration toolchain |

Sub-modules are added when needed (e.g., `migration.dotnet-modernizer`).

### 3.3 Directory Placement

Directories follow a **module-first, type-second** convention. All artifact types for a module are grouped under that module's directory:

```
ai/
└── [module]/              ← e.g., copilot/, migration/, kb/
    ├── instructions/       ← artifact type
    ├── agents/
    ├── prompts/
    ├── skills/
    ├── mcp/
    └── sdk/
```

---

## 4. Directory Structure

This is a **target-state structure**. It may be breaking relative to the current repository and is intentionally optimized for long-term toolchain evolution.

`ai/` is the source of truth organized by module. `.github/` is the Copilot runtime target and remains flat (no module subdirectories) per GitHub convention. `.copilot/` is optional compatibility storage and is not the default discovery location.

```
/                                      (repo root)
├── ai/                                (authoring layer — module-first source of truth)
│   ├── [module]/                      (e.g., copilot/, migration/, kb/)
│   │   ├── instructions/
│   │   ├── agents/
│   │   ├── prompts/
│   │   ├── skills/
│   │   ├── mcp/
│   │   ├── sdk/
│   │   └── sources/
│   │       └── requirements/          (module-scoped requirement history)
│   ├── composed/
│   │   ├── en/
│   │   │   └── [module]/              (deploy-ready English artifacts, module-first)
│   │   │       ├── instructions/
│   │   │       ├── agents/
│   │   │       └── ...
│   │   └── zh-TW/
│   │       └── [module]/              (Chinese backup artifacts, module-first)
│   │           ├── instructions/
│   │           ├── agents/
│   │           └── ...
│   ├── manifest.yaml                  (module → composed → published path map)
│   └── README.md                      (authoring layer guide)
│
├── .github/                           (deploy layer — COPILOT LIVE, FLAT — no module subdirs)
│   ├── copilot-instructions.md
│   ├── instructions/                  ← files from all modules merged here
│   ├── agents/
│   ├── prompts/
│   ├── skills/
│   └── README.md                      (deployed tool usage overview)
│
├── .mcp/                              (deploy layer — MCP runtime)
│   ├── mcp.json
│   ├── servers/
│   └── profiles/
│
├── sdk/                               (deploy layer — SDK runtime source)
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── templates/                         (release layer — module-first npm package artifact)
│   ├── [module]/                      (e.g., copilot/, migration/, kb/)
│   │   ├── .github/                   (Copilot files for this module, flat inside)
│   │   │   ├── instructions/
│   │   │   ├── agents/
│   │   │   ├── prompts/
│   │   │   ├── skills/
│   │   │   └── README.md              (module usage guide)
│   │   ├── .mcp/                      (MCP assets for this module, if any)
│   │   └── sdk/                       (SDK assets for this module, if any)
│   └── install-manifest.json          (registry of available modules and their targets)
│
├── docs/                              (workflow documentation)
│   ├── README.md
│   └── policy/
│       ├── ai-toolchain-workflow.md   (this file — English canonical)
│       └── ai-toolchain-workflow.zh-TW.md  (Chinese user review copy)
│
├── src/                               (CLI implementation)
├── bin/
├── package.json
└── CHANGELOG.md
```

### Directory Responsibilities

| Directory | Layer | Lifecycle State | Who reads it |
|-----------|-------|-----------------|--------------|
| `ai/[module]/[type]/` | Authoring | Draft | Copilot during authoring |
| `ai/composed/en/[module]/` | Authoring | Draft / Deployed | Copilot deploy tooling |
| `ai/composed/zh-TW/[module]/` | Authoring | Draft / Deployed | Developer and reviewer |
| `ai/[module]/sources/requirements/` | History | Draft / Released | Developer and reviewer |
| `.github/` | Publish | Deployed | Copilot (live, flat) |
| `.mcp/` | Publish | Deployed | MCP client/runtime |
| `sdk/` | Publish | Deployed | Copilot SDK runtime |
| `templates/[module]/` | Package | Released | npm modular installer |

---

## 5. Lifecycle: Draft → Deploy → Release

### 5.1 Draft

**Definition**: The tool exists in the `ai/` authoring layer and has not yet been reviewed by the user.

**Activities**:
1. Write or update tool content under `ai/[module]/[type]/`.
2. In the same Copilot operation, produce the English version (for `ai/composed/en/[module]/[type]/`) and the Chinese backup (for `ai/composed/zh-TW/[module]/[type]/`).
3. Record the original requirement through `copilot.requirement-recorder` skill as the primary path.
4. Use `recorder_mode=versioned-basic` by default for this workflow and keep raw requirement text without mandatory template fields.
5. Keep history output under `ai/[module]/sources/requirements/` unless user overrides `history_root_path`.
6. Version remains `[未發布]` (unreleased).

**State indicator**: No entry in CHANGELOG for the current changes yet, or listed under `[Unreleased]`.

---

### 5.2 Deploy

**Definition**: The tool is published from the authoring layer to the target platform directory for user testing. The version is still considered draft — not yet formally released.

**Trigger**: Developer explicitly declares a Deploy.

**Activities**:
1. Sync artifacts from `ai/composed/en/[module]/` to platform-specific runtime targets (see §10). The deploy target is always flat — module subdirectories are not preserved in the deploy layer:
   - Copilot artifacts (`instructions/`, `agents/`, `prompts/`, `skills/`) → `.github/[type]/` (flat merge across all modules)
   - MCP artifacts → `.mcp/`
   - SDK artifacts → `sdk/`
2. For non-targeted platforms, keep artifacts in composed state until an adapter is defined.
3. Update `.github/README.md` to reflect the addition or change.
4. Add an entry to `CHANGELOG.md` under `[Unreleased]`.
5. Version in files remains `[未發布]` or a draft marker (e.g., no version tag in frontmatter).

**Default deploy target by platform**:

| Platform | Deploy Target |
|----------|---------------|
| GitHub Copilot | `.github/` |
| Copilot CLI | `.github/` (same repository custom-instruction convention) |
| Copilot SDK | `sdk/` |
| MCP | `.mcp/` |
| OpenAI / Gemini CLI | `To be confirmed` |
| Hermes Agent | `To be confirmed` |

---

### 5.3 Release

**Definition**: The tool is formally versioned, packaged, and made available for installation via npm.

**Trigger**: Developer explicitly declares a Release with a version number.

**Activities**:
1. Assign the formal version number `[major].[minor].[patch]` in `package.json`.
2. Consolidate `CHANGELOG.md`:
   - Move all `[Unreleased]` entries into a new `[x.y.z] - YYYY-MM-DD` section.
   - Remove duplicate entries.
   - Merge records for items that were added and then immediately modified in the same cycle.
   - Follow Keep a Changelog format (Added / Changed / Fixed / Removed).
3. Run `copilot.requirement-recorder` with `release=true` and `version=<x.y.z>` to migrate `Draft.<sequence>` entries into versioned entries.
4. Keep sequence monotonic in each target history file and preserve reverse chronological order.
5. Sync each module: `ai/composed/en/[module]/` → `templates/[module]/` (module-first npm package artifacts).
6. Generate git commit and tag commands:
   ```bash
   git add .
   git commit -m "release: v[x.y.z] - [brief description]"
   git tag v[x.y.z]
   git push origin main --tags
   ```

**Installation by downstream projects** (modular — install only what is needed):
```bash
# Install all modules
npx @saintber/copilot-library install

# Install a specific module
npx @saintber/copilot-library install --module migration

# Update a specific module
npx @saintber/copilot-library update --module migration

# Remove a specific module
npx @saintber/copilot-library remove --module migration

# List available modules
npx @saintber/copilot-library list
```

The CLI reads `install-manifest.json` from the package to resolve available modules and their deploy target mappings.

---

## 6. Bilingual Strategy

| Artifact | Language | Location |
|----------|----------|----------|
| Published Copilot tool | English | `.github/[type]/` (flat, merged from all modules) |
| Published MCP assets | English | `.mcp/` |
| Published SDK assets | English | `sdk/` |
| Chinese backup | Traditional Chinese | `ai/composed/zh-TW/[module]/[type]/` |
| Requirement history | Traditional Chinese | `ai/[module]/sources/requirements/` |
| CHANGELOG | English | `CHANGELOG.md` (repo root) |

**Point conservation rule**: The English artifact and its Chinese backup MUST be produced in the same Copilot request. Do not issue a separate translation request. The maintainer agent writes both outputs simultaneously.

---

## 7. Version Numbering

Format: `[major].[minor].[patch]`

| Segment | Increment when |
|---------|---------------|
| `major` | Breaking architectural changes; existing tools change incompatibly |
| `minor` | New tools or capabilities added; backward-compatible |
| `patch` | Bug fixes, wording corrections, minor adjustments |

Pre-release state uses no version tag (listed as `[未發布]` in history, `[Unreleased]` in CHANGELOG).

---

## 8. Requirement History

### Purpose
Preserve the original user requirement text for each change so future AI evolution can refer back to the original intent.

### Primary Recorder
Use `copilot.requirement-recorder` as the default recorder operation.

**Effective defaults in this workflow**:
- `recorder_mode`: `versioned-basic`
- `history_root_path`: `ai/[module]/sources/requirements`
- `release`: set to `true` only when release is explicitly declared
- `raw_requirement`: always required; preserve original text as-is

### Format
History files are generated by recorder mode and version path conventions under `ai/[module]/sources/requirements/`.

```markdown
# Requirement History

## Draft

### YYYY-MM-DD
<original requirement text — no format restrictions>

---

## [1.0.0]

### YYYY-MM-DD
<original requirement text>

---
```

**Rules**:
- Entries are in reverse chronological order (newest first).
- No mandatory fields beyond date header and original text in `versioned-basic` mode.
- For multi-module changes, create one requirement entry in each affected module file under `ai/[module]/sources/requirements/`.
- Cross-reference related entries across module files (for example: `Related modules: copilot, migration`, with links or relative paths).
- If no version is supplied before release, assign `Draft.<sequence>`.
- On explicit release, convert `Draft.<sequence>` entries to `<version>.<sequence>`.

---

## 9. Changelog Management

`CHANGELOG.md` at the repository root follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

```markdown
# Changelog

## [Unreleased]
### Added
### Changed
### Fixed
### Removed

## [1.0.0] - 2026-04-27
### Added
- Initial set of instructions, agents, prompts, and skills.
```

**At Release**:
- Move `[Unreleased]` contents into the new version section.
- Remove entries that were added and then immediately removed in the same cycle (net-zero changes).
- Merge entries for items added and then modified within the same cycle into a single "Added" entry.
- Omit empty subsections (Added / Changed / Fixed / Removed) from the released version.

---

## 10. Platform Support & Expansion

### Deploy & Release Path by Artifact Type

The source is always module-first. The deploy target (`.github/`) is always flat — the CLI merges files from all modules during install/deploy.

| Artifact Type | Source (Authoring) | Deploy Target (Flat) | Release Target (Module-first) |
|---------------|--------------------|----------------------|--------------------------------|
| `instructions` | `ai/composed/en/[module]/instructions/` | `.github/instructions/` | `templates/[module]/.github/instructions/` |
| `agents` | `ai/composed/en/[module]/agents/` | `.github/agents/` | `templates/[module]/.github/agents/` |
| `prompts` | `ai/composed/en/[module]/prompts/` | `.github/prompts/` | `templates/[module]/.github/prompts/` |
| `skills` | `ai/composed/en/[module]/skills/` | `.github/skills/` | `templates/[module]/.github/skills/` |
| `mcp` | `ai/composed/en/[module]/mcp/` | `.mcp/` | `templates/[module]/.mcp/` |
| `sdk` | `ai/composed/en/[module]/sdk/` | `sdk/` | `templates/[module]/sdk/` |

### Module Installation Behavior

| Operation | CLI Command | Behavior |
|-----------|-------------|----------|
| Install all | `install` | Copies all `templates/[module]/` into the target project |
| Install one | `install --module <name>` | Copies only `templates/<name>/` |
| Update all | `update` | Re-copies all modules; overwrites existing files |
| Update one | `update --module <name>` | Re-copies only the named module |
| Remove one | `remove --module <name>` | Deletes files registered for the named module from deploy targets |
| List | `list` | Prints available modules from `install-manifest.json` |

### Name Collision & Ownership Policy

- Within this library, tool filenames are expected to be unique via the `[module].[name]` convention; duplicate names across modules are treated as packaging errors.
- Collision can still happen at install/deploy time when the target project already contains a file at the same path (not installed by this library).
- On first install, ownership of pre-existing target files is unknown. The installer must treat such files as unmanaged.
- Default safety behavior: do not overwrite unmanaged conflicting files; report them explicitly.
- Overwrite is allowed only for files tracked by installer state, or via explicit force behavior when intentionally requested by the user.

### Installer State Minimum Schema

To make ownership and conflict decisions deterministic, installer state should keep at least the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `module` | `string` | Yes | Installed module name (for example: `copilot`, `migration`). |
| `targetPath` | `string` | Yes | Resolved target project root path for this install/update run. |
| `sourceVersion` | `string` | Yes | Package version used when the module was installed/updated. |
| `installedAt` | `string` (ISO 8601) | Yes | Install/update timestamp for traceability. |
| `trackedFiles` | `array<object>` | Yes | Files owned by installer for this module. |
| `trackedFiles[].path` | `string` | Yes | Relative path in target project. |
| `trackedFiles[].hash` | `string` | Recommended | Content hash captured at install/update time. |
| `trackedFiles[].artifactType` | `string` | Yes | Artifact type (`instructions`, `agents`, `prompts`, `skills`, `mcp`, `sdk`). |
| `trackedFiles[].status` | `string` | Yes | Ownership status: `managed` or `external-conflict`. |

Interpretation rules:
- If `trackedFiles[].path` exists in state as `managed`, installer may overwrite on update.
- If a target file exists but is not tracked as `managed`, treat it as unmanaged and report conflict.
- If hash mismatches on a managed file, report drift before overwrite (or require explicit force behavior by policy).

### Future Platform Expansion

When a new platform is added, define:
1. **Artifact type mapping**: which types the platform supports.
2. **Deploy target**: platform-specific directory or config location.
3. **Release packaging**: where the module's assets are placed under `templates/[module]/`.
4. **CLI adapter**: extend `saintber-copilot` to route that artifact type to the new target.

| Platform | Status | Notes |
|----------|--------|-------|
| GitHub Copilot | ✅ Active | Primary platform |
| Copilot CLI | 🔲 Planned | Tool definitions for terminal workflows |
| Copilot SDK | 🔲 Planned | Programmatic agent/tool APIs |
| OpenAI / Gemini CLI | 🔲 Expansion Point | System prompts, tool definitions |
| Hermes Agent | 🔲 Expansion Point | Agent definitions |

---

## 11. Copilot Point Conservation

All workflow rules are designed to minimize Copilot request consumption:

| Scenario | Rule |
|----------|------|
| Creating / updating a tool | Produce English + Chinese backup in one request |
| Translating existing tools | Batch all tools needing translation into a single request |
| Requirement recording | Prioritize one parameterized call via `copilot.requirement-recorder` |
| CHANGELOG update | Append to `[Unreleased]`; defer consolidation to Release |
| Release consolidation | One dedicated request to consolidate CHANGELOG + migrate history |
