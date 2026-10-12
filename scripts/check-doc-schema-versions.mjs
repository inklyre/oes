// Every schema URL or path on the docs site must point at the *current*
// version of that schema (per lib/current-schemas.mjs), unless it is
// listed in INTENTIONAL_PINS below.
//
// Pages like Editor Setup promise "the right URL for every OES document
// type", and a version bump that forgets to update them leaves readers
// validating against a schema one version behind — silently, since every
// past version stays live. That happened once already (OPF 0.3.0, OQF
// 0.2.0 and OAF 0.2.0 all shipped with Editor Setup still on the old
// URLs); this check is what stops it happening again.
//
// downloads/ is deliberately not scanned: each consolidated spec there is
// a frozen snapshot of one version and is *supposed* to name its own.

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { CURRENT_SCHEMAS } from "./lib/current-schemas.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SITE = join(ROOT, "site");
const SKIP_DIRS = new Set([".vitepress", "public", "node_modules"]);

// References to a past version that are the point of the sentence they
// sit in. Keep this list short — every entry is a place a reader is
// deliberately shown an old schema.
const INTENTIONAL_PINS = [
  // "Pinning to a version" — the example is a past version on purpose.
  { file: "site/editor-setup.md", ref: "schemas/ocf/v0.2.0/course.schema.json" },
];

const REF = /schemas\/([a-z]+)\/v(\d+\.\d+\.\d+)\/([a-z-]+)\.schema\.json/g;

// "oqf/question.schema.json" -> "schemas/oqf/v0.2.0/question.schema.json"
const currentByFile = new Map(
  Object.values(CURRENT_SCHEMAS).map((path) => {
    const [, spec, , file] = path.match(/^schemas\/([a-z]+)\/v([\d.]+)\/([a-z-]+)\.schema\.json$/);
    return [`${spec}/${file}`, path];
  }),
);

async function* markdownFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* markdownFiles(join(dir, entry.name));
    } else if (entry.name.endsWith(".md")) {
      yield join(dir, entry.name);
    }
  }
}

const problems = [];
let checked = 0;

for await (const abs of markdownFiles(SITE)) {
  const file = relative(ROOT, abs);
  const lines = (await readFile(abs, "utf8")).split("\n");
  lines.forEach((line, i) => {
    for (const [ref, spec, , name] of line.matchAll(REF)) {
      checked++;
      const current = currentByFile.get(`${spec}/${name}`);
      if (current === ref) continue;
      if (INTENTIONAL_PINS.some((p) => p.file === file && p.ref === ref)) continue;
      problems.push(
        current
          ? `${file}:${i + 1} — ${ref} is not current; use ${current}`
          : `${file}:${i + 1} — ${ref} has no current version (removed document type?)`,
      );
    }
  });
}

if (problems.length) {
  for (const p of problems) console.error(`FAIL — ${p}`);
  console.error(`\n${problems.length} stale schema reference(s) on the docs site.`);
  process.exitCode = 1;
} else {
  console.log(`All ${checked} schema references on the docs site point at the current version.`);
}
