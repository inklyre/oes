# OQF — Open Question Format

<div class="oqf-badges">

**Version:** 0.1.0 &nbsp;·&nbsp; **Status:** Draft &nbsp;·&nbsp; **License:** CC BY 4.0

<a class="oqf-download-btn" href="/oes/downloads/oqf-v0.1.0-spec.md" download>⬇ Download full spec (single Markdown file)</a>

</div>

## What is OQF?

OQF (Open Question Format) is an open specification for a single question —
a multiple-choice question, a coding exercise, a fill-in-the-blank, an
essay prompt, or any of the [11 supported types](./question-types) — stored
as **static files**. A question is the smallest unit of practice content in
OES, and it's designed to be referenced from more than one place: the
common case is a question that lives alongside the [OPF](/specs/opf/) set
it belongs to, but the same question format also works as a standalone
repo, or as one entry in a shared question bank that many different sets
reference by URL.

## Philosophy

- **Static files, not a database.** A question is a folder of `.json` and
  `.md` files, versionable with git like anything else in OES.
- **Small and self-contained.** Everything needed to render and grade one
  question — its type, its grading configuration, its metadata — lives in
  one `question.json`, next to its prose in `statement.md`.
- **Reusable by design.** Because a question is its own spec rather than a
  concept baked into OPF, it can be authored once and referenced from
  multiple sets — co-located when it's only ever used in one set, or
  hosted independently when it's meant to be shared.
- **Composed by OPF, not owned by it.** OQF says nothing about sets,
  scoring policy across a set, or how many questions make up an
  assessment — that's [OPF](/specs/opf/)'s job. OQF only defines what a
  single question looks like.

## The files that make up a question

```
my-question/
├── question.json
├── statement.md
└── assets/            (optional — images, etc., referenced by question.json)
```

| File | Purpose |
|---|---|
| `question.json` | All structured data for the question: type, grading config, metadata. |
| `statement.md` | The question's prose, as pure Markdown — nothing else. |

Continue to [Getting Started](./getting-started) to build your first
question, or jump straight to the [Schema Reference](./schema-reference) if
you already know the shape of the format.

## Pages in this spec

- [Getting Started](./getting-started) — build a minimal question in five minutes
- [File Structure](./file-structure) — directory layout, naming rules, and the two ways to reference a question
- [Question Types](./question-types) — all 11 supported question types
- [Shared Stimuli](./shared-stimuli) — grouping questions off one shared passage/diagram
- [Schema Reference](./schema-reference) — full field-by-field reference
- [Authoring Guide](./authoring) — best practices for writing good questions
- [Extensions](./extensions) — the `x_` namespace mechanism
- [Examples](./examples) — worked examples across several types

<style>
.oqf-badges { margin-bottom: 24px; }
.oqf-download-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white) !important;
  font-weight: 600;
  text-decoration: none !important;
}
.oqf-download-btn:hover { background: var(--vp-c-brand-2); }
</style>
