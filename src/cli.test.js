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

test("list shows available modules with descriptions", async () => {
  const result = await captureRun(["list"]);

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Available modules:/);
  assert.match(result.stdout, /copilot/);
  assert.match(result.stdout, /migration/);
  assert.match(result.stdout, /—/);
  assert.doesNotMatch(result.stdout, /migration\.dotnet-modernizer/);
});

test("remove deletes only tracked installed module files and preserves user content", async () => {
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

test("remove with --module all fully uninstalls tracked content but keeps user .github files", async () => {
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
