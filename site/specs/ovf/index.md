# OVF — Open Video Format

<div class="ovf-badges">

**Version:** 0.1.0 &nbsp;·&nbsp; **Status:** Draft &nbsp;·&nbsp; **License:** CC BY 4.0

<a class="ovf-download-btn" href="/downloads/ovf-v0.1.0-spec.md" download>⬇ Download full spec (single Markdown file)</a>

</div>

## What is OVF?

OVF (Open Video Format) is an open specification for a single **video
lesson** — real structured metadata about a video, stored as **static
files**, referenced from an [OCF](/specs/ocf/) lesson as a first-class
content item (a "video lesson") rather than a bare `{type, title, url}`
link.

`video_url` always points at wherever the video is actually hosted or
embedded (YouTube, Vimeo, a self-hosted CDN) and is always required as the
canonical source — an *authored* `video.json` is metadata about a video,
not the video file itself, for the same reason a git repo is a poor home
for video binaries. What OVF adds beyond a bare link is real, structured
value: duration, a full transcript, and chapter markers.

That said, OES's static-files philosophy extends naturally to fully
**offline, portable packages** — a course exported as one self-contained
directory tree with no live network dependency at playback time. Since a
video is the one OES content type that can't just *be* a local file by
default (unlike an article, which already is one), OVF defines an explicit,
opt-in path for bundling a local copy: see
[Offline & Portable Packages](./file-structure#offline-portable-packages)
below.

## Philosophy

- **Metadata about a video, not the video.** `video_url` is required and
  external — OVF describes and enriches a video, it doesn't host one.
- **Real value beyond a link.** An optional `transcript.md` and structured
  `chapters` make a video lesson searchable, accessible, and navigable in a
  way a bare URL never is.
- **Reusable by design.** A video lesson can be co-located with the one
  lesson that uses it, or hosted independently and referenced by URL from
  many lessons — the same local/external duality every other OES content
  spec supports.
- **Composed by OCF, not owned by it.** OVF says nothing about courses,
  modules, or lesson sequencing — that's [OCF](/specs/ocf/)'s job.

## The files that make up a video lesson

```
my-video-lesson/
├── video.json
├── transcript.md      (optional — full text transcript)
└── assets/             (optional — e.g. a custom thumbnail)
```

| File | Purpose |
|---|---|
| `video.json` | Metadata: title, description, `video_url`, duration, chapters. |
| `transcript.md` | The video's full spoken content as plain Markdown, if provided. |

## Pages in this spec

- [Getting Started](./getting-started) — build a minimal video lesson in five minutes
- [File Structure](./file-structure) — directory layout and the two ways to reference a video lesson
- [Schema Reference](./schema-reference) — full field-by-field reference
- [Authoring Guide](./authoring) — writing good transcripts and chapter breakdowns
- [Extensions](./extensions) — the `x_` namespace mechanism
- [Examples](./examples) — a worked example

<style>
.ovf-badges { margin-bottom: 24px; }
.ovf-download-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white) !important;
  font-weight: 600;
  text-decoration: none !important;
}
.ovf-download-btn:hover { background: var(--vp-c-brand-2); }
</style>
