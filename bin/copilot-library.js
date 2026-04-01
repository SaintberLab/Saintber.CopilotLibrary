#!/usr/bin/env node
import { run } from "../src/cli.js";

run(process.argv).catch((err) => {
  console.error("[copilot-library] fatal:", err?.message ?? err);
  process.exit(1);
});