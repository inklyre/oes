# OPF — Open Practice Format

**Version:** 0.1.0
**Status:** Draft
**License:** CC0 1.0 (this specification document)
**Part of:** [OES — Open Education Standards](https://inklyre.github.io/oes/)

This document is a complete, self-contained specification for OPF v0.1.0.
It is intended to be implementable by a developer with no other reference
material and no internet access.

---

## Table of Contents

1. Overview and Philosophy
2. File Structure
3. `set.json` Reference
4. `problem.json` Reference
5. The 10 Problem Types (full field reference + examples)
6. Extension Mechanism
7. Hosting Options
8. Authoring Guidance
9. JSON Schemas (full text)
10. Full Worked Examples

---

## 1. Overview and Philosophy

OPF (Open Practice Format) is an open specification for practice problem
sets — quizzes, coding exercises, and assessments — stored entirely as
static files in a git repository.

- **Static files, not a database.** A problem set is a folder of `.json`
  and `.md` files, versionable and diffable like code.
- **Git-native.** Author by cloning, editing, committing, and pushing.
- **Database-free.** No backend is required. Any static file host works.
- **Auth-agnostic.** OPF does not define who may see or submit a problem —
  that is the hosting platform's responsibility.
- **LMS never stores the content.** An LMS integrates by storing one URL to
  a set's `set.json` and fetching problems on demand. Updating the source
  repo updates every consumer immediately.

## 2. File Structure

```
my-practice-set/
├── set.json
└── problems/
    └── {problem-id}/
        ├── problem.json
        ├── statement.md
        └── assets/            (optional)
```

**Naming rules:**

| Rule | Detail |
|---|---|
| `problem-id` format | kebab-case: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `problem-id` uniqueness | Unique within the set |
| Folder name | Must equal the problem's `id` |
| `set.json` location | Root of the set |
| `problem.json` location | `problems/{problem-id}/problem.json` |
| `statement.md` location | `problems/{problem-id}/statement.md` |

**File responsibilities:**

- `set.json` — entry point; set metadata and the list of problems.
- `problem.json` — all structured data for one problem (type, grading
  config, metadata).
- `statement.md` — the problem's prose. **Pure Markdown, no frontmatter, no
  metadata, no exceptions.** For `fill_blank` problems, blanks are marked
  inline as `{{blank-id}}`.
- `assets/` (optional) — binary assets (e.g. diagram images) referenced by
  `problem.json`, using paths relative to the problem's own folder.

**Path resolution:** every `path` in `set.json` is relative to `set.json`
itself; every asset path inside a `problem.json` is relative to that
problem's own folder — never assume a hosting root.

## 3. `set.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `opf_version` | string | **yes** | Must be `"0.1.0"`. |
| `id` | string | **yes** | Kebab-case, unique identifier for the set. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Longer description. |
| `authors` | string[] | no | GitHub usernames. |
| `license` | string | no | SPDX license identifier, e.g. `"CC-BY-4.0"`. |
| `tags` | string[] | no | Free-form tags. |
| `language` | string | no | BCP 47 tag, e.g. `"en"`. |
| `problems` | object[] | **yes** | Min 1 item. |

`problems[]`: `{ id: string (required), path: string (required) }`.

```json
{
  "opf_version": "0.1.0",
  "id": "my-first-set",
  "title": "My First Practice Set",
  "description": "A minimal OPF set with one problem.",
  "authors": ["your-github-username"],
  "license": "CC0-1.0",
  "language": "en",
  "problems": [
    { "id": "two-sum", "path": "problems/two-sum" }
  ]
}
```

## 4. `problem.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `opf_version` | string | **yes** | Must match the parent set's version. |
| `id` | string | **yes** | Kebab-case, matches folder name. |
| `type` | string | **yes** | One of the 10 types (section 5). |
| `title` | string | **yes** | Human-readable title. |
| `difficulty` | string | no | `"easy"` \| `"medium"` \| `"hard"`. |
| `tags` | string[] | no | Free-form tags. |
| `topics` | string[] | no | Subject-matter topics. |
| `companies` | string[] | no | Associated companies, if any. |
| `points` | number | no | Score weight. Default `10`. |
| `time_limit_mins` | number | no | Suggested time limit. |
| `hints` | string[] | no | Ordered least to most revealing. |
| `explanation` | string | no | Shown after an attempt. |
| `references` | string[] | no | URLs to further reading. |
| `type_config` | object | **yes** | Type-specific — see section 5. |

## 5. The 10 Problem Types

### `mcq` — Multiple choice, single answer

| Field | Type | Required | Description |
|---|---|---|---|
| `options` | `{id, text}[]` | yes | Candidate answers. |
| `answer` | string | yes | `id` of the correct option. |
| `shuffle_options` | boolean | no | Default `false`. |

```json
"type_config": {
  "options": [
    { "id": "a", "text": "O(1)" },
    { "id": "b", "text": "O(log n)" },
    { "id": "c", "text": "O(n)" },
    { "id": "d", "text": "O(n log n)" }
  ],
  "answer": "a",
  "shuffle_options": true
}
```

### `msq` — Multiple choice, multiple answers

| Field | Type | Required | Description |
|---|---|---|---|
| `options` | `{id, text}[]` | yes | Candidate answers. |
| `answers` | string[] | yes | `id`s of every correct option. |
| `shuffle_options` | boolean | no | Default `false`. |

```json
"type_config": {
  "options": [
    { "id": "a", "text": "Merge sort" },
    { "id": "b", "text": "Quick sort" },
    { "id": "c", "text": "Insertion sort" },
    { "id": "d", "text": "Heap sort" }
  ],
  "answers": ["a", "c"],
  "shuffle_options": true
}
```

### `fill_blank` — Fill in the blank

| Field | Type | Required | Description |
|---|---|---|---|
| `blanks` | object[] | yes | See below. |
| `blanks[].id` | string | yes | Matches a `{{id}}` marker in `statement.md`. |
| `blanks[].answer` | string | yes | Accepted answer. |
| `blanks[].type` | string | yes | `"text"` \| `"expression"` \| `"number"`. |
| `blanks[].case_sensitive` | boolean | no | Only for `type: "text"`. Default `true`. |

`statement.md`: `A binary search on a sorted array of n elements runs in {{b1}} time.`

```json
"type_config": {
  "blanks": [
    { "id": "b1", "answer": "O(log n)", "type": "text", "case_sensitive": false }
  ]
}
```

### `code` — Write code, executed against test cases

| Field | Type | Required | Description |
|---|---|---|---|
| `languages` | string[] | yes | Accepted language identifiers. |
| `starter_code` | object | no | Map of language → starter code string. |
| `test_cases` | object[] | yes | See below. |
| `test_cases[].id` | string | yes | Unique within the problem. |
| `test_cases[].input` | any | yes | Input for the submitted solution. |
| `test_cases[].expected` | any | yes | Expected output. |
| `test_cases[].is_hidden` | boolean | no | Default `false`. |
| `solutions` | object | no | Map of language → reference solution string. |
| `time_complexity` | string | no | e.g. `"O(n)"`. |
| `space_complexity` | string | no | e.g. `"O(n)"`. |

```json
"type_config": {
  "languages": ["python", "javascript"],
  "starter_code": { "python": "def two_sum(nums, target):\n    pass\n" },
  "test_cases": [
    { "id": "tc1", "input": { "nums": [2,7,11,15], "target": 9 }, "expected": [0,1], "is_hidden": false }
  ],
  "solutions": { "python": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n" },
  "time_complexity": "O(n)",
  "space_complexity": "O(n)"
}
```

### `match` — Match two columns

| Field | Type | Required | Description |
|---|---|---|---|
| `pairs` | `{left, right}[]` | yes | Each pair is a correct match. |
| `shuffle` | boolean | no | Default `true`. |

```json
"type_config": {
  "pairs": [
    { "left": "O(1)", "right": "Hash table lookup" },
    { "left": "O(log n)", "right": "Binary search" }
  ],
  "shuffle": true
}
```

### `order` — Arrange items in sequence

| Field | Type | Required | Description |
|---|---|---|---|
| `items` | string[] | yes | Items, written in correct order. |
| `correct_order` | integer[] | yes | Zero-based indices describing correct sequence. |
| `shuffle` | boolean | no | Default `true`. |

```json
"type_config": {
  "items": ["Choose a pivot", "Partition the array", "Recursively sort left", "Recursively sort right"],
  "correct_order": [0, 1, 2, 3],
  "shuffle": true
}
```

### `numerical` — Numeric answer with tolerance

| Field | Type | Required | Description |
|---|---|---|---|
| `answer` | number | yes | Correct value. |
| `tolerance` | number | no | Acceptable absolute deviation. Default `0`. |
| `unit` | string | no | Display-only unit label. |

```json
"type_config": { "answer": 42.5, "tolerance": 0.1, "unit": "ms" }
```

### `short_answer` — Free text, manually graded

| Field | Type | Required | Description |
|---|---|---|---|
| `max_words` | number | no | Suggested word limit. |
| `grading` | string | yes | Must be `"manual"`. |
| `rubric` | string | no | Grading guidance. |

```json
"type_config": {
  "max_words": 100,
  "grading": "manual",
  "rubric": "Should mention time and space tradeoff."
}
```

### `essay` — Long form, rubric graded

| Field | Type | Required | Description |
|---|---|---|---|
| `min_words` | number | no | Minimum expected word count. |
| `max_words` | number | no | Maximum expected word count. |
| `grading` | string | yes | Must be `"manual"`. |
| `rubric` | string | no | Grading criteria. |

```json
"type_config": {
  "min_words": 200,
  "max_words": 1000,
  "grading": "manual",
  "rubric": "See rubric criteria."
}
```

### `diagram` — Label parts of an image

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | string | yes | Path, relative to the problem folder. |
| `labels` | object[] | yes | See below. |
| `labels[].id` | string | yes | Unique within the problem. |
| `labels[].answer` | string | yes | Correct label text. |
| `labels[].position` | `{x, y}` | yes | Percentage coordinates (0-100) from top-left. |

```json
"type_config": {
  "image": "assets/diagram.png",
  "labels": [
    { "id": "l1", "answer": "root", "position": { "x": 50, "y": 10 } }
  ]
}
```

## 6. Extension Mechanism

Any field prefixed `x_` is reserved for extensions. Format:
`x_{namespace}_{field}`, `snake_case`.

- Parsers **must** ignore unknown fields without error — schemas set
  `additionalProperties: true` (scoped via a `patternProperties` entry
  matching `^x_[a-z0-9_]+$`).
- Core fields are never prefixed; a future spec version promotes a concept
  to a real field rather than repurposing an `x_` field name.
- Extensions must never be required for correctness — a set must remain
  fully valid and functional to a consumer that ignores every `x_` field.
- Namespace collisions are the extension author's responsibility.
- Reusable extensions are listed in `extensions/registry.md` in the OES
  repository — open a pull request there to register a namespace.

Example:

```json
{
  "x_spaced_repetition_interval": 3,
  "x_spaced_repetition_ease_factor": 2.5,
  "x_acmeplatform_internal_id": "prob_8f2a1c"
}
```

## 7. Hosting Options

OPF places no requirement on where a set lives — any static HTTP(S) host
works. A consumer only needs a stable URL to `set.json`.

1. **Public GitHub repo, raw** — `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/set.json`. Free, versioned, but subject to GitHub rate limits and no CDN guarantee.
2. **Public GitHub repo via jsDelivr CDN** — `https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/set.json`, or pin to a tag/SHA for immutable caching: `.../@v0.1.0/set.json`. Recommended for production public sets.
3. **Private GitHub repo, token-based** — via the GitHub Contents API (`GET /repos/{owner}/{repo}/contents/set.json?ref={branch}`, `Authorization: Bearer {token}`, `Accept: application/vnd.github.raw+json`). OPF does not define an auth model; typically fronted by a server-side proxy holding the token.
4. **S3-compatible object storage** (AWS S3, Cloudflare R2, MinIO, B2) — upload the folder structure as object keys mirroring file paths; serve directly, via CDN, or with signed URLs for private/gated content.
5. **Self-hosted static file server** — any static server (nginx, Caddy, `express.static()`), with correct CORS and `Content-Type` headers (`application/json` for `.json`, `text/markdown`/`text/plain` for `.md`).

Because sets are static, aggressive caching is safe; prefer pinning to an
immutable ref (tag/commit) over a mutable branch wherever the hosting
option supports it.

## 8. Authoring Guidance

- Keep `statement.md` self-contained — answerable from the statement alone.
- Use fenced code blocks for input/output examples.
- Calibrate `difficulty` relative to the listed `topics`: `easy` = one
  fact/step; `medium` = combining concepts or a non-obvious first step;
  `hard` = deeper analysis or a non-obvious insight.
- Write `hints` from least to most revealing: reframe → narrow the
  approach → nearly give it away. Never restate the statement as hint 1.
- Write `explanation` to teach — state the correct answer, explain *why*,
  and for `code` problems walk through complexity.
- Scale `points` by effort/guessability: guessable types (`mcq`/`msq`)
  generally worth less than free-response types (`code`/`essay`) of
  comparable difficulty.
- For `code` problems: always include a visible test case matching the
  statement's example exactly; include hidden edge-case tests; keep
  `starter_code` to a bare signature; omit `solutions` for high-stakes
  assessments since anyone who fetches `problem.json` can read them.
- For `short_answer`/`essay`: write `rubric` as concrete, checkable
  criteria, not a restatement of the question.
- Before publishing: validate against the schemas (section 9), confirm
  folder name matches `id`, run every `code` reference solution against
  every test case (including hidden ones), and read the statement as the
  learner would.

## 9. JSON Schemas (full text)

### `set.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://oes.dev/schemas/opf/v0.1.0/set.schema.json",
  "title": "OPF Set",
  "description": "Schema for set.json, the entry point of an Open Practice Format (OPF) problem set, version 0.1.0.",
  "type": "object",
  "required": ["opf_version", "id", "title", "problems"],
  "additionalProperties": true,
  "properties": {
    "opf_version": { "type": "string", "const": "0.1.0" },
    "id": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
    "title": { "type": "string", "minLength": 1 },
    "description": { "type": "string" },
    "authors": { "type": "array", "items": { "type": "string" } },
    "license": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } },
    "language": { "type": "string" },
    "problems": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "path"],
        "additionalProperties": true,
        "properties": {
          "id": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
          "path": { "type": "string" }
        }
      }
    }
  },
  "patternProperties": { "^x_[a-z0-9_]+$": {} }
}
```

### `problem.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://oes.dev/schemas/opf/v0.1.0/problem.schema.json",
  "title": "OPF Problem",
  "type": "object",
  "required": ["opf_version", "id", "type", "title", "type_config"],
  "additionalProperties": true,
  "properties": {
    "opf_version": { "type": "string", "const": "0.1.0" },
    "id": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
    "type": {
      "type": "string",
      "enum": ["mcq", "msq", "fill_blank", "code", "match", "order", "numerical", "short_answer", "essay", "diagram"]
    },
    "title": { "type": "string", "minLength": 1 },
    "difficulty": { "type": "string", "enum": ["easy", "medium", "hard"] },
    "tags": { "type": "array", "items": { "type": "string" } },
    "topics": { "type": "array", "items": { "type": "string" } },
    "companies": { "type": "array", "items": { "type": "string" } },
    "points": { "type": "number", "default": 10, "minimum": 0 },
    "time_limit_mins": { "type": "number", "minimum": 0 },
    "hints": { "type": "array", "items": { "type": "string" } },
    "explanation": { "type": "string" },
    "references": { "type": "array", "items": { "type": "string", "format": "uri" } },
    "type_config": { "type": "object" }
  },
  "patternProperties": { "^x_[a-z0-9_]+$": {} },
  "allOf": [
    { "if": { "properties": { "type": { "const": "mcq" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["options", "answer"], "additionalProperties": true,
        "properties": {
          "options": { "type": "array", "minItems": 2, "items": { "type": "object", "required": ["id", "text"], "properties": { "id": { "type": "string" }, "text": { "type": "string" } } } },
          "answer": { "type": "string" },
          "shuffle_options": { "type": "boolean", "default": false }
        } } } } },
    { "if": { "properties": { "type": { "const": "msq" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["options", "answers"], "additionalProperties": true,
        "properties": {
          "options": { "type": "array", "minItems": 2, "items": { "type": "object", "required": ["id", "text"], "properties": { "id": { "type": "string" }, "text": { "type": "string" } } } },
          "answers": { "type": "array", "minItems": 1, "items": { "type": "string" } },
          "shuffle_options": { "type": "boolean", "default": false }
        } } } } },
    { "if": { "properties": { "type": { "const": "fill_blank" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["blanks"], "additionalProperties": true,
        "properties": { "blanks": { "type": "array", "minItems": 1, "items": {
          "type": "object", "required": ["id", "answer", "type"],
          "properties": { "id": { "type": "string" }, "answer": { "type": "string" }, "type": { "type": "string", "enum": ["text", "expression", "number"] }, "case_sensitive": { "type": "boolean", "default": true } } } } }
        } } } },
    { "if": { "properties": { "type": { "const": "code" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["languages", "test_cases"], "additionalProperties": true,
        "properties": {
          "languages": { "type": "array", "minItems": 1, "items": { "type": "string" } },
          "starter_code": { "type": "object", "additionalProperties": { "type": "string" } },
          "test_cases": { "type": "array", "minItems": 1, "items": {
            "type": "object", "required": ["id", "input", "expected"],
            "properties": { "id": { "type": "string" }, "input": {}, "expected": {}, "is_hidden": { "type": "boolean", "default": false } } } },
          "solutions": { "type": "object", "additionalProperties": { "type": "string" } },
          "time_complexity": { "type": "string" },
          "space_complexity": { "type": "string" }
        } } } } },
    { "if": { "properties": { "type": { "const": "match" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["pairs"], "additionalProperties": true,
        "properties": { "pairs": { "type": "array", "minItems": 2, "items": { "type": "object", "required": ["left", "right"], "properties": { "left": { "type": "string" }, "right": { "type": "string" } } } }, "shuffle": { "type": "boolean", "default": true } } } } } },
    { "if": { "properties": { "type": { "const": "order" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["items", "correct_order"], "additionalProperties": true,
        "properties": { "items": { "type": "array", "minItems": 2, "items": { "type": "string" } }, "correct_order": { "type": "array", "minItems": 2, "items": { "type": "integer", "minimum": 0 } }, "shuffle": { "type": "boolean", "default": true } } } } } },
    { "if": { "properties": { "type": { "const": "numerical" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["answer"], "additionalProperties": true,
        "properties": { "answer": { "type": "number" }, "tolerance": { "type": "number", "minimum": 0, "default": 0 }, "unit": { "type": "string" } } } } } },
    { "if": { "properties": { "type": { "const": "short_answer" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["grading"], "additionalProperties": true,
        "properties": { "max_words": { "type": "integer", "minimum": 1 }, "grading": { "type": "string", "enum": ["manual"] }, "rubric": { "type": "string" } } } } } },
    { "if": { "properties": { "type": { "const": "essay" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["grading"], "additionalProperties": true,
        "properties": { "min_words": { "type": "integer", "minimum": 1 }, "max_words": { "type": "integer", "minimum": 1 }, "grading": { "type": "string", "enum": ["manual"] }, "rubric": { "type": "string" } } } } } },
    { "if": { "properties": { "type": { "const": "diagram" } } },
      "then": { "properties": { "type_config": {
        "type": "object", "required": ["image", "labels"], "additionalProperties": true,
        "properties": { "image": { "type": "string" }, "labels": { "type": "array", "minItems": 1, "items": {
          "type": "object", "required": ["id", "answer", "position"],
          "properties": { "id": { "type": "string" }, "answer": { "type": "string" }, "position": { "type": "object", "required": ["x", "y"], "properties": { "x": { "type": "number", "minimum": 0, "maximum": 100 }, "y": { "type": "number", "minimum": 0, "maximum": 100 } } } } } } } } } } }
  ]
}
```

## 10. Full Worked Examples

### Example 1 — DSA practice set (`code`, `mcq`, `fill_blank`)

```
dsa-fundamentals/
├── set.json
└── problems/
    ├── two-sum/{problem.json, statement.md}
    ├── big-o-lookup/{problem.json, statement.md}
    └── binary-search-complexity/{problem.json, statement.md}
