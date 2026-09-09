#!/usr/bin/env node
// A handful of JSON Schema `definitions` — related_item, source, reference
// — are deliberately duplicated verbatim into every spec's own schema
// file, rather than $ref'd from one shared file (see planning/02-decisions.md
// for why: cross-file $ref resolution is more machinery than the payoff
// justifies while these stay simple). That duplication is only safe as
// long as every copy stays *structurally* identical — same fields, same
// types, same required/oneOf rules, same enum values — which nothing
// else guarantees; this script is what actually catches one copy
// drifting out of sync when another spec's is updated and it's missed.
//
// Deliberately ignores `description` text when comparing: several of
// these definitions carry intentionally different prose per spec (e.g.
// `source.url`'s description gives a different example — "a video's
// page" in OVF, "a question's page" in OQF — appropriate to that spec's
// own content). Only structure is required to match; wording is free to
// be contextual.

import { readFileSync } from "fs";
import { CURRENT_SCHEMAS } from "./lib/current-schemas.mjs";

const SHARED_DEFINITIONS = ["related_item", "source", "reference"];

function stripDescriptions(value) {
  if (Array.isArray(value)) return value.map(stripDescriptions);
  if (value !== null && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === "description") continue;
      out[k] = stripDescriptions(v);
    }
    return out;
  }
  return value;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return aKeys.length === bKeys.length && aKeys.every((k, i) => k === bKeys[i] && deepEqual(a[k], b[k]));
}

let failed = false;

for (const name of SHARED_DEFINITIONS) {
  const copies = [];
  for (const [docType, path] of Object.entries(CURRENT_SCHEMAS)) {
    const schema = JSON.parse(readFileSync(path, "utf8"));
    const def = schema.definitions?.[name];
    if (def !== undefined) copies.push({ docType, path, def: stripDescriptions(def) });
  }

  if (copies.length < 2) {
    console.log(`SKIP — "${name}" appears in fewer than 2 current schemas, nothing to compare`);
    continue;
  }

  const [first, ...rest] = copies;
  const mismatches = rest.filter((c) => !deepEqual(c.def, first.def));

  if (mismatches.length === 0) {
    console.log(`PASS — "${name}" structurally identical across ${copies.map((c) => c.docType).join(", ")}`);
  } else {
    failed = true;
    console.log(`FAIL — "${name}" differs structurally (description text ignored):`);
    console.log(`  ${first.docType} (${first.path}):\n${JSON.stringify(first.def, null, 2)}`);
    for (const m of mismatches) {
      console.log(`  ${m.docType} (${m.path}) DIFFERS:\n${JSON.stringify(m.def, null, 2)}`);
    }
  }
}

if (failed) {
  console.log("\nShared definitions have drifted out of sync — bring the copies above back in line with each other.");
  process.exit(1);
} else {
  console.log("\nAll shared definitions are structurally consistent across every current schema.");
}
