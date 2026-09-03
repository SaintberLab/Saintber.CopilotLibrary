import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { run } from "./cli.js";

// Test utilities per ai-toolchain-workflow.md
// Verifies CLI behavior for module installation, updating, removal, and state tracking
// across the deploy layer (.github/) from release layer (templates/[module]/)

async function captureRun(args) {
  const logs = [];
  const errors = [];
  const warns = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const previousExitCode = process.exitCode;

  console.log = (...messages) => logs.push(messages.join(" "));
  console.error = (...messages) => errors.push(messages.join(" "));
  console.warn = (...messages) => warns.push(messages.join(" "));
  process.exitCode = 0;

  try {
    await run(["node", "cli.js", ...args]);
    return {
      stdout: logs.join("\n"),
      stderr: errors.join("\n"),
      warnings: warns.join("\n"),
      exitCode: process.exitCode ?? 0,
    };
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    process.exitCode = previousExitCode;
  }
}

test("list shows available modules with descriptions per ai-toolchain-workflow.md §3.2", async () => {
  const result = await captureRun(["list"]);

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Available modules:/);
  // Verify all MODULE_DIRS are listed (code, copilot, docs, kb, migration, speckit)
  assert.match(result.stdout, /copilot/);
  assert.match(result.stdout, /migration/);
  // Descriptions should be right-aligned (using — separator)
  assert.match(result.stdout, /—/);
  // Sub-namespaces should not appear in module list
  assert.doesNotMatch(result.stdout, /migration\.dotnet-modernizer/);
});

test("init installs files from release layer (templates/[module]/) to deploy layer (.github/) per ai-toolchain-workflow.md §5.2, §10", async () => {
  const targetDir = mkdtempSync(join(tmpdir(), "copilot-library-"));

  const initResult = await captureRun([
    "init",
    "--target",
    targetDir,
    "--module",
    "copilot",
  ]);

  assert.equal(initResult.exitCode, 0);
  // Verify deployment to .github/ (deploy layer, flat structure)
  assert.equal(existsSync(join(targetDir, ".github", "copilot-instructions.md")), true);
  assert.equal(
    existsSync(join(targetDir, ".github", "instructions", "copilot-instructions.md")),
    false
  );

  // Verify state tracking per ai-toolchain-workflow.md §10 (Installer State Minimum Schema)
  const state = JSON.parse(
    readFileSync(join(targetDir, ".copilot-library", "state.json"), "utf8")
  );
  assert.ok(state.installedFiles.includes("copilot-instructions.md"));
  assert.ok(state.version);
  assert.ok(state.targetPath);
});

test("init stages copilot-instructions under .github/instructions when root file already exists (dual-track strategy per ai-toolchain-workflow.md §5.2)", async () => {
  const targetDir = mkdtempSync(join(tmpdir(), "copilot-library-"));
  mkdirSync(join(targetDir, ".github"), { recursive: true });
  writeFileSync(
    join(targetDir, ".github", "copilot-instructions.md"),
    "# existing\nkeep\n"
  );

  const initResult = await captureRun([
    "init",
    "--target",
    targetDir,
    "--module",
    "copilot",
  ]);

  assert.equal(initResult.exitCode, 0);
  // Verify root file is preserved
  assert.equal(
    readFileSync(join(targetDir, ".github", "copilot-instructions.md"), "utf8"),
    "# existing\nkeep\n"
  );
  // Verify staged copy for merge
  assert.equal(
    existsSync(join(targetDir, ".github", "instructions", "copilot-instructions.md")),
    true
  );

  const state = JSON.parse(
    readFileSync(join(targetDir, ".copilot-library", "state.json"), "utf8")
  );
  assert.ok(state.installedFiles.includes("instructions/copilot-instructions.md"));
});

test("remove deletes only tracked installed files from deploy layer and preserves user content per ai-toolchain-workflow.md §10", async () => {
  const targetDir = mkdtempSync(join(tmpdir(), "copilot-library-"));
  mkdirSync(join(targetDir, ".github"), { recursive: true });
  writeFileSync(join(targetDir, ".github", "user-note.md"), "keep me\n");

  const initResult = await captureRun([
    "init",
    "--target",
    targetDir,
    "--module",
    "kb,copilot",
  ]);
  assert.equal(initResult.exitCode, 0);

  const stateAfterInit = JSON.parse(
    readFileSync(join(targetDir, ".copilot-library", "state.json"), "utf8")
  );
  assert.ok(Array.isArray(stateAfterInit.installedFiles));
  assert.ok(stateAfterInit.installedFiles.length > 0);
  assert.ok(
    stateAfterInit.installedFiles.some((file) => file.includes("kb.")),
    "expected kb files to be tracked in state"
  );
  assert.ok(
    stateAfterInit.installedFiles.some((file) => file.includes("copilot.")),
    "expected copilot files to remain tracked in state"
  );

  const removeResult = await captureRun([
    "remove",
    "--target",
    targetDir,
    "--module",
    "kb",
  ]);
  assert.equal(removeResult.exitCode, 0);
  assert.ok(existsSync(join(targetDir, ".github", "user-note.md")));

  const stateAfterRemove = JSON.parse(
    readFileSync(join(targetDir, ".copilot-library", "state.json"), "utf8")
  );
  assert.ok(Array.isArray(stateAfterRemove.installedFiles));
  assert.equal(
    stateAfterRemove.installedFiles.some((file) => file.includes("kb.")),
    false
  );
});

test("remove with --module all fully uninstalls tracked content but keeps user .github files per ai-toolchain-workflow.md §10", async () => {
  const targetDir = mkdtempSync(join(tmpdir(), "copilot-library-"));
  mkdirSync(join(targetDir, ".github"), { recursive: true });
  writeFileSync(join(targetDir, ".github", "user-note.md"), "keep me\n");

  const initResult = await captureRun(["init", "--target", targetDir]);
  assert.equal(initResult.exitCode, 0);
  assert.ok(existsSync(join(targetDir, ".copilot-library", "state.json")));

  const removeResult = await captureRun([
    "remove",
    "--target",
    targetDir,
    "--module",
    "all",
  ]);

  assert.equal(removeResult.exitCode, 0);
  assert.ok(existsSync(join(targetDir, ".github", "user-note.md")));
  assert.equal(existsSync(join(targetDir, ".copilot-library")), false);
});
