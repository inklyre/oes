# ORF — Open Resource Format

**Version 0.1.0 · Status: Draft · License: CC0 1.0**

Part of [OES — Open Education Standards](https://inklyre.github.io/oes/).

## Table of contents

1. Overview and Philosophy
2. File Structure
3. `resource.json` Reference
4. Offline & Portable Packages
5. Extension Mechanism
6. JSON Schema
7. Full Worked Example

---

## 1. Overview and Philosophy

ORF (Open Resource Format) structures metadata about a single **reference
document** — a PDF, an ebook, a paper, slides — as a static file,
referenced from an [OCF](https://inklyre.github.io/oes/specs/ocf/) lesson
as a first-class content item (`type: "resource"`).

ORF is deliberately not [OAF](https://inklyre.github.io/oes/specs/oaf/):
an OAF article is prose OES owns and renders; an ORF resource is a
document OES doesn't own or parse into structured content at all — a
genuine PDF/ebook/paper a learner needs to actually read. Forcing "here's
a link to a PDF" into an OAF article is dishonest about what the content
is; ORF gives that case its own honest home.

`document_url` always points at wherever the actual file is hosted and is
always required as the canonical source — an *authored* `resource.json`
is metadata about a document, not the document file itself. What ORF adds
beyond a bare link is real, structured value: a page count and a
page-anchored table of contents, so a consuming app can build actual
chapter navigation instead of a raw page-by-page scroll through a generic
PDF viewer.

Philosophy: metadata about a document, not the document; real value
beyond a link (`toc`); never pretends to be prose — no OCR, no extracted
text, no rendering opinion beyond "here's where the sections are";
reusable by design (co-located or hosted independently); composed by OCF,
not owned by it.

## 2. File Structure

```
my-resource/
├── resource.json
├── document.pdf         (optional, co-located, only when downloadable)
└── assets/               (optional, e.g. a custom thumbnail)
```

## 3. `resource.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `orf_version` | string | yes | Any `0.1.x` patch. |
| `id` | string | yes | |
| `title` | string | yes | |
| `description` | string | no | |
| `document_url` | string (uri) | yes | Where the document is actually hosted. Always the canonical source. |
| `page_count` | integer | no | |
| `authors` | string[] | no | |
| `license` | string | no | SPDX identifier. Describes the resource's own metadata — does not by itself grant redistribution rights to the underlying file; see `downloadable`. |
| `status` | string | no | `"draft"`/`"published"`/`"deprecated"`. Absent means published. |
| `tags` | string[] | no | |
| `language` | string | no | Primary written language, BCP 47 tag. |
| `toc` | object[] | no | Page-anchored table of contents: `{label, page}[]`. |
| `downloadable` | boolean | no, default `false` | Whether `document_url`'s file may be downloaded and bundled into an exported/portable package. |
| `local_path` | string | no | Filename (`.pdf`/`.epub`, no subdirectories) of a locally-bundled copy, populated by tooling. |
| `references` | array | no | Cited sources — same shape as every other OES spec's `references[]`. |
| `related` | array | no | Suggested material for a learner who wants to go further. |
| `source` | object | no | Where this resource was originally sourced/adapted from, if imported. See Versioning & Conformance's Content Provenance section. |

## 4. Offline & Portable Packages

Same mechanism as OVF's video lessons, substituting a document for a
video: `downloadable` (author-set legal flag) + `local_path` (tooling-set,
never hand-authored, never committed to the authoring repo). See
[OVF's own Offline & Portable Packages section](https://inklyre.github.io/oes/specs/ovf/file-structure#offline-portable-packages)
for the full reasoning — it applies here unchanged.

## 5. Extension Mechanism

Same `x_` mechanism as every OES spec, shared registry at
`extensions/registry.md`, across OCF/OPF/OQF/OAF/OVF/ORF.

## 6. JSON Schema

Full schema: `schemas/orf/v0.1.0/resource.schema.json`.

## 7. Full Worked Example

```json
{
  "orf_version": "0.1.0",
  "id": "sicp-chapter-1",
  "title": "Structure and Interpretation of Computer Programs — Chapter 1",
  "description": "The foundational chapter on the elements of programming.",
  "document_url": "https://example.com/books/sicp/chapter-1.pdf",
  "page_count": 42,
  "license": "CC-BY-SA-4.0",
  "toc": [
    { "label": "1.1 The Elements of Programming", "page": 1 },
    { "label": "1.2 Procedures and the Processes They Generate", "page": 15 },
    { "label": "1.3 Formulating Abstractions with Higher-Order Procedures", "page": 30 }
  ]
}
```

Referenced from an OCF lesson:

```json
{
  "type": "resource",
  "id": "sicp-chapter-1",
  "path": "resources/sicp-chapter-1"
}
```

See the [full Examples page](https://inklyre.github.io/oes/specs/orf/examples)
on the docs site for more, including the `downloadable`/`local_path`
offline-package case.
