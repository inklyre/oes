# File Structure

## Layout

Every OPF set is a single `set.json`, typically at the root of a git
repository:

```
my-practice-set/
├── set.json
└── questions/                     (optional — only if you co-locate questions)
    ├── {simple-question-id}.json  (single-file question, statement inline)
    └── {question-id}/             (folder question, e.g. it has assets/)
        ├── question.json
        ├── statement.md           (present when question.json's "statement" is {file: ...})
        └── assets/                (optional)
```

The `questions/` folder is a convention, not a requirement of the schema
itself — `set.json` only cares that each `questions[]` entry resolves to a
valid [OQF](/specs/oqf/) question, whether that's a co-located `path`
(single-file or folder) under `questions/` or an external `question_url`
pointing at a question hosted elsewhere entirely. See
[OQF's File Structure](/specs/oqf/file-structure) for the two ways a
question can be referenced and the single-file-vs-folder choice.

## Naming rules

| Rule | Detail |
|---|---|
| `set.json` location | Always at the root of the set. |
| `questions[].id` | Kebab-case, unique within the set: `^[a-z0-9]+(-[a-z0-9]+)*$`. Must match the question's folder name when `path` points to a folder; no such constraint for a single-file `path` or a `question_url`. |
| Co-located question folder | Must equal the question's `id`, exactly as in OQF. Only applies when the question uses the folder shape — a single-file question's filename can be anything. |

Same rule as [OCF's](/specs/ocf/file-structure#folder-naming-never-determines-order):
question order is decided only by `questions[]`'s array order in
`set.json`, never by folder name or filesystem listing order. Number
folders for your own browsing convenience if you like — it has no effect
on presentation order.

## File responsibilities

### `set.json`

The entry point. Any consumer (LMS, CLI tool, renderer) fetches this file
first. It carries set-level metadata and the ordered list of questions,
each with an `id`, optional `points`, and exactly one of `path` or
`question_url`. See [Schema Reference](./schema-reference#set-json) for the
full field list.

## Path resolution rules

- Every `path` field in `set.json` is relative to the location of `set.json`
  itself.
- Every `question_url` is a full, absolute URL — the referenced question is
  not assumed to live anywhere near this set's own repo.
- A question's own internal asset paths (e.g. `type_config.image` for the
  `diagram` type) are always relative to that question's own folder, per
  [OQF's path resolution rules](/specs/oqf/file-structure#path-resolution-rules)
  — never relative to `set.json`, even when co-located.
- Consumers must not assume any particular hosting root — resolve all paths
  relative to the file that referenced them, so a set works identically
  whether it's served from GitHub, a CDN, or S3.
