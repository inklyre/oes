# OPK — Open Package Format

<div class="opk-badges">

**Version:** 0.1.0 &nbsp;·&nbsp; **Status:** Draft &nbsp;·&nbsp; **License:** CC BY 4.0

<a class="opk-download-btn" href="/downloads/opk-v0.1.0-spec.md" download>⬇ Download full spec (single Markdown file)</a>

</div>

## What is OPK?

OPK (Open Package Format) is an open specification for **a unit of OES
content that can be named, versioned, and shared** — what you publish when
you want someone else to import your course, and what a registry serves
when they do.

The other six specs describe content. OPK describes **distribution**: a
namespaced name, a version, a digest, a manifest of what's inside, and the
shape of the payload a consumer actually receives.

## Why it exists

Today a course is shareable, but only as a location. `course.json` has an
`id`, `prerequisites[].course_url`, and `content_hash` — enough to *point
at* content, not enough to *distribute* it. There is no way to say:

- "this is `acme/databases`, version `2.1.0`" — no namespace, no version
- "here is everything in it" — no manifest, so a consumer discovers files
  by walking references and hoping
- "here is the exact bytes you got" — `content_hash` covers one document
  at a time, never the package as a whole
- "I depend on `acme/sql-basics@^1.0.0`" — prerequisites are URLs, which
  pin a location rather than a release

Every hosting-a-registry problem reduces to one of those four.

## The rule this spec had to pass

> A new spec is justified when it describes a noun that gets shared
> independently.

OCF/OPF/OQF/OAF/OVF/ORF all pass — a course, a set, a question, an
article, a video, a resource are each a thing someone hands to someone
else. A *package* passes too, and nothing else in OES describes one.

A learner's submission or progress, by contrast, does not pass: it is
per-learner runtime state, which is [out of scope](/conformance#scope-content-not-runtime-state)
by design and stays there.

## Status: designed ahead of its consumer

OPK is deliberately specified before any registry exists, so that content
can be packaged and shared by hand — over a git repo, a release asset, or
a static host — without waiting for one.

That ordering has a cost worth stating plainly: a spec written before its
implementation is a prediction. OPK is therefore kept as small as it can
be while still being useful, and everything a registry could reasonably
decide for itself — authentication, search, ranking, mirroring, quotas,
deprecation policy — is deliberately absent. Those belong to a registry's
own API, not to the package format.

## What OPK is not

- **Not a transport.** It says nothing about HTTP, and a package is
  perfectly valid sitting in a directory.
- **Not an archive format.** A package is OES files plus a manifest, not
  a new container. Tar or zip them however you like.
- **Not an auth or identity system.** Who may publish `acme/*` is a
  registry's question.
- **Not a replacement for `content_hash`.** Per-document hashes still do
  their job; OPK adds one over the package.

## Next

- [Package Structure](./file-structure) — what a package contains
- [Schema Reference](./schema-reference) — `package.json`'s fields
- [The Bundled Payload](./bundled-payload) — what a registry serves
