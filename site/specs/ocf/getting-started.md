# Getting Started

This walks through building the smallest possible valid OCF course: one
module, one lesson, with one co-located article as its content.

## 1. Create the folder structure

```bash
mkdir -p my-first-course/modules/intro/lessons/welcome/articles/main
cd my-first-course
```

## 2. Write the lesson's article

A lesson's content is [OAF](/specs/oaf/) articles (and/or
[OVF](/specs/ovf/) video lessons, and/or [OPF](/specs/opf/) practice sets).
`modules/intro/lessons/welcome/articles/main/content.md`:

```markdown
Welcome to the course! In this lesson, you'll get an overview of what
we'll cover and how the course is structured.

Each module builds on the last, and most lessons end with a linked
practice set so you can immediately apply what you've learned.
```

`modules/intro/lessons/welcome/articles/main/article.json`:

```json
{
  "oaf_version": "0.1.0",
  "id": "main",
  "title": "Welcome",
  "estimated_mins": 2
}
```

## 3. Write the lesson

`modules/intro/lessons/welcome/lesson.json`:

```json
{
  "ocf_version": "0.3.0",
  "id": "welcome",
  "title": "Welcome",
  "description": "Course overview and how it's structured.",
  "estimated_mins": 5,
  "items": [
    { "type": "article", "id": "main", "path": "articles/main" }
  ]
}
```

## 4. Write the module

`modules/intro/module.json`:

```json
{
  "ocf_version": "0.3.0",
  "id": "intro",
  "title": "Introduction",
  "description": "Get oriented before diving into the material.",
  "lessons": [
    { "id": "welcome", "path": "lessons/welcome" }
  ]
}
```

## 5. Write the course entry point

`course.json`:

```json
{
  "ocf_version": "0.3.0",
  "id": "my-first-course",
  "title": "My First Course",
  "description": "A minimal OCF course with one module and one lesson.",
  "authors": ["your-github-username"],
  "license": "CC-BY-4.0",
  "language": "en",
  "level": "beginner",
  "estimated_mins": 30,
  "modules": [
    { "id": "intro", "path": "modules/intro" }
  ]
}
```

## 6. Validate it

```bash
ajv validate -s "https://oes.inklyre.org/schemas/ocf/v0.3.0/course.schema.json#/definitions/course" -d course.json
ajv validate -s "https://oes.inklyre.org/schemas/ocf/v0.3.0/course.schema.json#/definitions/module" -d modules/intro/module.json
ajv validate -s "https://oes.inklyre.org/schemas/ocf/v0.3.0/course.schema.json#/definitions/lesson" -d modules/intro/lessons/welcome/lesson.json
ajv validate -s https://oes.inklyre.org/schemas/oaf/v0.2.0/article.schema.json -d modules/intro/lessons/welcome/articles/main/article.json
```

## 7. Host it

Push to a public GitHub repo and point any consumer at the raw URL of
`course.json`, exactly like [OPF's hosting](/specs/opf/hosting) — the same
options apply.

## Adding a video lesson and a practice set

`lesson.json`'s `items[]` is one ordered list mixing any combination of
articles, video lessons, and practice sets — array order is the order a
learner goes through them:

```json
{
  "ocf_version": "0.3.0",
  "id": "welcome",
  "title": "Welcome",
  "items": [
    {
      "type": "video",
      "id": "course-trailer",
      "title": "Course trailer",
      "video_lesson_url": "https://raw.githubusercontent.com/your-username/shared-videos/main/course-trailer/video.json"
    },
    { "type": "article", "id": "main", "path": "articles/main" },
    {
      "type": "practice_set",
      "id": "warmup-quiz",
      "title": "Warm-up quiz",
      "set_url": "https://raw.githubusercontent.com/your-username/warmup-quiz/main/set.json",
      "required": false
    }
  ]
}
```

## What's next

- Read [File Structure](./file-structure) for the full directory and
  naming rules.
- Read [Examples](./examples) for a complete, realistic course.
- Read [OAF](/specs/oaf/) and [OVF](/specs/ovf/) for how articles and
  video lessons work.
- Read [Editor Setup](/editor-setup) for inline validation/autocomplete
  while hand-editing `course.json`/`module.json`/`lesson.json`.
