# Schema Reference

Machine-readable JSON Schema (draft-07) is published as a single file
covering all three OCF document types, using `definitions` and a top-level
`oneOf`:

- [`schemas/ocf/v0.3.0/course.schema.json`](/schemas/ocf/v0.3.0/course.schema.json)

Validate a specific file type by pointing your validator at the matching
`#/definitions/...` fragment: `#/definitions/course`,
`#/definitions/module`, or `#/definitions/lesson`. A lesson's items are
validated separately, against [OAF's](/specs/oaf/schema-reference),
[OVF's](/specs/ovf/schema-reference), and [OPF's](/specs/opf/schema-reference)
own schemas — `lesson.json` itself only validates the reference list.

## `course.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `ocf_version` | string | **yes** | Any `0.3.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `id` | string | **yes** | Kebab-case, unique identifier for the course. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Longer description of the course. |
| `authors` | string[] | no | GitHub usernames of the authors. |
| `license` | string | no | SPDX license identifier. |
| `status` | string | no | One of `"draft"`, `"published"`, `"deprecated"`. Absent means published. |
| `tags` | string[] | no | Free-form tags for discovery. |
| `language` | string | no | BCP 47 language tag, e.g. `"en"`. |
| `level` | string | no | One of `"beginner"`, `"intermediate"`, `"advanced"`. |
| `estimated_mins` | number | no | Estimated total time to complete the course. Same unit as `module.estimated_mins`/`lesson.estimated_mins`, so a consumer can sum either level and get a comparable figure. |
| `outcomes` | string[] | no | What a learner will be able to do after completing this course — distinct from `description`, which is a general summary. Each entry is one outcome statement. Purely descriptive metadata for display; not machine-checked against any content. |
| `modules` | object[] | **yes** | Ordered list. Minimum 1 item. See below. |
| `prerequisites` | object[] | no | Other courses this course depends on. See below. |
| `source` | object | no | Where this course was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |

`modules[]` entries:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | **yes** | Must match the module folder name. |
| `path` | string | **yes** | Path, relative to `course.json`, to the module's folder. |

`prerequisites[]` entries:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | **yes** | Identifier of the prerequisite course. |
| `course_url` | string | **yes** | Full URL to that course's `course.json`. |
| `content_hash` | string | no | `sha256-{hex}` of the referenced `course.json`. See [Content Integrity](/conformance#content-integrity-for-external-references). |

## `module.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `ocf_version` | string | **yes** | Any `0.3.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `id` | string | **yes** | Kebab-case, matches the module's folder name. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Longer description of the module. |
| `estimated_mins` | number | no | Estimated time to complete the module. Same unit as `course.estimated_mins`/`lesson.estimated_mins`. |
| `outcomes` | string[] | no | Same convention as `course.outcomes`, at module granularity. |
| `lessons` | object[] | **yes** | Ordered list. Minimum 1 item. See below. |
| `source` | object | no | Where this module was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |

`lessons[]` entries:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | **yes** | Must match the lesson folder name. |
| `path` | string | **yes** | Path, relative to `module.json`, to the lesson's folder. |

## `lesson.json`

A lesson holds no prose of its own — its content is the ordered sequence
of items it references. `course → module → lesson → item` is the full
hierarchy: a lesson is a collection of items, and an item is the actual
video, article, practice set, or reference document ([ORF](/specs/orf/)).

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `ocf_version` | string | **yes** | Any `0.3.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `id` | string | **yes** | Kebab-case, matches the lesson's folder name. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Longer description of the lesson. |
| `estimated_mins` | number | no | Estimated time to complete the lesson. |
| `items` | object[] | no | Ordered list — the actual sequence a learner goes through: a video, then an article, then a practice set, in whatever order the array says. This is a lesson's entire content. See below. |
| `related` | object[] | no | Suggested material for a learner who wants to go further — a related video, a recommended book, another course. See below. |
| `source` | object | no | Where this lesson was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |

`items[]` entries — discriminated by `type`. All four variants share
`id`/`title`/`content_hash`/`required`; only the address field(s) differ:

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | **yes** | One of `"article"`, `"video"`, `"practice_set"`, `"resource"` — which of the four shapes below this entry is. |
| `id` | string | **yes** | Stable identifier within the lesson, unique across the whole `items[]` array regardless of type. Matches the referenced content's folder name when `path` is used. |
| `title` | string | no | Optional display label, mainly useful for `*_url` entries. |
| `path` | string | one of `path`/`*_url` | Path, relative to `lesson.json`, to co-located content. |
| `article_url` | string | `type: "article"` only, one of `path`/`article_url` | Full URL to an `article.json` hosted separately. |
| `video_lesson_url` | string | `type: "video"` only, one of `path`/`video_lesson_url` | Full URL to a `video.json` hosted separately. |
| `set_url` | string | `type: "practice_set"` only, one of `path`/`set_url` | Full URL to a `set.json` hosted separately. |
| `resource_url` | string | `type: "resource"` only, one of `path`/`resource_url` | Full URL to a [ORF](/specs/orf/) `resource.json` hosted separately. |
| `content_hash` | string | no | `sha256-{hex}` of the referenced document, meaningful only alongside the `*_url` field. See [Content Integrity](/conformance#content-integrity-for-external-references). |
| `required` | boolean | no, default `false` | Whether this item is required to complete the lesson. |

Example — a video, then a reading, then a check-for-understanding quiz,
then a reference PDF, in that order:

```json
"items": [
  { "type": "video", "id": "intro-video", "path": "videos/intro" },
  { "type": "article", "id": "background-reading", "path": "articles/background" },
  { "type": "practice_set", "id": "check-understanding", "path": "sets/quiz-1" },
  { "type": "resource", "id": "cheat-sheet", "path": "resources/cheat-sheet" }
]
```

Use `type: "resource"` for a document you don't own or render as prose —
a PDF, an ebook chapter, a paper. A genuine written article you're
authoring for this lesson always belongs in `type: "article"` (OAF)
instead — see [ORF](/specs/orf/) for when a resource is the right call.

`related[]` entries — suggested material for a learner who wants to go
*beyond* this lesson. This lesson's own content, even a single item,
always belongs in `items[]` above — `related[]` is exclusively for what
the lesson merely points at:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | **yes** | Human-readable title. |
| `type` | string | **yes** | One of `"video"`, `"article"`, `"book"`, `"course"`, `"practice_set"`, `"resource"`, `"file"`, `"link"`, `"other"` — what kind of thing this is, independent of how it's addressed below. |
| `path` | string | one of the six below | Path, relative to `lesson.json`, to co-located OES content (an actual `video.json`/`article.json`/`set.json`/`course.json`) this entry points at. |
| `video_lesson_url` / `article_url` / `set_url` / `course_url` / `resource_url` | string | one of the seven | Full URL to that OES document type, hosted separately — same idiom as `items[]` above, so a consuming app can fetch it and render it richly (real duration, thumbnail, etc). |
| `url` | string | one of the seven | For material that isn't OES content at all — a YouTube video, an external article, a book's product page. Exactly one of `path`/`video_lesson_url`/`article_url`/`set_url`/`course_url`/`resource_url`/`url` must be present. |
| `content_hash` | string | no | `sha256-{hex}`, meaningful only alongside one of the `*_url` fields. |
| `note` | string | no | Why this is suggested, e.g. "if you want a deeper dive into the underlying math." |

## Validating

```bash
npm install -g ajv-cli

ajv validate -s "schemas/ocf/v0.3.0/course.schema.json#/definitions/course" -d course.json
ajv validate -s "schemas/ocf/v0.3.0/course.schema.json#/definitions/module" -d "modules/*/module.json"
ajv validate -s "schemas/ocf/v0.3.0/course.schema.json#/definitions/lesson" -d "modules/*/lessons/*/lesson.json"
ajv validate -s schemas/oaf/v0.1.0/article.schema.json -d "modules/*/lessons/*/articles/*/article.json"
ajv validate -s schemas/ovf/v0.1.0/video.schema.json -d "modules/*/lessons/*/videos/*/video.json"
```

## Extension fields

Any field matching `^x_[a-z0-9_]+$` is permitted anywhere in any of the
three file types and is intentionally left unvalidated by the core schema.
See [Extensions](./extensions).

## Migrating from v0.2.0

1. Bump `ocf_version` to `"0.3.0"` in every `course.json`/`module.json`/`lesson.json`.
2. In each `lesson.json`, replace the three separate `articles[]`/
   `video_lessons[]`/`practice_sets[]` arrays with one `items[]` array,
   adding `"type": "article"`/`"video"`/`"practice_set"` to each existing
   entry and placing them in the order a learner should actually go
   through them — this is the whole point of the change: a lesson's
   content is now one explicit sequence, not three independently-ordered
   buckets that couldn't say how they interleave.

## Migrating from v0.1.0

1. Bump `ocf_version` to `"0.2.0"` in every `course.json`/`module.json`/`lesson.json`
   (then continue with the v0.2.0→v0.3.0 migration above).
2. For each lesson's old `content.md`: turn it into a co-located article —
   create `lessons/{id}/articles/main/` with `article.json` (a title and
   any relevant metadata) and move the prose into `content.md` there. Add
   an `article`-type entry pointing at `articles/main` to the lesson.
3. For each pre-v0.2.0 lesson-level resource entry with `type: "video"` or
   `"article"` that was actually this lesson's own content (not a
   suggestion): turn it into a real item instead — create a
   `video.json`/`article.json` (co-located or external), writing real
   prose for articles rather than just relocating a pointer.
4. Rename the field from `resources` to `related` and move everything
   else into it as-is — `type: "file"`/`"link"` entries, and any
   `"video"`/`"article"` entry that was always meant as a suggestion
   rather than this lesson's own material. `related[]`'s type enum also
   gained `"book"`/`"course"`/`"practice_set"`/`"other"` and OES-native
   `path`/`*_url` addressing alongside the existing `url` — see the field
   table above.