```

`set.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "dsa-fundamentals",
  "title": "DSA Fundamentals",
  "description": "Core data structures and algorithms practice: arrays, hashing, and search.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "tags": ["dsa", "interview-prep"],
  "language": "en",
  "problems": [
    { "id": "two-sum", "path": "problems/two-sum" },
    { "id": "big-o-lookup", "path": "problems/big-o-lookup" },
    { "id": "binary-search-complexity", "path": "problems/binary-search-complexity" }
  ]
}
```

`problems/two-sum/statement.md`:
```markdown
Given an array of integers `nums` and an integer `target`, return the
indices of the two numbers that add up to `target`. Assume exactly one
solution exists and you may not use the same element twice.

Example: Input: nums = [2, 7, 11, 15], target = 9 → Output: [0, 1]
```

`problems/two-sum/problem.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "two-sum",
  "type": "code",
  "title": "Two Sum",
  "difficulty": "easy",
  "tags": ["arrays", "hash-map"],
  "topics": ["hashing"],
  "companies": ["amazon", "google"],
  "points": 25,
  "time_limit_mins": 15,
  "hints": [
    "Think about what you'd need to already know about earlier numbers to answer in one pass.",
    "A hash map from value to index lets you check for a complement in O(1).",
    "For each number n, check if (target - n) is already in the map before inserting n."
  ],
  "explanation": "Iterate once, keeping a map from value to index. For each number n, check whether target - n is already in the map. O(n) time, O(n) space.",
  "type_config": {
    "languages": ["python", "javascript"],
    "starter_code": { "python": "def two_sum(nums, target):\n    pass\n" },
    "test_cases": [
      { "id": "tc1", "input": { "nums": [2, 7, 11, 15], "target": 9 }, "expected": [0, 1], "is_hidden": false },
      { "id": "tc2", "input": { "nums": [3, 2, 4], "target": 6 }, "expected": [1, 2], "is_hidden": false },
      { "id": "tc3", "input": { "nums": [1, 5, 3, 8], "target": 11 }, "expected": [2, 3], "is_hidden": true }
    ],
    "solutions": { "python": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n" },
    "time_complexity": "O(n)",
    "space_complexity": "O(n)"
  }
}
```

`problems/big-o-lookup/statement.md`:
```markdown
What is the average-case time complexity of a lookup in a well-sized hash
table (a good hash function, load factor kept low)?
```

`problems/big-o-lookup/problem.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "big-o-lookup",
  "type": "mcq",
  "title": "Hash table average lookup time",
  "difficulty": "easy",
  "points": 10,
  "explanation": "With a good hash function and a load factor kept low, each bucket holds a near-constant number of entries on average, giving O(1) average-case lookup.",
  "type_config": {
    "options": [
      { "id": "a", "text": "O(1)" }, { "id": "b", "text": "O(log n)" },
      { "id": "c", "text": "O(n)" }, { "id": "d", "text": "O(n log n)" }
    ],
    "answer": "a",
    "shuffle_options": true
  }
}
```

`problems/binary-search-complexity/statement.md`:
```markdown
A binary search on a sorted array of `n` elements runs in {{b1}} time. The
maximum number of comparisons needed in the worst case is {{b2}}.
```

`problems/binary-search-complexity/problem.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "binary-search-complexity",
  "type": "fill_blank",
  "title": "Binary search complexity",
  "difficulty": "easy",
  "points": 10,
  "explanation": "Each comparison halves the remaining search space, giving ceil(log2(n)) comparisons in the worst case, i.e. O(log n) time.",
  "type_config": {
    "blanks": [
      { "id": "b1", "answer": "O(log n)", "type": "text", "case_sensitive": false },
      { "id": "b2", "answer": "ceil(log2(n))", "type": "expression" }
    ]
  }
}
```

### Example 2 — Science quiz (`mcq`, `match`, `numerical`)

```
intro-chemistry-quiz/
├── set.json
└── problems/
    ├── periodic-table-groups/{problem.json, statement.md}
    ├── match-element-symbols/{problem.json, statement.md}
    └── molar-mass-calc/{problem.json, statement.md}
