# OPF — Open Practice Format

<div class="opf-badges">

**Version:** 0.2.0 &nbsp;·&nbsp; **Status:** Draft &nbsp;·&nbsp; **License:** CC BY 4.0

<a class="opf-download-btn" href="/downloads/opf-v0.3.0-spec.md" download>⬇ Download full spec (single Markdown file)</a>

</div>

## What is OPF?

OPF (Open Practice Format) is an open specification for a **practice
set** — an ordered collection of questions plus set-level metadata (title,
description, authors, license, tags), stored entirely as **static files**
in a git repository. OPF doesn't define what a question looks like — that's
[OQF (Open Question Format)](/specs/oqf/)'s job — it defines how questions
are assembled, scored, and shipped together as one assessable unit. There is
no required database, no required server, and no required authentication
system.

## Philosophy

- **Static files, not a database.** A set is a `set.json` file, versionable
  with git, reviewable with pull requests, and diffable like code.
- **Git-native.** Authoring workflow is: clone, edit, commit, push. History,
  blame, and branches all work exactly the way they do for code.
- **Composes with OQF, doesn't own it.** A set is a thin wrapper: it lists
  which questions belong to it and how much each is worth, but the
  questions themselves — their type, statement, grading configuration — are
  [OQF](/specs/oqf/) documents. A set's questions can be co-located
  (written specifically for this set) or pulled in by URL from a shared
  question bank, and either way, the set never duplicates their content.
- **Auth-agnostic.** OPF says nothing about who is allowed to see or submit
  a set. That's the hosting platform's job, not the format's.
- **LMS never stores the content.** An LMS integrates with OPF by storing a
  single URL pointing to a set's `set.json`. It fetches questions on demand.
  Update the source repo, and every LMS that links to it sees the update
  immediately — no sync, no re-import.

## The file that makes up a set

```
my-practice-set/
├── set.json
└── questions/                     (optional — only for co-located questions)
    └── {question-id}/
        ├── question.json
        └── statement.md
```

| File | Purpose |
|---|---|
| `set.json` | Entry point. Set-level metadata and the ordered list of questions, each referenced either by a co-located `path` or an external `question_url`. |

A set's questions are [OQF](/specs/oqf/) documents — see that spec for
`question.json` and `statement.md`.

Continue to [Getting Started](./getting-started) to build your first set, or
jump straight to the [Schema Reference](./schema-reference) if you already
know the shape of the format.

## Pages in this spec

- [Getting Started](./getting-started) — build a minimal set in five minutes
- [File Structure](./file-structure) — directory layout and naming rules
- [Schema Reference](./schema-reference) — full field-by-field reference
- [Hosting](./hosting) — where and how to serve a set
- [Authoring Guide](./authoring) — best practices for composing a good set
- [Extensions](./extensions) — the `x_` namespace mechanism
- [Examples](./examples) — complete, worked example sets

<style>
.opf-badges { margin-bottom: 24px; }
.opf-download-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white) !important;
  font-weight: 600;
  text-decoration: none !important;
}
.opf-download-btn:hover { background: var(--vp-c-brand-2); }
</style>
