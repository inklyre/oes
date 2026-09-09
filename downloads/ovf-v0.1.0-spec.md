# OVF — Open Video Format

**Version 0.1.0 · Status: Draft · License: CC0 1.0**

Part of [OES — Open Education Standards](https://inklyre.github.io/oes/).

## Table of contents

1. Overview and Philosophy
2. File Structure
3. `video.json` Reference
4. Offline & Portable Packages
5. Extension Mechanism
6. Authoring Guidance
7. JSON Schema
8. Worked Examples

---

## 1. Overview and Philosophy

OVF (Open Video Format) is an open specification for a single **video
lesson** — real structured metadata about a video, stored as static files,
referenced from an [OCF](https://inklyre.github.io/oes/specs/ocf/)
lesson as a first-class content item rather than a bare
`{type, title, url}` link.

`video_url` always points at wherever the video is actually hosted or
embedded and is always required as the canonical source. What OVF adds
beyond a bare link is real structured value: duration, a full transcript,
chapter markers, and — entirely optionally — a path to bundling a local
copy for fully offline, portable course packages (see section 4).

## 2. File Structure

```
{video-lesson-root}/
├── video.json
├── transcript.md      (optional)
└── assets/             (optional — e.g. a custom thumbnail)
```

Co-located (inside an OCF lesson's own folder, under
`video-lessons/{id}/`) or standalone/shared (its own repo, referenced by
`video_lesson_url`).

## 3. `video.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `ovf_version` | string | yes | Any `0.1.x` patch — see Versioning & Conformance on the docs site. |
| `id` | string | yes | Kebab-case. |
| `title` | string | yes | |
| `description` | string | no | |
| `video_url` | string (uri) | yes | Where the video is actually hosted/embedded. |
| `duration_mins` | number | no | |
| `authors` | string[] | no | GitHub usernames — a video lesson can be reused independently of any lesson. |
| `license` | string | no | SPDX identifier. Covers the metadata/transcript, not redistribution rights to the video file — see `downloadable`. |
| `status` | string | no | `"draft"`/`"published"`/`"deprecated"`. Absent means published. |
| `tags` | string[] | no | |
| `language` | string | no | Primary spoken language, BCP 47. |
| `chapters` | object[] | no | Ordered `{label, time_seconds}`. |
| `captions` | object[] | no | Timed closed captions/subtitles, distinct from `transcript.md`'s untimed prose. `[{language, path\|url, content_hash?}]`, `path`/`url` pointing at a `.vtt`/`.srt` file. |
| `downloadable` | boolean | no, default `false` | Whether `video_url`'s file may be downloaded and bundled into an exported package. Only `true` when you hold redistribution rights. |
| `local_path` | string | no | Filename (no subdirectories), one of `.mp4`/`.webm`/`.mov`/`.mkv`, populated by tooling once a `downloadable: true` video has been fetched. |
| `references` | array | no | Cited sources this video's content is based on — same shape as OAF's `references`. |
| `related` | array | no | Suggested material for a learner who wants to go further after this video — this video's own "watch next." `{title, type, path\|video_lesson_url\|article_url\|set_url\|course_url\|url, content_hash?, note?}`, exactly one address field. Use `video_lesson_url`/`path` for a suggestion that's itself an OVF `video.json`, or a bare `url` for anything external (e.g. a YouTube link). |

`transcript.md` is optional plain Markdown prose (no inline timestamps —
use `chapters` for that).

## 4. Offline & Portable Packages

An OAF article or OQF question is already a local file — nothing to
fetch. Video is the one OES content type that's normally just a pointer,
so OVF defines an explicit, entirely optional path to a fully offline
package: `downloadable` (author-set, default `false`) states whether the
file may legally be redistributed at all — only for self-hosted/licensed
video, never a third-party embed. `local_path` (tool-set, not
hand-authored) is where a downloaded copy actually lives once some app has
fetched it. A consumer prefers the local file when present and falls back
to streaming `video_url` otherwise — which is the default state for most
authored content, since bundling is opt-in.

**Don't commit the bundled file to your authoring repo.** `local_path` is
for exported/distributed packages, not the git repo you author `video.json`
in — committing an actual video file there reintroduces the large-binary
problem OVF exists to avoid. `local_path` is deliberately restricted to a
fixed extension set (`.mp4`/`.webm`/`.mov`/`.mkv`) with no subdirectories,
specifically so one `.gitignore` pattern catches every bundled video in a
repo:

```text
**/video-lessons/**/*.mp4
**/video-lessons/**/*.webm
**/video-lessons/**/*.mov
**/video-lessons/**/*.mkv
```

## 5. Extension Mechanism

Same `x_` mechanism as every OES spec, shared registry at
`extensions/registry.md`.

## 6. Authoring Guidance

Transcribe what's actually said, lightly cleaned up — not a scripted
summary. One chapter per distinct sub-topic, not per minute; label chapters
like headings, not restated timestamps; `time_seconds` values strictly
increasing. `duration_mins` should match the actual file length, a hard
fact, unlike an article's estimated reading time. Only mark `downloadable:
true` when you hold redistribution rights to the file itself — never for a
third-party embed (e.g. YouTube); when in doubt, leave it `false`.

## 7. JSON Schema

Full schema: `schemas/ovf/v0.1.0/video.schema.json`.

## 8. Worked Examples

Streaming-only (the common case — no `downloadable`/`local_path`):

```
install-python/
├── video.json
└── transcript.md
```

`video.json`:
```json
{
  "ovf_version": "0.1.0",
  "id": "install-python",
  "title": "Installing Python (Windows/Mac/Linux)",
  "description": "Download, install, and verify Python 3.12 on any major platform.",
  "video_url": "https://example.com/videos/python-setup",
  "duration_mins": 4,
  "tags": ["python", "setup"],
  "language": "en",
  "chapters": [
    { "label": "Downloading the installer", "time_seconds": 0 },
    { "label": "Running the installer", "time_seconds": 90 },
    { "label": "Verifying the install", "time_seconds": 180 }
  ]
}
```

Self-hosted, downloaded for offline use — a tool has already fetched and
bundled the file:

```
intro-recap/
├── video.json
└── video.mp4          (present because an app already downloaded it)
```

`video.json`:
```json
{
  "ovf_version": "0.1.0",
  "id": "intro-recap",
  "title": "Course Recap",
  "video_url": "https://cdn.example.com/videos/intro-recap.mp4",
  "duration_mins": 1.5,
  "downloadable": true,
  "local_path": "video.mp4"
}
```

A consumer that finds `video.mp4` present plays it directly, offline —
no request to `video_url` needed. If the file were missing, it would fall
back to streaming `video_url` instead, with no change to `video.json`.
