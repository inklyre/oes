# OPF — Open Practice Format

**Version 0.2.0 · Status: Draft · License: CC0 1.0**

Part of [OES — Open Education Standards](https://inklyre.github.io/oes/).

## Table of contents

1. Overview and Philosophy
2. File Structure
3. `set.json` Reference
4. Extension Mechanism
5. Hosting
6. Authoring Guidance
7. JSON Schema
8. Full Worked Example
9. Migrating from v0.1.0

---

## 1. Overview and Philosophy

OPF (Open Practice Format) is an open specification for a **practice
set** — an ordered collection of questions plus set-level metadata, stored
as static files. As of v0.2.0, OPF does not define what a question looks
like — that's [OQF](https://inklyre.github.io/oes/specs/oqf/)'s job — it
defines how questions are assembled, scored, and shipped together as one
assessable unit.

Philosophy:

- **Static files, not a database.** A set is `set.json`, versionable with
  git.
- **Git-native.** Clone, edit, commit, push.
- **Composes with OQF, doesn't own it.** A set lists which questions
  belong to it and how much each is worth; the questions themselves are
  OQF documents, co-located or pulled in by URL from a shared question
  bank — either way, never duplicated.
- **Auth-agnostic.** OPF says nothing about who is allowed to see or
  submit a set.
- **LMS never stores the content.** An LMS stores one URL to `set.json`
  and fetches on demand.

## 2. File Structure

```
{set-root}/
├── set.json
└── questions/                     (optional — only for co-located questions)
    └── {question-id}/
        ├── question.json
        ├── statement.md
        └── assets/
```

`questions/` is a convention, not a schema requirement — `set.json` only
cares that each `questions[]` entry resolves to a valid OQF question,
whether local (`path`) or external (`question_url`).

## 3. `set.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `opf_version` | string | yes | Any `0.2.x` patch — see Versioning & Conformance on the docs site. |
| `id` | string | yes | Kebab-case, unique. |
| `title` | string | yes | |
| `description` | string | no | |
| `authors` | string[] | no | |
| `license` | string | no | SPDX identifier. |
| `status` | string | no | `"draft"`/`"published"`/`"deprecated"`. Absent means published. |
| `tags` | string[] | no | |
| `language` | string | no | BCP 47. |
| `questions` | object[] | yes | Minimum 1, ordered. Each entry is a direct reference or a pool. See below. |

`questions[]` entries — direct reference:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Matches folder name when `path` points to a folder; unconstrained for a single-file `path` or `question_url`. |
| `title` | string | no | Display label, mainly useful for `question_url` entries. |
| `path` | string | one of `path`/`question_url` | Relative to `set.json`. Ending in `.json` points directly at a single-file question; otherwise a folder, resolved as `{path}/question.json`. See OQF's File Structure. |
| `question_url` | string (uri) | one of `path`/`question_url` | Absolute URL to an externally-hosted `question.json`. |
| `content_hash` | string | no | `sha256-{hex}` of the referenced `question.json`, meaningful only alongside `question_url` — pins a revision so it can't silently change. |
| `points` | number | no, default `10` | This use's score weight — not a property of the question itself. |

`questions[]` entries — pool (randomized selection), identified by
`select`/`from` instead of `path`/`question_url`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Identifies this pool within the set. |
| `select` | integer | yes | How many questions a consumer randomly picks from `from` at attempt-assembly time. MUST be ≤ `from`'s length (not schema-enforced). |
| `from` | object[] | yes | Candidates to select from, minimum 1: `{id, path\|question_url, content_hash?}`. |
| `shuffle` | boolean | no, default `true` | Randomize the selected questions' presentation order each time, vs. `from`'s relative order. |
| `points` | number | no, default `10` | Applied uniformly to every question this pool selects. |

Direct references and pools can be freely mixed and ordered in one
`questions[]` list.

## 4. Extension Mechanism

Same `x_` mechanism as every OES spec: `x_{namespace}_{field}`, both
`snake_case`, ignorable by conformant parsers, never load-bearing, never
retroactively repurposed from a core field. Shared registry at
`extensions/registry.md`, applying across OCF/OPF/OQF/OAF/OVF.

## 5. Hosting

OPF places no requirements on where a set lives — any static HTTP(S) host
works. Options: raw GitHub URL (free, simple, no CDN guarantees); GitHub +
jsDelivr CDN, pinned to a tag/SHA (recommended for production); private
repo + token via a server-side proxy; S3-compatible storage (public-read
or signed URLs); self-hosted static server. Prefer immutable pinned refs
over mutable branches wherever possible — OPF content is static, so
aggressive caching is safe and encouraged.

## 6. Authoring Guidance

Composing a set (not writing a question — see OQF's own authoring guide
for that): order `questions[]` deliberately (array order is the only
sequencing signal); mix difficulty/type where it serves the material;
`points` now lives on the reference — scale by effort/guess-risk and keep
consistent within a set; `title`/`description`/`tags` should describe the
set's practice focus, distinct from a question's own `topics`; prefer
co-located questions for content specific to this set, external
`question_url` references for genuine reuse (accepting the tradeoff that a
broken remote reference breaks your set — pin to a tag/SHA when you don't
control it).

## 7. JSON Schema

Full schema: `schemas/opf/v0.2.0/set.schema.json`. Question content is
validated separately against `schemas/oqf/v0.1.0/question.schema.json` —
`set.json` only validates the reference list, not question content.

## 8. Full Worked Example

```
dsa-fundamentals/
├── set.json
└── questions/
    ├── two-sum/
    │   ├── question.json
    │   └── statement.md
    ├── big-o-lookup/
    │   ├── question.json
    │   └── statement.md
    └── binary-search-complexity/
        ├── question.json
        └── statement.md
```

```json
{
  "opf_version": "0.2.0",
  "id": "dsa-fundamentals",
  "title": "DSA Fundamentals",
  "description": "Core data structures and algorithms practice: arrays, hashing, and search.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "tags": ["dsa", "interview-prep"],
  "language": "en",
  "questions": [
    { "id": "two-sum", "path": "questions/two-sum", "points": 25 },
    { "id": "big-o-lookup", "path": "questions/big-o-lookup", "points": 10 },
    { "id": "binary-search-complexity", "path": "questions/binary-search-complexity", "points": 10 }
  ]
}
```

See the [full Examples page](https://inklyre.github.io/oes/specs/opf/examples)
on the docs site for a second example mixing co-located and externally
shared questions, and [OQF's Examples](https://inklyre.github.io/oes/specs/oqf/examples)
for the referenced questions' own content.

## 9. Migrating from v0.1.0

1. Move each `problems/{id}/problem.json`+`statement.md` to
   `questions/{id}/question.json`+`statement.md`.
2. In each moved file: rename `opf_version` → `oqf_version` (value becomes
   `"0.1.0"`), remove `points`.
3. In `set.json`: bump `opf_version` to `"0.2.0"`, rename `problems[]` to
   `questions[]`, and move each entry's old `points` (or default `10`)
   onto the `questions[]` entry.
