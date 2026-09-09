# Extensions

OPF is deliberately minimal. Real-world platforms need fields OPF doesn't
define — spaced-repetition scheduling data, platform-specific IDs, custom
analytics tags, and so on. The `x_` namespace mechanism lets platforms add
these fields without forking the spec or breaking other consumers.

## The rule

Any field whose name starts with `x_` is reserved for extensions and is
never defined by the core OPF spec. This applies at any level of `set.json`
— the same mechanism, with its own reserved fields, applies separately to
`question.json` in [OQF](/specs/oqf/extensions).

**Naming format:** `x_{namespace}_{field}`

- `namespace` identifies who defines the field — typically a product name or
  organization, in `snake_case`.
- `field` is the field itself, also `snake_case`.

```json
{
  "opf_version": "0.2.0",
  "id": "spaced-rep-example",
  "title": "Example with an extension field",
  "questions": [{ "id": "q1", "path": "questions/q1" }],
  "x_acmeplatform_collection_id": "coll_8f2a1c",
  "x_acmeplatform_cohort": "2026-spring"
}
```

## Compliance rules

- **Parsers must ignore unknown fields without error.** Every OPF JSON
  Schema sets `additionalProperties: true` (or scopes it with a
  `patternProperties` entry matching `^x_[a-z0-9_]+$`), so any conformant
  validator accepts extension fields.
- **Core fields are never prefixed.** If a future OPF version wants to
  standardize a currently-extension concept, it will be promoted to a real,
  documented field in a new spec version — never silently repurposed from an
  `x_` field with the same name, since multiple platforms may already use
  that name for different things.
- **Extensions must never be required for correctness.** A set must remain
  fully valid and functional to a consumer that ignores every `x_` field
  entirely. If a concept is load-bearing for grading or rendering, it
  belongs in a proposal for the core spec, not an extension.
- **Namespace collisions are the author's responsibility.** Pick a
  `namespace` specific enough that it's unlikely to collide (a product name,
  not a generic word like `x_custom_field`).

## Registering an extension

Namespaces intended for reuse beyond a single private platform should be
listed in the shared <a href="/oes/extensions/registry.md">extension registry</a>
— one registry, shared across OPF, OQF, OCF, OAF, and OVF — so authors can
discover and interoperate with them instead of reinventing the same field
under a different name.

To register one, open a pull request against `extensions/registry.md`
adding a row with your namespace, the fields you define under it, and a
short description of what they mean and which types they apply to.

## When *not* to use an extension

If you find yourself needing an `x_` field to express something every
consumer of your set will need to understand to render or grade correctly,
that's a sign the concept belongs in a future core spec version rather than
as an extension — please open an issue on the OES repo to discuss it.
