---
layout: home

hero:
  name: OES
  text: Open Education Standards
  tagline: Open specifications for education technology. Free to use, free to implement, free to extend.
  actions:
    - theme: brand
      text: Browse Specs
      link: /specs/opf/

features:
  - icon: 🆓
    title: Open & Free
    details: Every spec is released under CC BY 4.0 — free to use, adapt, and redistribute, even commercially, with attribution. No licensing fees, no other restrictions.
  - icon: 🌱
    title: Git-Native
    details: Specs are designed around plain files in git repositories. Version content the same way you version code — with diffs, history, and pull requests.
  - icon: 🏫
    title: LMS-Ready
    details: An LMS integrates by storing a single URL to a set.json or course.json — never the content itself. Swap hosting providers without touching your database.
  - icon: 🧩
    title: Extensible
    details: Any x_ namespaced field is reserved for extensions and safely ignored by compliant parsers, so platforms can add their own data without forking the spec.
---

<div class="oes-specs-table">

## Specs

| Spec | Description | Version | Status |
|---|---|---|---|
| [OCF — Open Course Format](/specs/ocf/) | Courses of modules and lessons, each an ordered sequence of items linking OAF articles, OVF video lessons, OPF practice sets, and ORF reference documents | 0.3.0 | Draft |
| [OPF — Open Practice Format](/specs/opf/) | Practice sets: ordered collections of OQF questions plus set-level metadata | 0.2.0 | Draft |
| [OQF — Open Question Format](/specs/oqf/) | A single question: 11 types, static files, reusable across sets | 0.1.0 | Draft |
| [OAF — Open Article Format](/specs/oaf/) | A single written article — real authored content, not a link | 0.1.0 | Draft |
| [OVF — Open Video Format](/specs/ovf/) | A single video lesson: metadata, transcript, and chapters around an externally-hosted video | 0.1.0 | Draft |
| [ORF — Open Resource Format](/specs/orf/) | A single reference document (PDF, ebook, paper): metadata, page count, and a table of contents around an externally-hosted file | 0.1.0 | Draft |

</div>

<style>
.oes-specs-table {
  max-width: 960px;
  margin: 48px auto 0;
  padding: 0 24px;
}
.oes-specs-table table {
  width: 100%;
}
</style>
