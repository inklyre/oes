# Editor Setup

Every OES JSON Schema (draft-07) is published in this repo under
`schemas/` and served live from the docs site, so any editor with JSON
Schema support — VS Code, JetBrains IDEs, others — can validate an
`.json` file as you type and offer autocomplete for its fields, without
installing anything OES-specific. This page covers the two ways to wire
that up.

[[toc]]

## Option 1: a `$schema` field in the document itself

Every OES document type accepts an optional top-level `$schema` field —
this is the same convention `package.json`, `tsconfig.json`, and most
JSON tooling already use. VS Code (and most JSON-aware editors) reads it
automatically; no workspace configuration needed, and it travels with the
file itself even outside this repo's workspace.

```json
{
  "$schema": "https://oes.inklyre.org/schemas/ocf/v0.3.0/course.schema.json",
  "ocf_version": "0.3.0",
  "id": "intro-to-python",
  "title": "Introduction to Python",
  "modules": [
    { "id": "getting-started", "path": "modules/getting-started" }
  ]
}
```

`$schema` is a pure editor/tooling hint — not part of the OES content
model, and not required. An OES parser MUST ignore it like any other
unrecognized field, exactly the way it already ignores `x_`-prefixed
extensions.

`course.schema.json` covers all three OCF document types (`course.json`,
`module.json`, `lesson.json`) behind one root `oneOf`, so the same URL
works for all three regardless of which one you're editing — the editor
picks the matching branch automatically. The table below has the right
URL for every OES document type, current as of the versions in this repo:

| Document | `$schema` URL |
|---|---|
| `course.json` / `module.json` / `lesson.json` | `https://oes.inklyre.org/schemas/ocf/v0.3.0/course.schema.json` |
| `set.json` | `https://oes.inklyre.org/schemas/opf/v0.2.0/set.schema.json` |
| `question.json` | `https://oes.inklyre.org/schemas/oqf/v0.1.0/question.schema.json` |
| `stimulus.json` | `https://oes.inklyre.org/schemas/oqf/v0.1.0/stimulus.schema.json` |
| `article.json` | `https://oes.inklyre.org/schemas/oaf/v0.1.0/article.schema.json` |
| `video.json` | `https://oes.inklyre.org/schemas/ovf/v0.1.0/video.schema.json` |
| `resource.json` | `https://oes.inklyre.org/schemas/orf/v0.1.0/resource.schema.json` |

## Option 2: a workspace `.vscode/settings.json`

If you'd rather not touch every document, or you're editing files an
importer already generated, map filenames to schemas once per workspace
instead:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["course.json", "module.json", "lesson.json"],
      "url": "https://oes.inklyre.org/schemas/ocf/v0.3.0/course.schema.json"
    },
    {
      "fileMatch": ["set.json"],
      "url": "https://oes.inklyre.org/schemas/opf/v0.2.0/set.schema.json"
    },
    {
      "fileMatch": ["question.json"],
      "url": "https://oes.inklyre.org/schemas/oqf/v0.1.0/question.schema.json"
    },
    {
      "fileMatch": ["stimulus.json"],
      "url": "https://oes.inklyre.org/schemas/oqf/v0.1.0/stimulus.schema.json"
    },
    {
      "fileMatch": ["article.json"],
      "url": "https://oes.inklyre.org/schemas/oaf/v0.1.0/article.schema.json"
    },
    {
      "fileMatch": ["video.json"],
      "url": "https://oes.inklyre.org/schemas/ovf/v0.1.0/video.schema.json"
    },
    {
      "fileMatch": ["resource.json"],
      "url": "https://oes.inklyre.org/schemas/orf/v0.1.0/resource.schema.json"
    }
  ]
}
```

Drop this at `.vscode/settings.json` in your course repo. It's
workspace-scoped, so mapping a filename this generic to a schema is safe
here — it only ever applies inside your own OES repo, unlike a global,
editor-wide association.

::: tip Why not a global mapping via schemastore.org?
[SchemaStore](https://www.schemastore.org/) is the community catalog most
editors ship with built in, so a listed schema needs no configuration at
all, anywhere. OES's document filenames (`course.json`, `lesson.json`,
`article.json`, `video.json`, `resource.json`, `set.json`,
`question.json`) are exactly the kind of generic name SchemaStore's own
[contribution guidelines](https://github.com/SchemaStore/schemastore/blob/master/CONTRIBUTING.md)
warn against — a global filename association that generic risks
misfiring on some unrelated project's own `lesson.json`. The two options
above give the same validation and autocomplete without that risk, since
both are scoped to files that actually opt in (`$schema`) or to your own
workspace (`.vscode/settings.json`).
:::

## Pinning to a version

The URLs above track the current schema version for each spec. If you
need to pin to a specific past minor version instead (e.g. while
migrating), point at that version's path directly — every version this
repo has ever shipped stays live under `schemas/{spec}/v{version}/`, e.g.
[`schemas/ocf/v0.2.0/course.schema.json`](/schemas/ocf/v0.2.0/course.schema.json).

## See also

[Versioning & Conformance](/conformance) for what a `0.x.x` patch is and
isn't allowed to change, and each spec's own **Schema Reference** page
(e.g. [OCF's](/specs/ocf/schema-reference)) for the full field list.
