# Extensions

OQF is deliberately minimal. Real-world platforms need fields OQF doesn't
define — spaced-repetition scheduling data, platform-specific IDs, custom
analytics tags, and so on. The `x_` namespace mechanism lets platforms add
these fields without forking the spec or breaking other consumers. This is
the exact same mechanism used by OPF, OCF, OAF, and OVF.

## The rule

Any field whose name starts with `x_` is reserved for extensions and is
never defined by the core OQF spec. This applies at any level of
`question.json`, including inside `type_config`.

**Naming format:** `x_{namespace}_{field}`

- `namespace` identifies who defines the field — typically a product name or
  organization, in `snake_case`.
- `field` is the field itself, also `snake_case`.

```json
{
  "oqf_version": "0.1.0",
  "id": "spaced-rep-example",
  "type": "mcq",
  "title": "Example with an extension field",
  "type_config": { "...": "..." },
  "x_spaced_repetition_interval": 3,
  "x_spaced_repetition_ease_factor": 2.5,
  "x_acmeplatform_internal_id": "q_8f2a1c"
}
```

## Compliance rules

- **Parsers must ignore unknown fields without error.** The OQF JSON
  Schema sets `additionalProperties: true` (scoped with a
  `patternProperties` entry matching `^x_[a-z0-9_]+$`), so any conformant
  validator accepts extension fields.
- **Core fields are never prefixed.** If a future OQF version wants to
  standardize a currently-extension concept, it will be promoted to a real,
  documented field in a new spec version — never silently repurposed from an
  `x_` field with the same name.
- **Extensions must never be required for correctness.** A question must
  remain fully valid and gradable to a consumer that ignores every `x_`
  field entirely.
- **Namespace collisions are the author's responsibility.** Pick a
  `namespace` specific enough that it's unlikely to collide.

## Registering an extension

Namespaces intended for reuse beyond a single private platform should be
listed in the shared <a href="/extensions/registry.md">extension registry</a>
— one registry, shared across every OES spec — so authors can discover and
interoperate with them instead of reinventing the same field under a
different name.

To register one, open a pull request against `extensions/registry.md`
adding a row with your namespace, the fields you define under it, and a
short description of what they mean and which spec(s)/types they apply to.
