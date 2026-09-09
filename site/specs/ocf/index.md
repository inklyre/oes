# OCF — Open Course Format

<div class="ocf-badges">

**Version:** 0.3.0 &nbsp;·&nbsp; **Status:** Draft &nbsp;·&nbsp; **License:** CC BY 4.0

<a class="ocf-download-btn" href="/oes/downloads/ocf-v0.3.0-spec.md" download>⬇ Download full spec (single Markdown file)</a>

</div>

## What is OCF?

OCF (Open Course Format) is an open specification for structuring a course
— a sequence of modules, lessons, and items — as **static files** in a git
repository. A course owns no content of its own beyond sequencing: a
course sequences modules, a module sequences lessons, and a lesson
sequences items — a lesson is a collection of items, and an item is the
actual content: an [OAF](/specs/oaf/) article, an [OVF](/specs/ovf/) video
lesson, an [OPF](/specs/opf/) practice set, or an [ORF](/specs/orf/)
reference document, referenced rather than owned. Course content and
lesson content can be authored, hosted, and versioned independently while
still composing into one learning experience.

## Philosophy

- **Static files, not a database.** A course is a folder of `.json` and
  `.md` files, structured hierarchically: course → module → lesson → item.
- **Git-native.** The same clone/edit/commit/push workflow as every other
  OES spec.
- **No database required.** Nothing about OCF requires a backend to author
  or serve — any static file host works.
- **Every level is pure sequencing.** A course doesn't hold prose, a module
  doesn't hold prose, and neither does a lesson. A lesson's actual content
  is the ordered `items[]` it references — one explicit sequence mixing
  articles, video lessons, practice sets, and reference documents in
  whatever order they should be presented, not a separate,
  independently-ordered array per type — the same "compose, don't own"
  pattern all the way down.
- **Composes with OAF, OVF, OPF, and ORF.** A lesson's items reference
  articles, video lessons, practice sets, and reference documents by URL
  (or co-locate them, when they're written specifically for that lesson).
  The course doesn't own or duplicate any of that content — it links to
  it, so each piece can be
  updated or reused across many lessons and courses independently.

## The hierarchy

```
my-course/
└── course.json
    modules/
    └── {module-id}/
        └── module.json
            lessons/
            └── {lesson-id}/
                └── lesson.json
                    articles/{id}/            (optional — co-located)
                    video-lessons/{id}/        (optional — co-located)
```

| File | Purpose |
|---|---|
| `course.json` | Entry point. Course metadata and the ordered list of modules. |
| `module.json` | Module metadata and the ordered list of lessons within it. |
| `lesson.json` | Lesson metadata and its ordered `items[]` — the articles, video lessons, practice sets, and reference documents a learner actually goes through, plus lightweight `related` resources. |

Continue to [Getting Started](./getting-started) to build your first
course, or jump to the [Schema Reference](./schema-reference) for the full
field-by-field spec.

## Pages in this spec

- [Getting Started](./getting-started) — build a minimal course in five minutes
- [File Structure](./file-structure) — directory layout and naming rules
- [Schema Reference](./schema-reference) — full field-by-field reference
- [Extensions](./extensions) — the `x_` namespace mechanism
- [Examples](./examples) — a complete, worked course

<style>
.ocf-badges { margin-bottom: 24px; }
.ocf-download-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white) !important;
  font-weight: 600;
  text-decoration: none !important;
}
.ocf-download-btn:hover { background: var(--vp-c-brand-2); }
</style>
