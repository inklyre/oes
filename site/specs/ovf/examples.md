# Examples

A complete, worked OVF video lesson.

## `install-python`

### File tree

```
install-python/
├── video.json
└── transcript.md
```

### `video.json`

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

### `transcript.md`

```markdown
Welcome back. In this video we'll install Python 3.12 and confirm it works
from the command line, on Windows, Mac, or Linux.

First, head to python.org/downloads and grab the installer for your
platform. On Windows, make sure to check "Add python.exe to PATH" during
install — this is the single most common thing people forget.

Once it's installed, open a terminal and run `python3 --version`. If you
see a version number, you're set. Try opening a Python REPL with `python3`
and running `print("hello, world")` to confirm it actually executes code.
```

This example never sets `downloadable`/`local_path` — it's streaming-only,
which is the default and by far the common case.

## `intro-recap` — self-hosted, downloaded for offline use

A video the author self-hosts and has explicitly permitted redistributing,
which some consuming app has already downloaded and bundled — demonstrates
both fields together, after an app's "download for offline" feature ran.

### File tree

```
intro-recap/
├── video.json
└── video.mp4          (present because an app already downloaded it)
```

### `video.json`

```json
{
  "ovf_version": "0.1.0",
  "id": "intro-recap",
  "title": "Course Recap",
  "description": "A 90-second recap of what this course covers.",
  "video_url": "https://cdn.example.com/videos/intro-recap.mp4",
  "duration_mins": 1.5,
  "downloadable": true,
  "local_path": "video.mp4"
}
```

A consumer opening this `video.json` finds `local_path` set and the file
actually present at `intro-recap/video.mp4`, so it plays directly from
local storage — no network request to `video_url` needed. If `video.mp4`
were missing (say, a different app exported this course without bundling
it), the consumer would fall back to streaming `video_url` instead;
nothing about `video.json` itself would need to change.

## Using these examples

1. Rename `id` and the folder name to your own kebab-case identifier — if
   co-locating inside a lesson, the folder name must match `id` exactly.
2. Validate against the [JSON Schema](./schema-reference) before
   publishing.
3. Reference it from an [OCF lesson](/specs/ocf/examples) — either with a
   local `path` if co-located, or a `video_lesson_url` if hosted
   separately.
4. Leave out `downloadable`/`local_path` entirely unless you specifically
   hold redistribution rights and a tool has actually bundled the file —
   see [Offline & Portable Packages](./file-structure#offline-portable-packages).
