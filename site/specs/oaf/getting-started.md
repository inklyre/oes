# Getting Started

Building the smallest possible valid OAF article: one folder, two files.

## 1. Create the folder structure

```bash
mkdir -p my-first-article
cd my-first-article
```

## 2. Write the article

`content.md` — pure Markdown, no frontmatter:

```markdown
Python variables don't need a declared type — the type is inferred from the
value you assign.

\`\`\`python
name = "Ada"        # str
age = 36             # int
height_m = 1.68       # float
is_learning = True    # bool
\`\`\`

Use `type(x)` to check a value's type at any point. See the
[official docs](https://docs.python.org/3/library/stdtypes.html) for the
full list of built-in types.
```

Note the plain Markdown link to the official docs — that's how OAF handles
"further reading," not a separate structured field.

## 3. Write the article's metadata

`article.json`:

```json
{
  "oaf_version": "0.1.0",
  "id": "my-first-article",
  "title": "Variables and Types",
  "description": "Python's core built-in types and how variables work.",
  "estimated_mins": 5
}
```

## 4. Validate it

```bash
npx ajv-cli validate \
  -s https://oes.inklyre.org/schemas/oaf/v0.2.0/article.schema.json \
  -d article.json
```

## 5. Use it

An article isn't consumed standalone by an LMS — it's referenced from an
[OCF](/specs/ocf/) lesson's `items[]` list (as a `type: "article"` entry),
either co-located (a relative `path`) or externally (an `article_url`,
for an article shared across multiple lessons/courses). See
[OCF's Getting Started](/specs/ocf/getting-started) for building a lesson
around one.

Hosting works the same as any other OES spec — see
[OPF's Hosting guide](/specs/opf/hosting) for the general options.

## What's next

- Read [File Structure](./file-structure) for the co-located vs. standalone
  distinction.
- Read [Examples](./examples) for a complete worked article.
- Read [Editor Setup](/editor-setup) for inline validation/autocomplete
  while hand-editing `article.json`.
