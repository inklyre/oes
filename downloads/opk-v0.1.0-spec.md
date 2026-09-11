# OPK — Open Package Format

**Version 0.1.0 · Status: Draft · License: CC BY 4.0**

Part of [OES — Open Education Standards](https://oes.inklyre.org/).

## Table of contents

1. Overview and Philosophy
2. Package Structure
3. `package.json` Reference
4. Versioning a Package
5. Integrity
6. The Bundled Payload
7. JSON Schema
8. Worked Example

---

## 1. Overview and Philosophy

OPK describes **a unit of OES content that can be named, versioned, and
shared** — what you publish when you want someone else to import your
course, and what a registry serves when they do.

The other six specs describe content. OPK describes distribution. It
exists because a course today is shareable only as a *location*:
`course.json` has an `id`, `prerequisites[].course_url`, and
`content_hash` — enough to point at content, not enough to distribute it.
There is no namespace, no version, no manifest, and no digest over the
whole thing.

OPK is deliberately specified before any registry exists, so content can
be packaged and shared by hand — a git repo, a release asset, a static
host — without waiting for one. It is kept as small as possible in
consequence: authentication, search, ranking, mirroring, quotas and
deprecation policy all belong to a registry's own API, not to a package
format.

OPK is **not** a transport, not an archive format, not an auth system,
and not a replacement for `content_hash`.

## 2. Package Structure

```
{package-root}/
├── package.json          the OPK manifest — the only file OPK adds
├── course.json           (or set.json — the package's entry document)
└── modules/ …            everything the entry document references
```

Nothing moves: a package is a directory that already held valid OES
content, plus a manifest. Remove `package.json` and you have what you had
before.

Any document that can stand alone may be a package root — `course.json`,
`set.json`, `article.json`, `video.json`, `resource.json`. The manifest
names the entry explicitly, so no consumer has to guess or probe.

A package SHOULD be self-contained: every `path` resolves inside the
root. It MAY reference outside content by URL, but each such reference
SHOULD carry a `content_hash`, since the package digest covers only files
the package contains. A package MUST NOT reference anything above its own
root — that is what lets a consumer extract it anywhere without
rewriting paths.

## 3. `package.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint. Not part of the OES content model. |
| `opk_version` | string | yes | Any `0.1.x` patch — see Versioning & Conformance on the docs site. |
| `name` | string | yes | `{namespace}/{package}`, both kebab-case, e.g. `acme/databases`. |
| `version` | string | yes | SemVer for the package's content, independent of every spec version inside it. |
| `entry` | object | yes | `{type: "course"\|"set"\|"article"\|"video"\|"resource", path}` — the document a consumer opens first. |
| `title` | string | yes | Human-readable name, for a listing. |
| `description` | string | no | One or two sentences, for a listing. |
| `authors` | string[] | no | GitHub usernames. |
| `license` | string | no | SPDX identifier. Strongly recommended on anything published. |
| `tags` | string[] | no | Free-form, for discovery. |
| `language` | string | no | BCP 47 tag. |
| `oes_version` | string | no | The OES release this package was authored against. |
| `requires` | object | no | `{profiles: [...]}` — conformance profiles a consumer must implement. |
| `dependencies` | object | no | `{name: semver range}` — a release range, not a location. Distinct from a course's pedagogical `prerequisites`. |
| `digest` | string | no | `sha256-{hex}` over the package's contents. A registry SHOULD require it on publish. |
| `files` | object[] | no | `{path, sha256, bytes}` per file. A registry SHOULD require it on publish. |
| `source` | object | no | Where this package was originally sourced or adapted from. |

## 4. Versioning a Package

A package's `version` is its own and independent of every spec version
inside it. Bump the package version when the *content* changes, the spec
versions when the *shape* does.

- **patch** — a typo, a clarified sentence, a corrected answer key.
- **minor** — new material; nothing existing removed or renumbered.
- **major** — content removed, questions renumbered, a module
  restructured.

The useful test: **if someone's existing reference into your content
would now mean something different, it is a major.**

## 5. Integrity

`digest` is the SHA-256 of a canonical listing of every file path and its
own SHA-256, sorted by path. Hashing a listing rather than an archive
keeps the digest independent of tar/zip choices, file ordering, and
timestamps — two people packaging the same directory get the same digest.

It covers **every file**, prose and images included. Per-document
`content_hash` covers one JSON document at a time and notably does not
cover prose held in a separate file; the package digest is the only
integrity mechanism in OES that covers a whole tree.

## 6. The Bundled Payload

A package on disk is a tree of files — right for authoring and git, wrong
for a network, where forty questions is forty-plus requests. The bundled
payload is the same content in one response: every reference resolved,
all prose inlined, shared documents stored once under a `{type}:{id}` key,
and assets left as URLs so browsers and CDNs can cache them.

Bundle at the granularity a learner opens — a lesson or a set, not a
single question.

A bundle MUST be derivable from the package alone, MUST record the
`package.digest` it was built from, and MUST NOT contain answer keys the
package holds outside learner-facing documents. Bundling is a transport
optimisation, never a change in what a learner may see.

## 7. JSON Schema

Full schema: `schemas/opk/v0.1.0/package.schema.json`.

## 8. Worked Example

```json
{
  "$schema": "https://oes.inklyre.org/schemas/opk/v0.1.0/package.schema.json",
  "opk_version": "0.1.0",
  "name": "acme/databases",
  "version": "2.1.0",
  "title": "Databases: From Tables to Transactions",
  "description": "A one-semester introduction to relational databases.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "language": "en",
  "tags": ["databases", "sql"],
  "oes_version": "0.2.0",
  "entry": { "type": "course", "path": "course.json" },
  "requires": { "profiles": ["Core", "+Practice"] },
  "dependencies": { "acme/sql-basics": "^1.2.0" }
}
```

`digest` and `files` are omitted because they are added at publish time by
whatever packages the directory, not typed by an author.
