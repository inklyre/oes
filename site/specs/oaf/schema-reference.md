# Schema Reference

Machine-readable JSON Schema (draft-07):

- `article.json` → [`schemas/oaf/v0.1.0/article.schema.json`](/oes/schemas/oaf/v0.1.0/article.schema.json)

## `article.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `oaf_version` | string | **yes** | Any `0.1.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `id` | string | **yes** | Kebab-case. Matches the article's folder name when co-located via `path`. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Short summary/dek shown before opening the article. |
| `authors` | string[] | no | GitHub usernames of the authors. |
| `license` | string | no | SPDX identifier, e.g. `"CC-BY-4.0"`. An article can be reused independently of any lesson, so it needs its own license. |
| `status` | string | no | One of `"draft"`, `"published"`, `"deprecated"`. Absent means published. |
| `tags` | string[] | no | Free-form tags. |
| `language` | string | no | BCP 47 language tag, e.g. `"en"`. |
| `estimated_mins` | number | no | Estimated reading time. |
| `references` | array | no | Cited sources — what this article is based on. See below. |
| `related` | array | no | Suggested material for a learner who wants to go further. See below. |
| `source` | object | no | Where this article was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |

`references[]` entries — each entry is either a bare URL string (the
simple case) or a richer object, needed for a source with no single URL:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | **yes** (object form only) | The source's title. |
| `type` | string | no | One of `"article"`, `"book"`, `"paper"`, `"video"`, `"website"`, `"dataset"`, `"other"`. Defaults to `"website"`. |
| `authors` | string[] | no | The source's authors. |
| `url` | string | no | Where to find it online. Omit for a source with no online location, e.g. a print-only book. |
| `isbn` | string | no | For `type: "book"`. |
| `doi` | string | no | For `type: "paper"`. |
| `publisher` | string | no | |
| `year` | integer | no | |
| `note` | string | no | Why this source is included. |

`related[]` entries — same shape as [OCF lesson's `related[]`](/specs/ocf/schema-reference#lessonjson),
reused here so an individual article can suggest its own further material
(a related video, a recommended book) independent of whatever lesson
references it. See that page for the full field table.

For a citation or suggestion that's just a passing mention, an ordinary
Markdown link inside `content.md` remains the simplest option — reach for
`references`/`related` when you want the pointer to be structured data a
consuming app can render as its own section (a "Sources" or "Watch Next"
list), not just prose.

## Validating

```bash
ajv validate -s schemas/oaf/v0.1.0/article.schema.json \
  -d "my-articles/*/article.json"
```

## Extension fields

Any field matching `^x_[a-z0-9_]+$` is permitted anywhere in `article.json`
and is intentionally left unvalidated by the core schema. See
[Extensions](./extensions).
