# Versioning & Conformance

This page applies to every OES spec — [OCF](/specs/ocf/), [OPF](/specs/opf/),
[OQF](/specs/oqf/), [OAF](/specs/oaf/), and [OVF](/specs/ovf/) — the same
way the <a href="/oes/extensions/registry.md">extension mechanism</a> and the local/
external reference convention are shared across all five rather than
redefined per spec.

[[toc]]

## Conformance language

This page and every spec page use **MUST**, **MUST NOT**, **SHOULD**,
**SHOULD NOT**, and **MAY** the way [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119)
defines them:

- **MUST** / **MUST NOT** — an absolute requirement. A document or consumer
  that violates this is not conformant, full stop.
- **SHOULD** / **SHOULD NOT** — a strong recommendation. There can be valid
  reasons to deviate, but the full implications should be understood and
  weighed first.
- **MAY** — genuinely optional. Present or absent, correct either way.

Where an existing spec page says "must" or "should" in ordinary prose
without this convention in mind, read it with this same weight — this page
codifies the convention going forward rather than requiring every prior
sentence to be rewritten.

## Scope: content, not runtime state

All five OES specs describe **content** — static documents, authored once,
versioned with git, identical for every learner who reads them. That's a
deliberate, load-bearing choice, not an oversight, and it draws a firm
line around what OES will and won't take on.

**Explicitly out of scope: progress, completion, attempts, scores, and
any other per-learner runtime state.** Whether a specific person answered
a specific question correctly, how far they've gotten through a course,
what their current grade is — none of that is describable in OCF, OPF,
OQF, OAF, or OVF, and it never will be. This data is fundamentally
different from content on every axis that matters here: it's per-learner
rather than shared, generated continuously at runtime rather than
authored once, and needs to be queried/updated live rather than fetched
and cached. Folding it into these five specs would mean giving up the
"static files in git" model that makes them portable and swappable
between hosting providers in the first place.

