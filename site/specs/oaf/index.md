# OAF — Open Article Format

<div class="oaf-badges">

**Version:** 0.1.0 &nbsp;·&nbsp; **Status:** Draft &nbsp;·&nbsp; **License:** CC BY 4.0

<a class="oaf-download-btn" href="/downloads/oaf-v0.1.0-spec.md" download>⬇ Download full spec (single Markdown file)</a>

</div>

## What is OAF?

OAF (Open Article Format) is an open specification for a single written
article — the actual prose a learner reads, stored as **static files**.
It's real authored content: a title plus a Markdown file, not a link to
something hosted elsewhere. An OAF article can be written for one specific
[OCF](/specs/ocf/) lesson, or authored once and referenced from several
lessons across different courses.

If your article needs to point at something else on the web for further
reading, that's just an ordinary Markdown link *inside* the article's own
prose — OAF doesn't have (and deliberately doesn't add) a separate
structured field for "here's a link." That shallow shape is exactly what
OCF used to do before OAF existed, and it's what OAF replaces.

## Philosophy

- **Static files, not a database.** An article is a folder of `.json` and
  `.md` files, versionable with git like anything else in OES.
- **Real content, not a pointer.** The prose lives here, authored directly
  — OAF is not metadata about content hosted somewhere else.
- **Reusable by design.** An article can be co-located with the one lesson
  that uses it, or hosted independently and referenced by URL from many
  lessons — the same local/external duality [OQF](/specs/oqf/) questions
  support.
- **Composed by OCF, not owned by it.** OAF says nothing about courses,
  modules, or lesson sequencing — that's [OCF](/specs/ocf/)'s job. OAF only
  defines what a single article looks like.

## The files that make up an article

```
my-article/
├── article.json
├── content.md          (pure markdown prose — the article itself)
└── assets/              (optional — images, etc.)
```

| File | Purpose |
|---|---|
| `article.json` | Metadata: title, description, authors, tags, estimated reading time. |
| `content.md` | The article's prose, as pure Markdown — nothing else. |

## Pages in this spec

- [Getting Started](./getting-started) — build a minimal article in five minutes
- [File Structure](./file-structure) — directory layout and the two ways to reference an article
- [Schema Reference](./schema-reference) — full field-by-field reference
- [Authoring Guide](./authoring) — best practices for writing a good article
- [Extensions](./extensions) — the `x_` namespace mechanism
- [Examples](./examples) — a worked example

<style>
.oaf-badges { margin-bottom: 24px; }
.oaf-download-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white) !important;
  font-weight: 600;
  text-decoration: none !important;
}
.oaf-download-btn:hover { background: var(--vp-c-brand-2); }
</style>
