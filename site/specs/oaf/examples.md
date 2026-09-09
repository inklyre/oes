# Examples

A complete, worked OAF article.

## `variables-and-types`

### File tree

```
variables-and-types/
├── article.json
└── content.md
```

### `content.md`

```markdown
Python variables don't need a declared type — the type is inferred from the
value you assign.

\`\`\`python
name = "Ada"        # str
age = 36             # int
height_m = 1.68       # float
is_learning = True    # bool
\`\`\`

Use `type(x)` to check a value's type at any point. If you want the full
list of Python's built-in types, see the
[official documentation](https://docs.python.org/3/library/stdtypes.html).
```

### `article.json`

```json
{
  "oaf_version": "0.1.0",
  "id": "variables-and-types",
  "title": "Variables and Types",
  "description": "Python's core built-in types and how variables work.",
  "authors": ["ankit-ksh"],
  "tags": ["python", "fundamentals"],
  "language": "en",
  "estimated_mins": 5
}
```

## Using this example

1. Rename `id` and the folder name to your own kebab-case identifier — if
   co-locating inside a lesson, the folder name must match `id` exactly.
2. Validate against the [JSON Schema](./schema-reference) before
   publishing.
3. Reference it from an [OCF lesson](/specs/ocf/examples) — either with a
   local `path` if co-located, or an `article_url` if hosted separately.
