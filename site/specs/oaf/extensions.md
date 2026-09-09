# Extensions

OAF uses the same `x_` namespace mechanism as every other OES spec.

## The rule

Any field whose name starts with `x_` is reserved for extensions and is
never defined by the core OAF spec. This applies at any level of
`article.json`.

**Naming format:** `x_{namespace}_{field}`, both `snake_case`.

```json
{
  "oaf_version": "0.1.0",
  "id": "variables-and-types",
  "title": "Variables and Types",
  "x_acmeplatform_reading_level": "beginner"
}
```

## Compliance rules

- Parsers must ignore unknown `x_` fields without error.
- Core fields are never retroactively repurposed from an `x_` name.
- Extensions must never be required to render the article correctly.
- Namespace collisions are the author's responsibility.

## Registering an extension

Namespaces intended for reuse are listed in the shared
<a href="/oes/extensions/registry.md">extension registry</a> — one registry
shared across OPF, OQF, OCF, OAF, and OVF. Open a pull request against
`extensions/registry.md` to register one.
