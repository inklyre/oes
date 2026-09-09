# Authoring Guide

Practical guidance for writing good OQF questions, beyond what the schema
enforces.

## Writing statements

- Keep the statement self-contained, whether it's inline in `question.json`
  or its own `statement.md`. A learner should be able to answer the
  question from the statement alone, without needing external context.
- Use fenced code blocks for any input/output examples, so renderers
  preserve whitespace and monospacing.
- Don't put grading-relevant information in the statement that isn't also
  reflected in `type_config` — the statement is prose, `question.json` is
  the source of truth for grading.
- For `fill_blank`, keep the sentence readable with the `{{id}}` markers
  removed — imagine reading it as if each blank were replaced by "___".
- Figures and LaTeX math are both fair game — see
  [Markdown Conventions](/markdown-conventions).
- Prefer a plain-string `statement` for a short, one-off statement — it
  keeps the question to a single file. Switch to `{file: "statement.md"}`
  once the prose is long enough that editing it inside a JSON string gets
  awkward, or the question already needs a folder for its own `assets/`.
  See [File Structure](./file-structure#inline-vs-file-statement).

## Using a shared stimulus well

- Reach for a [stimulus](./shared-stimuli) only when a prompt genuinely
  applies to more than one question — a single-use prompt belongs directly
  in that one question's own statement.
- Keep each question's own statement focused on what that specific
  question asks, not a restatement of the stimulus — a learner reads the
  stimulus once, then each question in turn.
- Order the sharing questions consecutively in the set's `questions[]` —
  consumers are expected to render a shared stimulus once, above a
  consecutive run of questions that reference it.

## Choosing a difficulty

Calibrate `difficulty` against what a learner already familiar with the
`topics` listed should experience, not an absolute scale:

- `easy` — solvable by recalling a single fact or applying one step of
  reasoning.
- `medium` — requires combining two or more concepts, or a non-obvious
  first step.
- `hard` — requires deeper analysis, an insight that isn't immediately
  visible from the statement, or careful handling of edge cases.

## Writing good hints

`hints` is an ordered array from least to most revealing. A good hint
sequence:

1. **Reframe the question** — point at the right concept without naming the
   answer.
2. **Narrow the approach** — suggest a technique or data structure.
3. **Nearly give it away** — spell out the key insight, leaving only
   execution to the learner.

Avoid a hint that just restates the statement, and avoid jumping straight to
the answer in hint 1.

## Writing `explanation`

`explanation` is shown after an attempt, regardless of correctness. Write it
to teach, not just confirm:

- State the correct answer/approach explicitly.
- Explain *why* it's correct, not just *that* it's correct.
- For `code` questions, walk through the reference solution's logic and its
  time/space complexity.
- For incorrect common answers (e.g. a tempting wrong MCQ option), briefly
  note why they're wrong — this is often more instructive than explaining
  the right answer alone.

## Structuring `code` questions

- Always include at least one non-hidden test case that mirrors the
  statement's example exactly, so learners can sanity-check output format.
- Include hidden test cases (`is_hidden: true`) that cover edge cases (empty
  input, duplicates, boundary values) to prevent overfitting to the visible
  cases.
- Keep `starter_code` minimal — a function signature and a `pass`/`TODO`
  body, not a partial solution.
- Only include `solutions` if you're comfortable with them being
  distributed alongside the question — anyone who can fetch `question.json`
  can read them, including learners who inspect network requests. Omit
  `solutions` entirely for high-stakes assessments.

## Manually graded types (`short_answer`, `essay`)

Write `rubric` as concrete, checkable criteria a human grader can apply
consistently — not a restatement of the question. Prefer a short bulleted
list of things a correct answer must contain over a vague description of
"good understanding." Reach for the structured form
(`{criteria: [{name, points?}]}`) once you actually want per-criterion
point allocation or independent scoring — plain-string `rubric` is still
completely valid and often clearer for a short, single-paragraph rubric
that doesn't need to be broken apart.

## Image-based options

Use an image in an option's `content` (`{id, content}`, `content` holding
`![alt](assets/option-a.png)`) when the choices themselves are genuinely
visual — "which diagram shows a valid binary tree," not as a substitute
for a `diagram` question's labeling interaction. Keep every option's image
the same approximate size/framing so none is visually distinguishable by
size alone, and always write real alt text describing what the image
shows, not just restating the option id. An option's `content` can also
mix several images with text — e.g. a short label followed by a "before"
and "after" diagram, in the order they should render — for the rarer case
where one choice needs more than a single picture to make its point.

## Reviewing before publishing

Before merging a new or edited question:

1. Validate `question.json` against the [JSON Schema](./schema-reference).
2. If it's co-located in a set, confirm the folder name matches `id`
   exactly.
3. For `code` questions, actually run the reference solution against every
   test case, including hidden ones.
4. Read the statement as if you were the learner, with no other context.

## See also

Deciding *how much a question is worth*, sequencing several questions into
an assessment, and other composition-level concerns are covered in
[OPF's Authoring Guide](/specs/opf/authoring) — that's a set-level decision,
not a question-level one.
