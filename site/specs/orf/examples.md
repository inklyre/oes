# Examples

A complete, worked ORF resource.

## `sicp-chapter-1`

### File tree

```
sicp-chapter-1/
└── resource.json
```

### `resource.json`

```json
{
  "orf_version": "0.1.0",
  "id": "sicp-chapter-1",
  "title": "Structure and Interpretation of Computer Programs — Chapter 1",
  "description": "The foundational chapter on the elements of programming.",
  "document_url": "https://example.com/books/sicp/chapter-1.pdf",
  "page_count": 42,
  "license": "CC-BY-SA-4.0",
  "tags": ["scheme", "functional-programming"],
  "language": "en",
  "toc": [
    { "label": "1.1 The Elements of Programming", "page": 1 },
    { "label": "1.2 Procedures and the Processes They Generate", "page": 15 },
    { "label": "1.3 Formulating Abstractions with Higher-Order Procedures", "page": 30 }
  ],
  "references": [
    "https://mitpress.mit.edu/sicp/"
  ],
  "related": [
    { "type": "video", "title": "SICP Lecture 1a", "url": "https://www.youtube.com/watch?v=2Op3QLzMgSY" }
  ]
}
```

This example never sets `downloadable`/`local_path` — it's link-only,
which is the default and by far the common case.

## `lecture-slides` — self-hosted, downloaded for offline use

A slide deck the author self-hosts and has explicitly permitted
redistributing, which some consuming app has already downloaded and
bundled — demonstrates both fields together, after an app's "download for
offline" feature ran.

### File tree

```
lecture-slides/
├── resource.json
└── lecture-3.pdf          (present because an app already downloaded it)
```

### `resource.json`

```json
{
  "orf_version": "0.1.0",
  "id": "lecture-slides",
  "title": "Lecture 3 Slides",
  "document_url": "https://raw.githubusercontent.com/you/course-assets/main/lecture-3.pdf",
  "page_count": 18,
  "downloadable": true,
  "local_path": "lecture-3.pdf"
}
```

A consumer opening this `resource.json` finds `local_path` set and the
file actually present at `lecture-slides/lecture-3.pdf`, so it opens
directly from local storage — no network request to `document_url`
needed. If `lecture-3.pdf` were missing, the consumer would fall back to
fetching `document_url` instead; nothing about `resource.json` itself
would need to change.

## Using these examples

1. Rename `id` and the folder name to your own kebab-case identifier — if
   co-locating inside a lesson, the folder name must match `id` exactly.
2. Validate against the [JSON Schema](./schema-reference) before
   publishing.
3. Reference it from an [OCF lesson](/specs/ocf/examples) as a
   `type: "resource"` item — either with a local `path` if co-located, or
   a `resource_url` if hosted separately.
4. Leave out `downloadable`/`local_path` entirely unless you specifically
   hold redistribution rights and a tool has actually bundled the file —
   see [Offline & Portable Packages](./file-structure#offline-portable-packages).
