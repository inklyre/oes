# Schema Reference

Machine-readable JSON Schema (draft-07):

- `set.json` → [`schemas/opf/v0.3.0/set.schema.json`](/schemas/opf/v0.3.0/set.schema.json)

A set's questions are validated separately, against
[OQF's `question.schema.json`](/specs/oqf/schema-reference) — `set.json`
itself only validates the reference list, not question content.

## `set.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `opf_version` | string | **yes** | Any `0.3.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `id` | string | **yes** | Kebab-case, unique identifier for the set. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Longer description of the set. |
| `authors` | string[] | no | GitHub usernames of the authors. |
| `license` | string | no | SPDX license identifier, e.g. `"CC-BY-4.0"`. |
| `tags` | string[] | no | Free-form tags for discovery. |
| `status` | string | no | One of `"draft"`, `"published"`, `"deprecated"`. Absent means published. |
| `language` | string | no | BCP 47 language tag, e.g. `"en"`. |
| `source` | object | no | Where this set was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |
| `questions` | object[] | **yes** | Minimum 1 item, ordered. Each entry is a direct question reference, a pool, or a multi-part group. See below. |

`questions[]` entries — a **direct reference**:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | **yes** | Stable identifier within the set. Must match the question's folder name when `path` points to a folder; no constraint when `path` points directly to a single-file `.json` or when using `question_url`. |
| `title` | string | no | Optional display label — mainly useful for `question_url` entries, so a consumer can render a table of contents without first fetching every question. |
| `path` | string | one of `path`/`question_url` | Path, relative to `set.json`, to a question co-located in this set's own repo. A path ending in `.json` points directly to a single-file question (its `statement` inline, no folder); any other path is a folder, resolved as `{path}/question.json` (for a question with its own `statement.md` and/or `assets/`). See [OQF's File Structure](/specs/oqf/file-structure) for the full single-file-vs-folder picture. |
| `question_url` | string (uri) | one of `path`/`question_url` | Full URL to a `question.json` hosted in a separate, independently-owned repo — e.g. a shared question bank. |
| `content_hash` | string | no | `sha256-{hex}` of the referenced `question.json`, meaningful only alongside `question_url`. Pins a specific revision of externally-referenced content so it can't silently change underneath this set. See [Content Integrity](/conformance#content-integrity-for-external-references). |
| `points` | number | no, default `10` | How much this question is worth **in this set**. This is a per-use value, not a property of the question itself — the same question can be referenced from two different sets with two different point values. |

Exactly one of `path` or `question_url` must be present on a direct
reference — never both, never neither.

