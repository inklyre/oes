# Package Structure

A package is **ordinary OES content plus one extra file** at its root:

```
{package-root}/
├── package.json          the OPK manifest — the only file OPK adds
├── course.json           (or set.json — the package's entry document)
└── modules/ …            everything the entry document references
```

Nothing moves. A package is a directory that already contained valid OES
content, with a manifest describing it. Remove `package.json` and you have
exactly what you had before.

## What may be a package root

Any document that can stand alone as a thing worth sharing:

| Entry | A package of… |
|---|---|
| `course.json` | a whole course |
| `set.json` | a practice set or question bank |
| `article.json` | one substantial article |
| `video.json` / `resource.json` | a single item worth versioning on its own |

The manifest names the entry explicitly, so a consumer never has to guess
or probe for it.

## Self-containment

A package **SHOULD** be self-contained: every `path` reference resolves
inside the package root. A package MAY reference content outside itself by
URL, but each such reference SHOULD carry a `content_hash`, because
nothing else pins it — the package's own digest covers only the files the
package contains.

A package **MUST NOT** reference anything above its own root (`../`
escaping the package). That is what lets a consumer relocate a package —
extract it anywhere, serve it from any prefix — without rewriting paths.

## Versioning a package

A package's `version` is its own, and independent of every spec version
inside it. `acme/databases@2.1.0` says nothing about which OCF version its
`course.json` uses; that is what `ocf_version` is for. Bump the package
version when the *content* changes, the spec versions when the *shape*
does.

Package versions are [SemVer](https://semver.org/), interpreted for
content rather than code:

- **patch** — a typo, a clarified sentence, a corrected answer key. A
  learner mid-course is unaffected.
- **minor** — new material added; nothing existing removed or
  renumbered.
- **major** — content removed, questions renumbered, a module
  restructured. Anything that could invalidate a bookmark, a citation, or
  a grade computed against the previous version.

That last line is the useful test: **if someone's existing reference into
your content would now mean something different, it is a major.**

## Dependencies

`dependencies` names other packages this one needs — a course whose
prerequisite is another course, a set that reuses a shared stimulus
package:

```json
"dependencies": { "acme/sql-basics": "^1.2.0" }
```

This is a **release** range, not a location, which is the difference from
`prerequisites[].course_url`. A consumer resolves the name however it
resolves names; the format takes no position on where packages live.

`prerequisites` in `course.json` continues to mean what it always did —
*pedagogical* prerequisites, what a learner should know first. The two are
genuinely different, and a course can have either without the other.

## Integrity

`package.json` carries a `digest` over the package's contents: the SHA-256
of a canonical listing of every file path and its own SHA-256, sorted by
path. Hashing a listing rather than an archive keeps the digest
independent of tar/zip choices, file ordering, and timestamps — two people
packaging the same directory get the same digest.

The digest covers **every file**, including prose and images. That is
deliberate: per-document `content_hash` covers one JSON document at a
time, and notably [does not cover prose held in a separate
file](/conformance#content-integrity-for-external-references). The package
digest is the only integrity mechanism in OES that covers a whole tree.
