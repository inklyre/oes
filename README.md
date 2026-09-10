# OES — Open Education Standards

Open specifications for education technology. Free to use, free to
implement, free to extend.

OES is a hub of open, static-file-based specifications for representing
education content — practice problems, courses, and (over time) whatever
else needs a shared, open format. Every spec is git-native (plain files,
versioned like code), database-free (no backend required to author or host
content), and auth-agnostic (hosting and access control are left to the
platform, not the format).

Browse the full docs site: **https://oes.inklyre.org/**

## Current specs

| Spec | Description | Version | Status | Docs |
|---|---|---|---|---|
| **OCF** — Open Course Format | Courses of modules and lessons, each an ordered sequence of items linking OAF articles, OVF video lessons, OPF practice sets, and ORF reference documents | 0.3.0 | Draft | [Read the spec](https://oes.inklyre.org/specs/ocf/) |
| **OPF** — Open Practice Format | Practice sets: ordered collections of OQF questions plus set-level metadata | 0.2.0 | Draft | [Read the spec](https://oes.inklyre.org/specs/opf/) |
| **OQF** — Open Question Format | A single question: 11 types, static files, reusable across sets | 0.1.0 | Draft | [Read the spec](https://oes.inklyre.org/specs/oqf/) |
| **OAF** — Open Article Format | A single written article — real authored content, not a link | 0.1.0 | Draft | [Read the spec](https://oes.inklyre.org/specs/oaf/) |
| **OVF** — Open Video Format | A single video lesson: metadata, transcript, and chapters around an externally-hosted video | 0.1.0 | Draft | [Read the spec](https://oes.inklyre.org/specs/ovf/) |
| **ORF** — Open Resource Format | A single reference document (PDF, ebook, paper): metadata, page count, and a table of contents around an externally-hosted file | 0.1.0 | Draft | [Read the spec](https://oes.inklyre.org/specs/orf/) |

Each spec also has a JSON Schema (in [`schemas/`](./schemas)) and a single
downloadable Markdown file with the complete spec (in
[`downloads/`](./downloads)) for offline reference. Versioning policy,
conformance language (MUST/SHOULD/MAY), the cross-spec content-integrity
mechanism, and security considerations are documented once, shared across
every spec, at [**Versioning & Conformance**](https://oes.inklyre.org/conformance).

## Repository structure

This is the spec repo — schemas, docs, and conformance fixtures only, no
publish pipeline of any kind. Reference tooling built on this spec
(`@inklyre/oes-core`, `@inklyre/oes-lint`, `@inklyre/oes-import-youtube`,
and `@inklyre/oes-schemas`) lives in a separate repo,
**[inklyre/oes-tooling](https://github.com/inklyre/oes-tooling)** — kept
apart so a spec-only change never touches the tooling's own history or
release cadence, and so npm publish credentials never need to live in the
one repo explicitly meant to welcome low-barrier outside contributions
(typo fixes, clarifications). `oes-tooling` fetches the current schema
content directly from this repo (a scheduled sync, not a push from here)
and publishes `@inklyre/oes-schemas` on npm when it changes.

```
oes/
├── site/               VitePress docs site (spec pages, landing page)
├── schemas/             JSON Schema (draft-07) per spec, per version
├── downloads/            Single-file consolidated Markdown spec per format
├── conformance/          Checked-in valid/invalid fixtures per spec — a real
│                          test suite, not just doc examples (npm run conformance)
├── extensions/           Extension registry (the x_ namespace mechanism)
└── scripts/              Conformance/shared-definition validation (dev-only, no publishing)
```

## Running the site locally

Requires Node.js 20+.

```bash
npm install
npm run docs:dev       # local dev server with hot reload
npm run docs:build     # production build, output to site/.vitepress/dist
npm run docs:preview   # preview the production build locally
npm run conformance    # validate every fixture in conformance/ against its schema
```

## Proposing a new spec

- **Small changes to an existing spec** (typos, clarifications, additional
  examples): open a pull request directly.
- **New fields on an existing spec**: open an issue first to discuss —
  breaking the shape of `set.json`/`course.json`/etc. affects every
  existing implementation, so changes are versioned deliberately.
- **A brand new spec**: open an issue describing the problem it solves and
  why it doesn't fit as an extension (see the `x_` namespace mechanism
  documented in each spec's Extensions page) or as new fields on an
  existing spec. If it moves forward, it gets its own `schemas/{spec}/`,
  `site/specs/{spec}/`, and `downloads/{spec}-v{version}-spec.md`,
  following the same structure as the existing specs.
- **A reusable `x_` extension**: no process needed to use one privately.
  To register it for reuse, open a pull request against
  [`extensions/registry.md`](./extensions/registry.md).

## License

All specifications, schemas, and consolidated downloads
(`schemas/`, `downloads/`, and the spec content in `site/`) are released
under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — free to
use, adapt, and redistribute, even commercially, provided you credit
OES/Inklyre. See [`LICENSE-SPEC`](./LICENSE-SPEC) for why attribution
rather than public domain (CC0).

The small amount of code in this repo (`scripts/`, spec-validation only —
no published packages live here) is licensed under Apache 2.0 instead —
see [`LICENSE`](./LICENSE). Reference tooling with real published
packages lives in [`oes-tooling`](https://github.com/inklyre/oes-tooling),
licensed independently there.

Built and maintained by [Inklyre](https://github.com/inklyre).
