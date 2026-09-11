# Shared Stimuli

A **stimulus** is a prompt several questions are asked about — a reading
passage with five comprehension questions, one diagram with four labeling-
style questions about it, one code snippet with three questions about its
behavior, a shared dataset for a handful of numerical questions. Without a
stimulus, authoring that means copy-pasting the same passage into every
question's `statement.md`, with no relationship between them declared
anywhere. A stimulus is written once and referenced by any number of
questions instead.

## The files that make up a stimulus

```
{stimulus-root}/
├── stimulus.json
├── stimulus.md         (optional — the shared prose/prompt itself)
└── assets/              (optional — a shared image, dataset file, etc.)
```

| File | Purpose |
|---|---|
| `stimulus.json` | Metadata: id, optional title, authors, license, tags — and `content`, when the prose is held inline. |
| `stimulus.md` | The shared prompt, as pure Markdown — same conventions as `statement.md` (see [Markdown Conventions](/markdown-conventions) for figures and math). Present only when `content` uses the `{ "file": "stimulus.md" }` form. |

A stimulus with no prose at all is valid — some stimuli are purely an
image or a dataset file living in `assets/`, referenced from each
question's own `type_config` (e.g. a `diagram` question's `image` field
could point into a shared stimulus's `assets/` folder instead of its own).

The prose itself goes in `content`, either inline or as a file:

```json
{ "oqf_version": "0.2.0", "id": "bookstore-schema",
  "content": "An online bookstore stores books, authors, and orders." }

{ "oqf_version": "0.2.0", "id": "reading-passage-1",
  "content": { "file": "stimulus.md" } }
```

**Prefer the inline form for a stimulus referenced by `stimulus_url`.** A
`content_hash` on that reference covers `stimulus.json` only — with the
prose in a separate file, the passage every question depends on can be
swapped while the hash still verifies. That matters more here than
anywhere else in OES, because a stimulus is the one document the spec
actively recommends hosting independently for reuse across sets.

## Referencing a stimulus from a question

A `question.json` gets an optional top-level `stimulus` field:

```json
{
  "stimulus": { "path": "../../stimuli/reading-passage-1" }
}
```

or, for a stimulus hosted independently and reused across sets:

```json
{
  "stimulus": {
    "stimulus_url": "https://raw.githubusercontent.com/x/y/main/reading-passage-1/stimulus.json",
    "content_hash": "sha256-..."
  }
}
```

Exactly one of `path`/`stimulus_url` is required when `stimulus` is
present at all — the same local/external duality used everywhere else in
OES. `content_hash` is optional and only meaningful alongside
`stimulus_url` — see [Versioning & Conformance](/conformance#content-integrity-for-external-references).

## Where a co-located stimulus lives

The common case is a stimulus shared by several questions within the same
set. Convention: a `stimuli/` folder as a sibling to `questions/`, at the
set's own root — not inside any one question's folder, since it doesn't
belong to any single one of them:

```
my-practice-set/
├── set.json
├── questions/
│   ├── passage1-q1/
│   │   ├── question.json      → stimulus: { path: "../../stimuli/reading-passage-1" }
│   │   └── statement.md
│   ├── passage1-q2/
│   │   ├── question.json      → stimulus: { path: "../../stimuli/reading-passage-1" }
│   │   └── statement.md
│   └── passage1-q3/
│       └── ...
└── stimuli/
    └── reading-passage-1/
        ├── stimulus.json
        └── stimulus.md
```

Three questions, one passage, authored once.

## How a consumer should render grouped questions

OQF doesn't add an explicit "these N questions are a group" field anywhere
— grouping is implicit: a consumer walking a set's `questions[]` in order
SHOULD detect when consecutive questions resolve to the identical
stimulus (same `path`, or same `stimulus_url`) and render that stimulus
once above the group ("Questions 1-3 refer to the following passage..."),
not once per question. A consumer MAY still handle non-consecutive
sharing (the same stimulus referenced by questions elsewhere in the set)
gracefully, but consecutive grouping is the pattern this is designed for
and the one worth optimizing the rendering for.

## Authoring guidance

- Keep a stimulus's own content self-contained the same way a question's
  `statement.md` should be — a learner shouldn't need anything beyond the
  stimulus and each question's own statement to answer it.
- Don't put anything grading-relevant in the stimulus that isn't also
  reflected in each question's own `type_config` — same principle as
  `statement.md` vs `question.json`.
- A stimulus intentionally has no `difficulty`/`topics`/`points` — those
  describe individual questions, not the shared prompt they're about.
- If only one question will ever use a prompt, it's not a stimulus — just
  put the prompt directly in that question's own `statement.md`. Reach for
  a stimulus only when genuinely shared.

## See also

- [Schema Reference](./schema-reference) for `stimulus.json`'s full field
  table.
- [Examples](./examples) for a worked reading-comprehension set.
