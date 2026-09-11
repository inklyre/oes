#!/usr/bin/env node
// Conformance test suite: validates every fixture under conformance/{spec}/valid
// and conformance/{spec}/invalid against that spec's JSON Schema, and asserts
// each lands on the expected side. See conformance/README.md.

import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { CURRENT_SCHEMAS } from "./lib/current-schemas.mjs";

const SPECS = {
  // OQF has two document types, each with its own schema file. Fixtures live
  // one level deeper, in valid|invalid/{question,stimulus}/*.json — that
  // subfolder name picks which schema file to validate against.
  oqf: {
    docTypes: {
      question: CURRENT_SCHEMAS["oqf.question"],
      stimulus: CURRENT_SCHEMAS["oqf.stimulus"],
    },
  },
  opf: { schema: CURRENT_SCHEMAS.opf },
  oaf: { schema: CURRENT_SCHEMAS.oaf },
  ovf: { schema: CURRENT_SCHEMAS.ovf },
  orf: { schema: CURRENT_SCHEMAS.orf },
  opk: { schema: CURRENT_SCHEMAS.opk },
  // OCF is one schema file covering three document types via #/definitions/{name}.
  // Fixtures live one level deeper, in valid|invalid/{course,module,lesson}/*.json —
  // that subfolder name is the definition to validate against.
  ocf: { schema: CURRENT_SCHEMAS.ocf, definitions: ["course", "module", "lesson"] },
};

function findJsonFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...findJsonFiles(full));
    else if (entry.endsWith(".json")) out.push(full);
  }
  return out;
}

function compileSchema(schemaPath, fragment) {
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  return fragment
    ? ajv.compile({ definitions: schema.definitions, $ref: `#/definitions/${fragment}` })
    : ajv.compile(schema);
}

let total = 0;
let failed = 0;

for (const [spec, cfg] of Object.entries(SPECS)) {
  const subfolders = cfg.definitions || (cfg.docTypes && Object.keys(cfg.docTypes));

  for (const expectValid of [true, false]) {
    const dir = join("conformance", spec, expectValid ? "valid" : "invalid");
    let files;
    try {
      files = findJsonFiles(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      total++;
      const subfolder = subfolders ? relative(dir, file).split("/")[0] : undefined;
      if (subfolders && !subfolders.includes(subfolder)) {
        console.log(`FAIL — ${file}: unrecognized ${spec.toUpperCase()} fixture subfolder "${subfolder}"`);
        failed++;
        continue;
      }
      const schemaPath = cfg.docTypes ? cfg.docTypes[subfolder] : cfg.schema;
      const fragment = cfg.definitions ? subfolder : undefined;
      const validate = compileSchema(schemaPath, fragment);
      const data = JSON.parse(readFileSync(file, "utf8"));
      const valid = validate(data);
      const ok = valid === expectValid;
      if (!ok) failed++;
      console.log(
        `${ok ? "PASS" : "FAIL"} — ${file} (expected ${expectValid ? "valid" : "invalid"}, got ${valid ? "valid" : "invalid"})`
      );
      if (!ok) console.log("  " + JSON.stringify(validate.errors));
    }
  }
}

console.log(`\n${total - failed}/${total} fixtures behaved as expected.`);
if (failed > 0) {
  console.log(`${failed} FAILED.`);
  process.exit(1);
}
