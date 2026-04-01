import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  readdirSync,
} from "fs";
import { join, relative, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const TEMPLATES_DIR = join(ROOT, "templates");
const STATE_REL = ".copilot-library/state.json";
const GITHUB_SUBDIR = ".github";

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

function matchesModules(filename, modules) {
  if (!modules || modules.length === 0) return true;
  return modules.some(
    (m) =>
      filename === m ||
      filename.startsWith(m + ".") ||
      filename.startsWith(m + "-")
  );
}

function collectFiles(dir, baseDir, modules) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, baseDir, modules));
    } else if (matchesModules(entry.name, modules)) {
      results.push(relative(baseDir, full).replace(/\\/g, "/"));
    }
  }
  return results;
}

function copyFiles(files, srcBase, destBase) {
  for (const f of files) {
    const src = join(srcBase, f);
    const dest = join(destBase, f);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
  }
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
      const files = collectFiles(TEMPLATES_DIR, TEMPLATES_DIR, modules);
      if (files.length === 0) {
        console.error(
          "Error: no files to install (templates may be empty or no files match --modules)"
        );
        process.exitCode = 1;
        return;
      }
      const destGithub = join(targetDir, GITHUB_SUBDIR);
      copyFiles(files, TEMPLATES_DIR, destGithub);
      writeState(targetDir, { modules: modules ?? ["all"] });
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
      const files = collectFiles(TEMPLATES_DIR, TEMPLATES_DIR, effectiveModules);
      if (files.length === 0) {
        console.error("Error: no files to update");
        process.exitCode = 1;
        return;
      }
      const destGithub = join(targetDir, GITHUB_SUBDIR);
      copyFiles(files, TEMPLATES_DIR, destGithub);
      writeState(targetDir, { modules: effectiveModules ?? ["all"] });
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
      }
      const expected = collectFiles(TEMPLATES_DIR, TEMPLATES_DIR, checkModules);
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
      console.log("");
      console.log("Options:");
      console.log(
        "  --target   Target directory to install into, update, or check (default: current directory)"
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