# File Structure

## Layout

```
{resource-root}/
├── resource.json
├── document.pdf          (optional — a locally-bundled copy, only when downloadable)
└── assets/                (optional — e.g. a custom thumbnail)
```

## Two ways to reference a resource

**Co-located** — lives inside an OCF lesson's own folder, conventionally
under `resources/{id}/`:

```
lessons/recursion/
├── lesson.json
└── resources/
    └── chapter-3/
        └── resource.json
```

**Standalone / shared** — lives in its own repo, referenced by
`resource_url` from any number of lessons — useful for a document that
genuinely applies across multiple courses (a shared textbook chapter, a
reference paper).

See [OCF's Schema Reference](/specs/ocf/schema-reference) for exactly how
a lesson's `items[]` entries (`type: "resource"`) choose between the two.

## Naming rules

| Rule | Detail |
|---|---|
| `resource-id` format | kebab-case: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| Folder name (co-located only) | Must equal the resource's `id`. |
| `resource.json` location | Always at the root of the resource's own folder. |

## File responsibilities

### `resource.json`

Metadata for the document: title, description, `document_url` (required
— where the document is actually hosted), page count, table of contents.
See [Schema Reference](./schema-reference#resourcejson).

### `assets/` (optional)

E.g. a custom thumbnail image, referenced from `resource.json` using a
path relative to the resource's own folder.

## Offline & Portable Packages

Same reasoning as [OVF's video lessons](/specs/ovf/file-structure#offline-portable-packages),
applied to documents:

- `downloadable` (on `resource.json`, default `false`) — set by the
  resource's *author*, states whether the file at `document_url` may be
  downloaded and redistributed as part of an exported package at all.
  Only set it `true` for self-hosted or appropriately-licensed content
  you actually hold the rights to redistribute — never for a
  third-party-hosted file where mirroring it would violate that source's
  terms. Absence of this field, or `false`, means "stream/link only,
  never bundle this file."
- `local_path` (on `resource.json`, e.g. `"document.pdf"`) — set by
  *tooling*, not hand-authored. An application that offers a "download
  for offline" feature checks `downloadable` first, and if permitted,
  fetches `document_url`, saves it next to `resource.json` at this path,
  and includes the file when it exports/zips the course tree. A consumer
  that finds the file at `local_path` should prefer reading it directly
  over fetching `document_url`, and fall back to `document_url` whenever
  the local file is absent or missing.

### Don't commit the bundled file to your authoring repo

Same reasoning as OVF: `local_path` exists for **exported/distributed
packages**, not the git repository you author `resource.json` in.
Committing an actual PDF/ebook into that repo reintroduces exactly the
problem ORF exists to avoid — treat a file at `local_path` as a
build/download artifact, not source.

`local_path` is deliberately constrained to a small, fixed set of
extensions (`.pdf`, `.epub`) sitting directly in the resource's own
folder, with no subdirectories allowed — specifically so one short,
memorable `.gitignore` pattern catches every bundled document in a repo:

```text
# OES: locally-downloaded resource files (see ORF's Offline & Portable
# Packages) — populated by tooling for exported packages, never authored,
# never meant to be committed here.
**/resources/**/*.pdf
**/resources/**/*.epub
```

## Path resolution rules

- A resource's own asset paths, and `local_path` when present, are
  always relative to its own folder.
- `document_url` is always a full, absolute URL — the actual document is
  never assumed to be co-located with `resource.json` by default.
