# Getting Started

This walks through building the smallest possible valid OPF set: one
question, co-located, referenced from `set.json`.

## 1. Create the folder structure

```bash
mkdir -p my-first-set/questions
cd my-first-set
```

## 2. Write the question

A set's questions are [OQF](/specs/oqf/) documents. This one is simple
enough to skip a folder of its own — a single file,
`questions/two-sum.json`, with its statement inline. See
[OQF's Getting Started](/specs/oqf/getting-started) for the full
walkthrough, including when a question needs a folder instead:

```json
{
  "oqf_version": "0.1.0",
  "id": "two-sum",
  "type": "mcq",
  "title": "Two Sum — time complexity",
  "difficulty": "easy",
  "tags": ["arrays", "hash-map"],
  "statement": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.",
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

## 3. Write the set entry point

`set.json`:

```json
{
  "opf_version": "0.2.0",
  "id": "my-first-set",
  "title": "My First Practice Set",
  "description": "A minimal OPF set with one question.",
  "authors": ["your-github-username"],
  "license": "CC-BY-4.0",
  "language": "en",
  "questions": [
    { "id": "two-sum", "path": "questions/two-sum.json", "points": 10 }
  ]
}
```

Note the `path` ends in `.json` — that's what tells a consumer this is a
single-file question, not a folder to look inside.

## 4. Validate it

```bash
npx ajv-cli validate \
  -s https://oes.inklyre.org/schemas/opf/v0.3.0/set.schema.json \
  -d set.json

npx ajv-cli validate \
  -s https://oes.inklyre.org/schemas/oqf/v0.2.0/question.schema.json \
  -d questions/two-sum.json
```

## 5. Host it and link it from an LMS

Push the folder to a public GitHub repo, then point any consumer at the raw
URL of `set.json`, for example:

```
https://raw.githubusercontent.com/your-username/my-first-set/main/set.json
```

See [Hosting](./hosting) for other hosting options, including private repos
and object storage.

## Referencing a question from a shared bank instead

Once you have more than one set, you'll often want to reuse a question
across them rather than copying it. Skip the `questions/` folder for that
entry and reference it by URL instead:

```json
{
  "questions": [
    { "id": "two-sum", "path": "questions/two-sum.json", "points": 10 },
    {
      "id": "sorting-stable",
      "question_url": "https://raw.githubusercontent.com/your-username/question-bank/main/sorting-stable/question.json",
      "points": 15
    }
  ]
}
```

## What's next

- Read [File Structure](./file-structure) for the full directory and naming
  rules.
- Read [OQF's Question Types](/specs/oqf/question-types) to see all 10
  supported question types.
- Read [Examples](./examples) for complete, realistic sets you can copy
  from.
- Read [Editor Setup](/editor-setup) for inline validation/autocomplete
  while hand-editing `set.json`.
