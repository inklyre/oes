# Extensions

ORF uses the same `x_` namespace mechanism as every other OES spec.

## The rule

Any field whose name starts with `x_` is reserved for extensions and is
never defined by the core ORF spec. This applies at any level of
`resource.json`.

**Naming format:** `x_{namespace}_{field}`, both `snake_case`.

```json
{
  "orf_version": "0.1.0",
  "id": "chapter-3-reading",
  "title": "Chapter 3: Recursion",
  "document_url": "https://example.com/books/chapter-3.pdf",
  "x_acmeplatform_ocr_text_url": "https://example.com/books/chapter-3.txt"
}
```

## Compliance rules

- Parsers must ignore unknown `x_` fields without error.
- Core fields are never retroactively repurposed from an `x_` name.
- Extensions must never be required to open or understand the document.
- Namespace collisions are the author's responsibility.

## Registering an extension

Namespaces intended for reuse are listed in the shared
<a href="/extensions/registry.md">extension registry</a> — one registry
shared across OCF, OPF, OQF, OAF, OVF, and ORF. Open a pull request against
`extensions/registry.md` to register one.
