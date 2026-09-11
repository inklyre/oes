# Schema Reference

Machine-readable JSON Schema (draft-07):

- `package.json` → [`schemas/opk/v0.1.0/package.schema.json`](/schemas/opk/v0.1.0/package.schema.json)

## `package.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `opk_version` | string | **yes** | Any `0.1.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `name` | string | **yes** | `{namespace}/{package}`, both kebab-case — e.g. `"acme/databases"`. The namespace is what a registry grants ownership of; OPK takes no position on how. |
| `version` | string | **yes** | [SemVer](https://semver.org/) for the package's *content*, independent of every spec version inside it. See [Versioning a package](./file-structure#versioning-a-package). |
| `entry` | object | **yes** | The document a consumer opens first: `{ "type": "course" \| "set" \| "article" \| "video" \| "resource", "path": "course.json" }`. Named explicitly so no consumer has to guess or probe. |
| `title` | string | **yes** | Human-readable name, for a listing. |
| `description` | string | no | One or two sentences, for a listing. |
| `authors` | string[] | no | GitHub usernames. |
| `license` | string | no | SPDX identifier. Strongly recommended on anything published — content with no stated license is content nobody can safely reuse. |
| `tags` | string[] | no | Free-form, for discovery. |
| `language` | string | no | BCP 47 tag for the content's primary language. |
| `oes_version` | string | no | The [OES release](/conformance#the-oes-release-version) this package was authored against, e.g. `"0.2.0"`. Lets a consumer check compatibility once instead of inspecting every document's own version field. |
| `requires` | object | no | Profiles a consumer must implement to render this package — `{ "profiles": ["Core", "+Practice"] }`. See [Conformance profiles](/conformance#conformance-profiles). A consumer that doesn't implement them SHOULD refuse rather than render partially. |
| `dependencies` | object | no | `{ "{namespace}/{package}": "{semver range}" }` — other packages this one needs. A release range, not a location. |
| `digest` | string | no | `sha256-{hex}` over the package's contents. See [Integrity](./file-structure#integrity). Absent while authoring; a registry SHOULD require it on publish. |
| `files` | object[] | no | The manifest: `{path, sha256, bytes}` per file. Absent while authoring; a registry SHOULD require it on publish, since it is what makes `digest` reproducible and lets a consumer verify a partial fetch. |
| `source` | object | no | Where this package was originally sourced or adapted from — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |

## Example

```json
{
  "$schema": "https://oes.inklyre.org/schemas/opk/v0.1.0/package.schema.json",
  "opk_version": "0.1.0",
  "name": "acme/databases",
  "version": "2.1.0",
  "title": "Databases: From Tables to Transactions",
  "description": "A one-semester introduction to relational databases.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "language": "en",
  "tags": ["databases", "sql"],
  "oes_version": "0.2.0",
  "entry": { "type": "course", "path": "course.json" },
  "requires": { "profiles": ["Core", "+Practice"] },
  "dependencies": { "acme/sql-basics": "^1.2.0" }
}
```

`digest` and `files` are omitted above because they are added at publish
time by whatever packages the directory, not typed by an author.

## Validating

```bash
ajv validate -s schemas/opk/v0.1.0/package.schema.json -d package.json
```

## Extension fields

Any field matching `^x_[a-z0-9_]+$` is permitted and is intentionally left
unvalidated by the core schema. See [Extensions](/specs/ocf/extensions)
for the shared convention.
