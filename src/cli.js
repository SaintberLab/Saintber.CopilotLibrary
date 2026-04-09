import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  readdirSync,
  rmSync,
} from "fs";
import { join, relative, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const TEMPLATES_DIR = join(ROOT, "templates");
const STATE_REL = ".copilot-library/state.json";
const GITHUB_SUBDIR = ".github";
const ARTIFACT_DIRS = ["agents", "instructions", "prompts", "skills"];
const MODULE_DIRS = ["code", "copilot", "docs", "kb", "migration", "speckit"];

function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      result[key] = next && !next.startsWith("--") ? (i++, next) : true;
    }
  }
  return result;
}

function getPackageVersion() {
  return JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version;
}

function readState(targetDir) {
  const p = join(targetDir, STATE_REL);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function writeState(targetDir, patch = {}) {
  const stateDir = join(targetDir, ".copilot-library");
  mkdirSync(stateDir, { recursive: true });
  const now = new Date().toISOString();
  const prev = readState(targetDir) ?? {};
  const state = {
    version: getPackageVersion(),
    installedAt: prev.installedAt ?? now,
    updatedAt: now,
    ...patch,
  };
  writeFileSync(join(targetDir, STATE_REL), JSON.stringify(state, null, 2));
  return state;
}

function matchesModules(selector, modules) {
  if (!modules || modules.length === 0) return true;
  return modules.some(
    (m) =>
      selector === m ||
      selector.startsWith(m + ".") ||
      selector.startsWith(m + "-")
  );
}

function resolveTemplateEntry(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  const parts = normalized.split("/");

  // Special case: copilot-instructions.md belongs in .github root, not .github/instructions
  const filename = parts[parts.length - 1];
  if (filename === "copilot-instructions.md") {
    return {
      sourceRelativePath: normalized,
      destinationRelativePath: "copilot-instructions.md",
      selector: getModuleSelectorFromFile(filename),
    };
  }

  if (
    parts.length === 3 &&
    MODULE_DIRS.includes(parts[0]) &&
    ARTIFACT_DIRS.includes(parts[1])
  ) {
    return {
      sourceRelativePath: normalized,
      destinationRelativePath: `${parts[1]}/${filename}`,
      selector: getModuleSelectorFromFile(filename),
    };
  }

  if (parts.length === 2 && ARTIFACT_DIRS.includes(parts[0])) {
    return {
      sourceRelativePath: normalized,
      destinationRelativePath: normalized,
      selector: getModuleSelectorFromFile(filename),
    };
  }

  return null;
}

function collectTemplateEntries(dir, baseDir, modules) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectTemplateEntries(full, baseDir, modules));
      continue;
    }

    const rel = relative(baseDir, full).replace(/\\/g, "/");
    const resolved = resolveTemplateEntry(rel);
    if (!resolved) continue;
    if (!matchesModules(resolved.selector, modules)) continue;
    results.push(resolved);
  }

  // Deduplicate by destination path. Later entries win so module-scoped templates can override legacy root templates.
  const dedup = new Map();
  for (const item of results) {
    dedup.set(item.destinationRelativePath, item);
  }

  return Array.from(dedup.values());
}

function copyFiles(entries, srcBase, destBase) {
  for (const entry of entries) {
    const src = join(srcBase, entry.sourceRelativePath);
    // For .github root files (like copilot-instructions.md), copy directly to destBase
    const finalDest = entry.destinationRelativePath.includes("/")
      ? join(destBase, entry.destinationRelativePath)
      : join(destBase, entry.destinationRelativePath);
    mkdirSync(dirname(finalDest), { recursive: true });
    copyFileSync(src, finalDest);
  }
}

function getFilenameFromRelativePath(filePath) {
  return filePath.split("/").pop() ?? filePath;
}

function getModuleSelectorFromFile(filePath) {
  const filename = getFilenameFromRelativePath(filePath);
  const knownSuffixes = [
    ".instructions.md",
    ".agent.md",
    ".prompt.md",
    ".skill.md",
  ];
  const suffix = knownSuffixes.find((item) => filename.endsWith(item));
  return suffix ? filename.slice(0, -suffix.length) : filename.replace(/\.md$/, "");
}

