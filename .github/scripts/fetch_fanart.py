"""Read fan-art posts from a Discord channel with a bot and save the new ones for the website.

A post looks like this (full-width or half-width colons both work, 委託人 and 備註 are optional,
and the note may run over several lines):

    作品序號：21
    作品名：金屬徽章摩耶
    作者：雲糰（柒柒）（ @Bai35461097 ）
    委託人：斯特萊
    備註：超級可愛的徽章！
    印製出來的實物也是非常有質感！

plus one attached image. Parsing is plain pattern matching: posts that don't follow the format are skipped.

Settings come from the environment (GitHub Actions secrets / variables):
  DISCORD_BOT_TOKEN           the bot's token (secret)
  DISCORD_FANART_CHANNEL_ID   the channel to read
  DISCORD_FANART_AUTHOR_IDS   optional, comma-separated user IDs whose posts count (e.g. only Topa's)

Without a token or channel the script does nothing, and the cards written in index.html stay as they are.
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = 'https://discord.com/api/v10'
USER_AGENT = 'DiscordBot (https://github.com, 1.0) topa-homepage-fanart-sync'
IMAGE_HOSTS = {'cdn.discordapp.com', 'media.discordapp.net'}
IMAGE_TYPES = {'png': 'png', 'jpg': 'jpg', 'jpeg': 'jpg', 'gif': 'gif', 'webp': 'webp'}
MAX_IMAGE_BYTES = 25 * 1024 * 1024

FIELDS = {
    '作品序號': 'serial', '序號': 'serial',
    '作品名稱': 'title', '作品名': 'title',
    '作者': 'artist', '繪師': 'artist',
    '委託人': 'client',
    '備註': 'note',
}
FIELD_LINE = re.compile(r'^\s*(' + '|'.join(sorted(FIELDS, key=len, reverse=True)) + r')\s*[：:]\s*(.*)$')
# Discord-only markup that means nothing on the website: custom emoji, mentions, channel links.
DISCORD_MARKUP = re.compile(r'<a?:\w+:\d+>|<@[!&]?\d+>|<#\d+>|<t:\d+(?::\w)?>')


def clean(text: str) -> str:
    text = DISCORD_MARKUP.sub('', text)
    text = re.sub(r'\*\*|__|~~|`', '', text)  # bold, underline, strikethrough, code
    return re.sub(r'[ \t\u3000]+', ' ', text).strip()


def parse_post(content: str):
    """Turn a post's text into {serial, title, artist, client, note}, or None if it isn't a fan-art post."""
    found, current = {}, None
    for line in content.splitlines():
        match = FIELD_LINE.match(line)
        if match:
            current = FIELDS[match[1]]
            if current not in found:
                found[current] = [match[2]]
                continue
            current = None  # a repeated field is ignored rather than merged
        elif current == 'note':
            found['note'].append(line)
    serial = re.search(r'\d+', ''.join(found.get('serial', [])))
    title = clean(' '.join(found.get('title', [])))
    artist = clean(' '.join(found.get('artist', [])))
    if not serial or not title or not artist:
        return None
    note_lines = [clean(line) for line in found.get('note', [])]
    return {
        'serial': int(serial[0]),
        'title': title,
        'artist': artist,
        'client': clean(' '.join(found.get('client', []))),
        'note': '\n'.join(line for line in note_lines if line),
    }


def first_image(message: dict):
    for attachment in message.get('attachments', []):
        name = attachment.get('filename', '')
        extension = IMAGE_TYPES.get(name.rsplit('.', 1)[-1].lower()) if '.' in name else None
        kind = attachment.get('content_type', '')
        if extension and (not kind or kind.startswith('image/')):
            if urllib.parse.urlsplit(attachment.get('url', '')).hostname in IMAGE_HOSTS:
                return attachment, extension
    return None, None


def request(url: str, token: str = '') -> bytes:
    headers = {'User-Agent': USER_AGENT}
    if token:
        headers['Authorization'] = f'Bot {token}'
    for attempt in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as response:
                body = response.read(MAX_IMAGE_BYTES + 1)
                if len(body) > MAX_IMAGE_BYTES:
                    raise ValueError(f'File too large: {url}')
                return body
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 4:
                raise
            # Rate limited: Discord says how long to wait.
            wait = float(json.loads(error.read() or b'{}').get('retry_after', 1))
            time.sleep(min(wait, 30))
    raise RuntimeError('unreachable')


def channel_messages(token: str, channel: str):
    """Every message in the channel, newest first, 100 at a time."""
    before = None
    while True:
        query = {'limit': 100}
        if before:
            query['before'] = before
        page = json.loads(request(f'{API}/channels/{channel}/messages?{urllib.parse.urlencode(query)}', token))
        if not page:
            return
        yield from page
        before = page[-1]['id']


def known_serials(index_html: Path):
    """Serial numbers that already have a card in index.html (those keep their edited, translated text)."""
    document = index_html.read_text(encoding='utf-8')
    start = document.find('id="fanart-collection"')
    end = document.find('class="gallery-more"', start)
    if start < 0 or end < 0:
        return set()
    return {int(n) for n in re.findall(r'data-i18n="fanart\.no" data-i18n-n="(\d+)"', document[start:end])}


def collect(messages, authors=frozenset(), skip=frozenset()):
    """Pick the posts worth a card: right author, right format, an image, and a serial not on the page yet."""
    posts = {}
    for message in messages:
        if authors and message.get('author', {}).get('id') not in authors:
            continue
        post = parse_post(message.get('content', ''))
        attachment, extension = first_image(message)
        if not post or not attachment or post['serial'] in skip:
            continue
        # The same serial posted twice: the newer post (a correction) wins.
        if post['serial'] in posts and int(posts[post['serial']]['message']) > int(message['id']):
            continue
        posts[post['serial']] = {
            **post, 'message': message['id'], 'posted': message.get('timestamp', ''),
            'image_url': attachment['url'], 'extension': extension, 'attachment': attachment['id'],
        }
    return [posts[serial] for serial in sorted(posts)]


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('output', type=Path, help='JSON file to write')
    parser.add_argument('images', type=Path, help='folder for the downloaded images')
    parser.add_argument('--known', type=Path, help='index.html whose existing fan-art cards are kept as they are')
    args = parser.parse_args()

    token = os.environ.get('DISCORD_BOT_TOKEN', '').strip()
    channel = os.environ.get('DISCORD_FANART_CHANNEL_ID', '').strip()
    if not token or not channel:
        print('No Discord bot token or channel set: keeping the fan-art cards written in index.html.')
        return 0
    if not channel.isdigit():
        print('DISCORD_FANART_CHANNEL_ID must be a channel ID (digits only).', file=sys.stderr)
        return 1
    authors = {a.strip() for a in os.environ.get('DISCORD_FANART_AUTHOR_IDS', '').split(',') if a.strip()}
    skip = known_serials(args.known) if args.known else set()

    try:
        posts = collect(channel_messages(token, channel), authors, skip)
    except urllib.error.HTTPError as error:
        hint = {401: 'the bot token is wrong', 403: 'the bot cannot read this channel', 404: 'no such channel'}
        print(f'Discord answered {error.code}: {hint.get(error.code, error.reason)}.', file=sys.stderr)
        return 1

    args.images.mkdir(parents=True, exist_ok=True)
    cards = []
    for post in posts:
        name = f"fanart-{post['serial']:02d}-{post['attachment']}.{post['extension']}"
        (args.images / name).write_bytes(request(post['image_url']))
        cards.append({key: post[key] for key in ('serial', 'title', 'artist', 'client', 'note', 'posted')} | {'image': name})
    args.output.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{len(cards)} new fan-art post(s) from Discord' + (f' (already on the page: {len(skip)})' if skip else '') + '.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