```

`set.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "intro-chemistry-quiz",
  "title": "Intro Chemistry Quiz",
  "description": "A short quiz covering the periodic table, element symbols, and basic stoichiometry.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "tags": ["chemistry", "quiz"],
  "language": "en",
  "problems": [
    { "id": "periodic-table-groups", "path": "problems/periodic-table-groups" },
    { "id": "match-element-symbols", "path": "problems/match-element-symbols" },
    { "id": "molar-mass-calc", "path": "problems/molar-mass-calc" }
  ]
}
```

`problems/periodic-table-groups/statement.md`:
```markdown
Which group of the periodic table contains the noble gases — elements that
are (almost entirely) chemically inert under normal conditions?
```

`problems/periodic-table-groups/problem.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "periodic-table-groups",
  "type": "mcq",
  "title": "Noble gas group",
  "difficulty": "easy",
  "points": 10,
  "explanation": "Group 18 contains the noble gases: helium, neon, argon, krypton, xenon, radon. Their full outer electron shells make them largely unreactive.",
  "type_config": {
    "options": [
      { "id": "a", "text": "Group 1" }, { "id": "b", "text": "Group 17" },
      { "id": "c", "text": "Group 18" }, { "id": "d", "text": "Group 2" }
    ],
    "answer": "c",
    "shuffle_options": true
  }
}
```

`problems/match-element-symbols/statement.md`:
```markdown
Match each element to its correct chemical symbol.
```

`problems/match-element-symbols/problem.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "match-element-symbols",
  "type": "match",
  "title": "Match element to symbol",
  "difficulty": "easy",
  "points": 15,
  "explanation": "Sodium's symbol Na comes from natrium, Potassium's K from kalium, Iron's Fe from ferrum.",
  "type_config": {
    "pairs": [
      { "left": "Sodium", "right": "Na" }, { "left": "Potassium", "right": "K" },
      { "left": "Iron", "right": "Fe" }, { "left": "Gold", "right": "Au" }
    ],
    "shuffle": true
  }
}
```

`problems/molar-mass-calc/statement.md`:
```markdown
Calculate the molar mass of water, H₂O, in grams per mole. Use H = 1.008
g/mol, O = 16.00 g/mol.
```

`problems/molar-mass-calc/problem.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "molar-mass-calc",
  "type": "numerical",
  "title": "Molar mass of water",
  "difficulty": "medium",
  "points": 15,
  "explanation": "Molar mass = (2 × 1.008) + (1 × 16.00) = 18.016 g/mol ≈ 18.02 g/mol.",
  "type_config": { "answer": 18.02, "tolerance": 0.05, "unit": "g/mol" }
}
```

### Example 3 — Writing assessment (`short_answer`, `essay`)

```
technical-writing-assessment/
├── set.json
└── problems/
    ├── explain-hash-table/{problem.json, statement.md}
    └── distributed-systems-essay/{problem.json, statement.md}
