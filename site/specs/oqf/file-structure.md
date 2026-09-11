# File Structure

## Layout

A question comes in two shapes, and an author picks whichever fits the
question — this is a per-question choice, not a spec-wide one.

**Single-file** — for a simple question with no images, no shared
stimulus, and a short statement: just one file, nothing else.

```
two-sum.json           (question.json's content, statement inline)
```

**Folder** — once a question needs its own binary assets (a diagram, an
image-based option), or its statement is long/reused enough to be worth
keeping as its own Markdown file:

```
{question-root}/
├── question.json
├── statement.md        (optional — see "Inline vs. file statement" below)
└── assets/              (optional — images, etc., referenced by question.json)
```

Independently of single-file-vs-folder, every question also chooses how
its *statement* is authored:

## Inline vs. file statement

`statement` is always required on `question.json`, and its *shape* is
what says which mode you're in — not a separate flag, and not "which
files happen to exist alongside it":

- **Inline** — `statement` is a plain string, the prose itself, as
  Markdown. No separate file needed at all — the simplest option, and
  what makes single-file authoring possible.
  ```json
  "statement": "Given an array of integers `nums`..."
  ```
- **File** — `statement` is an object pointing at a sibling Markdown
  file, conventionally `statement.md`, path relative to this question's
  own folder:
  ```json
  "statement": { "file": "statement.md" }
  ```
  Better once the prose is long, reused, or you'd rather edit it in a
  plain Markdown file/editor than inline inside JSON.

Both use identical Markdown conventions (figures, LaTeX math, `{{blank-id}}`
markers for `fill_blank` — see below and
[Markdown Conventions](/markdown-conventions)). Neither is "the real" way
to author a question; pick per-question based on whether the prose is
short and one-off or long/reused. A question that also has `assets/` (for
a diagram or image options) can still use an inline `statement` — the two
choices are independent.

Making `statement` required, with its value's shape as the sole signal,
closes both failure modes an earlier, purely-optional design left open: a
question can no longer end up with *no* statement source at all (the
field is mandatory), and it can no longer end up with *two* — an inline
string and a stray `statement.md` disagreeing with each other — since one
field can't hold both shapes at once. What a schema validator still can't
confirm on its own is whether a referenced `statement.md` actually exists
at that path — the same category of gap `path`/`question_url` already
have everywhere else in OES; see the
[Versioning & Conformance](/conformance) page's note on what schema
validation does and doesn't catch.

## Two ways to reference a question

**Co-located** (the common case) — the question lives inside an OPF set's
own repo, conventionally under `questions/{question-id}/`:

```
my-practice-set/
├── set.json
└── questions/
    ├── two-sum.json              (single-file, inline statement)
    └── complexity-match/          (folder, e.g. it has assets/)
        ├── question.json
        └── statement.md
```

The set references a folder-based question with a relative `path` ending
in the folder name (`"path": "questions/complexity-match"`), or a
single-file question with a `path` ending in `.json`
(`"path": "questions/two-sum.json"`). See
[OPF's Schema Reference](/specs/opf/schema-reference) for exactly how the
two are distinguished.

**Standalone / shared** — the question lives in its own repo (or as one of
many in a shared question-bank repo), with no relationship to any
particular set's file tree:

```
my-question-bank/
├── two-sum.json
├── big-o-lookup.json
├── complexity-match/
│   ├── question.json
│   └── statement.md
└── ...
```

Any set can reference a question here with an absolute `question_url`
(pointing directly at the `.json` file, wherever it's hosted) instead of a
`path`. This is the capability that makes splitting questions out of OPF
worthwhile: the same question can be reused across many sets without being
copied. A question can also optionally reference a shared **stimulus** it's
asked about, following this exact same local/external pattern — see
[Shared Stimuli](./shared-stimuli).

## Naming rules

| Rule | Detail |
|---|---|
| `question-id` format | kebab-case: lowercase letters, digits, and hyphens only. Pattern: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| Folder/file name (co-located only) | When referenced via a folder `path`, the folder name **must** equal the question's `id`. When referenced via a single-file `path` or a `question_url`, there's no such constraint — the filename can be anything, since the question is addressed by its full path/URL, not derived from it. |
| `question.json` location | The root of the question's own folder, or the single file itself when there's no folder. |
| `statement.md` location | When `statement` is `{file}` (as opposed to an inline string), always at the path `statement.file` gives, relative to the question's own folder — conventionally `statement.md` right alongside `question.json`. Using a file necessarily requires the folder shape, since a lone `.json` file has no "alongside" to put it in. |

## File responsibilities

### `question.json`

All structured data for the question: its `type`, grading configuration
(`type_config`), and metadata (difficulty, tags, hints, etc.) — plus its
required `statement`, either inline or as a `{file}` pointer. This is the
only file a consumer needs to render and grade a question, aside from the
statement text itself when `statement` points at a separate file instead
of holding it directly. See
[Schema Reference](./schema-reference#question-json).

### `statement.md`

The question's prose, when authored as its own file (pointed at by
`statement: {file: "statement.md"}`) rather than inline — **pure
Markdown, no frontmatter, no metadata, no exceptions.** All structured
data belongs in `question.json`. This separation keeps the statement
portable: it can be rendered by any Markdown renderer without needing to
understand OQF at all. May include figures and LaTeX math — see
[Markdown Conventions](/markdown-conventions).

For `fill_blank` questions, blanks are marked inline in the Markdown (inline
`statement` field or `statement.md`, the marker syntax is identical) using
the blank's `id` wrapped in double curly braces, e.g. `{{b1}}`. Renderers
replace these markers with input fields.

### `assets/` (optional)

An optional folder inside a question's directory for any binary asset the
question uses — a figure embedded in the statement (inline `statement`
field or `statement.md`, either way via standard Markdown image syntax),
an image referenced from `type_config` (the `diagram` type's `image`
field), or an image embedded in an `mcq`/`msq` option's `content` (also
standard Markdown image syntax — an option can hold any number of images,
interleaved with text). Referenced using paths relative to the question's
own folder, e.g. `"image": "assets/diagram.png"` or
`![alt](assets/option-a.png)`. Since `assets/` needs somewhere to live,
a question that uses it needs the folder shape, even if its `statement`
is inline.

## Path resolution rules

- A question's own asset paths (e.g. `type_config.image` for the `diagram`
  type) are always relative to that question's own folder — never to
  whatever set (if any) references it.
- Consumers must not assume any particular hosting root — resolve all
  paths relative to the file that referenced them, so a question works
  identically whether it's co-located, standalone, or part of a shared
  question bank.