`questions[]` entries — a **pool** (randomized selection), identified by
having `select`/`from` instead of `path`/`question_url`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | **yes** | Stable identifier for this pool within the set. Not tied to any folder name. |
| `select` | integer | **yes** | How many questions a consumer randomly picks from `from` at attempt-assembly time, in place of this one entry. MUST be ≤ `from`'s length — a cross-field constraint schema validation can't check by itself. |
| `from` | object[] | **yes** | The candidate questions to select from. Minimum 1 item. Each is `{id, path\|question_url, content_hash?}` — the same reference shape as a direct entry, minus `points`/`title` (a pool's own `points` applies uniformly to whichever get selected; only the selected subset is ever shown, so candidates have no individual display label). |
| `shuffle` | boolean | no, default `true` | If `true`, the selected questions' presentation order is randomized each time; if `false`, they appear in `from`'s relative order. |
| `points` | number | no, default `10` | Applied uniformly to every question this pool selects. |

`questions[]` entries — a **group** (a multi-part question), identified
by having `parts`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | **yes** | Stable identifier for the group within the set. |
| `parts` | object[] | **yes** | Minimum 1. An ordered list of entries presented together under one heading, as a past paper's Q3 (a)/(b)/(c). Each part is an ordinary `questions[]` entry, so parts may be of different question types — and a part may itself have `parts`, giving Q3(a)(i). |
| `label` | string | no | Display label — `"3"` for the group, `"a"` or `"ii"` for a part. A consumer derives `a, b, c…` from position when absent; set it explicitly to reproduce a real paper's numbering, which is often neither sequential nor alphabetic. Display only — `id` remains the identifier. |
| `title` | string | no | Optional display title for the group. |
| `answer_any` | integer | no | "Answer any N of these parts." MUST be ≤ the number of parts — a cross-field constraint schema validation can't check by itself. |

A group carries **no `points` of its own** — its total is the sum of its
parts, so the two can never disagree.

**Parts MUST NOT be reordered, and a consumer that shuffles a set MUST
move the group as a unit rather than splitting it.** Later parts
routinely refer to earlier ones ("explain why the index in (b) helps"),
so reordering silently breaks the question.

`answer_any` is deliberately *not* the pool's `select`. A pool's `select`
means the system picks at random and the learner never sees the rest;
`answer_any` means every part is shown and the learner chooses which to
attempt. It is advisory authored intent a platform MAY enforce, the same
status as OQF's `time_limit_mins`.

**A shared stem does not live here.** It belongs on each part's own
question, via [OQF's `stimulus`](/specs/oqf/shared-stimuli) — that is what
keeps every part independently resolvable, and it is why a question
fetched on its own still carries the context it needs. A consumer SHOULD
render the shared stimulus once above the parts rather than repeating it.

```json
"questions": [
  { "id": "q1", "path": "questions/normalisation", "points": 10 },
  {
    "id": "q3",
    "label": "3",
    "parts": [
      { "id": "q3a", "label": "a", "path": "questions/er-diagram", "points": 6 },
      { "id": "q3b", "label": "b", "path": "questions/sql-join",   "points": 4 },
      { "id": "q3c", "label": "c", "path": "questions/index-why",  "points": 5 }
    ]
  }
]
```

A set can freely mix direct references, pools, and groups in one ordered
`questions[]` list — e.g. a few fixed intro questions, then a pool, then
a multi-part question — a consumer expanding pools in place produces the
final assembled sequence.

## Validating

Any draft-07 compatible JSON Schema validator works. Example using
[ajv-cli](https://github.com/ajv-validator/ajv-cli):

```bash
ajv validate -s schemas/opf/v0.3.0/set.schema.json -d my-set/set.json

ajv validate -s schemas/oqf/v0.2.0/question.schema.json \
  -d "my-set/questions/*/question.json"
```

## Extension fields

Any field matching `^x_[a-z0-9_]+$` is permitted anywhere in `set.json` and
is intentionally left unvalidated by the core schema
(`additionalProperties: true`, with a `patternProperties` entry matching the
`x_` prefix). See [Extensions](./extensions) for the naming convention and
the extension registry.

## Migrating from v0.1.0

v0.1.0 sets inlined question content directly (`problems[]` pointing at a
local `problem.json`+`statement.md`). To migrate:

1. Move each `problems/{id}/problem.json` + `statement.md` to
   `questions/{id}/question.json` + `statement.md`.
2. In each moved `question.json`: rename `opf_version` → `oqf_version`
   (value becomes `"0.1.0"`, OQF's own version — not OPF's), and remove the
   `points` field.
3. In `set.json`: bump `opf_version` to `"0.2.0"`, rename `problems[]` to
   `questions[]`, and for each entry move its old `points` value (or the
   default `10`, if it had none) onto the `questions[]` entry alongside its
   existing `id`/`path`.

## Migrating from v0.2.0

1. Bump `opf_version` to `"0.3.0"` in every `set.json`.
2. Nothing else. v0.3.0 is purely additive — the group entry is a new
   third shape in `questions[]`, and every existing direct reference and
   pool validates unchanged.

The version still moves because a consumer built for `0.2.x` does not
know what `parts` means. Under the [versioning
policy](/conformance#versioning-policy) it will refuse a `0.3.0`
document outright rather than silently rendering a multi-part question
as one empty entry — which is the failure mode worth paying a minor bump
to avoid.
