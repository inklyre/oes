# Markdown Conventions

Every prose file across OES — `statement.md` ([OQF](/specs/oqf/)),
`stimulus.md` ([OQF](/specs/oqf/shared-stimuli)), `content.md`
([OAF](/specs/oaf/)), `transcript.md` ([OVF](/specs/ovf/)) — is **pure
Markdown, no frontmatter, no exceptions**, so any generic Markdown renderer
can display it without knowing anything about OES. This page documents two
conventions for richer content within that constraint, shared across every
spec rather than redefined per spec.

[[toc]]

## Figures

There's no special OES mechanism for this — it's just standard Markdown
image syntax, pointing at the same `assets/` folder every spec already
defines alongside its prose file:

```markdown
The partition step looks like this:

![Partitioning an array around a pivot value](assets/partition-diagram.png)
```

`assets/` is not only for the fields that explicitly reference it (like
`diagram`'s `type_config.image`) — it's the general home for any binary
asset a prose file embeds this way. Always include real alt text (the
bracketed part) — screen readers depend on it, and it's the only
description a consumer gets if the image fails to load.

## LaTeX math

OES content MAY include math using the same delimiter convention already
adopted by GitHub, Jupyter, and most modern Markdown tooling: `$...$` for
inline math, `$$...$$` for display/block math.

```markdown
The average-case lookup time is $O(1)$, assuming a good hash function and
a load factor kept low.

$$
P(A \mid B) = \frac{P(B \mid A) \, P(A)}{P(B)}
$$
```

This is deliberately **not** part of CommonMark itself — a plain-text or
naive Markdown renderer will show the literal `$...$` source rather than a
rendered equation. That's an acceptable, graceful degradation, the same
tradeoff already implicit in fenced code blocks (a renderer without syntax
highlighting still shows correct, readable code, just unstyled): the raw
LaTeX is still legible to anyone who reads LaTeX, and the content remains
valid, renderable Markdown either way.

- A consumer aiming for full-fidelity rendering of OES content SHOULD
  render `$...$`/`$$...$$` via a standard library — [KaTeX](https://katex.org/)
  or [MathJax](https://www.mathjax.org/) are the common choices.
- A consumer that doesn't support math rendering MUST still display the
  raw source without erroring — it's just plain text to a Markdown parser
  that doesn't specifically look for these delimiters.
- If a document genuinely needs a literal dollar sign immediately adjacent
  to what could be mistaken for math (e.g. `$5` right before a digit),
  escape it as `\$` — the same approach GitHub's own math rendering
  documents.

## See also

[Versioning & Conformance](/conformance) for the RFC 2119 conformance
language (MUST/SHOULD/MAY) used above and throughout every spec.
