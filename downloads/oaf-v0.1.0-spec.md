# OAF — Open Article Format

**Version 0.1.0 · Status: Draft · License: CC0 1.0**

Part of [OES — Open Education Standards](https://inklyre.github.io/oes/).

## Table of contents

1. Overview and Philosophy
2. File Structure
3. `article.json` Reference
4. Extension Mechanism
5. Authoring Guidance
6. JSON Schema
7. Worked Example

---

## 1. Overview and Philosophy

OAF (Open Article Format) is an open specification for a single written
article — the actual prose a learner reads, stored as static files. It's
real authored content: a title plus a Markdown file, not a link to
something hosted elsewhere. An article can be written for one specific
[OCF](https://inklyre.github.io/oes/specs/ocf/) lesson, or authored once
and referenced from several lessons across different courses.

If an article needs to point at something else on the web for further
reading, that's an ordinary Markdown link *inside* the prose — OAF
deliberately has no separate structured field for "here's a link." That
shallow shape is what OCF used to do before OAF existed, and what OAF
replaces.

## 2. File Structure

```
{article-root}/
├── article.json
├── content.md
└── assets/            (optional)
```

Co-located (common case) — inside an OCF lesson's own folder, under
`articles/{id}/`. Standalone/shared — its own repo, referenced by
`article_url` from any number of lessons.

## 3. `article.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `oaf_version` | string | yes | Any `0.1.x` patch — see Versioning & Conformance on the docs site. |
| `id` | string | yes | Kebab-case. |
| `title` | string | yes | |
| `description` | string | no | Short summary/dek. |
| `authors` | string[] | no | |
| `license` | string | no | SPDX identifier, e.g. `"CC-BY-4.0"` — an article can be reused independently of any lesson. |
| `status` | string | no | `"draft"`/`"published"`/`"deprecated"`. Absent means published. |
| `tags` | string[] | no | |
| `language` | string | no | BCP 47. |
| `estimated_mins` | number | no | Estimated reading time. |
| `references` | array | no | Cited sources — each entry a bare URL string, or `{title, type?, authors?, url?, isbn?, doi?, publisher?, year?, note?}` for a source with no single URL (e.g. a print book via `isbn`). |
| `related` | array | no | Suggested material for a learner who wants to go further — same shape as OCF lesson's `related[]` (see that section): `{title, type, path\|video_lesson_url\|article_url\|set_url\|course_url\|url, content_hash?, note?}`. |

`content.md` is pure Markdown prose — no frontmatter, no metadata. For a
citation or suggestion that's just a passing mention, an ordinary Markdown
link inside `content.md` remains simplest; reach for `references`/
`related` when you want it as structured data a consumer can render as
its own section.

## 4. Extension Mechanism

Same `x_` mechanism as every OES spec, shared registry at
`extensions/registry.md`.

## 5. Authoring Guidance

Open with what the reader will be able to do or understand after reading.
Use headings for anything longer than a few paragraphs. Place links at the
point where they're relevant in the prose, not collected in a footer.
Prefer several focused articles over one long one when a topic naturally
splits into revisitable sub-topics. `estimated_mins` should reflect a
careful first read (~200-250 wpm for technical prose with code examples),
slower for dense/mathematical content.

## 6. JSON Schema

Full schema: `schemas/oaf/v0.1.0/article.schema.json`.

## 7. Worked Example

```
variables-and-types/
├── article.json
└── content.md
```

`content.md`:
```markdown
Python variables don't need a declared type — the type is inferred from the
value you assign. Use `type(x)` to check a value's type at any point. See
the [official documentation](https://docs.python.org/3/library/stdtypes.html)
for the full list of built-in types.
```

`article.json`:
```json
{
  "oaf_version": "0.1.0",
  "id": "variables-and-types",
  "title": "Variables and Types",
  "description": "Python's core built-in types and how variables work.",
  "authors": ["ankit-ksh"],
  "tags": ["python", "fundamentals"],
  "language": "en",
  "estimated_mins": 5
}
```
