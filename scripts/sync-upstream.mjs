// Refreshes content/free-for-dev.md from ripienaar/free-for-dev (default branch)
// and records the upstream commit SHA in content/UPSTREAM_COMMIT.
import { execFileSync } from "node:child_process";
import { mkdtempSync, copyFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const REPO = "https://github.com/ripienaar/free-for-dev.git";
const dir = mkdtempSync(path.join(tmpdir(), "free-for-dev-"));
try {
  execFileSync("git", ["clone", "--depth", "1", REPO, dir], { stdio: "inherit" });
  const sha = execFileSync("git", ["-C", dir, "rev-parse", "HEAD"]).toString().trim();
  copyFileSync(path.join(dir, "README.md"), path.join("content", "free-for-dev.md"));
  writeFileSync(path.join("content", "UPSTREAM_COMMIT"), `${sha}\n`);
  console.log(`Synced free-for-dev @ ${sha}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
