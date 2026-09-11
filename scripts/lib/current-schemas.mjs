// The current (non-legacy) schema file per document type — the single
// source of truth every script in this repo that needs "which schema
// file is actually current" keys off, so validate-conformance.mjs and
// check-shared-definitions.mjs can't quietly disagree with each other.
//
// The oes-tooling repo (github.com/inklyre/oes-tooling) necessarily
// duplicates this same list twice more, since it can't import this file
// directly across repos: packages/schemas/scripts/fetch-schemas.mjs's
// SCHEMA_PATHS (what to fetch) and packages/schemas/src/index.ts's
// import statements (what to bundle). Bumping a schema's current version
// here means updating those two spots too — nothing checks that
// automatically today.
export const CURRENT_SCHEMAS = {
  oaf: "schemas/oaf/v0.2.0/article.schema.json",
  ocf: "schemas/ocf/v0.3.0/course.schema.json",
  opf: "schemas/opf/v0.3.0/set.schema.json",
  ovf: "schemas/ovf/v0.1.0/video.schema.json",
  orf: "schemas/orf/v0.1.0/resource.schema.json",
  "oqf.question": "schemas/oqf/v0.2.0/question.schema.json",
  "oqf.stimulus": "schemas/oqf/v0.2.0/stimulus.schema.json",
};
