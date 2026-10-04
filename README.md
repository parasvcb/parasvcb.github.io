This website hosts Paras Verma's research profile.

The landing page is `paras/index.html`. `paras/research.html` combines Core and
Extensions; `paras/views.html` contains the Cancer and Agentic AI perspectives.
All three pages use `paras/profile.json` and `paras/content.json` as their content
sources. The two essays are stored under `content.essays`.

The generator, template, tests and editorial material are kept in the sibling
`../extra` directory. From this repository, regenerate and check the pages with:

```sh
python ../extra/generate.py --site-dir paras
python ../extra/generate.py --site-dir paras --check
```

The JSON sources remain local and are ignored by Git. Commit generated HTML,
styles, scripts and display assets. Raw data and the unused AVI source video are
also excluded. The site does not load JSON at runtime. Existing Git history is
unchanged; the files are removed from tracking in the current index only.

If Python is unavailable, use the equivalent Node generator:

```sh
node ../extra/generate.cjs
node ../extra/generate.cjs --check
```

Backups and the complete line-by-line editorial redline are in the sibling
`../extra/revision-2026-10-03` directory. Keep a separate backup of local JSON
sources: a fresh clone contains the published pages, not the authoring data.