This is a deliberate boundary, not a gap waiting to be filled by a sixth
OES spec. An application built on OES is expected to track progress and
results itself, however fits its own architecture — a database, an
existing standard like [xAPI](https://xapi.com/) recording statements
that reference OES content by `id`/`path`/`content_hash`, or anything
else. OES's job stops at describing what the content *is*; what a learner
*did* with it belongs to whatever's consuming it.

**Same boundary, smaller scale: grading/scoring policy is a consumer
decision, not authored content.** Whether a wrong `mcq`/`msq` answer
costs negative points, how many attempts a learner gets, whether a
timed assessment enforces its `time_limit_mins` strictly or leniently,
and how `code`'s per-test-case `points` roll up into a final score
(every test must pass for any credit? a strict proportional sum? some
partial-credit curve?) — none of these are described anywhere in OQF or
OPF, and won't be. They're all instance-specific policy an app or LMS
decides at grading time, the same category of decision as progress
tracking above, just at question/set scale instead of whole-platform
scale. What OQF *does* provide — `points` per test case, a structured
`rubric`, `points` per question in OPF — is optional raw material a
scoring policy can use; it never dictates the policy itself.

Every OES spec is independently versioned (`oqf_version`, `opf_version`,
`oaf_version`, `ocf_version`, `ovf_version`), and every one of
them is currently **`0.x`, Draft status** — pre-1.0. That status has a
direct, practical consequence for how strictly a document's version field
should be checked.

**Pre-1.0 (current state for every spec):**

- A patch release (`0.1.0` → `0.1.1`) **MUST NOT** change the meaning or
  validation of any existing field. It MAY fix a documentation error, add
  a new *optional* field, loosen an over-strict constraint, or add a new
  optional value to an existing enum. A consumer built against `0.1.0`
  MUST continue to accept `0.1.1` documents without modification.
- A minor release (`0.1.x` → `0.2.x`) MAY be breaking — this is
  exactly what happened when OPF and OCF moved `0.1.0` → `0.2.0` in this
  same project. Draft specs are allowed to restructure based on real
  feedback; that's what Draft status means.
- Every schema's version field is therefore a **pattern matching the
  current minor** (e.g. `^0\.2\.\d+$` for OPF v0.2.x), not an exact
  `const` match against one literal patch version — a consumer correctly
  built for `0.2.0` MUST also accept `0.2.1`, `0.2.7`, etc. without
  needing an update, since nothing about the shape changed. Rejecting an
  unrecognized *patch* number is a conformance bug, not caution.
- A consumer that encounters a **minor or major** it doesn't recognize
  (e.g. a `0.3.x` document, when it only knows `0.2.x`) SHOULD refuse to
  process that document rather than guess, and SHOULD surface this as a
  distinct "unsupported version" condition rather than a generic parse
  failure — these are genuinely different failure modes for a caller to
  handle.

**After 1.0** (aspirational, once a spec's shape is considered stable):
ordinary [SemVer](https://semver.org/) applies — patch = fixes only, minor
= additive/backward-compatible, major = breaking. Each spec's own
changelog will state when it reaches 1.0.

## The OES release version

Each spec keeps its own version field — `oqf_version` only changes when
OQF's own shape changes, and a document never needs re-stamping just
because a sibling spec moved. But the five specs are not independent in
practice: OCF lessons reference OAF/OVF/OQF documents, OPF sets reference
OQF questions, and a tool consuming "OES" is really consuming all five
together. Tracking five version numbers separately, with no single
statement of which combinations are actually tested and meant to work
together, makes it hard for a tool author to be sure what they're
building against.

**OES itself carries one version number**, independent of and layered on
top of the five per-spec ones — tracked as this repository's own
`package.json` version and tagged in git on every release. It names a
specific, tested combination of sub-spec versions, published as a
compatibility table on this page:

| OES version | OCF | OPF | OQF | OAF | OVF |
|---|---|---|---|---|---|
| `0.1.0` (current, pre-release) | `0.2.x` | `0.2.x` | `0.1.x` | `0.1.x` | `0.1.x` |

The OES version bumps whenever **any** sub-spec changes, even if the
other four are byte-identical to the previous release — that bump is what
makes "OES v0.1.0" a precise, checkable claim rather than a vague label.
A tool that wants certainty pins to an OES version and reads this table,
rather than tracking five independent compatibility ranges itself. This
is why an *unrelated* spec's patch doesn't force any existing course/set/
question/article/video file to change: the OES version is a release name
for a tested bundle, not a field embedded in content — so a `course.json`
authored under OES `0.1.0` stays exactly as valid under OES `0.1.1` if
OCF's own shape didn't move, with nothing to edit.

## Content integrity for external references

Every reference to an independently-hosted document — `question_url`
(OPF), `article_url`/`video_lesson_url` (OCF), `set_url` (OCF),
`course_url` (OCF) — points at content this document does not control and
cannot version alongside itself. Without anything more, that has three
consequences: no way to detect the referenced content changed after the
fact, no way to cache it safely across requests, and no way to reproduce
a past grading/completion result with confidence the content is what it
was at the time.

Every one of these reference shapes therefore supports an optional
**`content_hash`** field: a `sha256` hash of the referenced document,
formatted `"sha256-{hex}"` — the same idea as [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
on the web.

- Set it when you want to pin a specific revision of externally-referenced
  content — a shared question bank, a shared article, a shared video
  lesson, a prerequisite course. A consumer fetching that URL SHOULD
  verify the hash matches, and SHOULD treat a mismatch as "this reference
  is stale," not silently render whatever it got.
- Leave it unset when you're fine always resolving to whatever the URL
  currently serves (the simpler, more common case for content you trust
  the maintainer of, or content unlikely to change meaningfully).
- It's meaningless for co-located `path` references — those are already
  versioned by this document's own repo history, so there's nothing extra
  a hash would tell you.

This is one mechanism solving three problems at once (integrity, caching,
reproducibility) rather than three separate ad hoc fields.

## Content provenance for imported/adapted content

An `article.json`, `video.json`, `question.json`, `stimulus.json`,
`set.json`, `course.json`, `module.json`, or `lesson.json` can optionally
carry a **`source`** object recording where it was originally sourced or
adapted from, when it wasn't authored directly for OES — the shape any
importer against another platform (a YouTube playlist, an OpenCourseWare
site, anything) should fill in:

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | **yes** | The original content's own URL. |
| `platform` | string | no | Free-text label for the originating platform or site, e.g. `"Khan Academy"`, `"MIT OpenCourseWare"`, `"YouTube"`. Deliberately not an enum — OES doesn't hard-code or endorse any specific platform; any importer fills in whatever's accurate. |
| `license` | string | no | The **original** content's license or terms of use at the source. Free text, not constrained to SPDX like the document's own top-level `license` field — many platforms' terms of use aren't expressible as a single SPDX identifier. |
| `retrieved_at` | string | no | Date the content was fetched/adapted from the source (`YYYY-MM-DD`) — provenance, and a signal for how stale this copy might be. |
| `note` | string | no | Free-text context — adaptation details, attribution requirements, anything not covered above. |

`source.license` is deliberately distinct from a document's own top-level
`license`: the latter describes *this OES document's* license (what you,
the OES author, are licensing your adaptation under), while `source.license`
records what the *original* was licensed under at the source — which is
often more restrictive (e.g. non-commercial, share-alike) and matters for
knowing what a re-user is actually allowed to do with the adaptation.

This field is entirely optional and purely descriptive — no OES tooling
requires it, verifies it, or fetches `source.url`. It exists so an
importer has somewhere honest to record provenance and licensing
constraints, for anyone building a connector against a platform that
requires authentication, scraping, or its own API to extract from. OES
itself takes no position on any specific platform's terms of service —
`source` just gives whoever built that connector, and everyone who
inherits the content afterward, a place to be honest about where it came
from and under what terms.

## Error handling for broken references

None of the specs can force a referenced URL to keep working. What they
can define is what a conformant consumer does when one doesn't:

- A consumer that fails to resolve a reference (network failure, 404,
  schema-invalid response, hash mismatch) MUST NOT silently omit that
  item from what it shows the learner without any indication something is
  missing — that's indistinguishable from content simply not existing,
  which misleads whoever's looking at a lesson/set expecting it.
- A consumer SHOULD render the rest of the document (the other questions
  in a set, the other content items in a lesson) rather than failing the
  entire tree over one broken reference, and SHOULD surface a visible
  "this content is unavailable" marker for the specific item that failed.
- A consumer MAY retry, cache a last-known-good copy, or fall back to a
  `content_hash`-verified cached version if one exists — none of this is
  mandated, but silently succeeding *or* silently failing on a broken
  reference are both non-conformant.

## Security considerations

- **Executable content.** OQF's `code` type embeds `starter_code`,
  `test_cases`, and optionally `solutions` — a consumer that runs
  submitted or reference code against these test cases MUST do so in a
  sandboxed environment with no access to anything beyond what grading
  that one question requires. Treat every string in a `code` question,
  and any code a learner submits against it, as untrusted input.
- **Fetching arbitrary URLs.** Every `*_url` field is, by definition, a
  URL supplied by whoever authored the referencing document — not
  necessarily the same party operating the consuming application. A
  consumer SHOULD apply reasonable limits (timeouts, response size caps,
  a restriction against fetching non-HTTP(S) schemes or internal/private
  network addresses) before fetching one, the same hygiene any application
  fetching user-supplied URLs needs, to avoid becoming an SSRF vector or
  being sent to fetch an unbounded response.
- **Answer visibility.** By default, every OQF type's `type_config`
  carries its own answer inline — an `mcq`'s `answer`, an `msq`'s
  `answers`, and so on — present directly in the same `question.json` a
  learner's client fetches. This is the right default for self-practice
  content, and remains the default: most questions have no reason to pay
  any extra ceremony for a secret that isn't one. Every type with a
  single determinate answer can opt into being a **graded question**
  instead by setting a top-level `answer_key` (`{file}` or `{url}`, the
  same local/external idiom used everywhere else in OES): when set, the
  type-specific answer field MUST be omitted from `type_config` — the
  schema enforces this exclusion, not just documents it — and a grading
  consumer fetches the real answer from wherever `answer_key` points,
  which SHOULD be a private repo or an authenticated endpoint, never a
  public co-located file, if the intent is that a learner's client truly
  never sees it. This now covers `mcq`, `msq`, `numerical`, `fill_blank`,
  `diagram`, `code` (its hidden test cases and `solutions`), `match`, and
  `order` — every type where "the answer" is a well-defined thing to hide.
  `short_answer`, `essay`, and `submission` have no `answer_key` support
  because they have no single correct answer to hide in the first place —
  they're manually graded against a rubric, which is guidance for a human
  grader, not a secret to protect. Securing `match` and `order` required
  restructuring both away from their original shapes (a pair's two values
  sitting together, or items stored in their literal correct order) into
  id-keyed public content plus a separately-removable id-based answer —
  see each type's page in [Question Types](/specs/oqf/question-types) for
  the current shape. Widely-used assessment platforms converge on this
  same requirement independently, just via different mechanisms — never
  transmit the answer at all, strip it from the response server-side, or
  gate it behind a submission deadline — which is a reasonable signal
  that "the client must not receive a live question's correct answer"
  is a real, near-universal requirement, not an OES-specific
  precaution. `answer_key` is OES's static, authoring-time version of
  that same guarantee: whether an implementer actually keeps the file
  private is up to them, same as any access-control decision outside
  the content itself, but the schema at least makes "the answer is a
  separate, omittable resource" the shape the spec assumes.
- **Video redistribution rights.** OVF's `downloadable` flag is a
  statement about legal redistribution rights, set by the video's author
  — it is not a technical access-control mechanism, and a consuming app
  MUST NOT infer redistribution rights from the mere fact that a
  `video_url` is fetchable. See [OVF's Authoring Guide](/specs/ovf/authoring)
  for when it's appropriate to set `downloadable: true`.
