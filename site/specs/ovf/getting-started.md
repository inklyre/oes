# Getting Started

Building the smallest possible valid OVF video lesson: one folder, one file.

## 1. Create the folder structure

```bash
mkdir -p my-first-video-lesson
cd my-first-video-lesson
```

## 2. Write the video lesson's metadata

`video.json`:

```json
{
  "ovf_version": "0.1.0",
  "id": "my-first-video-lesson",
  "title": "Installing Python",
  "description": "Download and install Python 3.12, and confirm it works.",
  "video_url": "https://example.com/videos/python-setup",
  "duration_mins": 4
}
```

There's no video file to write — `video_url` points at wherever the video
is actually hosted. Everything else in `video.json` describes it.

## 3. (Optional) add a transcript and chapters

`transcript.md`:

```markdown
Welcome back. In this video we'll install Python 3.12 and confirm it
works from the command line.

First, head to python.org/downloads and grab the installer for your
platform...
```

Add chapter markers to `video.json`:

```json
{
  "ovf_version": "0.1.0",
  "id": "my-first-video-lesson",
  "title": "Installing Python",
  "video_url": "https://example.com/videos/python-setup",
  "duration_mins": 4,
  "chapters": [
    { "label": "Downloading the installer", "time_seconds": 0 },
    { "label": "Running the installer", "time_seconds": 90 },
    { "label": "Verifying the install", "time_seconds": 180 }
  ]
}
```

## 4. Validate it

```bash
npx ajv-cli validate \
  -s https://oes.dev/schemas/ovf/v0.1.0/video.schema.json \
  -d video.json
```

## 5. Use it

A video lesson is referenced from an [OCF](/specs/ocf/) lesson's
`video_lessons[]` list, either co-located (a relative `path`) or externally
(a `video_lesson_url`, for a video shared across multiple lessons/courses).
See [OCF's Getting Started](/specs/ocf/getting-started).

## What's next

- Read [File Structure](./file-structure) for the co-located vs. standalone
  distinction.
- Read [Examples](./examples) for a complete worked video lesson.
- Read [Editor Setup](/editor-setup) for inline validation/autocomplete
  while hand-editing `video.json`.
