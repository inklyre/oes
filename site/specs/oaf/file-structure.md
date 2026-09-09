# File Structure

## Layout

```
{article-root}/
├── article.json
├── content.md
└── assets/            (optional)
```

## Two ways to reference an article

**Co-located** (the common case) — the article lives inside an OCF lesson's
own folder, conventionally under `articles/{article-id}/`:

```
lessons/variables-and-types/
├── lesson.json
└── articles/
    └── main/
        ├── article.json
        └── content.md
```

**Standalone / shared** — the article lives in its own repo, referenced by
`article_url` from any number of lessons — useful for a reading that
genuinely applies across multiple courses (a shared primer, a reference
explainer) rather than being specific to one lesson.

See [OCF's Schema Reference](/specs/ocf/schema-reference) for exactly how a
lesson's `items[]` entries (`type: "article"`) choose between the two.

## Naming rules

| Rule | Detail |
|---|---|
| `article-id` format | kebab-case: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| Folder name (co-located only) | Must equal the article's `id`. A standalone/shared article has no such constraint. |
| `article.json` / `content.md` location | Always together, at the article's own root. |

## File responsibilities

### `article.json`

Metadata for the article: title, description, authors, tags, estimated
reading time. See [Schema Reference](./schema-reference#articlejson).

### `content.md`

The article's prose — **pure Markdown, no frontmatter, no metadata, no
exceptions.** Any reference to outside material (further reading, a cited
source) is an ordinary inline Markdown link within this prose, not a
separate field in `article.json`. May include figures and LaTeX math —
see [Markdown Conventions](/markdown-conventions).

### `assets/` (optional)

Binary assets (images, diagrams) referenced from `content.md` using paths
relative to the article's own folder.

## Path resolution rules

- An article's own asset paths are always relative to that article's own
  folder — never to whatever lesson (if any) references it.
- Consumers must not assume any particular hosting root, so an article
  works identically whether co-located or standalone.
