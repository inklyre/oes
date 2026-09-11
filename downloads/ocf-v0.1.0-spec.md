# OCF — Open Course Format

**Version:** 0.1.0
**Status:** Draft
**License:** CC BY 4.0 (this specification document)
**Part of:** [OES — Open Education Standards](https://oes.inklyre.org/)

This document is a complete, self-contained specification for OCF v0.1.0.
It is intended to be implementable by a developer with no other reference
material and no internet access.

---

## Table of Contents

1. Overview and Philosophy
2. File Structure
3. `course.json` Reference
4. `module.json` Reference
5. `lesson.json` Reference
6. Extension Mechanism
7. JSON Schema (full text)
8. Full Worked Example

---

## 1. Overview and Philosophy

OCF (Open Course Format) is an open specification for structuring a course
— a sequence of modules and lessons — as static files in a git repository,
the same way OPF (Open Practice Format) structures practice problem sets.
A course's lessons can link out to OPF practice sets, letting course
content and practice content be authored, hosted, and versioned
independently while still composing into one learning experience.

- **Static files, not a database.** A course is a folder of `.json` and
  `.md` files, structured hierarchically: course → modules → lessons.
- **Git-native.** The same clone/edit/commit/push workflow as OPF.
- **No database required.** Any static file host works.
- **Composes with OPF.** A lesson references OPF practice sets by URL. The
  course never owns or duplicates that content — it links to it, so the
  practice set can be updated or reused across many courses independently.

## 2. File Structure

```
my-course/
├── course.json
└── modules/
    └── {module-id}/
        ├── module.json
        └── lessons/
            └── {lesson-id}/
                ├── lesson.json
                ├── content.md
                └── assets/       (optional)
```

**Naming rules:**

| Rule | Detail |
|---|---|
| `module-id` / `lesson-id` format | kebab-case: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `module-id` uniqueness | Unique within the course |
| `lesson-id` uniqueness | Unique within its module |
| Folder name | Must equal the module's/lesson's `id` |
| `course.json` location | Root of the course |
| `module.json` location | `modules/{module-id}/module.json` |
| `lesson.json` location | `modules/{module-id}/lessons/{lesson-id}/lesson.json` |
| `content.md` location | `modules/{module-id}/lessons/{lesson-id}/content.md` |

**File responsibilities:**

- `course.json` — entry point; course metadata and the ordered list of
  modules (array order determines module sequence), plus optional
  `prerequisites` (other courses, by URL).
- `module.json` — module metadata and the ordered list of lessons within
  it (array order determines lesson sequence).
- `lesson.json` — lesson metadata: estimated time, linked external
  `resources`, and linked OPF `practice_sets`.
- `content.md` — the lesson's prose. Pure Markdown, no frontmatter, no
  metadata — same rule as OPF's `statement.md`.
- `assets/` (optional) — binary assets referenced from `content.md` via
  relative paths.

**Path resolution:** every `path` in `course.json` is relative to
`course.json` itself; every `path` in a `module.json` is relative to that
`module.json`. `set_url` and `course_url` are always full absolute URLs,
since they typically point at a different repository entirely.

## 3. `course.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `ocf_version` | string | **yes** | Must be `"0.1.0"`. |
| `id` | string | **yes** | Kebab-case, unique identifier. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Longer description. |
| `authors` | string[] | no | GitHub usernames. |
| `license` | string | no | SPDX license identifier. |
| `tags` | string[] | no | Free-form tags. |
| `language` | string | no | BCP 47 tag. |
| `level` | string | no | `"beginner"` \| `"intermediate"` \| `"advanced"`. |
| `estimated_hours` | number | no | Estimated total completion time. |
| `modules` | object[] | **yes** | Ordered list, min 1 item. |
| `prerequisites` | object[] | no | Other courses this depends on. |

`modules[]`: `{ id: string (required), path: string (required) }`.
`prerequisites[]`: `{ id: string (required), course_url: string (required) }`.

```json
{
  "ocf_version": "0.1.0",
  "id": "my-first-course",
  "title": "My First Course",
  "description": "A minimal OCF course with one module and one lesson.",
  "authors": ["your-github-username"],
  "license": "CC-BY-4.0",
  "language": "en",
  "level": "beginner",
  "estimated_hours": 0.5,
  "modules": [ { "id": "intro", "path": "modules/intro" } ]
}
```

## 4. `module.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `ocf_version` | string | **yes** | Must be `"0.1.0"`. |
| `id` | string | **yes** | Kebab-case, matches folder name. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Longer description. |
| `lessons` | object[] | **yes** | Ordered list, min 1 item. |

`lessons[]`: `{ id: string (required), path: string (required) }`.

```json
{
  "ocf_version": "0.1.0",
  "id": "intro",
  "title": "Introduction",
  "description": "Get oriented before diving into the material.",
  "lessons": [ { "id": "welcome", "path": "lessons/welcome" } ]
}
```

## 5. `lesson.json` Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `ocf_version` | string | **yes** | Must be `"0.1.0"`. |
| `id` | string | **yes** | Kebab-case, matches folder name. |
| `title` | string | **yes** | Human-readable title. |
| `description` | string | no | Longer description. |
| `estimated_mins` | number | no | Estimated completion time. |
| `resources` | object[] | no | Linked external materials. |
| `practice_sets` | object[] | no | Linked OPF practice sets. |

`resources[]`: `{ type: "video"|"article"|"file"|"link" (required), title: string (required), url: string (required) }`.

`practice_sets[]`: `{ title: string (required), set_url: string (required), required: boolean (default false) }`.

```json
{
  "ocf_version": "0.1.0",
  "id": "welcome",
  "title": "Welcome",
  "description": "Course overview and how it's structured.",
  "estimated_mins": 5,
  "resources": [
    { "type": "video", "title": "Course trailer", "url": "https://example.com/videos/trailer" }
  ],
  "practice_sets": [
    {
      "title": "Warm-up quiz",
      "set_url": "https://raw.githubusercontent.com/your-username/warmup-quiz/main/set.json",
      "required": false
    }
  ]
}
```

## 6. Extension Mechanism

OCF uses the same `x_` namespace mechanism as OPF — any field prefixed
`x_` is reserved for extensions, at any level of `course.json`,
`module.json`, or `lesson.json`. Format: `x_{namespace}_{field}`,
`snake_case`.

- Parsers **must** ignore unknown `x_`-prefixed fields without error.
- Core fields are never prefixed.
- Extensions must never be required for correctness.
- Namespace collisions are the extension author's responsibility.
- OCF and OPF share one extension registry (`extensions/registry.md` in
  the OES repository) — many extension concepts (spaced repetition,
  cohort/enrollment metadata) are useful in both contexts.

```json
{
  "x_acmeplatform_cohort_id": "fall-2026",
  "x_acmeplatform_unlock_date": "2026-09-15"
}
```

## 7. JSON Schema (full text)

A single schema file covers all three document types via `definitions` and
a top-level `oneOf`. Validate a specific file type against
`#/definitions/course`, `#/definitions/module`, or `#/definitions/lesson`.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://oes.inklyre.org/schemas/ocf/v0.1.0/course.schema.json",
  "title": "OCF Course",
  "definitions": {
    "course": {
      "type": "object",
      "required": ["ocf_version", "id", "title", "modules"],
      "additionalProperties": true,
      "properties": {
        "ocf_version": { "type": "string", "const": "0.1.0" },
        "id": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
        "title": { "type": "string", "minLength": 1 },
        "description": { "type": "string" },
        "authors": { "type": "array", "items": { "type": "string" } },
        "license": { "type": "string" },
        "tags": { "type": "array", "items": { "type": "string" } },
        "language": { "type": "string" },
        "level": { "type": "string", "enum": ["beginner", "intermediate", "advanced"] },
        "estimated_hours": { "type": "number", "minimum": 0 },
        "modules": {
          "type": "array", "minItems": 1,
          "items": { "type": "object", "required": ["id", "path"], "additionalProperties": true,
            "properties": { "id": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" }, "path": { "type": "string" } } }
        },
        "prerequisites": {
          "type": "array",
          "items": { "type": "object", "required": ["id", "course_url"], "additionalProperties": true,
            "properties": { "id": { "type": "string" }, "course_url": { "type": "string", "format": "uri" } } }
        }
      },
      "patternProperties": { "^x_[a-z0-9_]+$": {} }
    },
    "module": {
      "type": "object",
      "required": ["ocf_version", "id", "title", "lessons"],
      "additionalProperties": true,
      "properties": {
        "ocf_version": { "type": "string", "const": "0.1.0" },
        "id": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
        "title": { "type": "string", "minLength": 1 },
        "description": { "type": "string" },
        "lessons": {
          "type": "array", "minItems": 1,
          "items": { "type": "object", "required": ["id", "path"], "additionalProperties": true,
            "properties": { "id": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" }, "path": { "type": "string" } } }
        }
      },
      "patternProperties": { "^x_[a-z0-9_]+$": {} }
    },
    "lesson": {
      "type": "object",
      "required": ["ocf_version", "id", "title"],
      "additionalProperties": true,
      "properties": {
        "ocf_version": { "type": "string", "const": "0.1.0" },
        "id": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
        "title": { "type": "string", "minLength": 1 },
        "description": { "type": "string" },
        "estimated_mins": { "type": "number", "minimum": 0 },
        "resources": {
          "type": "array",
          "items": { "type": "object", "required": ["type", "title", "url"], "additionalProperties": true,
            "properties": { "type": { "type": "string", "enum": ["video", "article", "file", "link"] }, "title": { "type": "string" }, "url": { "type": "string", "format": "uri" } } }
        },
        "practice_sets": {
          "type": "array",
          "items": { "type": "object", "required": ["title", "set_url"], "additionalProperties": true,
            "properties": { "title": { "type": "string" }, "set_url": { "type": "string", "format": "uri" }, "required": { "type": "boolean", "default": false } } }
        }
      },
      "patternProperties": { "^x_[a-z0-9_]+$": {} }
    }
  },
  "oneOf": [
    { "$ref": "#/definitions/course" },
    { "$ref": "#/definitions/module" },
    { "$ref": "#/definitions/lesson" }
  ]
}
```

## 8. Full Worked Example

A beginner programming course with two modules of three lessons each,
with practice sets linked from several lessons.

```
intro-to-python/
├── course.json
└── modules/
    ├── getting-started/
    │   ├── module.json
    │   └── lessons/
    │       ├── setup/{lesson.json, content.md}
    │       ├── variables-and-types/{lesson.json, content.md}
    │       └── control-flow/{lesson.json, content.md}
    └── functions-and-data/
        ├── module.json
        └── lessons/
            ├── writing-functions/{lesson.json, content.md}
            ├── lists-and-dicts/{lesson.json, content.md}
            └── putting-it-together/{lesson.json, content.md}
```

`course.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "intro-to-python",
  "title": "Introduction to Python",
  "description": "A beginner-friendly introduction to Python: syntax, control flow, functions, and core data structures.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "tags": ["python", "programming", "beginner"],
  "language": "en",
  "level": "beginner",
  "estimated_hours": 6,
  "modules": [
    { "id": "getting-started", "path": "modules/getting-started" },
    { "id": "functions-and-data", "path": "modules/functions-and-data" }
  ]
}
```

`modules/getting-started/module.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "getting-started",
  "title": "Getting Started",
  "description": "Install Python, learn the basics of syntax, variables, types, and control flow.",
  "lessons": [
    { "id": "setup", "path": "lessons/setup" },
    { "id": "variables-and-types", "path": "lessons/variables-and-types" },
    { "id": "control-flow", "path": "lessons/control-flow" }
  ]
}
```

`modules/getting-started/lessons/setup/content.md`:
```markdown
Before writing any Python, let's get it installed and confirm everything
works.

1. Download Python 3.12 or later from python.org.
2. Verify the install by running `python3 --version` in your terminal.
3. Open a Python REPL by running `python3` with no arguments, and try
   `print("hello, world")`.
```

`modules/getting-started/lessons/setup/lesson.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "setup",
  "title": "Setting Up Python",
  "description": "Install Python and run your first line of code.",
  "estimated_mins": 10,
  "resources": [
    { "type": "link", "title": "Official Python downloads", "url": "https://www.python.org/downloads/" },
    { "type": "video", "title": "Installing Python (Windows/Mac/Linux)", "url": "https://example.com/videos/python-setup" }
  ]
}
```

`modules/getting-started/lessons/variables-and-types/content.md`:
```markdown
Python variables don't need a declared type — the type is inferred from
the value you assign.

name = "Ada"        # str
age = 36             # int
height_m = 1.68       # float
is_learning = True    # bool

Use `type(x)` to check a value's type at any point.
```

`modules/getting-started/lessons/variables-and-types/lesson.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "variables-and-types",
  "title": "Variables and Types",
  "description": "Python's core built-in types and how variables work.",
  "estimated_mins": 20,
  "practice_sets": [
    {
      "title": "Variables & Types Quiz",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/set.json",
      "required": true
    }
  ]
}
```

`modules/getting-started/lessons/control-flow/content.md`:
```markdown
`if`/`elif`/`else` and `for`/`while` loops control the order code executes
in. Python uses indentation, not braces, to mark blocks.

