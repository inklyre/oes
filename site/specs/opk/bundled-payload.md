# The Bundled Payload

A package on disk is a tree of files. That is the right shape for
authoring and for git, and the wrong shape for a network: a set of forty
questions is forty-plus requests, and a consumer that fetches them one at
a time has an N+1 problem the format handed it.

The **bundled payload** is the same content in one response. It is what a
registry serves and what an app consumes.

## Three forms, one spec

```
 .oes.md          →   question.json      →   bundled payload
 (authoring)          (THE SPEC)             (the network form)
 optional tooling     human + machine        machine only
                      readable, git-diffable prose inlined, one fetch
```

The middle column is the specification. The left is
[tooling](https://www.npmjs.com/package/@inklyre/oes-authoring) and
appears nowhere in these specs. The right is this page.

It is worth being precise about the middle column, because it is easy to
assume JSON was chosen for machines. It was not. `question.json` is
pretty-printed, uses long readable field names, and lives in a git repo
so a person can review a one-word change in a pull request — the
[Git-Native](/) property. JSON is the format that serves **both**
audiences adequately. Only the third column is machine-optimised, and
only the third column is produced rather than authored.

## What bundling does

Given a package, a bundler produces one JSON document in which:

1. **Every reference is resolved.** No `path`, no `*_url` left to follow.
2. **All prose is inlined.** `statement`, an article's `content`, a
   stimulus's `content` are strings, never `{file}` references. This is
   also what makes a single digest meaningful — prose in a separate file
   is [not covered by a document's own
   `content_hash`](/conformance#content-integrity-for-external-references).
3. **Shared documents appear once.** A stimulus referenced by five
   questions is inlined once and referenced by `id`, not copied five
   times.
4. **Assets stay as URLs.** Images, video files, and PDFs are *not*
   inlined. They are better as static files a browser fetches, caches,
   and pulls from a CDN — and base64 in JSON would defeat all three.

## The unit is the set or lesson, not the question

Bundle at the granularity a learner actually opens. One response carrying
a lesson, or a practice set with all its questions and its stimuli, is the
point; a per-question bundle just reintroduces N+1 with extra steps.

## Structure

```json
{
  "opk_version": "0.1.0",
  "kind": "bundle",
  "package": { "name": "acme/databases", "version": "2.1.0", "digest": "sha256-…" },
  "generated_from": { "oes_version": "0.2.0" },
  "entry": { "type": "course", "id": "databases" },
  "documents": {
    "course:databases": { "…": "the course.json content, references resolved to ids" },
    "question:two-sum": { "…": "statement inlined as a string" },
    "stimulus:bookstore-schema": { "…": "content inlined once" }
  },
  "assets": [
    { "id": "assets/neuron.png", "url": "https://…/neuron.png", "sha256": "…", "bytes": 20481 }
  ]
}
```

`documents` is a flat map keyed `{type}:{id}`, so a shared document is
stored once and referenced by key from anywhere. The nesting that OES uses
on disk is expressed by those keys rather than by duplication.

## Rules

- A bundle **MUST** be derivable from the package alone. It carries no
  information a consumer could not compute itself; it exists to save
  round trips, not to add meaning. Anything a bundle knows that the
  package does not is a bug.
- A bundle **MUST** record the `package.digest` it was built from, so a
  consumer can tell which release it holds and a cache can be invalidated
  precisely.
- A bundle **MUST NOT** contain answer keys that the package holds
  outside the learner-facing documents. A secured question stays secured:
  bundling is a transport optimisation, never a change in what a learner
  may see. This is the one rule whose violation is a security bug rather
  than a correctness one.
- A consumer **SHOULD** treat a bundle as a cache of the package, not as
  the source of truth. The package is canonical.

## Why this is specified at all

While one codebase both produces and consumes bundles, their shape is an
implementation detail and does not need a spec. It stops being one the
moment a registry serves a bundle to somebody else's LMS — at that point
it is an interop surface between two independent implementations, which
is precisely the condition that makes something a specification rather
than a convention.

Specifying it here, with OPK, keeps that boundary in one place instead of
letting every registry invent its own.
