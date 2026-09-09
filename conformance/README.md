# Conformance Fixtures

A real, checked-in test suite for every OES spec — not just the JSON code
blocks embedded in the docs. Each `{spec}/valid/` fixture MUST validate
against that spec's current JSON Schema; each `{spec}/invalid/` fixture
MUST fail validation, and its filename says which rule it's there to
exercise.

Run the whole suite:

```bash
npm run conformance
```

A related, smaller check: `related_item`/`source`/`reference` are
deliberately duplicated verbatim into every spec's own schema file
rather than `$ref`'d from one shared file — this catches one copy
drifting structurally out of sync with the others (description text is
allowed to vary; everything else isn't):

```bash
npm run check-shared-definitions
```

## Layout

```
conformance/
├── oqf/{valid,invalid}/*.json          — one fixture per question type (+ invalid cases)
├── opf/{valid,invalid}/*.json          — co-located and external question refs
├── oaf/{valid,invalid}/*.json
├── ovf/{valid,invalid}/*.json          — streaming-only and downloadable+local cases
├── orf/{valid,invalid}/*.json          — link-only and downloadable+local cases
└── ocf/{valid,invalid}/{course,module,lesson}/*.json
```

OCF's fixtures are nested one level deeper than the others because a
single schema file (`course.schema.json`) covers three document types via
`#/definitions/{course,module,lesson}` — the subfolder name tells
`scripts/validate-conformance.mjs` which definition to validate against.

## Adding a fixture

- A new **valid** fixture should be the smallest example that exercises
  something not already covered — a new field, a new type, a new
  reference shape — not a duplicate of an existing one with cosmetic
  changes.
- A new **invalid** fixture should isolate exactly one violated rule, and
  its filename should say which one (see the existing ones for the
  pattern, e.g. `both-path-and-url.json`, `essay-max-words-not-integer.json`).
- If you change a schema, add or update a fixture that would have caught
  the change — this suite is only worth as much as its coverage.

This suite intentionally validates single-document shape only. It does
**not** check cross-file referential integrity (e.g. that a `path` in one
file actually resolves to a real file elsewhere, or that ids are unique
across a whole tree) — that's [`@inklyre/oes-lint`](https://github.com/inklyre/oes-tooling/tree/main/packages/lint)'s
job, built on top of [`@inklyre/oes-core`](https://github.com/inklyre/oes-tooling/tree/main/packages/core)'s
`resolve()`, not something these fixtures claim to cover.
