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

Commit the generated HTML with JSON changes. The site does not load JSON at runtime.