function collectModuleSelectors(files) {
  const selectors = new Set();
  for (const file of files) {
    const selector = getModuleSelectorFromFile(file);
    if (!selector) continue;

    const namespace = selector.split(".")[0].split("-")[0];
    if (namespace) {
      selectors.add(namespace);
    }
    if (selector.includes(".")) {
      selectors.add(selector);
    }
  }
  return Array.from(selectors).sort();
}

function readModuleDescription(module) {
  const readmePath = join(TEMPLATES_DIR, module, "README.md");
  if (!existsSync(readmePath)) return "";
  try {
    const content = readFileSync(readmePath, "utf8");
    const lines = content.split("\n");
    let foundTitle = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!foundTitle) {
        if (trimmed.startsWith("# ")) foundTitle = true;
        continue;
      }
      if (trimmed && !trimmed.startsWith("#")) {
        // Strip a leading `<word>` (module name in backticks) to avoid duplication
        return trimmed.replace(/^`[^`]+`\s*/, "");
      }
    }
    return "";
  } catch {
    return "";
  }
}

function mergeInstalledFiles(previousFiles, nextFiles) {
  return Array.from(
    new Set([...(previousFiles ?? []), ...(nextFiles ?? [])])
  ).sort();
}

function mergeTrackedModules(previousModules, requestedModules) {
  if (!requestedModules || requestedModules.length === 0) {
    return ["all"];
  }

  const previous = Array.isArray(previousModules)
    ? previousModules.filter(Boolean)
    : [];

  if (previous.includes("all")) {
    return ["all"];
  }

  return Array.from(new Set([...previous, ...requestedModules])).sort();
}

function removeFiles(files, destBase) {
  const boundary = resolve(destBase);

  for (const f of files) {
    const dest = join(destBase, f);
    if (!existsSync(dest)) continue;

    rmSync(dest, { force: true });

    let current = resolve(dirname(dest));
    while (current.startsWith(boundary) && current !== boundary) {
      if (!existsSync(current) || readdirSync(current).length > 0) {
        break;
      }
      rmSync(current, { recursive: true, force: true });
      current = resolve(dirname(current));
    }
  }
}

function resolveExpectedFiles(state, modules) {
  if (modules && modules.length > 0) {
    return collectTemplateEntries(TEMPLATES_DIR, TEMPLATES_DIR, modules).map(
      (entry) => entry.destinationRelativePath
    );
  }

  if (Array.isArray(state?.installedFiles) && state.installedFiles.length > 0) {
    return state.installedFiles;
  }

  if (
    Array.isArray(state?.modules) &&
    state.modules.length > 0 &&
    !state.modules.includes("all")
  ) {
    return collectTemplateEntries(TEMPLATES_DIR, TEMPLATES_DIR, state.modules).map(
      (entry) => entry.destinationRelativePath
    );
  }

  return collectTemplateEntries(TEMPLATES_DIR, TEMPLATES_DIR, null).map(
    (entry) => entry.destinationRelativePath
  );
}

export async function run(argv) {
  const [, , command, ...rawArgs] = argv;
  const opts = parseArgs(rawArgs);
  const moduleArg =
    typeof opts.modules === "string"
      ? opts.modules
      : typeof opts.module === "string"
      ? opts.module
      : null;
  const modules = moduleArg
    ? moduleArg
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  switch (command) {
    case "init": {
      const targetDir = resolve(process.cwd(), opts.target || ".");
      if (!existsSync(targetDir)) {
        console.error(`Error: target directory does not exist: ${targetDir}`);
        process.exitCode = 1;
        return;
      }
      const previousState = readState(targetDir) ?? {};
      const templateEntries = collectTemplateEntries(
        TEMPLATES_DIR,
        TEMPLATES_DIR,
        modules
      );
      if (templateEntries.length === 0) {
        console.error(
          "Error: no files to install (templates may be empty or no files match --modules)"
        );
        process.exitCode = 1;
        return;
      }
      const files = templateEntries.map((entry) => entry.destinationRelativePath);
      const destGithub = join(targetDir, GITHUB_SUBDIR);
      copyFiles(templateEntries, TEMPLATES_DIR, destGithub);
      const installedFiles = mergeInstalledFiles(previousState.installedFiles, files);
      writeState(targetDir, {
        modules: mergeTrackedModules(previousState.modules, modules),
        installedFiles,
      });
      console.log(`✓ Installed ${files.length} file(s) to ${destGithub}`);
      break;
    }

    case "update": {
      const targetDir = resolve(process.cwd(), opts.target || ".");
      if (!existsSync(targetDir)) {
        console.error(`Error: target directory does not exist: ${targetDir}`);
        process.exitCode = 1;
        return;
      }
      const state = readState(targetDir);
      if (!state) {
        console.warn(
          "Warning: no state.json found. Run init first for a clean install."
        );
      }
      const effectiveModules = modules;
      const templateEntries = collectTemplateEntries(
        TEMPLATES_DIR,
        TEMPLATES_DIR,
        effectiveModules
      );
      if (templateEntries.length === 0) {
        console.error("Error: no files to update");
        process.exitCode = 1;
        return;
      }
      const files = templateEntries.map((entry) => entry.destinationRelativePath);
      const destGithub = join(targetDir, GITHUB_SUBDIR);
      copyFiles(templateEntries, TEMPLATES_DIR, destGithub);
      const installedFiles = mergeInstalledFiles(state?.installedFiles, files);
      writeState(targetDir, {
        modules: mergeTrackedModules(state?.modules, effectiveModules),
        installedFiles,
      });
      console.log(`✓ Updated ${files.length} file(s) in ${destGithub}`);
      break;
    }

    case "doctor": {
      const targetDir = resolve(process.cwd(), opts.target || ".");
      let hasError = false;

      if (existsSync(targetDir)) {
        console.log(`✓ Target directory: ${targetDir}`);
      } else {
        console.error(`✗ Target directory not found: ${targetDir}`);
        hasError = true;
      }

      const state = readState(targetDir);
      if (state) {
        console.log(`✓ State file: .copilot-library/state.json`);
        console.log(`  Installed version : ${state.version}`);
        console.log(`  Installed at      : ${state.installedAt}`);
        console.log(`  Last updated      : ${state.updatedAt}`);
        if (state.modules && !state.modules.includes("all")) {
          console.log(`  Installed modules : ${state.modules.join(", ")}`);
        }
      } else {
        console.error(
          `✗ State file not found (.copilot-library/state.json) — run 'init' first`
        );
        hasError = true;
      }

      const checkModules = modules;
      if (checkModules) {
        console.log(`\nChecking modules: ${checkModules.join(", ")}`);
      } else if (Array.isArray(state?.installedFiles) && state.installedFiles.length) {
        console.log(`\nChecking tracked installed files from state.json`);
      }
      const expected = resolveExpectedFiles(state, checkModules);
      const destGithub = join(targetDir, GITHUB_SUBDIR);
      const missing = expected.filter((f) => !existsSync(join(destGithub, f)));
      if (missing.length === 0) {
        console.log(`✓ All ${expected.length} expected file(s) are present`);
      } else {
        console.error(
          `✗ Missing ${missing.length} of ${expected.length} file(s):`
        );
        for (const f of missing) console.error(`  - .github/${f}`);
        hasError = true;
      }

      if (hasError) process.exitCode = 1;
      break;
    }

    case "list": {
      const maxLen = Math.max(...MODULE_DIRS.map((m) => m.length));
      console.log("Available modules:");
      for (const module of MODULE_DIRS) {
        const description = readModuleDescription(module);
        const pad = module.padEnd(maxLen);
        const line = `  ${pad}  ${description ? `— ${description}` : ""}`;
        console.log(line.trimEnd());
      }

      const targetDir = resolve(process.cwd(), opts.target || ".");
      const state = readState(targetDir);
      if (state?.installedFiles?.length) {
        const installedModules = collectModuleSelectors(state.installedFiles).filter(
          (s) => MODULE_DIRS.includes(s)
        );
        if (installedModules.length > 0) {
          console.log("\nInstalled modules in target:");
          for (const module of installedModules) {
            const description = readModuleDescription(module);
            const pad = module.padEnd(maxLen);
            const line = `  ${pad}  ${description ? `— ${description}` : ""}`;
            console.log(line.trimEnd());
          }
        }
      }
      break;
    }

    case "remove": {
      const targetDir = resolve(process.cwd(), opts.target || ".");
      if (!existsSync(targetDir)) {
        console.error(`Error: target directory does not exist: ${targetDir}`);
        process.exitCode = 1;
        return;
      }

      if (!modules || modules.length === 0) {
        console.error(
          "Error: remove requires --module or --modules so removal stays scoped to specific installed content"
        );
        process.exitCode = 1;
        return;
      }

      const state = readState(targetDir);
      if (!state) {
        console.error(
          "Error: state file not found (.copilot-library/state.json) — cannot safely remove tracked files"
        );
        process.exitCode = 1;
        return;
      }

      if (!Array.isArray(state.installedFiles)) {
        console.error(
          "Error: this installation does not track installed files yet. Run 'update' once to refresh state.json before using 'remove'."
        );
        process.exitCode = 1;
        return;
      }

      const isFullRemoval = modules.includes("all");
      const filesToRemove = isFullRemoval
        ? state.installedFiles
        : state.installedFiles.filter((file) =>
            matchesModules(getFilenameFromRelativePath(file), modules)
          );

      if (filesToRemove.length === 0 && !isFullRemoval) {
        console.log(
          `No tracked files matched modules: ${modules.join(", ")}`
        );
        break;
      }

      const destGithub = join(targetDir, GITHUB_SUBDIR);
      removeFiles(filesToRemove, destGithub);

      const filesToRemoveSet = new Set(filesToRemove);
      const remainingFiles = isFullRemoval
        ? []
        : state.installedFiles.filter((file) => !filesToRemoveSet.has(file));

      if (remainingFiles.length === 0) {
        rmSync(join(targetDir, ".copilot-library"), {
          recursive: true,
          force: true,
        });
        console.log(
          `✓ Removed ${filesToRemove.length} tracked file(s) for module(s): ${modules.join(", ")} and cleared .copilot-library`
        );
        break;
      }

      writeState(targetDir, {
        modules: collectModuleSelectors(remainingFiles),
        installedFiles: remainingFiles,
      });

      console.log(
        `✓ Removed ${filesToRemove.length} tracked file(s) for module(s): ${modules.join(", ")}`
      );
      break;
    }

    default:
      console.log("Usage:");
      console.log(
        "  npx @saintber/copilot-library init   [--target <dir>] [--module <ns1,ns2>]"
      );
      console.log(
        "  npx @saintber/copilot-library update [--target <dir>] [--module <ns1,ns2>]"
      );
      console.log(
        "  npx @saintber/copilot-library doctor [--target <dir>] [--module <ns1,ns2>]"
      );
      console.log(
        "  npx @saintber/copilot-library list   [--target <dir>]"
      );
      console.log(
        "  npx @saintber/copilot-library remove [--target <dir>] --module <ns1,ns2|all>"
      );
      console.log("");
      console.log("Options:");
      console.log(
        "  --target   Target directory to install into, update, check, list, or remove from (default: current directory)"
      );
      console.log(
        "  --module   Comma-separated namespace modules to filter (supports sub-namespaces)"
      );
      console.log("  --modules  Alias of --module");
      console.log(
        "             Examples: kb  |  copilot,docs  |  migration.dotnet-modernizer"
      );
      process.exitCode = 1;
      break;
  }
}