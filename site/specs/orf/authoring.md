# Authoring Guide

Practical guidance for writing a good ORF resource.

## Writing a table of contents

- One entry per meaningful section, not one per page — a 24-page chapter
  might have 3-5 `toc` entries, not 24.
- Label each entry the way you'd label a heading in an article — a short,
  specific phrase describing what's there ("3.2 Recursive cases"), not a
  generic "Section 2."
- `page` values must be strictly increasing.
- Omit `toc` entirely for a short document with no natural sections (a
  single-page handout, a short paper) — an empty or trivial table of
  contents is worse than none.

## Page count and metadata

- `page_count` should match the actual document length. Unlike an
  article's `estimated_mins`, this is a hard fact about the file, not an
  estimate.
- `description` should tell a learner what they'll read, distinct from
  `title` — avoid just repeating the title with different words.

## Marking a resource `downloadable`

Only set `downloadable: true` if you actually hold the rights to
redistribute the document *file itself*, not just the right to link to
it:

- A document you self-host (your own CDN, your own S3 bucket) that you
  produced or hold a redistribution license for — reasonable to mark
  `true`.
- A third-party-hosted PDF you don't control — leave it `false` (the
  default). Mirroring that file into other people's exported course
  packages could easily violate the source's terms, regardless of what
  ORF's schema permits.

When in doubt, leave it `false`. It only disables one convenience feature
(offline bundling) for consuming apps — the resource still opens fine via
`document_url` either way.

## When *not* to use ORF

If you're tempted to write a `resource.json` whose only real content is
"here's a link, go read it" for something you could just as easily write
as prose, use [OAF](/specs/oaf/) instead — a genuine written article is
almost always the better home for content OES can actually own and
render. ORF exists specifically for documents that stay opaque files by
nature (a scanned PDF, a published paper, a slide deck) — not as a
lighter-weight alternative to writing an article.

## Reviewing before publishing

1. Validate `resource.json` against the [JSON Schema](./schema-reference).
2. If co-located, confirm the folder name matches `id` exactly.
3. Confirm `document_url` actually resolves and opens.
4. If a `toc` is present, open the document and confirm each page number
   lands where the labeled section actually starts.
