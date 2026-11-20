"""Assemble main at / and staging at /staging/ for one Pages deployment."""
import argparse
import hashlib
import html
import json
import re
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path

TAIWAN = timezone(timedelta(hours=8))
PAGES = ('donate',)


def version_assets(document: str, source: Path) -> str:
    """A changed CSS/JS file (styles.css, script.js, i18n.js) gets a new URL instead of reusing a cached response."""
    pattern = (
        r"(?P<attribute>(?:href|src)\s*=\s*)(?P<quote>[\"'])"
        r"(?P<path>(?:\./)?(?:styles\.css|script\.js|i18n\.js))"
        r"(?:\?[^\"']*)?(?P=quote)"
    )
    def replace(match):
        asset = source / match['path']
        version = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
        quote = match['quote']
        return f"{match['attribute']}{quote}{match['path']}?v={version}{quote}"
    return re.sub(pattern, replace, document)


VIDEO_BLOCK = re.compile(r'(<!-- videos:start -->)(.*?)(<!-- videos:end -->)', re.S)
LABELS = {'cover': 'Cover', 'original': 'Official Music Video'}
DEFAULT_CREDITS = {'cover': 'covered by 多帕 Topa', 'original': '多帕 Topa'}


def split_title(title: str, category: str):
    """「【歌ってみた】曲名 / 原唱｜covered by 多帕 Topa #tag」→ (曲名 / 原唱, covered by 多帕 Topa)"""
    text = re.sub(r'【[^】]*】', ' ', title)
    text = re.sub(r'(\s+#\S+)+\s*$', '', text).strip()
    if '｜' in text or '|' in text:
        song, credit = re.split(r'\s*[｜|]\s*', text, maxsplit=1)
    else:
        match = re.match(r'(.*?)\s*/?\s*(covered by .+)$', text, re.I)
        song, credit = match.groups() if match else (text, '')
    return song.strip() or title, re.sub(r'\s+', ' ', credit).strip() or DEFAULT_CREDITS[category]


def published_date(published: str):
    """YouTube gives UTC; the card shows the Taiwan date, e.g. ('2026-10-25', '2026.10.25')."""
    try:
        moment = datetime.fromisoformat(published.replace('Z', '+00:00'))
    except ValueError:
        return None
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    local = moment.astimezone(TAIWAN)
    return local.strftime('%Y-%m-%d'), local.strftime('%Y.%m.%d')


def video_cards(songs) -> str:
    cards = []
    for index, song in enumerate(songs):
        name, credit = split_title(song['title'], song['category'])
        label = LABELS[song['category']]
        video_id = html.escape(song['id'])
        kind = 'cover 影片縮圖' if song['category'] == 'cover' else 'official music video 縮圖'
        featured = ' featured' if index == 0 else ''
        lazy = '' if index == 0 else ' loading="lazy"'
        released = published_date(song.get('published', ''))
        if released:
            label += f' · <time datetime="{released[0]}">{released[1]}</time>'
        cards.append(
            f'<a class="video-card{featured}" href="https://www.youtube.com/watch?v={video_id}" '
            f'data-video-id="{video_id}" data-category="{song["category"]}" '
            'target="_blank" rel="noopener noreferrer">'
            f'<img src="{html.escape(song["thumbnail"])}" alt="{html.escape(name + " " + kind)}"{lazy} />'
            f'<div><p>{label}</p><h3>{html.escape(name)}</h3><span>{html.escape(credit)}</span></div></a>'
        )
    return '\n'.join(cards)


def render_videos(document: str, songs) -> str:
    """Replace the hand-written cards with the synced list; pages without the markers are unchanged."""
    if not songs:
        return document
    cards = video_cards(songs)
    return VIDEO_BLOCK.sub(lambda m: f'{m[1]}\n{cards}\n{m[3]}', document, count=1)


def build(main: Path, staging: Path, output: Path, songs=()) -> None:
    for source in (main, staging):
        for required in ('index.html', 'styles.css', 'assets'):
            if not (source / required).exists():
                raise ValueError(f'Missing required website file: {source / required}')

    main_html = render_videos(version_assets((main / 'index.html').read_text(encoding='utf-8'), main), songs)
    preview_html = render_videos(
        version_assets((staging / 'index.html').read_text(encoding='utf-8'), staging), songs,
    )
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
        # Extra standalone pages, each served from its own folder (e.g. /donate/).
        for page in PAGES:
            if (source / page / 'index.html').is_file():
                shutil.copytree(source / page, destination / page)
    (output / 'index.html').write_text(main_html, encoding='utf-8')
    (output / 'staging/index.html').write_text(preview_html, encoding='utf-8')
    (output / '.nojekyll').touch()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('main', type=Path)
    parser.add_argument('staging', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--videos', type=Path, help='videos.json from fetch_videos.py (optional)')
    args = parser.parse_args()
    songs = []
    if args.videos and args.videos.exists():
        songs = json.loads(args.videos.read_text(encoding='utf-8'))
    else:
        print('No synced video list: keeping the cards written in index.html.')
    build(args.main, args.staging, args.output, songs)
