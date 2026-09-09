# Examples

A complete, worked OCF course: "Introduction to Python," two modules, six
lessons. Shows the full file tree and the full contents of every file.

## File tree

```
intro-to-python/
├── course.json
└── modules/
    ├── getting-started/
    │   ├── module.json
    │   └── lessons/
    │       ├── setup/
    │       │   ├── lesson.json
    │       │   ├── articles/
    │       │   │   └── main/
    │       │   │       ├── article.json
    │       │   │       └── content.md
    │       │   └── video-lessons/
    │       │       └── install-python/
    │       │           └── video.json
    │       ├── variables-and-types/
    │       │   ├── lesson.json
    │       │   └── articles/
    │       │       └── main/
    │       │           ├── article.json
    │       │           └── content.md
    │       └── control-flow/
    │           ├── lesson.json
    │           └── articles/
    │               └── main/
    │                   ├── article.json
    │                   └── content.md
    └── functions-and-data/
        ├── module.json
        └── lessons/
            ├── writing-functions/
            │   ├── lesson.json
            │   └── articles/
            │       └── main/
            │           ├── article.json
            │           └── content.md
            ├── lists-and-dicts/
            │   ├── lesson.json
            │   └── articles/
            │       └── main/
            │           ├── article.json
            │           └── content.md
            └── putting-it-together/
                ├── lesson.json
                └── articles/
                    └── main/
                        ├── article.json
                        └── content.md
```

## `course.json`

```json
{
  "ocf_version": "0.3.0",
  "id": "intro-to-python",
  "title": "Introduction to Python",
  "description": "A beginner-friendly introduction to Python: syntax, control flow, functions, and core data structures.",
  "authors": ["ankit-ksh"],
  "license": "CC-BY-4.0",
  "tags": ["python", "programming", "beginner"],
  "language": "en",
  "level": "beginner",
  "estimated_mins": 360,
  "modules": [
    { "id": "getting-started", "path": "modules/getting-started" },
    { "id": "functions-and-data", "path": "modules/functions-and-data" }
  ]
}
```

## Module 1 — `modules/getting-started/module.json`

```json
{
  "ocf_version": "0.3.0",
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

### `lessons/setup/articles/main/content.md`

```markdown
Before writing any Python, let's get it installed and confirm everything
works.

1. Download Python 3.12 or later from python.org.
2. Verify the install by running `python3 --version` in your terminal.
3. Open a Python REPL by running `python3` with no arguments, and try
   `print("hello, world")`.

You now have everything you need to follow along with the rest of this
course. If you'd rather watch than read, see the video below.
```

### `lessons/setup/articles/main/article.json`

```json
{
  "oaf_version": "0.1.0",
  "id": "main",
  "title": "Setting Up Python",
  "estimated_mins": 3
}
```

### `lessons/setup/video-lessons/install-python/video.json`

```json
{
  "ovf_version": "0.1.0",
  "id": "install-python",
  "title": "Installing Python (Windows/Mac/Linux)",
  "description": "Download, install, and verify Python 3.12 on any major platform.",
  "video_url": "https://example.com/videos/python-setup",
  "duration_mins": 4
}
```

### `lessons/setup/lesson.json`

```json
{
  "ocf_version": "0.3.0",
  "id": "setup",
  "title": "Setting Up Python",
  "description": "Install Python and run your first line of code.",
  "estimated_mins": 10,
  "items": [
    { "type": "video", "id": "install-python", "path": "video-lessons/install-python" },
    { "type": "article", "id": "main", "path": "articles/main" }
  ],
  "related": [
    { "type": "link", "title": "Official Python downloads", "url": "https://www.python.org/downloads/" }
  ]
}
```

### `lessons/variables-and-types/articles/main/content.md`

```markdown
Python variables don't need a declared type — the type is inferred from the
value you assign.

\`\`\`python
name = "Ada"        # str
age = 36             # int
height_m = 1.68       # float
is_learning = True    # bool
\`\`\`

Use `type(x)` to check a value's type at any point.
```

### `lessons/variables-and-types/articles/main/article.json`

```json
{
  "oaf_version": "0.1.0",
  "id": "main",
  "title": "Variables and Types",
  "estimated_mins": 8
}
```

### `lessons/variables-and-types/lesson.json`

```json
{
  "ocf_version": "0.3.0",
  "id": "variables-and-types",
  "title": "Variables and Types",
  "description": "Python's core built-in types and how variables work.",
  "estimated_mins": 20,
  "items": [
    { "type": "article", "id": "main", "path": "articles/main" },
    {
      "type": "practice_set",
      "id": "variables-types-quiz",
      "title": "Variables & Types Quiz",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/set.json",
      "required": true
    }
  ]
}
```

### `lessons/control-flow/articles/main/content.md`

```markdown
`if`/`elif`/`else` and `for`/`while` loops control the order code executes
in. Python uses indentation, not braces, to mark blocks.

\`\`\`python
for n in range(5):
    if n % 2 == 0:
        print(n, "is even")
    else:
        print(n, "is odd")
\`\`\`
```

### `lessons/control-flow/articles/main/article.json`

```json
{
  "oaf_version": "0.1.0",
  "id": "main",
  "title": "Control Flow",
  "estimated_mins": 10
}
```

