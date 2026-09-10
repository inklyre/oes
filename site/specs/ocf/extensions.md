# Extensions

OCF uses the same `x_` namespace mechanism as [OPF](/specs/opf/extensions),
[OQF](/specs/oqf/extensions), [OAF](/specs/oaf/extensions), and
[OVF](/specs/ovf/extensions) — any field prefixed `x_` is reserved for
extensions and is never defined by the core spec, at any level of
`course.json`, `module.json`, or `lesson.json`.

## The rule

**Naming format:** `x_{namespace}_{field}`, in `snake_case`, exactly as in
OPF.

```json
{
  "ocf_version": "0.2.0",
  "id": "intro",
  "title": "Introduction",
  "lessons": [{ "id": "welcome", "path": "lessons/welcome" }],
  "x_acmeplatform_cohort_id": "fall-2026",
  "x_acmeplatform_unlock_date": "2026-09-15"
}
```

## Compliance rules

Identical to OPF's:

- Parsers must ignore unknown `x_`-prefixed fields without error — every
  OCF schema definition sets `additionalProperties: true` scoped by a
  `patternProperties` entry matching `^x_[a-z0-9_]+$`.
- Core fields are never prefixed; a future OCF version promotes a concept to
  a real field rather than repurposing an existing `x_` field name.
- Extensions must never be required for correctness — a course must stay
  fully valid and functional to a consumer that ignores every `x_` field.
- Namespace collisions are the author's responsibility; pick a namespace
  specific to your platform or product.

## Registering an extension

OCF, OPF, OQF, OAF, and OVF all share one
<a href="/extensions/registry.md">extension registry</a>. Register a
namespace there once and it applies across every OES spec — many extension
concepts (e.g. spaced-repetition scheduling, cohort/enrollment metadata)
are useful across course, practice, and content contexts alike.
