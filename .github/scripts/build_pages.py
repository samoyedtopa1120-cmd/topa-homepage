"""Assemble main at / and staging at /staging/ for one Pages deployment."""
import argparse
import re
import shutil
from pathlib import Path


def build(main: Path, staging: Path, output: Path) -> None:
    for source in (main, staging):
        for required in ('index.html', 'styles.css', 'assets'):
            if not (source / required).exists():
                raise ValueError(f'Missing required website file: {source / required}')

    preview_html = (staging / 'index.html').read_text(encoding='utf-8')
    if not re.search(r'</head\s*>', preview_html, re.I) or not re.search(r'<body\b[^>]*>', preview_html, re.I):
        raise ValueError('staging/index.html must contain head and body elements')
    preview_html = re.sub(
        r'<meta\b(?=[^>]*\bname=[\"\']robots[\"\'])[^>]*>', '', preview_html, flags=re.I,
    )
    preview_html = re.sub(
        r'</head\s*>', '<meta name="robots" content="noindex, nofollow" />\n</head>',
        preview_html, count=1, flags=re.I,
    )
    preview_html = re.sub(r'<title>', '<title>[Staging] ', preview_html, count=1, flags=re.I)
    # Keep the canonical URL pointing to the production page. Neither source branch is edited.
    badge = (
        '<aside aria-label="Staging 預覽版" style="position:fixed;bottom:16px;right:16px;'
        'z-index:9999;padding:10px 16px;border:1px solid #287bb9;border-radius:24px;'
        'background:#fff;color:#235c85;box-shadow:0 3px 16px #0002;'
        'font:600 13px/1.5 sans-serif">Staging 預覽版 · '
        '<a href="../" style="color:#235c85;text-decoration:underline">前往正式版</a></aside>'
    )
    preview_html = re.sub(r'(<body\b[^>]*>)', lambda m: m[1] + '\n' + badge, preview_html, count=1, flags=re.I)

    output.mkdir(parents=True, exist_ok=False)
    for source, destination in ((main, output), (staging, output / 'staging')):
        destination.mkdir(exist_ok=True)
        # Publish website files only, excluding git history, workflows and editorial notes.
        for file in source.iterdir():
            if file.is_file() and (file.suffix in ('.html', '.css', '.js', '.ico') or file.name == 'robots.txt'):
                shutil.copy2(file, destination / file.name)
        shutil.copytree(source / 'assets', destination / 'assets')
    (output / 'staging/index.html').write_text(preview_html, encoding='utf-8')
    (output / '.nojekyll').touch()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('main', type=Path)
    parser.add_argument('staging', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    build(args.main, args.staging, args.output)
