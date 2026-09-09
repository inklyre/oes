# File Structure

## Layout

Every OCF course is a single directory, typically the root of a git
repository:

```
my-course/
├── course.json
└── modules/
    └── {module-id}/
        ├── module.json
        └── lessons/
            └── {lesson-id}/
                ├── lesson.json
                ├── articles/                (optional — co-located articles)
                │   └── {article-id}/
                │       ├── article.json
                │       └── content.md
                └── video-lessons/            (optional — co-located video lessons)
                    └── {video-lesson-id}/
                        └── video.json
```

A course may contain any number of modules, each with any number of
lessons. A lesson may reference any number of articles, video lessons, and
practice sets — co-located under its own folder as shown above, or
external, referenced entirely by URL with no local folder at all.

## Naming rules

| Rule | Detail |
|---|---|
| `module-id` / `lesson-id` format | kebab-case: lowercase letters, digits, and hyphens only. Pattern: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `module-id` uniqueness | Must be unique within the course. |
| `lesson-id` uniqueness | Must be unique within its module. |
| Folder name | A module's/lesson's folder name **must** equal its `id`. |
| `course.json` location | Always at the root of the course. |
| `module.json` location | Always at `modules/{module-id}/module.json`. |
| `lesson.json` location | Always at `modules/{module-id}/lessons/{lesson-id}/lesson.json`. |
| Co-located article/video-lesson folder | Must equal that article's/video lesson's own `id`, per [OAF](/specs/oaf/file-structure)/[OVF](/specs/ovf/file-structure). |

### Folder naming never determines order

Sequence is decided **only** by array order in the parent `.json` file —
`course.modules[]`, `module.lessons[]`, `lesson.items[]` — never by a
folder's name, and never by filesystem/alphabetical listing order. A
folder's name has exactly one constraint: it must equal its content's own
`id`. Nothing about *where* that name sorts affects what a learner sees.

You're free to number folders for your own convenience as an author —
`01-setup/`, `02-variables/` — purely so `ls`/a file browser lists them in
reading order for a human skimming the repo. This is a cosmetic
convention with zero effect on the actual sequence: renaming
`01-setup/` to `setup/`, or to `99-setup/`, changes nothing about
playback order as long as the parent's `path` still points at the right
folder. Don't rely on numbered folders *instead of* getting `items[]`'s
order right — the array is the only thing that matters here.

## File responsibilities

### `course.json`

The entry point. Carries course-level metadata, the ordered list of
modules (order determines the course's module sequence), and optionally a
list of `prerequisites` — other courses, referenced by URL, that a learner
should complete first. See
[Schema Reference](./schema-reference#coursejson).

### `module.json`

Module-level metadata and the ordered list of lessons within it (order
determines the module's lesson sequence). See
[Schema Reference](./schema-reference#modulejson).

### `lesson.json`

Lesson-level metadata (estimated time) and its content: `items` — the
ordered sequence of articles ([OAF](/specs/oaf/) references), video
lessons ([OVF](/specs/ovf/) references), and practice sets
([OPF](/specs/opf/) references) a learner actually goes through, in that
order — and `related` (suggested material beyond this lesson's own
content — a related video, a recommended book, another course). See
[Schema Reference](./schema-reference#lessonjson).

There is deliberately no `content.md` on a lesson as of v0.2.0 — a
lesson's written content is one or more `type: "article"` items. A
lesson that needs just a short paragraph of its own text authors that as
one co-located article, the same ceremony a co-located question or
article already requires elsewhere in OES.

## Path resolution rules

- Every `path` field in `course.json` is relative to `course.json` itself.
- Every `path` field in a `module.json` is relative to that `module.json`
  itself (i.e. relative to the module's own folder).
- Every `path` field in a `lesson.json`'s `items[]` entries is relative to
  that `lesson.json` itself.
- `set_url`, `article_url`, `video_lesson_url`, and `course_url` fields are
  always full absolute URLs, since they typically point at a different
  repository entirely — OES content is not assumed to live alongside
  whatever references it.