### `lessons/control-flow/lesson.json`

```json
{
  "ocf_version": "0.3.0",
  "id": "control-flow",
  "title": "Control Flow",
  "description": "Conditionals and loops.",
  "estimated_mins": 25,
  "items": [
    { "type": "article", "id": "main", "path": "articles/main" },
    {
      "type": "practice_set",
      "id": "control-flow-practice",
      "title": "Control Flow Practice",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/control-flow-set.json",
      "required": false
    }
  ]
}
```

## Module 2 — `modules/functions-and-data/module.json`

```json
{
  "ocf_version": "0.3.0",
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

### `lessons/writing-functions/articles/main/content.md`

```markdown
A function is defined with `def`, takes parameters, and optionally returns
a value:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("Ada"))
\`\`\`

Functions let you name and reuse a piece of logic instead of repeating it.
```

### `lessons/writing-functions/articles/main/article.json`

```json
{
  "oaf_version": "0.1.0",
  "id": "main",
  "title": "Writing Functions",
  "estimated_mins": 10
}
```

### `lessons/writing-functions/lesson.json`

```json
{
  "ocf_version": "0.3.0",
  "id": "writing-functions",
  "title": "Writing Functions",
  "description": "Defining and calling functions, parameters, and return values.",
  "estimated_mins": 25,
  "items": [
    { "type": "article", "id": "main", "path": "articles/main" },
    {
      "type": "practice_set",
      "id": "functions-practice",
      "title": "Functions Practice",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/functions-set.json",
      "required": true
    }
  ]
}
```

### `lessons/lists-and-dicts/articles/main/content.md`

```markdown
Lists are ordered, mutable collections. Dictionaries map keys to values.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
prices = {"apple": 0.5, "banana": 0.25}

fruits.append("date")
print(prices["banana"])
\`\`\`
```

### `lessons/lists-and-dicts/articles/main/article.json`

```json
{
  "oaf_version": "0.1.0",
  "id": "main",
  "title": "Lists and Dictionaries",
  "estimated_mins": 10
}
```

### `lessons/lists-and-dicts/lesson.json`

```json
{
  "ocf_version": "0.3.0",
  "id": "lists-and-dicts",
  "title": "Lists and Dictionaries",
  "description": "Python's core built-in data structures.",
  "estimated_mins": 25,
  "items": [
    { "type": "article", "id": "main", "path": "articles/main" },
    {
      "type": "practice_set",
      "id": "lists-dicts-practice",
      "title": "Lists & Dicts Practice",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/lists-dicts-set.json",
      "required": true
    }
  ]
}
```

### `lessons/putting-it-together/articles/main/content.md`

```markdown
Let's combine everything: functions, loops, and a dictionary to build a
small word-frequency counter.

\`\`\`python
def word_counts(text):
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    return counts

print(word_counts("the quick fox jumps over the lazy fox"))
\`\`\`

This is your first small program that combines everything from this
module. Try modifying it to ignore punctuation.
```

### `lessons/putting-it-together/articles/main/article.json`

```json
{
  "oaf_version": "0.1.0",
  "id": "main",
  "title": "Putting It Together",
  "estimated_mins": 12
}
```

### `lessons/putting-it-together/lesson.json`

```json
{
  "ocf_version": "0.3.0",
  "id": "putting-it-together",
  "title": "Putting It Together",
  "description": "A small capstone program combining functions, loops, and dictionaries.",
  "estimated_mins": 30,
  "items": [
    { "type": "article", "id": "main", "path": "articles/main" },
    {
      "type": "practice_set",
      "id": "module-2-capstone-challenge",
      "title": "Module 2 Capstone Challenge",
      "set_url": "https://raw.githubusercontent.com/ankit-ksh/python-basics-practice/main/capstone-set.json",
      "required": true
    }
  ],
  "related": [
    { "type": "file", "title": "Starter notebook", "url": "https://example.com/files/word-counter-starter.ipynb" }
  ]
}
```

## Notes on this example

- Every `type: "practice_set"` item's `set_url` points at a separate,
  independently hosted OPF repository — the course never embeds question
  content directly, per OCF's "link rather than duplicate" philosophy.
- `required: true` items must be completed to progress; `required: false`
  are optional reinforcement — every item type supports this flag, unused
  on most articles here since they're every lesson's core content.
- `setup` is the only lesson mixing a video and an article — the article
  covers the same steps as the video, for learners who prefer reading;
  `items[]`'s order puts the video first. `putting-it-together` is the
  only lesson using `related` (a starter notebook file) alongside its
  article and practice set.
- Module/lesson order is entirely determined by array order in
  `course.json`'s `modules` and each `module.json`'s `lessons` — there is
  no separate `order` field anywhere in OCF.

## Using this example

Copy this tree as a starting point for your own course, then:

1. Rename `id` fields (course, modules, lessons, articles, video lessons)
   and matching folder names to your own kebab-case identifiers.
2. Replace `authors`, `license`, and `tags` with your own.
3. Point `set_url`/`article_url`/`video_lesson_url` fields at your own
   hosted [OPF](/specs/opf/)/[OAF](/specs/oaf/)/[OVF](/specs/ovf/) content.
4. Validate against the [JSON Schemas](./schema-reference) before
   publishing.
