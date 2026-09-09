# OCF — Open Course Format

**Version 0.2.0 · Status: Draft · License: CC0 1.0**

Part of [OES — Open Education Standards](https://inklyre.github.io/oes/).

## Table of contents

1. Overview and Philosophy
2. File Structure
3. `course.json` Reference
4. `module.json` Reference
5. `lesson.json` Reference
6. Extension Mechanism
7. JSON Schema
8. Full Worked Example
9. Migrating from v0.1.0

---

## 1. Overview and Philosophy

OCF (Open Course Format) structures a course — a sequence of modules and
lessons — as static files. A course owns no content of its own beyond
sequencing: a course sequences modules, a module sequences lessons, and a
lesson is itself a collection of the content types OES defines —
[OAF](https://inklyre.github.io/oes/specs/oaf/) articles,
[OVF](https://inklyre.github.io/oes/specs/ovf/) video lessons, and
[OPF](https://inklyre.github.io/oes/specs/opf/) practice sets —
referenced rather than owned.

Philosophy: static files, not a database; git-native; no database required;
every level is pure sequencing (as of v0.2.0, a lesson holds no prose of
its own — its content *is* the articles/video-lessons/practice-sets it
references); composes with OAF/OVF/OPF without duplicating their content.

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

There is deliberately no `content.md` directly on a lesson — see the
Migrating section below for how v0.1.0 lessons convert.

## 3. `course.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `ocf_version` | string | yes | Any `0.2.x` patch — see Versioning & Conformance on the docs site. |
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

## 4. `module.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `ocf_version` | string | yes | Any `0.2.x` patch. |
| `id` | string | yes | |
| `title` | string | yes | |
| `description` | string | no | |
| `estimated_mins` | number | no | Same unit as `course.estimated_mins`/`lesson.estimated_mins`. |
| `outcomes` | string[] | no | Same convention as `course.outcomes`, at module granularity. |
| `lessons` | object[] | yes | Ordered, ≥1. `{id, path}`. |

## 5. `lesson.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `ocf_version` | string | yes | Any `0.2.x` patch. |
| `id` | string | yes | |
| `title` | string | yes | |
| `description` | string | no | |
| `estimated_mins` | number | no | |
| `articles` | object[] | no | `{id, title?, path\|article_url, content_hash?, required?}` |
| `video_lessons` | object[] | no | `{id, title?, path\|video_lesson_url, content_hash?, required?}` |
| `practice_sets` | object[] | no | `{id, title?, path\|set_url, content_hash?, required?}` — as of this pass, co-located `path` is supported like articles/video_lessons (previously `set_url`-only). |
| `related` | object[] | no | Suggested supplementary material, not this lesson's own content: `{title, type, path\|video_lesson_url\|article_url\|set_url\|course_url\|url, content_hash?, note?}` — `type` is one of `"video"`/`"article"`/`"book"`/`"course"`/`"practice_set"`/`"file"`/`"link"`/`"other"`, exactly one address field. See the warning below. |

## 6. Extension Mechanism

Same `x_` mechanism as every OES spec, shared registry at
`extensions/registry.md`, across OCF/OPF/OQF/OAF/OVF.

## 7. JSON Schema

Full schema: `schemas/ocf/v0.2.0/course.schema.json` (3 `definitions` +
root `oneOf`, same structure as v0.1.0). Articles and video lessons are
validated separately against OAF's and OVF's own schemas.

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
  "ocf_version": "0.2.0",
  "id": "intro-to-python",
  "title": "Introduction to Python",
  "modules": [
    { "id": "getting-started", "path": "modules/getting-started" }
  ]
}
```

```json
{
  "ocf_version": "0.2.0",
  "id": "setup",
  "title": "Setting Up Python",
  "estimated_mins": 10,
  "articles": [{ "id": "main", "path": "articles/main" }],
  "video_lessons": [{ "id": "install-python", "path": "video-lessons/install-python" }],
  "related": [
    { "type": "link", "title": "Official Python downloads", "url": "https://www.python.org/downloads/" },
    { "type": "video", "title": "A different explanation on YouTube", "url": "https://www.youtube.com/watch?v=example" }
  ]
}
```

**`related[]` is for suggestions, never for this lesson's own content.**
A `video_lessons[]`/`articles[]` entry *is* the lesson; a `related[]`
entry is something the lesson merely points at for a learner who wants
more. The schema can't enforce this distinction — it's a modeling
discipline, not a validation rule.

See the [full Examples page](https://inklyre.github.io/oes/specs/ocf/examples)
on the docs site for the complete six-lesson course.

## 9. Migrating from v0.1.0

1. Bump `ocf_version` to `"0.2.0"` everywhere.
2. Turn each lesson's old `content.md` into a co-located article:
   `lessons/{id}/articles/main/{article.json, content.md}`, add
   `{ "id": "main", "path": "articles/main" }` to `articles[]`.
3. For a pre-v0.2.0 lesson-level resource entry with `type: "video"`/
   `"article"` that was actually the lesson's own content (not a
   suggestion): turn it into a real `video_lessons[]`/`articles[]` entry
   instead (co-located or external `video.json`/`article.json`, writing
   real prose for articles rather than just relocating the pointer).
4. Rename the field from `resources` to `related` and move everything
   else into it as-is — `"file"`/`"link"` entries, and any `"video"`/
   `"article"` entry that was always meant as a suggestion. `related[]`'s
   type enum also gained `"book"`/`"course"`/`"practice_set"`/`"other"`
   and OES-native `path`/`*_url` addressing — see the field table above.
