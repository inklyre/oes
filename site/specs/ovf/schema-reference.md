# Schema Reference

Machine-readable JSON Schema (draft-07):

- `video.json` → [`schemas/ovf/v0.1.0/video.schema.json`](/oes/schemas/ovf/v0.1.0/video.schema.json)

## `video.json`

| Field | Type | Required | Description |
|---|---|---|---|
| `$schema` | string | no | Optional editor hint (e.g. VS Code) pointing at this document's JSON Schema for inline validation/autocomplete. Not part of the OES content model. |
| `ovf_version` | string | **yes** | Any `0.1.x` — see [Versioning & Conformance](/conformance#versioning-policy). |
| `id` | string | **yes** | Kebab-case. Matches the video lesson's folder name when co-located via `path`. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | |
| `video_url` | string (uri) | **yes** | Where the video is actually hosted/embedded (YouTube, Vimeo, self-hosted CDN). Always the canonical source. MAY be a single file or an adaptive-streaming manifest (HLS `.m3u8`, DASH `.mpd`) — OVF takes no position on which. |
| `duration_mins` | number | no | |
| `authors` | string[] | no | GitHub usernames. A video lesson can be reused independently of any lesson, so it needs its own attribution. |
| `license` | string | no | SPDX identifier. Describes the video lesson's own metadata/transcript — does not by itself grant redistribution rights to the underlying file; see `downloadable`. |
| `status` | string | no | One of `"draft"`, `"published"`, `"deprecated"`. Absent means published. |
| `tags` | string[] | no | |
| `language` | string | no | Primary spoken language, BCP 47 tag. |
| `chapters` | object[] | no | Ordered list of `{ label, time_seconds }`. |
| `captions` | object[] | no | Timed closed captions/subtitles, distinct from the untimed prose in `transcript.md`. Zero or more tracks, e.g. one per language — each `{language, path\|url, content_hash?}`, `path`/`url` pointing at a `.vtt` or `.srt` file. Exactly one of `path`/`url` per track. |
| `downloadable` | boolean | no, default `false` | Whether `video_url`'s file may be downloaded and bundled into an exported/portable package. Only `true` when you hold redistribution rights — never for a third-party-hosted embed. See [Offline & Portable Packages](./file-structure#offline-portable-packages) and [Security Considerations](/conformance#security-considerations). |
| `local_path` | string | no | Filename (no subdirectories) of a locally-bundled copy, one of `.mp4`/`.webm`/`.mov`/`.mkv`, populated by tooling (not hand-authored) once a `downloadable: true` video has actually been fetched. Entirely optional — most `video.json` files never have this. The fixed extension set is deliberate: it's what makes a single `.gitignore` pattern reliably catch every bundled video in a repo — see [Offline & Portable Packages](./file-structure#offline-portable-packages). |
| `references` | array | no | Cited sources — papers, books, or sites this video's content is based on. See below. |
| `related` | array | no | Suggested material for a learner who wants to go further after this specific video — e.g. this video's own "watch next." See below. |
| `source` | object | no | Where this video was originally sourced or adapted from, if imported — see [Content provenance](/conformance#content-provenance-for-imported-adapted-content). |

`references[]` entries — each entry is either a bare URL string (the
simple case) or a richer object, needed for a source with no single URL:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | **yes** (object form only) | The source's title. |
| `type` | string | no | One of `"article"`, `"book"`, `"paper"`, `"video"`, `"website"`, `"dataset"`, `"other"`. Defaults to `"website"`. |
| `authors` | string[] | no | The source's authors. |
| `url` | string | no | Where to find it online. Omit for a source with no online location, e.g. a print-only book. |
| `isbn` | string | no | For `type: "book"`. |
| `doi` | string | no | For `type: "paper"`. |
| `publisher` | string | no | |
| `year` | integer | no | |
| `note` | string | no | Why this source is included. |

`related[]` entries — suggested material, not this video's own content:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | **yes** | Human-readable title. |
| `type` | string | **yes** | One of `"video"`, `"article"`, `"book"`, `"course"`, `"practice_set"`, `"resource"`, `"file"`, `"link"`, `"other"`. |
| `path` | string | one of the six below | Path, relative to this `video.json`, to co-located OES content this entry points at. |
| `video_lesson_url` / `article_url` / `set_url` / `course_url` / `resource_url` | string | one of the seven | Full URL to that OES document type, hosted separately. |
| `url` | string | one of the seven | For material that isn't OES content at all — e.g. a YouTube video. Exactly one of `path`/`video_lesson_url`/`article_url`/`set_url`/`course_url`/`resource_url`/`url` must be present. |
| `content_hash` | string | no | `sha256-{hex}`, meaningful only alongside one of the `*_url` fields. |
| `note` | string | no | Why this is suggested. |

This is the natural home for a "suggested next video" that isn't part of
the referencing lesson's own required content — a different explanation of
the same topic, a deeper dive, or literally the next video in a source
YouTube playlist. Use `video_lesson_url`/`path` when the suggestion is
itself modeled as an OVF `video.json` (so a consuming app can render its
real title/duration/thumbnail); use a bare `url` when it's an external
video you don't otherwise want to wrap as OES content, e.g. an arbitrary
YouTube link.

## Validating

```bash
ajv validate -s schemas/ovf/v0.1.0/video.schema.json \
  -d "my-video-lessons/*/video.json"
```

## Extension fields

Any field matching `^x_[a-z0-9_]+$` is permitted anywhere in `video.json`
and is intentionally left unvalidated by the core schema. See
[Extensions](./extensions).
