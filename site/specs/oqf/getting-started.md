# Getting Started

This walks through building the smallest possible valid OQF question: one
file, nothing else.

## 1. Write the question

`my-first-question.json` — structured data and prose together, since this
question is simple enough not to need its own folder:

```json
{
  "oqf_version": "0.1.0",
  "id": "my-first-question",
  "type": "mcq",
  "title": "Two Sum — time complexity",
  "difficulty": "easy",
  "tags": ["arrays", "hash-map"],
  "statement": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.",
  "type_config": {
    "options": [
      { "id": "a", "content": "O(n^2)" },
      { "id": "b", "content": "O(n log n)" },
      { "id": "c", "content": "O(n)" },
      { "id": "d", "content": "O(1)" }
    ],
    "answer": "c",
    "shuffle_options": true
  }
}
```

The `statement` field is Markdown, same conventions as anywhere else in
OES — it's just being authored inline instead of as its own file.

## 2. Validate it

```bash
npx ajv-cli validate \
  -s https://oes.inklyre.org/schemas/oqf/v0.2.0/question.schema.json \
  -d my-first-question.json
```

## 3. Use it

A question by itself isn't consumed directly by an LMS — it's referenced
from an [OPF](/specs/opf/) set's `questions[]` list, either co-located
(a relative `path`, when this question sits inside the set's own repo
under `questions/`) or externally (a `question_url`, when it's hosted on
its own or as part of a shared question bank). See
[OPF's Getting Started](/specs/opf/getting-started) for building a set
around one or more questions like this one.

If you're hosting a standalone question or a shared question bank, the same
hosting options apply as for any other OES spec — a public GitHub repo (raw
or via jsDelivr), a private repo behind a token, or any static file host.
See [OPF's Hosting guide](/specs/opf/hosting) for the details; nothing
about serving a question is different from serving a set.

## When to use a folder instead

Once a question needs its own `assets/` (an image for a `diagram` type or
an image-based option), or its statement is long/reused enough to be
worth editing as its own Markdown file, give it a folder instead of a
single file — move the prose out of `question.json`'s `statement` string
and into a sibling `statement.md`, replacing `statement`'s value with
`{ "file": "statement.md" }`:

```
my-first-question/
├── question.json      ("statement": { "file": "statement.md" })
├── statement.md
└── assets/
    └── diagram.png
```

Everything else about the question is identical either way — this is a
per-question authoring choice, not a different kind of question. See
[File Structure](./file-structure#inline-vs-file-statement) for the full
rule.

## What's next

- Read [File Structure](./file-structure) for the full directory and
  naming rules, including the co-located vs. standalone distinction.
- Read [Question Types](./question-types) to see all 11 supported types.
- Read [Examples](./examples) for several complete, realistic questions.
- Read [Editor Setup](/editor-setup) for inline validation/autocomplete
  while hand-editing `question.json`.
