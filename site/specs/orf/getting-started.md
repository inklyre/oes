# Getting Started

Building the smallest possible valid ORF resource: one folder, one file.

## 1. Create the folder structure

```bash
mkdir -p my-first-resource
cd my-first-resource
```

## 2. Write the resource's metadata

`resource.json`:

```json
{
  "orf_version": "0.1.0",
  "id": "my-first-resource",
  "title": "Chapter 3: Recursion",
  "description": "A chapter from the course's companion textbook.",
  "document_url": "https://example.com/books/chapter-3.pdf",
  "page_count": 24
}
```

There's no document file to write — `document_url` points at wherever
the document is actually hosted. Everything else in `resource.json`
describes it.

## 3. (Optional) add a table of contents

```json
{
  "orf_version": "0.1.0",
  "id": "my-first-resource",
  "title": "Chapter 3: Recursion",
  "document_url": "https://example.com/books/chapter-3.pdf",
  "page_count": 24,
  "toc": [
    { "label": "3.1 Base cases", "page": 1 },
    { "label": "3.2 Recursive cases", "page": 8 },
    { "label": "3.3 Tail recursion", "page": 17 }
  ]
}
```

## 4. Validate it

```bash
npx ajv-cli validate \
  -s https://oes.inklyre.org/schemas/orf/v0.1.0/resource.schema.json \
  -d resource.json
```

## 5. Use it

A resource is referenced from an [OCF](/specs/ocf/) lesson's `items[]`
list as a `type: "resource"` entry, either co-located (a relative `path`)
or externally (a `resource_url`, for a document shared across multiple
lessons/courses). See [OCF's Getting Started](/specs/ocf/getting-started).

## What's next

- Read [File Structure](./file-structure) for the co-located vs. standalone
  distinction.
- Read [Examples](./examples) for a complete worked resource.
- Read [Editor Setup](/editor-setup) for inline validation/autocomplete
  while hand-editing `resource.json`.
