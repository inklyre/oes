# Authoring Guide

Practical guidance for writing a good OAF article.

## Structure

- Open with what the reader will be able to do or understand after
  reading — don't bury the point.
- Use headings (`##`, `###`) to break up anything longer than a few
  paragraphs; a learner should be able to scan the article and find a
  specific point again later.
- Use fenced code blocks for any code, command, or output example, so
  renderers preserve formatting.

## Where links belong

Any reference to outside material — a citation, a deeper dive, a related
tool — is an ordinary inline Markdown link inside the prose, placed at the
point where it's relevant, not collected in a footer list. A reader
following the article's natural flow should encounter a link exactly when
it's useful, not have to cross-reference a separate list.

## One article vs. several

If a topic naturally splits into distinct sub-topics a learner might want
to revisit independently (or that another lesson might also want to link
to on its own), prefer several focused articles over one long one. If it's
genuinely one continuous explanation, keep it as a single article — don't
split purely to keep files short.

## Estimated reading time

`estimated_mins` should reflect a careful first read, not a skim — roughly
200-250 words per minute for technical prose with code examples, slower
than that for anything dense with math or unfamiliar terminology.

## Reviewing before publishing

1. Validate `article.json` against the [JSON Schema](./schema-reference).
2. If co-located, confirm the folder name matches `id` exactly.
3. Read `content.md` rendered as Markdown, not as raw text — confirm code
   blocks, links, and any images in `assets/` render correctly.