```

`set.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "technical-writing-assessment",
  "title": "Technical Writing Assessment",
  "description": "Free-response problems assessing a candidate's ability to explain technical concepts clearly, in writing.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "tags": ["writing", "assessment"],
  "language": "en",
  "problems": [
    { "id": "explain-hash-table", "path": "problems/explain-hash-table" },
    { "id": "distributed-systems-essay", "path": "problems/distributed-systems-essay" }
  ]
}
```

`problems/explain-hash-table/statement.md`:
```markdown
In your own words, explain why a hash table gives O(1) average-case lookup
time. Write for an audience that understands arrays but has never seen a
hash table before.
```

`problems/explain-hash-table/problem.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "explain-hash-table",
  "type": "short_answer",
  "title": "Explain hash table lookup complexity",
  "difficulty": "medium",
  "points": 10,
  "time_limit_mins": 10,
  "type_config": {
    "max_words": 100,
    "grading": "manual",
    "rubric": "Should mention: (1) a hash function maps keys to bucket indices in O(1); (2) with a good hash function and low load factor, each bucket holds ~O(1) items; (3) this is average-case, not worst-case."
  }
}
```

`problems/distributed-systems-essay/statement.md`:
```markdown
Discuss the CAP theorem and its implications for distributed database
design. Define the theorem, explain the fundamental tradeoff, and
illustrate it with at least one real-world system.
```

`problems/distributed-systems-essay/problem.json`:
```json
{
  "opf_version": "0.1.0",
  "id": "distributed-systems-essay",
  "type": "essay",
  "title": "CAP theorem and distributed database design",
  "difficulty": "hard",
  "points": 30,
  "time_limit_mins": 30,
  "type_config": {
    "min_words": 200,
    "max_words": 1000,
    "grading": "manual",
    "rubric": "(1) Correctly defines Consistency, Availability, Partition tolerance. (2) Explains the tradeoff under partition. (3) Gives a concrete real system example and correctly classifies its tradeoff. (4) Clear, well-organized writing."
  }
}
```

---

*End of OPF v0.1.0 specification. Part of OES — Open Education Standards,
released under CC0 1.0.*
