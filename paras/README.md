# Updating this profile

Edit the JSON files, then run from the repository root:

```sh
python paras/generate.py
python paras/generate.py --check
```

On Windows, `py paras/generate.py` also works if the Python launcher is installed.
Python 3.8 or newer is required; no packages are needed. Paths are resolved relative
to the script, so you can also run `python generate.py` from inside `paras`.

- `profile.json`: relatively stable metadata, identity, navigation labels, and links.
- `content.json`: current role, research, projects, publications, methods, training,
  and personal interests. Keys follow the visible page sections. Numbered fields
  follow their order within that section.
- `index.template.html`: existing layout with `{{...}}` content placeholders.
- `index.html`: generated page; direct edits will be overwritten.
- `profile-review.html`: standalone suggestions with deleted/inserted wording,
  positioning advice, and a draft responsible AI statement. Suggestions are not
  automatically applied. Open this file in a browser to read the review.

Keep JSON keys unchanged. Edit the values in double quotes. Escape double quotes
inside a value as `\"`. Most copy values support small HTML fragments such as
`<i>species name</i>` and `<a href=\"https://...\">label</a>` to preserve the original
formatting. These are trusted author-written HTML, not sanitised input. In rich
text, write `&amp;` for an ampersand and `&lt;` for a literal less-than sign.
Metadata and standalone links are automatically HTML-escaped.

To add a publication, copy a record in `content.json`'s `publications` array:

```json
{
  "year": "2026",
  "style": "preprint",
  "citation_html": "Author A, Verma P. Title of the paper.",
  "url": "https://doi.org/your-doi",
  "venue": "Journal or preprint server",
  "details": "Preprint."
}
```

Use `"highlight"`, `"preprint"`, or `""` for style. Array order is display order.
All other publication fields are strings. Confirm the citation and status before
publishing. Add/remove/reorder publication records freely. Adding a new project,
tab, or method card also requires its markup in the template; editing existing
text only requires JSON. Image paths and external links are in `profile.links`;
links within rich text remain alongside their text.

The generator leaves the existing page intact if JSON or required fields are
invalid. `--check` makes no changes and returns a nonzero exit code if generation
fails or the page is stale. Review the generated page and commit it with the JSON
and template changes for GitHub Pages. No browser-side JSON loading is required.
