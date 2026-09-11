# OQF — Open Question Format

**Version 0.2.0 · Status: Draft · License: CC BY 4.0**

Part of [OES — Open Education Standards](https://oes.inklyre.org/).

## Table of contents

1. Overview and Philosophy
2. File Structure
3. `question.json` Reference
4. The 11 Question Types
5. Shared Stimuli
6. Extension Mechanism
7. JSON Schema
8. Worked Examples
9. Changes since 0.1.0

---

## 1. Overview and Philosophy

OQF (Open Question Format) is an open specification for a single question
— a multiple-choice question, a coding exercise, a fill-in-the-blank, an
essay prompt, or any of the 11 supported types — stored as static files. A
question is the smallest unit of practice content in OES, designed to be
referenced from more than one place: co-located alongside the
[OPF](https://oes.inklyre.org/specs/opf/) set it belongs to (the
common case), or hosted independently as a standalone repo / shared
question bank that many sets reference by URL.

Philosophy:

- **Static files, not a database.** A question is one `.json` file, or a
  folder of `.json` and `.md` files, versionable with git.
- **Small and self-contained.** Everything needed to render and grade one
  question lives in `question.json`, next to its prose — either inline in
  a `statement` field, or in a sibling `statement.md`.
- **Reusable by design.** Splitting question out of OPF as its own spec is
  what lets it be authored once and referenced from multiple sets.
- **Composed by OPF, not owned by it.** OQF defines what a single question
  looks like — nothing about sets, scoring policy, or how many questions
  make up an assessment. That's OPF's job.

## 2. File Structure

A question is single-file or a folder, an author's per-question choice.
Single-file, for a simple question with no images and a short statement:

```
two-sum.json           (question.json's content, statement inline)
```

Folder, once a question needs its own `assets/` or a long/reused
statement worth keeping as its own file:

```
{question-root}/
├── question.json
├── statement.md        (optional — see "Inline vs. file statement" below)
└── assets/              (optional — images, etc.)
```

### Inline vs. file statement

`statement` is always required on `question.json`, and its value's shape
says which mode you're in: a plain string is the prose itself, inline, as
Markdown — no separate file, what makes single-file authoring possible.
An object `{file: "statement.md"}` instead points at a sibling Markdown
file, path relative to the question's own folder — better once the prose
is long, reused, or the question already has a folder for `assets/`. Both
use identical Markdown conventions. Making `statement` required, with its
shape as the sole signal, rules out both a question ending up with no
statement source and one ending up with two disagreeing ones (an inline
string and a stray `statement.md`) — a validator still can't confirm a
referenced `statement.md` actually exists, the same limitation `path`/
`question_url` already have elsewhere in OES.

Two ways to reference a question:

**Co-located** — inside an OPF set's own repo, under `questions/`. A
folder-based question's `path` points at its folder
(`questions/complexity-match`); a single-file question's `path` ends in
`.json` (`questions/two-sum.json`) and points directly at the file:

```
my-practice-set/
├── set.json
└── questions/
    ├── two-sum.json               (single-file, "statement": "...")
    └── complexity-match/           (folder, e.g. it has assets/)
        ├── question.json          ("statement": {"file": "statement.md"})
        └── statement.md
```

**Standalone / shared** — its own repo, or one of many in a shared
question-bank repo, referenced by absolute `question_url` (pointing
directly at the `.json` file) from any set.

Naming: `question-id` is kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*$`). When
co-located via a folder `path`, the folder name must equal `id` — a
single-file `path`, `question_url`, or standalone question has no such
constraint since it's addressed by its full path/URL, not derived from it.

## 3. `question.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `oqf_version` | string | yes | Any `0.2.x` patch — see Versioning & Conformance on the docs site. |
| `id` | string | yes | Kebab-case. |
| `type` | string | yes | One of the 11 question types below. |
| `title` | string | yes | Human-readable title. |
| `difficulty` | string | no | `"easy"`, `"medium"`, or `"hard"`. |
| `status` | string | no | `"draft"`/`"published"`/`"deprecated"`. Absent means published. |
| `authors` | string[] | no | GitHub usernames — a question can be reused independently of any set. |
| `license` | string | no | SPDX identifier, e.g. `"CC-BY-4.0"`. |
| `tags` | string[] | no | Free-form tags. |
| `topics` | string[] | no | Subject-matter topics. |
| `companies` | string[] | no | Associated companies, if any. |
| `time_limit_mins` | number | no | Suggested time limit. |
| `hints` | string[] | no | Ordered least to most revealing. |
| `explanation` | string | no | Shown after attempting. |
| `references` | array | no | Cited sources or further reading — each entry a bare URL string, or `{title, type?, authors?, url?, isbn?, doi?, publisher?, year?, note?}` for a source with no single URL (e.g. a print book via `isbn`). Same shape as OAF's `references`. |
| `type_config` | object | yes | Type-specific shape — see below. |
| `statement` | string \| `{file}` | yes | The question's prose: a string inline, or `{file: "statement.md"}` pointing at a sibling file. Schema confirms the shape, not that a referenced file actually exists (not enforceable by schema alone). |
| `answer_key` | `{file}` \| `{url}` | no | Absent (default): self-practice — `type_config` carries its own answer inline. Present: a graded question — `type_config`'s answer field(s) MUST be omitted, fetched from here instead. Schema-enforced for every type with a determinate answer (`mcq`, `msq`, `numerical`, `fill_blank`, `diagram`, `code`, `match`, `order`); not applicable to `short_answer`/`essay`/`submission`. |

Unlike OPF v0.1.0's `problem.json`, there is no `points` field — that's a
per-set-use concern, living on OPF's `set.json` reference instead.

**Answer visibility:** by default every type's `type_config` carries its
own answer inline — an `mcq`'s `answer`, for instance, sits directly in
the same `question.json` a learner's client fetches, which is the right
default for self-practice content. Every type with a single determinate
answer can opt into being graded by setting `answer_key`, which the
schema then requires the answer to be omitted from `type_config` — a
grading consumer fetches the real value from wherever `answer_key` points
instead (private repo or authenticated endpoint, not a public co-located
file, if the intent is a learner's client never sees it). This covers
`mcq`, `msq`, `numerical`, `fill_blank`, `diagram`, `code` (hidden test
cases + `solutions`), `match`, and `order`. `short_answer`, `essay`, and
`submission` have no `answer_key` — manually graded against a rubric,
there's no single correct answer to hide.

`statement.md` is pure Markdown, no frontmatter, and may include figures
(standard `![]()` syntax + `assets/`) and LaTeX math (`$...$` / `$$...$$`
— see the docs site's Markdown Conventions page). For `fill_blank`, blanks
are marked inline as `{{blank-id}}`. A question MAY also carry an optional
top-level `stimulus` field (see section 5).

## 4. The 11 Question Types

### `mcq` — Multiple choice, single answer
`options: [{id, content}]` (yes, ≥2; `content` is Markdown with full
parity to `statement` — arbitrary text, code fences, LaTeX math, and any
number of images interleaved in sequence, e.g.
`![alt](assets/option-a.png)`), `answer: string` (yes unless a top-level
`answer_key` is set, in which case omit it here — matches an option's
id), `shuffle_options?: boolean` (default `false`).

### `msq` — Multiple choice, multiple answers
`options` — same shape as `mcq` above (yes, ≥2), `answers: string[]`
(yes unless secured via `answer_key`, ≥1, each matches an option's id),
`shuffle_options?: boolean` (default `false`).

### `fill_blank` — Fill in the blank
`blanks: [{id, answer, type: "text"|"expression"|"number", case_sensitive?}]`
`answer` is one accepted string **or a list of them** — a response matching
any member is correct, which is how equivalent spellings are handled
(`["O(log n)", "O(logn)", "\u0398(log n)"]`). Matching is exact against each
member, with `case_sensitive` applied uniformly; there is no fuzzy match.
(yes, ≥1; `answer` omitted per-blank when secured via `answer_key`,
supplied there instead keyed by `id`). Blanks marked in `statement.md` as
`{{id}}`.

### `code` — Write code, executed against test cases
`languages: string[]` (yes, ≥1), `starter_code?: Record<lang,code>`,
`test_cases: [{id, input, expected, is_hidden?, points?, time_limit_ms?, memory_limit_mb?}]`
(yes, ≥1; `points` is optional per-test-case weight for a consumer
computing a proportional score; `expected` omitted for `is_hidden` cases
when secured via `answer_key`, supplied there instead keyed by `id`),
`solutions?: Record<lang,code>` (omitted entirely when secured — always
fully secret), `time_limit_ms?: integer` (default per-test-case time
limit; absent = judge decides), `memory_limit_mb?: integer` (default
per-test-case memory limit; absent = judge decides), `time_complexity?: string`,
`space_complexity?: string`.

### `match` — Match two columns
`left: [{id, content}]` (yes, ≥2) and `right: [{id, content}]` (yes, ≥2,
may have more items than `left` as unmatched distractors) are the two
public, independent columns — `content` is Markdown, same shape as `mcq`
options. `pairs: [{left_id, right_id}]` (yes, ≥2, unless secured via
`answer_key` — then omitted here, supplied there in the same shape) is
the correct associations, referencing ids from `left`/`right`.
`shuffle?: boolean` (default `true`) — safe to apply freely to `right`,
since correctness is id-based, not positional. (Earlier drafts of this
type used a single `pairs: [{left, right}]` list where each pair's two
values sat together; that shape made revealing the choices inherently
reveal the pairing, so it couldn't be secured. This id-keyed shape
replaces it.)

### `order` — Arrange items in sequence
`items: [{id, content}]` (yes, ≥2) — may be stored in any order; its
position in the array carries no meaning by itself, only `correct_order`
does. `correct_order: string[]` (yes, ≥2, the ids from `items` in correct
sequence, unless secured via `answer_key` — then omitted here, supplied
there in the same shape). `shuffle?: boolean` (default `true`) — safe to
apply freely, since correctness is id-based, not positional. (Earlier
drafts used integer indices into an `items: string[]` array stored in its
literal correct order, which meant revealing `items` risked revealing the
answer outright; this id-keyed shape replaces it.)

### `numerical` — Numeric answer with tolerance
`answer: number` (yes unless secured via `answer_key`), `tolerance?: number`
(default `0`), `tolerance_type?: "absolute"|"percentage"` (default
`"absolute"` — `"percentage"` interprets `tolerance` as a percent of
`|answer|`, for when the correct answer's magnitude varies too much
across similar questions for one fixed absolute margin to make sense),
`unit?: string`.

### `short_answer` — Free text, manually graded
`max_words?: integer`, `grading: "manual"` (yes), `rubric?: string |
{criteria: [{name, description?, points?}]}`.

### `essay` — Long form, rubric graded
`min_words?: integer`, `max_words?: integer`, `grading: "manual"` (yes),
`rubric?: string | {criteria: [...]}` — same structured-or-string shape
as `short_answer`.

### `diagram` — Label parts of an image
`image` (yes) is a relative path string, or `{file, content_hash?}` when the
question is fetched by URL and the image would otherwise be unverified.
`labels: [{id, answer, position:{x,y}}]`
(yes, ≥1, `x`/`y` are 0-100 percentage coordinates from top-left;
`answer` omitted per-label when secured via `answer_key`, supplied there
instead keyed by `id` — `position` always stays public, it's where to
click, not what the answer is).

### `submission` — Deliverable-based, manually graded
For a project/capstone/portfolio piece where the learner submits a file,
URL, or git repo link instead of answering inline. `formats: string[]`
(yes, ≥1, from `"file"`/`"url"`/`"git_repo"`), `max_file_size_mb?: number`
and `allowed_file_types?: string[]` (both meaningful only when `"file"`
is accepted), `grading: "manual"` (yes), `rubric?: string | {criteria: [...]}`
(same shape as `essay`/`short_answer`). Grading workflow — due dates,
peer review, group submissions — is a consumer/LMS policy concern, not
part of this content.

## 5. Shared Stimuli

A **stimulus** is a prompt several questions are asked about — a reading
passage, a shared diagram, a code snippet, a dataset — authored once
instead of duplicated into every question's `statement.md`.

```
{stimulus-root}/
├── stimulus.json     {oqf_version, id, title?, content?, authors?, license?, tags?}
├── stimulus.md        (only when content uses the {file} form)
└── assets/             (optional)
```

Convention: co-located stimuli live in a `stimuli/` folder sibling to
`questions/`, at the set's own root:

```
my-practice-set/
├── set.json
├── questions/
│   ├── passage1-q1/question.json   → stimulus: {path: "../../stimuli/reading-passage-1"}
│   └── passage1-q2/question.json   → stimulus: {path: "../../stimuli/reading-passage-1"}
└── stimuli/
    └── reading-passage-1/{stimulus.json, stimulus.md}
```

The prose lives in `content`, inline or as `{file: "stimulus.md"}`. Prefer
inline for a stimulus referenced by `stimulus_url`: a `content_hash` covers
`stimulus.json` only, so prose in a separate file can be swapped while the
hash still verifies.

`question.json`'s `stimulus` field: `{path | stimulus_url, content_hash?}`
— exactly one of `path` (co-located) or `stimulus_url` (hosted separately,
for cross-set reuse), same local/external duality used everywhere in OES.
`content_hash` is an optional `sha256-{hex}` pin, meaningful only
alongside `stimulus_url`.

There's no explicit "these questions are a group" field — a consumer
walking a set's `questions[]` in order SHOULD detect consecutive questions
resolving to the identical stimulus and render it once above the group,
not once per question.

## 6. Extension Mechanism

Any field matching `^x_[a-z0-9_]+$` is reserved for extensions, never
defined by core OQF, at any level including inside `type_config`. Format:
`x_{namespace}_{field}`, both `snake_case`. Parsers must ignore unknown
`x_` fields; core fields are never retroactively repurposed from an `x_`
name; extensions must never be load-bearing for correctness; namespace
collisions are the author's responsibility. Shared registry — one across
OPF, OQF, OCF, OAF, and OVF — at `extensions/registry.md`. Applies equally
to `stimulus.json`.

## 7. JSON Schema

Full schemas: `schemas/oqf/v0.2.0/question.schema.json` and
`schemas/oqf/v0.2.0/stimulus.schema.json` — the canonical, machine-readable
definitions of every field, every type's `type_config` shape, and
`stimulus.json`'s own shape. See the schema files themselves (linked from
the docs site) for the literal JSON.

## 8. Worked Examples
9. Changes since 0.1.0

### `two-sum` — `code`

`statement.md`:
```markdown
Given an array of integers `nums` and an integer `target`, return the
indices of the two numbers that add up to `target`.
```

`question.json`:
```json
{
  "oqf_version": "0.2.0",
  "id": "two-sum",
  "type": "code",
  "title": "Two Sum",
  "difficulty": "easy",
  "tags": ["arrays", "hash-map"],
  "statement": { "file": "statement.md" },
  "type_config": {
    "languages": ["python"],
    "test_cases": [
      { "id": "tc1", "input": { "nums": [2, 7, 11, 15], "target": 9 }, "expected": [0, 1] }
    ]
  }
}
```

### `big-o-lookup` — `mcq`

```json
{
  "oqf_version": "0.2.0",
  "id": "big-o-lookup",
  "type": "mcq",
  "title": "Hash table average lookup time",
  "difficulty": "easy",
  "statement": "What's the average-case time complexity of a lookup in a well-implemented hash table?",
  "type_config": {
    "options": [
      { "id": "a", "content": "O(1)" },
      { "id": "b", "content": "O(log n)" },
      { "id": "c", "content": "O(n)" },
      { "id": "d", "content": "O(n log n)" }
    ],
    "answer": "a",
    "shuffle_options": true
  }
}
```

See the [full Examples page](https://oes.inklyre.org/specs/oqf/examples)
on the docs site for every type worked through in full.

## 9. Changes since 0.1.0

- **`fill_blank` blanks accept several answers.** `answer` may now be a
  list, any member matching. Under 0.1.0 a blank accepted exactly one
  spelling, so correct responses were marked wrong — worth revisiting
  across an existing bank, not just new questions.
- **`stimulus.json` declares its prose in `content`.** Previously the
  prose was pure filesystem convention, so a `content_hash` on a
  `stimulus_url` reference did not cover the passage itself.
- **A `diagram`'s `image` may carry a `content_hash`.** A plain path
  string remains valid.

All three are widening changes: every valid 0.1.0 question is still
structurally valid, and migrating means bumping `oqf_version`.