for n in range(5):
    if n % 2 == 0:
        print(n, "is even")
    else:
        print(n, "is odd")
```

`modules/getting-started/lessons/control-flow/lesson.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "control-flow",
  "title": "Control Flow",
  "description": "Conditionals and loops.",
  "estimated_mins": 25,
  "practice_sets": [
    {
      "title": "Control Flow Practice",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/control-flow-set.json",
      "required": false
    }
  ]
}
```

`modules/functions-and-data/module.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "functions-and-data",
  "title": "Functions and Data",
  "description": "Write reusable functions and work with Python's core data structures.",
  "lessons": [
    { "id": "writing-functions", "path": "lessons/writing-functions" },
    { "id": "lists-and-dicts", "path": "lessons/lists-and-dicts" },
    { "id": "putting-it-together", "path": "lessons/putting-it-together" }
  ]
}
```

`modules/functions-and-data/lessons/writing-functions/content.md`:
```markdown
A function is defined with `def`, takes parameters, and optionally returns
a value:

def greet(name):
    return f"Hello, {name}!"

print(greet("Ada"))
```

`modules/functions-and-data/lessons/writing-functions/lesson.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "writing-functions",
  "title": "Writing Functions",
  "description": "Defining and calling functions, parameters, and return values.",
  "estimated_mins": 25,
  "practice_sets": [
    {
      "title": "Functions Practice",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/functions-set.json",
      "required": true
    }
  ]
}
```

`modules/functions-and-data/lessons/lists-and-dicts/content.md`:
```markdown
Lists are ordered, mutable collections. Dictionaries map keys to values.

