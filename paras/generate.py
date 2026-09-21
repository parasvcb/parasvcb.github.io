#!/usr/bin/env python3
"""Build index.html from the two JSON files. Python 3.8+, no dependencies."""
import argparse
import html
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
TOKEN = re.compile(r"\{\{([a-zA-Z0-9_.]+)(\|html)?\}\}")


def load(path):
    with path.open(encoding="utf-8-sig") as source:
        value = json.load(source)
    if not isinstance(value, dict):
        raise ValueError(f"{path.name} must contain a JSON object")
    return value


def publications(records):
    if not isinstance(records, list):
        raise ValueError("content.publications must be an array")
    result = []
    for i, record in enumerate(records, 1):
        for key in ("year", "citation_html", "url", "venue", "details"):
            if not isinstance(record.get(key), str):
                raise ValueError(f"Publication {i}: {key} must be a string")
        style = record.get("style", "")
        if style not in ("", "highlight", "preprint"):
            raise ValueError(f"Publication {i}: invalid style")
        url = urlsplit(record["url"])
        if url.scheme not in ("https", "http") or not url.netloc:
            raise ValueError(f"Publication {i}: expected a complete http(s) URL")
        e = html.escape
        classes = "publication-item" + (" " + style if style else "")
        details = record['details']
        separator = '' if not details or details[0] in '.,;:' else ' '
        result.append(
            f'<article class="{classes}">\n'
            f'          <span class="year">{e(record["year"])}</span>\n'
            f'          <p>{record["citation_html"]} '
            f'<a href="{e(record["url"], quote=True)}" target="_blank" rel="noopener noreferrer">'
            f'<i>{e(record["venue"])}</i>{separator}{e(details)}</a></p>\n'
            '        </article>'
        )
    return '\n        '.join(result)


def render(profile, content, template):
    data = {"profile": profile, "content": content}
    publication_html = publications(content["publications"])

    def replace(match):
        key, rich = match.groups()
        if key == "publications":
            return publication_html
        value = data
        for part in key.split('.'):
            value = value[part]
        if not isinstance(value, str):
            raise ValueError(f"{key} must be a string")
        # Rich text is deliberately trusted author-owned HTML, not user input.
        return value if rich else html.escape(value, quote=True)

    return TOKEN.sub(replace, template)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check that index.html matches its sources without writing')
    args = parser.parse_args()
    try:
        output = render(load(ROOT / 'profile.json'), load(ROOT / 'content.json'),
                        (ROOT / 'index.template.html').read_text(encoding='utf-8'))
        target = ROOT / 'index.html'
        if args.check:
            if not target.exists() or target.read_text(encoding='utf-8') != output:
                raise ValueError('index.html is out of date; run generate.py')
            print('index.html is up to date.')
        else:
            # Render completely before replacing the output, so invalid JSON leaves it intact.
            temporary = ROOT / 'index.html.tmp'
            temporary.write_text(output, encoding='utf-8')
            temporary.replace(target)
            print(f'Generated {target}')
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f'Cannot generate index.html: {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
