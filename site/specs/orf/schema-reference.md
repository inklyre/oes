# Schema Reference

Machine-readable JSON Schema (draft-07):

- `resource.json` → [`schemas/orf/v0.1.0/resource.schema.json`](/oes/schemas/orf/v0.1.0/resource.schema.json)

## `resource.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `orf_version` | string | **yes** | Any `0.1.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `id` | string | **yes** | Kebab-case. Matches the resource's folder name when co-located via `path`. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | |
| `document_url` | string (uri) | **yes** | Where the document is actually hosted. Always the canonical source. |
| `page_count` | integer | no | |
| `authors` | string[] | no | GitHub usernames. A resource can be reused independently of any lesson, so it needs its own attribution. |
| `license` | string | no | SPDX identifier. Describes the resource's own metadata (title, description, table of contents) — does not by itself grant redistribution rights to the underlying file; see `downloadable`. |
| `status` | string | no | One of `"draft"`, `"published"`, `"deprecated"`. Absent means published. |
| `tags` | string[] | no | |
| `language` | string | no | Primary written language, BCP 47 tag. |
| `toc` | object[] | no | Table of contents — page-anchored sections. Ordered list of `{ label, page }`. |
| `downloadable` | boolean | no, default `false` | Whether `document_url`'s file may be downloaded and bundled into an exported/portable package. Only `true` when you hold redistribution rights — never for a third-party-hosted file. See [Offline & Portable Packages](./file-structure#offline-portable-packages) and [Security Considerations](/conformance#security-considerations). |
| `local_path` | string | no | Filename (no subdirectories) of a locally-bundled copy, one of `.pdf`/`.epub`, populated by tooling (not hand-authored) once a `downloadable: true` resource has actually been fetched. Entirely optional — most `resource.json` files never have this. See [Offline & Portable Packages](./file-structure#offline-portable-packages). |
| `references` | array | no | Cited sources — papers, books, or sites this document's content is based on. See below. |
| `related` | array | no | Suggested material for a learner who wants to go further after this specific resource. See below. |
| `source` | object | no | Where this resource was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |

`toc[]` entries:

| Field | Type | Required | Description |
|---|---|---|---|
| `label` | string | **yes** | Section title, e.g. `"3.1 Base cases"`. |
| `page` | integer | **yes** | The page this section starts on (1-indexed). |

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

`related[]` entries — suggested material, not this resource's own content:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | **yes** | Human-readable title. |
| `type` | string | **yes** | One of `"video"`, `"article"`, `"book"`, `"course"`, `"practice_set"`, `"resource"`, `"file"`, `"link"`, `"other"`. |
| `path` | string | one of the seven below | Path, relative to this `resource.json`, to co-located OES content this entry points at. |
| `video_lesson_url` / `article_url` / `set_url` / `course_url` / `resource_url` | string | one of the seven | Full URL to that OES document type, hosted separately. |
| `url` | string | one of the seven | For material that isn't OES content at all. Exactly one of `path`/`video_lesson_url`/`article_url`/`set_url`/`course_url`/`resource_url`/`url` must be present. |
| `content_hash` | string | no | `sha256-{hex}`, meaningful only alongside one of the `*_url` fields. |
| `note` | string | no | Why this is suggested. |

## Validating

```bash
ajv validate -s schemas/orf/v0.1.0/resource.schema.json \
  -d "my-resources/*/resource.json"
```

## Extension fields

Any field matching `^x_[a-z0-9_]+$` is permitted anywhere in
`resource.json` and is intentionally left unvalidated by the core
schema. See [Extensions](./extensions).
