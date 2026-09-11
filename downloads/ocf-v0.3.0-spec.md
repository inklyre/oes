# OCF — Open Course Format

**Version 0.3.0 · Status: Draft · License: CC BY 4.0**

Part of [OES — Open Education Standards](https://oes.inklyre.org/).

## Table of contents

1. Overview and Philosophy
2. File Structure
3. `course.json` Reference
4. `module.json` Reference
5. `lesson.json` Reference
6. Extension Mechanism
7. JSON Schema
8. Full Worked Example
9. Migrating from v0.2.0

---

## 1. Overview and Philosophy

OCF (Open Course Format) structures a course — a sequence of modules,
lessons, and items — as static files. A course owns no content of its
own beyond sequencing: a course sequences modules, a module sequences
lessons, and a lesson sequences items — a lesson is a collection of
items, and an item is the actual content: an
[OAF](https://oes.inklyre.org/specs/oaf/) article, an
[OVF](https://oes.inklyre.org/specs/ovf/) video lesson, or an
[OPF](https://oes.inklyre.org/specs/opf/) practice set —
referenced rather than owned.

Philosophy: static files, not a database; git-native; no database
required; every level is pure sequencing (a lesson holds no prose of its
own — its content *is* the ordered `items[]` it references); composes
with OAF/OVF/OPF without duplicating their content.

`course → module → lesson → item` is the full, four-level hierarchy.
Before v0.3.0, a lesson held three separately-ordered arrays
(`articles[]`/`video_lessons[]`/`practice_sets[]`), which meant a lesson
couldn't express how those types interleave — "watch this video, then
read this article, then try this quiz" had no way to be said as one
sequence. `items[]` fixes that: one ordered array, each entry
discriminated by `type`.

## 2. File Structure

```
my-course/
├── course.json
└── modules/
    └── {module-id}/
        ├── module.json
        └── lessons/
            └── {lesson-id}/
                ├── lesson.json
                ├── articles/{id}/            (optional, co-located)
                │   ├── article.json
                │   └── content.md
                └── video-lessons/{id}/        (optional, co-located)
                    └── video.json
```

There is deliberately no `content.md` directly on a lesson — a lesson's
written content is one or more `type: "article"` items.

## 3. `course.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `ocf_version` | string | yes | Any `0.3.x` patch — see Versioning & Conformance on the docs site. |
| `id` | string | yes | |
| `title` | string | yes | |
| `description` | string | no | |
| `authors` | string[] | no | |
| `license` | string | no | |
| `status` | string | no | `"draft"`/`"published"`/`"deprecated"`. Absent means published. |
| `tags` | string[] | no | |
| `language` | string | no | |
| `level` | string | no | `"beginner"`/`"intermediate"`/`"advanced"`. |
| `estimated_mins` | number | no | Same unit as `module.estimated_mins`/`lesson.estimated_mins`. |
| `outcomes` | string[] | no | What a learner will be able to do after completing this course — distinct from `description`, a general summary. Purely descriptive, not machine-checked. |
| `modules` | object[] | yes | Ordered, ≥1. `{id, path}`. |
| `prerequisites` | object[] | no | `{id, course_url, content_hash?}`. |
| `source` | object | no | Where this course was originally sourced/adapted from, if imported. See Versioning & Conformance's Content Provenance section. |

## 4. `module.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `ocf_version` | string | yes | Any `0.3.x` patch. |
| `id` | string | yes | |
| `title` | string | yes | |
| `description` | string | no | |
| `estimated_mins` | number | no | Same unit as `course.estimated_mins`/`lesson.estimated_mins`. |
| `outcomes` | string[] | no | Same convention as `course.outcomes`, at module granularity. |
| `lessons` | object[] | yes | Ordered, ≥1. `{id, path}`. |
| `source` | object | no | Same as `course.source`. |

## 5. `lesson.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `ocf_version` | string | yes | Any `0.3.x` patch. |
| `id` | string | yes | |
| `title` | string | yes | |
| `description` | string | no | |
| `estimated_mins` | number | no | |
| `items` | object[] | no | Ordered — the actual sequence a learner goes through. Each entry is `{type, id, title?, path\|<type-specific>_url, content_hash?, required?}`, where `type` is `"article"` (address field `article_url`), `"video"` (`video_lesson_url`), `"practice_set"` (`set_url`), or `"resource"` (`resource_url`, an ORF reference document — a PDF/ebook/paper). `id` is unique across the whole array, not per-type. |
| `related` | object[] | no | Suggested supplementary material, not this lesson's own content: `{title, type, path\|video_lesson_url\|article_url\|set_url\|course_url\|url, content_hash?, note?}` — `type` is one of `"video"`/`"article"`/`"book"`/`"course"`/`"practice_set"`/`"file"`/`"link"`/`"other"`, exactly one address field. See the warning below. |
| `source` | object | no | Same as `course.source`. |

## 6. Extension Mechanism

Same `x_` mechanism as every OES spec, shared registry at
`extensions/registry.md`, across OCF/OPF/OQF/OAF/OVF.

## 7. JSON Schema

Full schema: `schemas/ocf/v0.3.0/course.schema.json` (3 `definitions` +
root `oneOf`, same structure as prior versions, plus a `lesson_item`
definition for `items[]`'s discriminated shape). Articles, video lessons,
and practice sets are validated separately against OAF's, OVF's, and
OPF's own schemas.

## 8. Full Worked Example

```
intro-to-python/
├── course.json
└── modules/
    ├── getting-started/
    │   ├── module.json
    │   └── lessons/
    │       └── setup/
    │           ├── lesson.json
    │           ├── articles/main/{article.json,content.md}
    │           └── video-lessons/install-python/video.json
    └── ...
```

```json
{
  "ocf_version": "0.3.0",
  "id": "intro-to-python",
  "title": "Introduction to Python",
  "modules": [
    { "id": "getting-started", "path": "modules/getting-started" }
  ]
}
```

```json
{
  "ocf_version": "0.3.0",
  "id": "setup",
  "title": "Setting Up Python",
  "estimated_mins": 10,
  "items": [
    { "type": "video", "id": "install-python", "path": "video-lessons/install-python" },
    { "type": "article", "id": "main", "path": "articles/main" }
  ],
  "related": [
    { "type": "link", "title": "Official Python downloads", "url": "https://www.python.org/downloads/" },
    { "type": "video", "title": "A different explanation on YouTube", "url": "https://www.youtube.com/watch?v=example" }
  ]
}
```

**`related[]` is for suggestions, never for this lesson's own content.**
An `items[]` entry *is* the lesson; a `related[]` entry is something the
lesson merely points at for a learner who wants more. The schema can't
enforce this distinction — it's a modeling discipline, not a validation
rule.

See the [full Examples page](https://oes.inklyre.org/specs/ocf/examples)
on the docs site for the complete six-lesson course.

## 9. Migrating from v0.2.0

1. Bump `ocf_version` to `"0.3.0"` everywhere.
2. In each `lesson.json`, replace the three separate `articles[]`/
   `video_lessons[]`/`practice_sets[]` arrays with one `items[]` array,
   adding `"type": "article"`/`"video"`/`"practice_set"` to each existing
   entry and placing them in the order a learner should actually go
   through them.
