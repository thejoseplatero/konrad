# Konrad, Senior Consultant

A personal application page built by Jose Platero for one job posting:
[Senior Consultant, Toronto](https://www.konrad.com/careers/job/senior-consultant_7848814003).

Not affiliated with, endorsed by, or authorized by Konrad.

## Working on it

```bash
node scripts/build.mjs   # content/*.md + template.html -> index.html
node scripts/qa.mjs      # 63 checks, gates every commit
node scripts/qa.mjs --live   # also checks both deploy targets
```

Prose lives in `content/*.md`. Structure lives in `template.html`. Never edit
`index.html` by hand, it is generated and will be overwritten.

Two token types:

- `<!--content:name-->` renders block markdown, for anything sitting inside a `div`
- `<!--inline:name-->` renders one line with no wrapping tag, for anything sitting
  inside an existing `h1` or `p`

Using the wrong one is a real bug that already happened once: a block token inside
`<h1>` produced `<h1><p>...</p></h1>` and silently dropped the hero headline to
body size. QA now fails on it.

## Before changing anything

Read `design-notes.md`. It records the measured brand tokens, the shape language
behind the mark, and the reason each QA check exists. If a change contradicts that
file, either the change is wrong or the file needs updating first. "It looked
better" is not a reference.

## Not deployed

No GitHub Pages, no FTP, nothing pushed. Deploy is a deliberate, separate step,
and the application decision comes before it.
