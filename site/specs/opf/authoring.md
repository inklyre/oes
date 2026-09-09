# Authoring Guide

Practical guidance for composing a good OPF **set**, beyond what the schema
enforces. For guidance on writing an individual question well — statements,
hints, explanations, rubrics — see
[OQF's Authoring Guide](/specs/oqf/authoring); this page is about
assembling questions into a set, not writing them.

## Composing and sequencing questions

- Order `questions[]` the way you want a learner to encounter them —
  array order is the only sequencing signal OPF has, the same convention
  OCF uses for modules and lessons.
- Mix difficulty deliberately: a set that ramps from `easy` to `hard`
  builds confidence before challenging it; a set of uniform difficulty is
  better for a timed assessment where every question should carry similar
  weight.
- Mix question types where it serves the material — `mcq`/`msq` for quick
  recall checks, `code`/`essay`/`short_answer` for deeper application — but
  don't force variety where a single type genuinely fits the content best.

## Choosing `points`

Points now live on the set's `questions[]` entry, not on the question
itself — the same question can be worth different amounts in different
sets. Default is `10` if omitted. Guidelines:

- Scale relative to effort and risk of guessing: lower-effort,
  higher-guess-rate types (`mcq`, `msq`) should generally be worth less than
  free-response types (`code`, `essay`) of comparable difficulty.
- Keep point values consistent within a set so a learner's total score
  means something predictable — don't have two `easy` `mcq` questions worth
  wildly different amounts without a reason.
- When referencing a question from an external question bank, don't assume
  its author's intent about weight — decide `points` based on this set's
  own emphasis, not the question's difficulty alone.

## Set-level metadata

- `title` and `description` should describe what a learner will practice,
  not restate the questions' own titles.
- `tags` are for discovery (subject area, exam/certification name, company
  interview track) — keep them at the set level distinct from a question's
  own `topics`, which describe the specific concept each question tests.
- `license` and `authors` matter more here than they might seem: a set
  composed partly of externally-referenced questions should still be clear
  about who assembled *this particular combination and sequence*, even
  though it doesn't own every question's content.

## Co-located vs. externally-referenced questions

- Author a question co-located (under `questions/{id}/`) when it's written
  specifically for this set and unlikely to be reused elsewhere — this is
  the common case, and it keeps the set self-contained (no external
  dependency to break).
- Reference a question by `question_url` when you want to reuse a question
  that already exists elsewhere — a shared question bank, another team's
  set, a question you've published independently — instead of copying it.
  This trades self-containment for reuse: if the referenced question's repo
  disappears or the URL changes, your set breaks. Prefer pinning to a tag
  or commit SHA (see [Hosting](./hosting)) over a mutable branch reference
  for anything you don't control.
- A set can freely mix both within the same `questions[]` list.

## Reviewing before publishing

Before merging a new or edited set:

1. Validate `set.json` against the [JSON Schema](./schema-reference), and
   every co-located `question.json` against
   [OQF's schema](/specs/oqf/schema-reference).
2. Confirm every `path` entry's folder name matches its `id`.
3. Resolve every `question_url` and confirm it actually returns a valid
   OQF question — a broken external reference fails silently for a
   consumer that doesn't check.
4. Read through the set end-to-end in the order `questions[]` lists them,
   as if you were the learner.
