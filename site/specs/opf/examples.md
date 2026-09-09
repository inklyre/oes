# Examples

Two complete, worked OPF sets. Each shows the full file tree and `set.json`
— copy either as a starting point. Question content
(`question.json`/`statement.md`) for the types used here is shown in full
in [OQF's Examples](/specs/oqf/examples); this page focuses on how a set
assembles them.

[[toc]]

## Example 1 — DSA practice set, fully co-located

Every question is written specifically for this set and lives alongside it.

### File tree

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

### `set.json`

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

`questions/two-sum/question.json` is the `code`-type question shown in full
in [OQF's Examples](/specs/oqf/examples#two-sum-code) (note it has no
`points` field there — this set assigns it 25 points via the reference
above). `big-o-lookup` and `binary-search-complexity` are the `mcq` and
`fill_blank` examples from the same page.

---

## Example 2 — Mixed set: co-located and shared questions

A set can reuse questions it doesn't own alongside ones written just for
it. This set combines a locally-authored question with two pulled from a
shared, independently-hosted question bank.

### File tree

```
sorting-and-complexity-quiz/
├── set.json
└── questions/
    └── complexity-match/
        ├── question.json
        └── statement.md
```

### `set.json`

```json
{
  "opf_version": "0.2.0",
  "id": "sorting-and-complexity-quiz",
  "title": "Sorting & Complexity Quiz",
  "description": "A short quiz mixing a question written for this set with two pulled from a shared question bank.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "tags": ["dsa", "sorting"],
  "language": "en",
  "questions": [
    { "id": "complexity-match", "path": "questions/complexity-match", "points": 15 },
    {
      "id": "sorting-stable",
      "title": "Which sorting algorithms are stable?",
      "question_url": "https://raw.githubusercontent.com/ankit-ksh/cs-question-bank/main/sorting-stable/question.json",
      "points": 15
    },
    {
      "id": "quicksort-steps",
      "title": "Order the steps of Quicksort",
      "question_url": "https://raw.githubusercontent.com/ankit-ksh/cs-question-bank/main/quicksort-steps/question.json",
      "points": 15
    }
  ]
}
```

`questions/complexity-match/` is the `match`-type question from
[OQF's Examples](/specs/oqf/examples). `sorting-stable` and
`quicksort-steps` are the `msq` and `order` examples from the same page,
here hosted independently in a shared `cs-question-bank` repo and pulled in
by URL — note the optional `title` on those two entries, so a consumer can
render this set's table of contents without fetching each remote question
first.

---

## Using these examples

1. Rename `id` fields (in `set.json` and every co-located `question.json`)
   and matching folder names to your own kebab-case identifiers.
2. Replace `authors`, `license`, and `tags` with your own.
3. Validate against the [JSON Schema](./schema-reference) — and each
   question against [OQF's schema](/specs/oqf/schema-reference) — before
   publishing.
