# Extension Registry

This registry lists `x_` namespaces shared across every OES spec:
[OCF](../site/specs/ocf/index.md), [OPF](../site/specs/opf/index.md),
[OQF](../site/specs/oqf/index.md), [OAF](../site/specs/oaf/index.md),
[OVF](../site/specs/ovf/index.md), and [ORF](../site/specs/orf/index.md).
Registering a namespace here lets other authors and platforms discover
and reuse it instead of inventing a competing field for the same concept.

Registering here is **not required** to use an `x_` field — any
`^x_[a-z0-9_]+$` field is valid per the core spec without registration. It's
purely a discoverability aid for namespaces meant to be reused beyond a
single private platform.

## How to register

Open a pull request against this file adding a row to the table below with:

- **Namespace** — the `{namespace}` segment of your `x_{namespace}_{field}` fields.
- **Fields** — every field you define under that namespace, one per line.
- **Applies to** — one or more of `OCF`, `OPF`, `OQF`, `OAF`, `OVF`, `ORF`.
- **Description** — what the fields mean and how a consumer should use them.
- **Maintainer** — a GitHub username or organization to contact.

## Registered namespaces

| Namespace | Fields | Applies to | Description | Maintainer |
|---|---|---|---|---|
| _(none yet — be the first to register one)_ | | | | |

## Example entry

The table below isn't part of the registry — it's a template showing the
expected format for a new pull request:

| Namespace | Fields | Applies to | Description | Maintainer |
|---|---|---|---|---|
| `spaced_repetition` | `x_spaced_repetition_interval`, `x_spaced_repetition_ease_factor`, `x_spaced_repetition_due_date` | OQF | Scheduling data for spaced-repetition review of a question, compatible with an SM-2-style algorithm. | `@example-user` |