fruits = ["apple", "banana", "cherry"]
prices = {"apple": 0.5, "banana": 0.25}

fruits.append("date")
print(prices["banana"])
```

`modules/functions-and-data/lessons/lists-and-dicts/lesson.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "lists-and-dicts",
  "title": "Lists and Dictionaries",
  "description": "Python's core built-in data structures.",
  "estimated_mins": 25,
  "practice_sets": [
    {
      "title": "Lists & Dicts Practice",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/lists-dicts-set.json",
      "required": true
    }
  ]
}
```

`modules/functions-and-data/lessons/putting-it-together/content.md`:
```markdown
Let's combine everything: functions, loops, and a dictionary to build a
small word-frequency counter.

def word_counts(text):
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    return counts

print(word_counts("the quick fox jumps over the lazy fox"))
```

`modules/functions-and-data/lessons/putting-it-together/lesson.json`:
```json
{
  "ocf_version": "0.1.0",
  "id": "putting-it-together",
  "title": "Putting It Together",
  "description": "A small capstone program combining functions, loops, and dictionaries.",
  "estimated_mins": 30,
  "resources": [
    { "type": "file", "title": "Starter notebook", "url": "https://example.com/files/word-counter-starter.ipynb" }
  ],
  "practice_sets": [
    {
      "title": "Module 2 Capstone Challenge",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/capstone-set.json",
      "required": true
    }
  ]
}
```

**Notes:** every `practice_sets[].set_url` points at a separate,
independently hosted OPF repository — the course never embeds problem
content directly. `required: true` sets are ones a learner must complete
to progress. Module and lesson order is entirely determined by array order
— there is no separate `order` field.

---

*End of OCF v0.1.0 specification. Part of OES — Open Education Standards,
released under CC BY 4.0.*
