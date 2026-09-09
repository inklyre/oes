# Authoring Guide

Practical guidance for writing a good OVF video lesson.

## Writing a transcript

- Transcribe what's actually said, lightly cleaned up (remove filler words,
  false starts) — not a scripted summary written after the fact.
- Break it into paragraphs at natural topic shifts, not by a fixed line
  length, so it reads well as prose.
- Don't inline timestamps into `transcript.md` — that's what `chapters` is
  for. A transcript should read like an article.

## Writing chapters

- One chapter per distinct sub-topic the video covers, not one per minute.
  A 4-minute setup video might have 3 chapters; a 40-minute lecture might
  have 8-10.
- Label each chapter the way you'd label a heading in an article — a short
  noun phrase describing what happens there ("Verifying the install"), not
  a timestamp restated as text.
- `time_seconds` values must be strictly increasing.

## Duration and metadata

- `duration_mins` should match the actual video length, not the topic's
  reading-equivalent time — unlike an article's `estimated_mins`, this one
  is a hard fact about the file, not an estimate.
- `description` should tell a learner what they'll see, distinct from
  `title` — avoid just repeating the title with different words.

## Marking a video `downloadable`

Only set `downloadable: true` if you actually hold the rights to
redistribute the video *file itself*, not just the right to link to it:

- A video you self-host (your own CDN, your own S3 bucket) that you
  produced or hold a redistribution license for — reasonable to mark
  `true`.
- An embed of someone else's YouTube/Vimeo/etc. video — leave it `false`
  (the default). Mirroring that file into other people's exported course
  packages would very likely violate that platform's terms of service,
  regardless of what OVF's schema permits.

When in doubt, leave it `false`. It only disables one convenience feature
(offline bundling) for consuming apps — the video still plays fine via
`video_url` either way.

## Reviewing before publishing

1. Validate `video.json` against the [JSON Schema](./schema-reference).
2. If co-located, confirm the folder name matches `id` exactly.
3. Confirm `video_url` actually resolves and plays.
4. If chapters are present, scrub through the video and confirm each
   timestamp lands where the labeled topic actually starts.
