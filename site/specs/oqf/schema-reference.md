# Schema Reference

Machine-readable JSON Schema (draft-07):

- `question.json` → [`schemas/oqf/v0.1.0/question.schema.json`](/oes/schemas/oqf/v0.1.0/question.schema.json)
- `stimulus.json` → [`schemas/oqf/v0.1.0/stimulus.schema.json`](/oes/schemas/oqf/v0.1.0/stimulus.schema.json)

## `question.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `oqf_version` | string | **yes** | Any `0.1.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `id` | string | **yes** | Kebab-case. Matches the question's folder name when co-located via `path`. |
| `type` | string | **yes** | One of the [11 question types](./question-types). |
| `title` | string | **yes** | Human-readable title. |
| `difficulty` | string | no | One of `"easy"`, `"medium"`, `"hard"`. |
| `status` | string | no | One of `"draft"`, `"published"`, `"deprecated"`. Absent means published — for a consumer or authoring tool that wants to filter out draft/deprecated content, not an access-control mechanism. |
| `authors` | string[] | no | GitHub usernames. A question can be hosted and reused independently of any set, so it needs its own attribution. |
| `license` | string | no | SPDX identifier, e.g. `"CC-BY-4.0"`. Independent of whatever set(s) reference this question. |
| `tags` | string[] | no | Free-form tags. |
| `topics` | string[] | no | Subject-matter topics, e.g. `"dynamic-programming"`. |
| `companies` | string[] | no | Companies this question is associated with, if any. |
| `time_limit_mins` | number | no | Suggested time limit in minutes — advisory; OQF describes content, not runtime behavior, so enforcement is up to a consuming platform. |
| `max_attempts` | integer | no | Suggested attempt limit, same advisory status as `time_limit_mins`. Absent means unlimited. |
| `hints` | string[] | no | Ordered least to most revealing. |
| `explanation` | string | no | Shown to the learner after attempting the question. |
| `references` | array | no | Cited sources or further reading. Each entry is either a bare URL string (the simple case) or a richer object — `{title, type?, authors?, url?, isbn?, doi?, publisher?, year?, note?}` — needed for a source with no single URL, like a print book (`isbn`) or a paper (`doi`). Same shape as [OAF's `references`](/specs/oaf/schema-reference). |
| `source` | object | no | Where this question was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |
| `type_config` | object | **yes** | Type-specific shape — see [Question Types](./question-types). |
| `stimulus` | object | no | A shared prompt this question is asked about — `{path\|stimulus_url, content_hash?}`. See [Shared Stimuli](./shared-stimuli). |
| `statement` | string \| `{file}` | **yes** | The question's prose. A string is the statement inline, as Markdown; `{file: "statement.md"}` points at a sibling Markdown file instead, path relative to the question's own folder. See [File Structure](./file-structure#inline-vs-file-statement) for when to use which. A schema validator can confirm the field's shape but not that a referenced file actually exists — the same limitation `path`/`question_url` already have elsewhere in OES. |
| `answer_key` | `{file}` or `{url}` | no | Absent (the default): this is self-practice content, and `type_config` carries its own answer inline as usual. Present: this is a graded question — `type_config`'s answer-bearing field(s) MUST be omitted, and a grading consumer fetches them from here instead. Enforced by the schema for every type with a single determinate answer (`mcq`, `msq`, `numerical`, `fill_blank`, `diagram`, `code`, `match`, `order`); not applicable to `short_answer`/`essay`/`submission`, which have no single correct answer to begin with. See [Answer Visibility](/conformance#security-considerations). |

The `type_config` shape is validated conditionally: the JSON Schema uses
`if`/`then` blocks keyed on `type` to require the correct fields for each of
the 11 types. See [Question Types](./question-types) for the full field
table and worked example of each `type_config` shape.

**Note on `points`:** unlike OPF v0.1.0's `problem.json`, a question has no
`points` field of its own. How much a question is worth is a property of
*how it's used* in a particular set, not of the question itself — the same
question could reasonably be worth different amounts in two different
sets. `points` lives on the reference, in the referencing set's
`questions[]` entry — see [OPF's Schema Reference](/specs/opf/schema-reference).

**A note on answer visibility:** by default, every type's `type_config`
carries its own answer inline — an `mcq`'s `answer`, for instance, sits
directly in the same `question.json` a learner's client fetches. That's
the right default for practice content. Every type with a determinate
answer can also opt into being a graded question via the top-level
`answer_key` field above, which the schema then requires the answer to be
omitted from `type_config` — not something to rely on without it for
secure/proctored assessments. See
[Security Considerations](/conformance#security-considerations).

## `stimulus.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `oqf_version` | string | **yes** | Any `0.1.x`. |
| `id` | string | **yes** | Kebab-case. Matches the stimulus's folder name when co-located via `path`. |
| `title` | string | no | Many stimuli don't need one. |
| `authors` | string[] | no | A stimulus can be reused independently of any question. |
| `license` | string | no | SPDX identifier. |
| `tags` | string[] | no | |
| `source` | object | no | Where this stimulus was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |

Paired with an optional `stimulus.md` (pure Markdown, same conventions as
`statement.md`) and an optional `assets/` folder. See
[Shared Stimuli](./shared-stimuli) for the full picture — file layout,
how a question references one, and how a consumer should render several
questions that share one.

## Richer `mcq`/`msq` options and structured rubrics

Two small additions beyond what [Question Types](./question-types) shows:

- **Markdown options, including images.** An `mcq`/`msq` option is
  `{id, content}`, where `content` is Markdown — full parity with
  `statement`, not a restricted subset. Plain text is the common case, but
  arbitrary Markdown is fair game (bold/italic, lists, code fences, LaTeX
  math), including a single image (`![alt](assets/option-a.png)`) or any
  mix of text and images interleaved in whatever order they should
  render, each image path relative to the question's own folder. Always
  give every image real alt text — it's the only description a screen
  reader or a failed image load gets.
- **Structured rubrics.** `short_answer`/`essay`'s `rubric` field accepts
  either a plain string (the simple case, unchanged) or a structured
  object: `{ criteria: [{ name, description?, points? }] }`, for a rubric
  broken into independently named, gradeable criteria rather than one
  paragraph of prose.

## Validating

Any draft-07 compatible JSON Schema validator works. Example using
[ajv-cli](https://github.com/ajv-validator/ajv-cli):

```bash
ajv validate -s schemas/oqf/v0.1.0/question.schema.json \
  -d "my-question-bank/*/question.json"

ajv validate -s schemas/oqf/v0.1.0/stimulus.schema.json \
  -d "my-practice-set/stimuli/*/stimulus.json"
```

## Extension fields

Any field matching `^x_[a-z0-9_]+$` is permitted anywhere in `question.json`
or `stimulus.json` and is intentionally left unvalidated by the core schema
(`additionalProperties: true`, with a `patternProperties` entry matching the
`x_` prefix). See [Extensions](./extensions) for the naming convention and
the extension registry.
