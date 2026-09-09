# Question Types

OQF v0.1.0 defines 11 question types. Every `question.json` declares its
type via the top-level `type` field, and carries type-specific configuration
under `type_config`. This page documents every field of every
`type_config` shape, with a complete example for each.

Fields common to all types (`oqf_version`, `id`, `title`, `difficulty`,
`tags`, `topics`, `companies`, `time_limit_mins`, `max_attempts`, `hints`, `explanation`,
`references`) are documented once in the
[Schema Reference](./schema-reference) and omitted from most examples below
for brevity — only `type`, `statement`, and `type_config` are shown unless
a field interacts with type-specific behavior.

Every question has a required `statement` — either the prose inline as a
string, or `{file: "statement.md"}` pointing at a sibling file; each
example below shows one or the other. See
[File Structure](./file-structure#inline-vs-file-statement) for when to
use which. Either way it may include figures and LaTeX math; see
[Markdown Conventions](/markdown-conventions). Any question can also
reference a [shared stimulus](./shared-stimuli) it's asked about, on top
of its own `type_config`.

[[toc]]

## `mcq` — Multiple choice, single answer

Exactly one option is correct.

| Field | Type | Required | Description |
|---|---|---|---|
| `options` | array of option objects | yes | The candidate answers. `id` must be unique within the question. See below. |
| `answer` | string | yes, unless secured | The `id` of the correct option. MUST be omitted here if the question sets a top-level `answer_key` — see [Answer Visibility](/conformance#security-considerations) — in which case a consumer fetches it from there instead. |
| `shuffle_options` | boolean | no | If `true`, a renderer should present options in random order. Default `false`. |

Each option is `{ id, content, score? }`, where `content` is Markdown with
the same full range as `statement` — not a restricted subset. Plain text
is the usual case, but arbitrary Markdown works too: bold/italic, lists,
code fences, LaTeX math, any number of images (a single image for a purely
visual choice like "which diagram...", or several interleaved with text
in whatever order they should render). Image paths are relative to the
question's own folder. Always give every image real alt text — it's the
option's only description for a screen reader or a failed image load.

`score` is optional and almost always absent: by default, selecting the
option named in `answer` is worth full credit and any other option is
worth zero — plain right-or-wrong. Set `score` on one or more options
only when you need something other than that (see the `msq` section
below for a worked partial-credit/penalty example) — a consumer that
sees any `score` on any option SHOULD sum the selected option(s)'
`score` instead of assuming all-or-nothing.

By default `answer` sits right here, inline — the right choice for
ordinary self-practice content. For a **graded question** where the
answer must not reach a learner's client at all, set a top-level
`answer_key` (`{file: "answer-key.json"}` or `{url: "..."}`) instead of
`answer`; the schema requires exactly one of the two:

```json
{
  "oqf_version": "0.1.0",
  "id": "big-o-lookup-secure",
  "type": "mcq",
  "title": "Hash table average lookup time (graded)",
  "statement": "What's the average-case time complexity of a lookup in a well-implemented hash table?",
  "answer_key": { "file": "answer-key.json" },
  "type_config": {
    "options": [
      { "id": "a", "content": "O(1)" },
      { "id": "b", "content": "O(log n)" },
      { "id": "c", "content": "O(n)" },
      { "id": "d", "content": "O(n log n)" }
    ]
  }
}
```

`answer-key.json`, kept out of any repo/host a learner's client can read:

```json
{ "answer": "a" }
```

```json
{
  "oqf_version": "0.1.0",
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

Image-option variant, including an option whose content interleaves text
and two images in sequence:

```json
{
  "type_config": {
    "options": [
      { "id": "a", "content": "![A rooted diagram where each node has at most two children](assets/option-a.png)" },
      { "id": "b", "content": "Before the fix:\n\n![A diagram with a cycle between three nodes](assets/option-b-before.png)\n\nAfter the fix:\n\n![The same diagram with the cycle removed](assets/option-b-after.png)" }
    ],
    "answer": "a"
  }
}
```

## `msq` — Multiple choice, multiple answers

One or more options are correct; the learner must select all of them and
none of the incorrect ones to be marked fully correct.

| Field | Type | Required | Description |
|---|---|---|---|
| `options` | array of option objects | yes | The candidate answers — same `{id, content, score?}` shape as `mcq`, see above. |
| `answers` | array of string | yes, unless secured | The `id`s of every correct option. Same `answer_key` opt-out as `mcq` — set `{"answers": [...]}` in the referenced document instead, and omit `answers` here. |
| `shuffle_options` | boolean | no | Default `false`. |

```json
{
  "oqf_version": "0.1.0",
  "id": "sorting-stable",
  "type": "msq",
  "title": "Which sorting algorithms are stable?",
  "difficulty": "medium",
  "statement": "Select every sorting algorithm below that is stable (preserves the relative order of equal elements).",
  "type_config": {
    "options": [
      { "id": "a", "content": "Merge sort" },
      { "id": "b", "content": "Quick sort" },
      { "id": "c", "content": "Insertion sort" },
      { "id": "d", "content": "Heap sort" }
    ],
    "answers": ["a", "c"],
    "shuffle_options": true
  }
}
```

Partial credit and a penalty for a tempting wrong answer, using
`score` on individual options instead of the all-or-nothing default —
here, each correct option is worth half credit on its own, and the
common misconception ("Heap sort" is often mistaken for stable) costs a
point rather than just contributing nothing:

```json
{
  "oqf_version": "0.1.0",
  "id": "sorting-stable-partial-credit",
  "type": "msq",
  "title": "Which sorting algorithms are stable?",
  "statement": "Select every sorting algorithm below that is stable.",
  "type_config": {
    "options": [
      { "id": "a", "content": "Merge sort", "score": 0.5 },
      { "id": "b", "content": "Quick sort", "score": 0 },
      { "id": "c", "content": "Insertion sort", "score": 0.5 },
      { "id": "d", "content": "Heap sort", "score": -1 }
    ],
    "answers": ["a", "c"]
  }
}
```

## `fill_blank` — Fill in the blank

One or more blanks embedded in `statement.md`, each marked inline with
`{{blank-id}}`.

| Field | Type | Required | Description |
|---|---|---|---|
| `blanks` | array of blank objects | yes | See below. |
| `blanks[].id` | string | yes | Matches a `{{id}}` marker in `statement.md`. |
| `blanks[].answer` | string | yes | The accepted answer. |
| `blanks[].type` | string | yes | One of `text`, `expression`, `number`. Hints a renderer how to validate/format input. |
| `blanks[].case_sensitive` | boolean | no | Only meaningful for `type: "text"`. Default `true`. |

`statement.md`:
```markdown
A binary search on a sorted array of `n` elements runs in {{b1}} time.
For an array of size `n`, the maximum number of comparisons needed is
{{b2}}.
```

`question.json`:
```json
{
  "oqf_version": "0.1.0",
  "id": "binary-search-complexity",
  "type": "fill_blank",
  "title": "Binary search complexity",
  "difficulty": "easy",
  "statement": { "file": "statement.md" },
  "type_config": {
    "blanks": [
      { "id": "b1", "answer": "O(log n)", "type": "text", "case_sensitive": false },
      { "id": "b2", "answer": "ceil(log2(n))", "type": "expression" }
    ]
  }
}
```

## `code` — Write code, executed against test cases

| Field | Type | Required | Description |
|---|---|---|---|
| `languages` | array of string | yes | Accepted language identifiers, e.g. `"python"`, `"javascript"`, `"java"`, `"cpp"`. |
| `starter_code` | object | no | Map of language → starter code, pre-filled in the editor. Each entry is either a plain string (the whole editable body — the common case) or `{prefix?, template, suffix?}`, splitting it into a fixed, non-editable prefix/suffix around an editable `template`, for boilerplate or harness code the learner shouldn't see or touch. |
| `test_cases` | array of test case objects | yes | See below. |
| `test_cases[].id` | string | yes | Unique within the question. |
| `test_cases[].input` | any | yes | Input passed to the submitted solution. Shape is question-defined. |
| `test_cases[].expected` | any | yes, unless secured and hidden | Expected output for that input. If this question sets a top-level `answer_key`: MUST be omitted for `is_hidden: true` test cases (supplied from `answer_key` instead, keyed by `id`), but stays required for non-hidden ones, since those are meant to be visible. |
| `test_cases[].is_hidden` | boolean | no | If `true`, the test case's input/expected are not shown to the learner, only pass/fail. Default `false`. |
| `test_cases[].points` | number | no | This test case's weight, for a consumer computing a proportional score across test cases instead of pure binary pass/fail. Absent means the consumer decides its own weighting (e.g. equal weight) — purely optional input to a scoring policy OQF itself doesn't mandate. |
| `test_cases[].time_limit_ms` | integer | no | Overrides `time_limit_ms` for this test case only — for a stress test that legitimately needs more time than the rest. |
| `test_cases[].memory_limit_mb` | integer | no | Overrides `memory_limit_mb` for this test case only. |
| `solutions` | object | no | Map of language → reference solution string. MUST be omitted if this question sets a top-level `answer_key` — reference solutions are always fully secret when securing a code question. |
| `time_limit_ms` | integer | no | Default execution time limit per test case, in milliseconds, for a judge running the submission. OQF doesn't mandate a default when absent — that's the judge's own call. |
| `memory_limit_mb` | integer | no | Default memory limit per test case, in megabytes. Same "judge decides" fallback when absent. |
| `time_complexity` | string | no | Expected time complexity, shown in the explanation, e.g. `"O(n)"`. |
| `space_complexity` | string | no | Expected space complexity, e.g. `"O(n)"`. |

**Two legitimate, equally valid postures, not one "correct" one.**
`is_hidden`/`answer_key` cover *secured grading* — hide the reference
solution and some test cases, appropriate when there's a single correct
answer worth protecting. But a `code` question is often graded entirely
by its test suite, with no separate secret to hide at all: the tests
themselves *are* the specification, meant to be fully visible, and
correctness is enforced by running submitted code in a sandbox — the
execution boundary is the security boundary, not the response payload.
For that case, set every `test_cases[]` entry's `is_hidden` to `false`
(or omit it) and don't set `answer_key`/`solutions` at all; there is
nothing else to configure; this is a first-class intended usage of the
type, not merely "the absence of the secure pattern."

```json
{
  "oqf_version": "0.1.0",
  "id": "two-sum-code",
  "type": "code",
  "title": "Two Sum",
  "difficulty": "easy",
  "statement": { "file": "statement.md" },
  "type_config": {
    "languages": ["python", "javascript"],
    "starter_code": {
      "python": "def two_sum(nums, target):\n    pass\n",
      "javascript": "function twoSum(nums, target) {\n  \n}\n"
    },
    "test_cases": [
      { "id": "tc1", "input": { "nums": [2, 7, 11, 15], "target": 9 }, "expected": [0, 1], "is_hidden": false, "points": 1 },
      { "id": "tc2", "input": { "nums": [3, 2, 4], "target": 6 }, "expected": [1, 2], "is_hidden": false, "points": 1 },
      { "id": "tc3", "input": { "nums": [1, 5, 3, 8], "target": 11 }, "expected": [2, 3], "is_hidden": true, "points": 2 }
    ],
    "solutions": {
      "python": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n"
    },
    "time_limit_ms": 1000,
    "memory_limit_mb": 256,
    "time_complexity": "O(n)",
    "space_complexity": "O(n)"
  }
}
```

Locked boilerplate around an editable region — useful when the learner
should implement one function but shouldn't see or edit the harness that
calls it:

```json
"starter_code": {
  "python": {
    "prefix": "class Solution:\n",
    "template": "    def two_sum(self, nums, target):\n        pass\n",
    "suffix": "\nif __name__ == \"__main__\":\n    print(Solution().two_sum([2, 7, 11, 15], 9))\n"
  }
}
```

Graded variant — `solutions` and the hidden test case's `expected` both move to `answer_key`, keyed by id; non-hidden test cases keep `expected` inline since they're meant to be visible:

```json
{
  "type_config": {
    "languages": ["python", "javascript"],
    "test_cases": [
      { "id": "tc1", "input": { "nums": [2, 7, 11, 15], "target": 9 }, "expected": [0, 1], "is_hidden": false },
      { "id": "tc2", "input": { "nums": [3, 2, 4], "target": 6 }, "expected": [1, 2], "is_hidden": false },
      { "id": "tc3", "input": { "nums": [1, 5, 3, 8], "target": 11 }, "is_hidden": true }
    ]
  }
}
```

`answer-key.json`:

```json
{
  "solutions": { "python": "def two_sum(nums, target):\n    ...\n" },
  "test_cases": [
    { "id": "tc3", "expected": [2, 3] }
  ]
}
```

## `match` — Match two columns

Left and right are two independent, id-keyed lists of Markdown-content
items (the same `{id, content}` shape as `mcq` options) — the correct
associations live in a separate `pairs` list, keyed by those ids. This
means revealing `left`/`right` reveals nothing about which pairs
correctly, unlike an earlier design where each pair's two values sat
together in one object.

| Field | Type | Required | Description |
|---|---|---|---|
| `left` | array of `{id, content}` | yes | The left-hand column. `content` is Markdown, same conventions as options. |
| `right` | array of `{id, content}` | yes | The right-hand column. MAY include more items than `left`, as unmatched distractors. |
| `pairs` | array of `{left_id, right_id}` | yes, unless secured | The correct associations — each `left_id`/`right_id` must reference a real id in `left`/`right` (not schema-enforced). Required here unless this question sets a top-level `answer_key`, in which case it MUST be omitted here and supplied from there instead, in the same shape. |
| `shuffle` | boolean | no | If `true`, a renderer presents `right` in random order — safe to do freely, since correctness is keyed by id, not position. Default `true`. |

```json
{
  "oqf_version": "0.1.0",
  "id": "complexity-match",
  "type": "match",
  "title": "Match algorithm to complexity",
  "difficulty": "medium",
  "statement": "Match each algorithm on the left to its typical time complexity on the right.",
  "type_config": {
    "left": [
      { "id": "l1", "content": "Hash table lookup" },
      { "id": "l2", "content": "Binary search" },
      { "id": "l3", "content": "Linear scan" },
      { "id": "l4", "content": "Merge sort" }
    ],
    "right": [
      { "id": "r1", "content": "O(1)" },
      { "id": "r2", "content": "O(log n)" },
      { "id": "r3", "content": "O(n)" },
      { "id": "r4", "content": "O(n log n)" }
    ],
    "pairs": [
      { "left_id": "l1", "right_id": "r1" },
      { "left_id": "l2", "right_id": "r2" },
      { "left_id": "l3", "right_id": "r3" },
      { "left_id": "l4", "right_id": "r4" }
    ],
    "shuffle": true
  }
}
```

Graded variant — `pairs` moves to `answer_key`, `left`/`right` stay exactly as above:

```json
{ "answer_key": { "file": "answer-key.json" } }
```

`answer-key.json`:

```json
{
  "pairs": [
    { "left_id": "l1", "right_id": "r1" },
    { "left_id": "l2", "right_id": "r2" },
    { "left_id": "l3", "right_id": "r3" },
    { "left_id": "l4", "right_id": "r4" }
  ]
}
```

## `order` — Arrange items in sequence

`items` is an id-keyed list, same `{id, content}` shape as `match`'s
columns. `items` MAY be stored in any order — its position in the array
carries no meaning by itself, only `correct_order` does. This is
deliberate: it means revealing `items` never reveals the answer,
regardless of what order they happen to be authored in.

| Field | Type | Required | Description |
|---|---|---|---|
| `items` | array of `{id, content}` | yes | The items to be ordered, in any order — see above. |
| `correct_order` | array of string | yes, unless secured | The ids from `items`, in correct sequence — must reference every id in `items` exactly once (not schema-enforced). Required here unless this question sets a top-level `answer_key`, in which case it MUST be omitted here and supplied from there instead, in the same shape. |
| `shuffle` | boolean | no | If `true`, present `items` in random order initially — safe to do freely, since correctness is keyed by id, not position. Default `true`. |

```json
{
  "oqf_version": "0.1.0",
  "id": "quicksort-steps",
  "type": "order",
  "title": "Order the steps of Quicksort",
  "difficulty": "medium",
  "statement": "Arrange the following steps into the order Quicksort actually performs them.",
  "type_config": {
    "items": [
      { "id": "s1", "content": "Choose a pivot element" },
      { "id": "s2", "content": "Partition the array around the pivot" },
      { "id": "s3", "content": "Recursively sort the left partition" },
      { "id": "s4", "content": "Recursively sort the right partition" }
    ],
    "correct_order": ["s1", "s2", "s3", "s4"],
    "shuffle": true
  }
}
```

Graded variant — `correct_order` moves to `answer_key`, `items` stays
exactly as above:

```json
{ "answer_key": { "file": "answer-key.json" } }
```

`answer-key.json`:

```json
{ "correct_order": ["s1", "s2", "s3", "s4"] }
```

## `numerical` — Numeric answer with tolerance

| Field | Type | Required | Description |
|---|---|---|---|
| `answer` | number | yes, unless secured | The correct numeric value. Same `answer_key` opt-out as `mcq` — set `{"answer": 42.5}` in the referenced document instead, and omit `answer` here. |
| `tolerance` | number | no | Acceptable deviation from `answer`, interpreted per `tolerance_type`. Default `0`. |
| `tolerance_type` | string | no | `"absolute"` (default) or `"percentage"`. `"absolute"`: correct if within `answer ± tolerance`, regardless of `answer`'s magnitude. `"percentage"`: correct if within `answer ± (tolerance/100 * \|answer\|)` — use this when the correct answer's magnitude varies a lot across similar questions and a fixed absolute margin wouldn't scale (an absolute tolerance of 10 is far too tight for an answer near 1,500,000 and far too loose for one near 5). |
| `unit` | string | no | Unit label shown alongside the input, e.g. `"ms"`. Not used in comparison. |

```json
{
  "oqf_version": "0.1.0",
  "id": "avg-lookup-time",
  "type": "numerical",
  "title": "Average lookup time in a well-sized hash table",
  "difficulty": "easy",
  "statement": "A well-sized hash table with a good hash function has an average lookup time of approximately what, in milliseconds?",
  "type_config": {
    "answer": 42.5,
    "tolerance": 0.1,
    "unit": "ms"
  }
}
```

Percentage-tolerance variant, for an answer whose correct magnitude
varies too much for a fixed absolute margin to make sense:

```json
{
  "type_config": {
    "answer": 1500000,
    "tolerance": 1,
    "tolerance_type": "percentage",
    "unit": "requests/day"
  }
}
```

## `short_answer` — Free text, manually graded

| Field | Type | Required | Description |
|---|---|---|---|
| `max_words` | integer | no | Suggested word limit shown to the learner. |
| `grading` | string | yes | Must be `"manual"` in v0.1.0. |
| `rubric` | string or structured object | no | Grading guidance — a plain string, or `{criteria: [{name, description?, points?}]}`. See below. |

```json
{
  "oqf_version": "0.1.0",
  "id": "why-hash-tables",
  "type": "short_answer",
  "title": "Why does a hash table give O(1) average lookup?",
  "difficulty": "medium",
  "statement": "In your own words, explain why a well-implemented hash table achieves O(1) average-case lookup time.",
  "type_config": {
    "max_words": 100,
    "grading": "manual",
    "rubric": "Should mention time and space tradeoff, and reference amortized analysis or a good hash function distributing keys evenly."
  }
}
```

`rubric` as a structured object instead of a string:

```json
{
  "type_config": {
    "grading": "manual",
    "rubric": {
      "criteria": [
        { "name": "Explains time/space tradeoff", "points": 5 },
        { "name": "References amortized analysis or hash quality", "points": 5 }
      ]
    }
  }
}
```

## `essay` — Long form, rubric graded

| Field | Type | Required | Description |
|---|---|---|---|
| `min_words` | integer | no | Minimum expected word count. |
| `max_words` | integer | no | Maximum expected word count. |
| `grading` | string | yes | Must be `"manual"` in v0.1.0. |
| `rubric` | string or structured object | no | Grading criteria — same shape as `short_answer`'s `rubric` above, string or `{criteria: [...]}`. |

```json
{
  "oqf_version": "0.1.0",
  "id": "cap-theorem-essay",
  "type": "essay",
  "title": "Discuss the CAP theorem's implications for distributed database design",
  "difficulty": "hard",
  "statement": "Discuss the CAP theorem's implications for distributed database design, with a real-world example.",
  "type_config": {
    "min_words": 200,
    "max_words": 1000,
    "grading": "manual",
    "rubric": "See rubric criteria: (1) correctly defines Consistency, Availability, Partition tolerance; (2) explains why only two of three can be guaranteed under partition; (3) gives a real system example (e.g. Cassandra vs. traditional RDBMS) and correctly classifies its tradeoff."
  }
}
```

## `diagram` — Label parts of an image

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | string | yes | Path, relative to the question's folder, to the image asset (e.g. `assets/diagram.png`). |
| `labels` | array of label objects | yes | See below. |
| `labels[].id` | string | yes | Unique within the question. |
| `labels[].answer` | string | yes, unless secured | The correct label text for this point. Required on every label here unless this question sets a top-level `answer_key`, in which case it MUST be omitted from every label here and supplied from there instead, keyed by `id`. |
| `labels[].position` | `{ x, y }` | yes | Percentage-based coordinates (0–100) from the image's top-left corner, marking where the label point sits. Stays public even when secured — it's where to click, not what the answer is. |

```json
{
  "oqf_version": "0.1.0",
  "id": "bst-parts",
  "type": "diagram",
  "title": "Label the parts of this binary search tree",
  "difficulty": "easy",
  "statement": "Click each labeled point on the diagram and identify what it represents.",
  "type_config": {
    "image": "assets/bst-diagram.png",
    "labels": [
      { "id": "l1", "answer": "root", "position": { "x": 50, "y": 10 } },
      { "id": "l2", "answer": "left subtree", "position": { "x": 25, "y": 45 } },
      { "id": "l3", "answer": "right subtree", "position": { "x": 75, "y": 45 } },
      { "id": "l4", "answer": "leaf node", "position": { "x": 12, "y": 80 } }
    ]
  }
}
```

Graded variant — `answer` is dropped from every label, `position` stays:

```json
{
  "answer_key": { "file": "answer-key.json" },
  "type_config": {
    "image": "assets/bst-diagram.png",
    "labels": [
      { "id": "l1", "position": { "x": 50, "y": 10 } },
      { "id": "l2", "position": { "x": 25, "y": 45 } }
    ]
  }
}
```

`answer-key.json`:

```json
{
  "labels": [
    { "id": "l1", "answer": "root" },
    { "id": "l2", "answer": "left subtree" }
  ]
}
```

## `submission` — Deliverable-based, manually graded

For a project, capstone, or portfolio piece where the learner submits a
file, a URL, or a link to a git repo rather than answering inline. Always
manually graded. Grading *workflow* — due dates, peer review, group
submissions — is a consumer/LMS policy concern, not part of this content,
the same reasoning that keeps assessment policy out of OPF.

| Field | Type | Required | Description |
|---|---|---|---|
| `formats` | array of string | yes | Which submission format(s) are accepted, from `"file"`, `"url"`, `"git_repo"`. Minimum 1. |
| `max_file_size_mb` | number | no | Only meaningful when `"file"` is an accepted format. |
| `allowed_file_types` | array of string | no | File extensions or MIME patterns accepted, e.g. `["pdf", "zip"]`. Only meaningful when `"file"` is an accepted format. |
| `grading` | string | yes | Must be `"manual"`. |
| `rubric` | string or structured object | no | Same shape as `essay`/`short_answer`'s `rubric` — a plain string or `{criteria: [...]}`. |

```json
{
  "oqf_version": "0.1.0",
  "id": "capstone-project",
  "type": "submission",
  "title": "Build and deploy a small REST API",
  "difficulty": "hard",
  "statement": "Design, build, and deploy a REST API for a simple todo-list service with at least three endpoints. Submit a link to your deployed API and its source repository.",
  "type_config": {
    "formats": ["url", "git_repo"],
    "grading": "manual",
    "rubric": {
      "criteria": [
        { "name": "API is deployed and reachable", "points": 20 },
        { "name": "Endpoints follow REST conventions", "points": 20 },
        { "name": "Code is organized and readable", "points": 10 }
      ]
    }
  }
}
```

## See also

- [Schema Reference](./schema-reference) — validated shape of every field,
  including the common fields shared by all types.
- [Shared Stimuli](./shared-stimuli) — grouping several questions off one
  shared passage, diagram, or dataset.
- [Examples](./examples) — worked questions built from these types.
- [OPF Schema Reference](/specs/opf/schema-reference) — how a set assigns
  `points` to a question and chooses between a co-located `path` and an
  external `question_url`.
