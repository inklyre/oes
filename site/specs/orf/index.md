# ORF — Open Resource Format

<div class="orf-badges">

**Version:** 0.1.0 &nbsp;·&nbsp; **Status:** Draft &nbsp;·&nbsp; **License:** CC BY 4.0

<a class="orf-download-btn" href="/downloads/orf-v0.1.0-spec.md" download>⬇ Download full spec (single Markdown file)</a>

</div>

## What is ORF?

ORF (Open Resource Format) is an open specification for a single
**reference document** — a PDF, an ebook, a paper, slides — real
structured metadata about a document, stored as **static files**,
referenced from an [OCF](/specs/ocf/) lesson as a first-class content
item (`type: "resource"`) rather than a bare link or a suggestion buried
in `related[]`.

ORF is deliberately *not* [OAF](/specs/oaf/). An OAF article is prose OES
owns and renders — written natively for the spec, editable as Markdown.
An ORF resource is the opposite: a document OES doesn't own, can't parse
into structured content, and doesn't try to — a genuine PDF/ebook/paper a
learner needs to actually read. Forcing "here's a link to a PDF" into an
OAF article would be dishonest about what the content actually is; ORF
exists so that case has its own honest home instead.

`document_url` always points at wherever the actual file is hosted and is
always required as the canonical source — an *authored* `resource.json`
is metadata about a document, not the document file itself, the same
reasoning [OVF](/specs/ovf/) applies to video. What ORF adds beyond a bare
link is real, structured value: a page count and a page-anchored table of
contents, so a consuming app can build actual chapter navigation instead
of a raw page-by-page scroll through a generic PDF viewer.

## Philosophy

- **Metadata about a document, not the document.** `document_url` is
  required and external — ORF describes and enriches a document, it
  doesn't host one.
- **Real value beyond a link.** A structured `toc` (page-anchored
  sections) makes a document navigable in a way a bare URL never is —
  the whole point of giving reference documents their own format instead
  of an opaque file pointer.
- **Never pretends to be prose.** ORF doesn't parse or own the document's
  actual content — no OCR, no extracted text, no rendering opinion beyond
  "here's where the sections are." A genuine written article always
  belongs in [OAF](/specs/oaf/) instead.
- **Reusable by design.** A resource can be co-located with the one
  lesson that uses it, or hosted independently and referenced by URL from
  many lessons — the same local/external duality every other OES content
  spec supports.
- **Composed by OCF, not owned by it.** ORF says nothing about courses,
  modules, or lesson sequencing — that's [OCF](/specs/ocf/)'s job.

## The files that make up a resource

```
my-resource/
├── resource.json
└── assets/             (optional — e.g. a custom thumbnail)
```

| File | Purpose |
|---|---|
| `resource.json` | Metadata: title, description, `document_url`, page count, table of contents. |

## Pages in this spec

- [Getting Started](./getting-started) — reference a minimal resource in five minutes
- [File Structure](./file-structure) — directory layout and the two ways to reference a resource
- [Schema Reference](./schema-reference) — full field-by-field reference
- [Authoring Guide](./authoring) — writing a good table of contents
- [Extensions](./extensions) — the `x_` namespace mechanism
- [Examples](./examples) — a worked example

<style>
.orf-badges { margin-bottom: 24px; }
.orf-download-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white) !important;
  font-weight: 600;
  text-decoration: none !important;
}
.orf-download-btn:hover { background: var(--vp-c-brand-2); }
</style>
