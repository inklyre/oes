# Examples

Several complete, worked OQF questions across different types. Each is
shown as a `question.json` + `statement.md` pair (the folder shape) —
copy either as a starting point for a co-located question inside a set's
`questions/` folder, or as a standalone question in its own repo. Any of
these could equally be authored as a single file instead, by moving
`statement.md`'s contents into an inline `statement` field — see
[File Structure](./file-structure#inline-vs-file-statement) for when
that's worth doing.

[[toc]]

## `two-sum` — `code`

### `statement.md`

```markdown
Given an array of integers `nums` and an integer `target`, return the
indices of the two numbers that add up to `target`.

You may assume each input has exactly one solution, and you may not use the
same element twice.

**Example**

\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
\`\`\`
```

### `question.json`

```json
{
  "oqf_version": "0.1.0",
  "id": "two-sum",
  "type": "code",
  "title": "Two Sum",
  "difficulty": "easy",
  "statement": { "file": "statement.md" },
  "tags": ["arrays", "hash-map"],
  "topics": ["hashing"],
  "companies": ["amazon", "google"],
  "time_limit_mins": 15,
  "hints": [
    "Think about what you'd need to already know about earlier numbers to answer in one pass.",
    "A hash map from value to index lets you check for a complement in O(1).",
    "For each number n, check if (target - n) is already in the map before inserting n."
  ],
  "explanation": "Iterate once, keeping a map from value to index. For each number n, check whether target - n is already in the map; if so, you've found your pair. This runs in O(n) time and O(n) space, compared to O(n^2) for the brute-force nested loop.",
  "references": ["https://en.wikipedia.org/wiki/Hash_table"],
  "type_config": {
    "languages": ["python", "javascript"],
    "starter_code": {
      "python": "def two_sum(nums, target):\n    pass\n",
      "javascript": "function twoSum(nums, target) {\n  \n}\n"
    },
    "test_cases": [
      { "id": "tc1", "input": { "nums": [2, 7, 11, 15], "target": 9 }, "expected": [0, 1], "is_hidden": false },
      { "id": "tc2", "input": { "nums": [3, 2, 4], "target": 6 }, "expected": [1, 2], "is_hidden": false },
      { "id": "tc3", "input": { "nums": [1, 5, 3, 8], "target": 11 }, "expected": [2, 3], "is_hidden": true },
      { "id": "tc4", "input": { "nums": [0, 4, 3, 0], "target": 0 }, "expected": [0, 3], "is_hidden": true }
    ],
    "solutions": {
      "python": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n"
    },
    "time_complexity": "O(n)",
    "space_complexity": "O(n)"
  }
}
```

## `sorting-stable` — `msq`

### `statement.md`

```markdown
Which of the following sorting algorithms are **stable** (preserve the
relative order of equal elements)? Select all that apply.
```

### `question.json`

```json
{
  "oqf_version": "0.1.0",
  "id": "sorting-stable",
  "type": "msq",
  "title": "Which sorting algorithms are stable?",
  "difficulty": "medium",
  "statement": { "file": "statement.md" },
  "tags": ["sorting"],
  "topics": ["sorting-algorithms"],
  "explanation": "Merge sort and insertion sort are stable by construction. Standard quicksort and heapsort are not stable — equal elements can be reordered during partitioning/heapify.",
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

## `binary-search-complexity` — `fill_blank`

### `statement.md`

```markdown
A binary search on a sorted array of `n` elements runs in {{b1}} time.

For an array of size `n`, the maximum number of comparisons needed in the
worst case is {{b2}}.
```

### `question.json`

```json
{
  "oqf_version": "0.1.0",
  "id": "binary-search-complexity",
  "type": "fill_blank",
  "title": "Binary search complexity",
  "difficulty": "easy",
  "statement": { "file": "statement.md" },
  "tags": ["searching", "complexity"],
  "topics": ["binary-search"],
  "explanation": "Each comparison in binary search eliminates half the remaining search space, so the number of comparisons needed is the number of times n can be halved before reaching 1, i.e. ceil(log2(n)). This gives O(log n) time complexity.",
  "type_config": {
    "blanks": [
      { "id": "b1", "answer": "O(log n)", "type": "text", "case_sensitive": false },
      { "id": "b2", "answer": "ceil(log2(n))", "type": "expression" }
    ]
  }
}
```

## `distributed-systems-essay` — `essay`

### `statement.md`

```markdown
Discuss the CAP theorem and its implications for distributed database
design. Your essay should define the theorem, explain the fundamental
tradeoff it describes, and illustrate it with at least one real-world
system.
```

### `question.json`

```json
{
  "oqf_version": "0.1.0",
  "id": "distributed-systems-essay",
  "type": "essay",
  "title": "CAP theorem and distributed database design",
  "difficulty": "hard",
  "statement": { "file": "statement.md" },
  "tags": ["distributed-systems"],
  "topics": ["cap-theorem", "distributed-databases"],
  "time_limit_mins": 30,
  "references": ["https://en.wikipedia.org/wiki/CAP_theorem"],
  "type_config": {
    "min_words": 200,
    "max_words": 1000,
    "grading": "manual",
    "rubric": "(1) Correctly defines Consistency, Availability, and Partition tolerance. (2) Explains that under a network partition, a system must choose between consistency and availability — it cannot guarantee both. (3) Gives a concrete real system example and correctly classifies its tradeoff (e.g. Cassandra favors AP, traditional single-node RDBMS with synchronous replication favors CP). (4) Writing is clear and well-organized."
  }
}
```

## Two questions sharing one stimulus

Demonstrates [Shared Stimuli](./shared-stimuli): a short reading passage,
followed by two `mcq` questions about it, co-located at the set level.

### File tree

```
civics-reading/
├── set.json
├── questions/
│   ├── passage1-q1/
│   │   ├── question.json
│   │   └── statement.md
│   └── passage1-q2/
│       ├── question.json
│       └── statement.md
└── stimuli/
    └── tragedy-of-commons/
        ├── stimulus.json
        └── stimulus.md
```

### `stimuli/tragedy-of-commons/stimulus.json`

```json
{
  "oqf_version": "0.1.0",
  "id": "tragedy-of-commons",
  "title": "The Tragedy of the Commons",
  "tags": ["reading-comprehension", "economics"]
}
```

### `stimuli/tragedy-of-commons/stimulus.md`

```markdown
Shared, unregulated resources — a common grazing pasture, an open fishery,
the atmosphere itself — tend to be overused relative to what any single
user would choose if they alone bore the full cost of their use. Each
individual gains the full benefit of one more unit of use while sharing
the cost of depletion across everyone, so from any one user's perspective
the rational choice is to keep using more, even though the aggregate
effect of everyone reasoning this way is collectively worse for the group.
```

### `questions/passage1-q1/question.json`

```json
{
  "oqf_version": "0.1.0",
  "id": "passage1-q1",
  "type": "mcq",
  "title": "Main idea of the passage",
  "difficulty": "medium",
  "statement": "What is the main idea conveyed by the passage?",
  "stimulus": { "path": "../../stimuli/tragedy-of-commons" },
  "type_config": {
    "options": [
      { "id": "a", "content": "Shared resources tend to be overused without coordination." },
      { "id": "b", "content": "Private ownership always leads to overuse." },
      { "id": "c", "content": "Regulation is the only solution to resource depletion." }
    ],
    "answer": "a"
  }
}
```

### `questions/passage1-q2/question.json`

```json
{
  "oqf_version": "0.1.0",
  "id": "passage1-q2",
  "type": "mcq",
  "title": "Why does the individually rational choice differ from the group-optimal one?",
  "difficulty": "hard",
  "statement": "Why does the individually rational choice differ from the group-optimal one, according to the passage?",
  "stimulus": { "path": "../../stimuli/tragedy-of-commons" },
  "type_config": {
    "options": [
      { "id": "a", "content": "Because each user gets the full benefit of their own use but only bears a fraction of the shared cost." },
      { "id": "b", "content": "Because users are generally unaware the resource is shared." }
    ],
    "answer": "a"
  }
}
```

A consumer walking this set's `questions[]` finds both entries resolve to
the same `../../stimuli/tragedy-of-commons` stimulus and, per
[Shared Stimuli](./shared-stimuli#how-a-consumer-should-render-grouped-questions),
renders the passage once above both questions rather than repeating it.

## Using these examples

1. Rename `id` (in `question.json`) and the folder name to your own
   kebab-case identifier — if you're co-locating the question inside a
   set, the folder name must match `id` exactly.
2. Validate against the [JSON Schema](./schema-reference) before
   publishing.
3. Reference it from an [OPF set](/specs/opf/examples) — either with a
   local `path` if co-located, or a `question_url` if hosted separately.
