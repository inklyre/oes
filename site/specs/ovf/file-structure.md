# File Structure

## Layout

```
{video-lesson-root}/
├── video.json
├── video.mp4           (optional — a locally-bundled copy, only when downloadable)
├── transcript.md       (optional)
└── assets/              (optional — e.g. a custom thumbnail)
```

## Two ways to reference a video lesson

**Co-located** — lives inside an OCF lesson's own folder, conventionally
under `video-lessons/{id}/`:

```
lessons/setup/
├── lesson.json
└── video-lessons/
    └── install-python/
        └── video.json
```

**Standalone / shared** — lives in its own repo, referenced by
`video_lesson_url` from any number of lessons — useful for a video that
genuinely applies across multiple courses.

See [OCF's Schema Reference](/specs/ocf/schema-reference) for exactly how a
lesson's `video_lessons[]` entries choose between the two.

## Naming rules

| Rule | Detail |
|---|---|
| `video-lesson-id` format | kebab-case: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| Folder name (co-located only) | Must equal the video lesson's `id`. |
| `video.json` location | Always at the root of the video lesson's own folder. |

## File responsibilities

### `video.json`

Metadata for the video: title, description, `video_url` (required —
where the video is actually hosted), duration, chapters. See
[Schema Reference](./schema-reference#videojson).

### `transcript.md` (optional)

The video's full spoken content, as plain Markdown prose (no timestamps
inline — use `video.json`'s `chapters` for structured timestamps). Improves
accessibility, searchability, and translatability.

### `assets/` (optional)

E.g. a custom thumbnail image, referenced from `video.json` using a path
relative to the video lesson's own folder.

## Offline & Portable Packages

OES's static-files philosophy extends naturally to a fully **offline,
portable course package** — an exported directory tree (or a zip of one)
that plays back with no live network dependency, because every piece of
content it references is already a local file. An [OAF](/specs/oaf/)
article or an [OQF](/specs/oqf/) question already satisfies this by
construction — they *are* local JSON+Markdown, nothing to fetch. Video is
the one OES content type that's normally a pointer to somewhere else, so
OVF defines an explicit, **entirely optional** mechanism for bundling a
local copy:

- `downloadable` (on `video.json`, default `false`) — set by the video's
  *author*, this states whether the file at `video_url` may be downloaded
  and redistributed as part of an exported package at all. Only set it
  `true` for self-hosted or appropriately-licensed video you actually hold
  the rights to redistribute — never for an embed of third-party-hosted
  video (e.g. a YouTube URL), where mirroring the file would violate that
  platform's terms. Absence of this field, or `false`, means "streaming
  only, never bundle this file."
- `local_path` (on `video.json`, e.g. `"video.mp4"`) — set by *tooling*,
  not hand-authored. An application that offers a "download for offline"
  feature checks `downloadable` first, and if permitted, fetches
  `video_url`, saves it next to `video.json` at this path, and includes
  the file when it exports/zips the course tree. A consumer that finds the
  file at `local_path` should prefer playing it directly over fetching
  `video_url`, and fall back to streaming from `video_url` whenever the
  local file is absent or missing — which is the common case for most
  authored content, since this is opt-in, not the default.

This is the same reasoning [OPF's questions](/specs/opf/authoring) and
[OCF's practice sets](/specs/ocf/index) already apply to co-located vs.
externally-referenced content, extended to handle the one content type
(video) that also has real file-size and redistribution-rights concerns a
question or article never does.

### Don't commit the bundled file to your authoring repo

`local_path` exists for **exported/distributed packages** — a zip a
learner downloads, a folder a desktop app writes to local disk — not for
the git repository you author `video.json` in. Committing an actual video
file into that repo reintroduces exactly the problem OVF exists to avoid:
git repos handle large binaries badly (bloated clones, no meaningful
diffs, history that only grows). Treat a file at `local_path` the same way
you'd treat a `dist/` folder or a downloaded dependency — a build/download
artifact, not source.

`local_path` is deliberately constrained to a small, fixed set of
extensions (`.mp4`, `.webm`, `.mov`, `.mkv`) sitting directly in the video
lesson's own folder, with no subdirectories allowed — specifically so one
short, memorable `.gitignore` pattern catches every bundled video in a
repo, regardless of how many video lessons it has:

```text
# OES: locally-downloaded video files (see OVF's Offline & Portable
# Packages) — populated by tooling for exported packages, never authored,
# never meant to be committed here.
**/video-lessons/**/*.mp4
**/video-lessons/**/*.webm
**/video-lessons/**/*.mov
**/video-lessons/**/*.mkv
```

Add this once to a course or question-bank repo's `.gitignore` and every
future co-located video lesson is covered automatically — no per-file
exclusions to remember. If you're building the actual export/packaging
tool, this is also your cue: package/zip generation should include these
files even though the *source* repo ignores them, since the whole point is
that the exported package is self-contained even when the authoring repo
isn't.

## Path resolution rules

- A video lesson's own asset paths, and `local_path` when present, are
  always relative to its own folder.
- `video_url` is always a full, absolute URL — the actual video is never
  assumed to be co-located with `video.json` by default.
