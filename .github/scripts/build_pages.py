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
    """A changed CSS/JS file (styles.css, script.js, i18n.js, motion.js) gets a new URL instead of reusing a cached response."""
    pattern = (
        r"(?P<attribute>(?:href|src)\s*=\s*)(?P<quote>[\"'])"
        r"(?P<path>(?:\./)?(?:styles\.css|script\.js|i18n\.js|motion\.js))"
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


FANART_GRID = 'id="fanart-collection"'
FANART_IMAGES = 'assets/fanart/discord'
FANART_CARD = re.compile(r'[ \t]*<article class="fanart-card">.*?</article>\n?', re.S)
ZOOM_MARK = (
    '<span class="zoom-mark" aria-hidden="true"><svg viewBox="0 0 24 24">'
    '<path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg></span>'
)


def fanart_card(item) -> str:
    """Same markup as the hand-written cards; synced text has no translation keys, so it stays in Chinese."""
    serial = int(item['serial'])
    title = html.escape(item['title'])
    image = f"./{FANART_IMAGES}/{html.escape(item['image'])}"
    credit = f'<span data-i18n="fanart.artist">作者：</span>{html.escape(item["artist"])}'
    if item.get('client'):
        credit += f'<br /><span data-i18n="fanart.client">委託人：</span>{html.escape(item["client"])}'
    note = ''
    if item.get('note'):
        lines = '<br />'.join(html.escape(line) for line in item['note'].splitlines())
        note = f'\n              <p class="fanart-note">{lines}</p>'
    return (
        '          <article class="fanart-card">\n'
        f'            <a class="image-open" href="{image}" aria-label="放大：{title}">'
        f'<img src="{image}" alt="{title}" loading="lazy" />{ZOOM_MARK}</a>\n'
        '            <div>\n'
        f'              <span data-i18n="fanart.no" data-i18n-n="{serial}">作品序號：{serial}</span>\n'
        f'              <h3>{title}</h3>\n'
        f'              <p class="fanart-author">{credit}</p>{note}\n'
        '            </div>\n'
        '          </article>\n'
    )


def render_fanart(document: str, items) -> str:
    """Newest first: every fan-art card, hand-written or from Discord, sorted by 作品序號 from high to low.

    Discord posts whose serial already has a card are skipped, so hand-written text and translations stay.
    """
    start = document.find(FANART_GRID)
    more = document.find('class="gallery-more"', start)
    if start < 0 or more < 0:
        return document
    open_end = document.index('>', start) + 1
    end = document.rfind('</div>', start, more)  # closes the grid
    inner = document[open_end:end]
    cards = FANART_CARD.findall(inner)
    if FANART_CARD.sub('', inner).strip():
        return document  # something other than cards in the grid: leave it alone

    def serial(card):
        found = re.search(r'data-i18n-n="(\d+)"', card)
        return int(found[1]) if found else -1

    existing = {serial(card) for card in cards}
    cards += [fanart_card(item) for item in items if int(item['serial']) not in existing]
    cards = [card if card.endswith('\n') else card + '\n' for card in cards]
    cards.sort(key=serial, reverse=True)
    closing_indent = inner[len(inner.rstrip(' \t')):]
    return document[:open_end] + '\n' + ''.join(cards) + closing_indent + document[end:]


def sync_stamp(document: str, section_id: str, moment) -> str:
    """Note at the bottom right of an auto-updated section saying when the data was last fetched (Taiwan time)."""
    start = document.find(f'<section id="{section_id}"')
    end = document.find('</section>', start)
    if moment is None or start < 0 or end < 0:
        return document
    local = moment.astimezone(TAIWAN)
    stamp = (
        '<p class="sync-stamp"><span data-i18n="sync.label">最後同步</span> '
        f'<time datetime="{local.isoformat(timespec="minutes")}">{local:%Y/%m/%d %H:%M}</time> (UTC+8)</p>'
    )
    return document[:end] + stamp + document[end:]


def build(main: Path, staging: Path, output: Path, songs=(), fanart=(), fanart_images: Path = None,
          synced=None) -> None:
    """synced: {"media": datetime, "fanart": datetime} for the sections whose data was fetched this time."""
    synced = synced or {}
    for source in (main, staging):
        for required in ('index.html', 'styles.css', 'assets'):
            if not (source / required).exists():
                raise ValueError(f'Missing required website file: {source / required}')

    def assemble(source: Path) -> str:
        document = render_fanart(render_videos(
            version_assets((source / 'index.html').read_text(encoding='utf-8'), source), songs,
        ), fanart)
        for section_id, moment in synced.items():
            document = sync_stamp(document, section_id, moment)
        return document

    main_html = assemble(main)
    preview_html = assemble(staging)
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
        # Images downloaded from the Discord fan-art channel.
        if fanart and fanart_images and fanart_images.is_dir():
            shutil.copytree(fanart_images, destination / FANART_IMAGES, dirs_exist_ok=True)
    (output / 'index.html').write_text(main_html, encoding='utf-8')
    (output / 'staging/index.html').write_text(preview_html, encoding='utf-8')
    (output / '.nojekyll').touch()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('main', type=Path)
    parser.add_argument('staging', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--videos', type=Path, help='videos.json from fetch_videos.py (optional)')
    parser.add_argument('--fanart', type=Path, help='fanart.json from fetch_fanart.py (optional)')
    parser.add_argument('--fanart-images', type=Path, help='folder of images downloaded by fetch_fanart.py')
    args = parser.parse_args()
    # A data file exists only when its fetch succeeded; its modification time is the sync time.
    fetched_at = lambda path: datetime.fromtimestamp(path.stat().st_mtime, TAIWAN)
    songs, fanart, synced = [], [], {}
    if args.videos and args.videos.exists():
        songs = json.loads(args.videos.read_text(encoding='utf-8'))
        if songs:
            synced['media'] = fetched_at(args.videos)
    else:
        print('No synced video list: keeping the cards written in index.html.')
    if args.fanart and args.fanart.exists():
        fanart = json.loads(args.fanart.read_text(encoding='utf-8'))
        synced['fanart'] = fetched_at(args.fanart)
        print(f'{len(fanart)} fan-art post(s) from Discord.')
    build(args.main, args.staging, args.output, songs, fanart, args.fanart_images, synced)
