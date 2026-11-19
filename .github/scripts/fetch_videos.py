"""Fetch Topa's covers and original songs from the channel's Videos tab into a JSON file.

With YOUTUBE_API_KEY set, every video in the Videos tab is read through the YouTube Data API.
Without a key, the public RSS feed is used instead, which only lists the newest 15 videos.
"""
import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

CHANNEL_ID = 'UC2Vvw_S0IZvvrEmYu6Jz6XA'
# "UULF" + channel id is YouTube's own list of the Videos tab: no Shorts, no live streams.
VIDEOS_TAB = 'UULF' + CHANNEL_ID[2:]
UPLOADS = 'UU' + CHANNEL_ID[2:]
API = 'https://www.googleapis.com/youtube/v3/playlistItems'
RSS = 'https://www.youtube.com/feeds/videos.xml?playlist_id='


def classify(title: str):
    """歌ってみた means a cover; Official Music Video (also the "Offical" typo) means an original."""
    if re.search(r'offici?al\s+music\s+video', title, re.I):
        return 'original'
    if '歌ってみた' in title:
        return 'cover'
    return None


def keep_songs(items):
    songs = []
    for item in items:
        category = classify(item['title'])
        if category:
            songs.append({**item, 'category': category})
    songs.sort(key=lambda song: song['published'], reverse=True)
    return songs


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={'User-Agent': 'topa-homepage-video-sync'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def best_thumbnail(thumbnails: dict, video_id: str) -> str:
    for size in ('maxres', 'standard', 'high', 'medium', 'default'):
        if size in thumbnails:
            return thumbnails[size]['url']
    return f'https://i.ytimg.com/vi/{video_id}/hqdefault.jpg'


def from_api(key: str, playlist: str):
    items, token = [], ''
    while True:
        query = {'part': 'snippet', 'playlistId': playlist, 'maxResults': 50, 'key': key}
        if token:
            query['pageToken'] = token
        page = json.loads(get(API + '?' + urllib.parse.urlencode(query)))
        for entry in page.get('items', []):
            snippet = entry['snippet']
            video_id = snippet['resourceId']['videoId']
            if snippet.get('title') in ('Private video', 'Deleted video'):
                continue
            items.append({
                'id': video_id,
                'title': snippet['title'],
                'published': snippet.get('publishedAt', ''),
                'thumbnail': best_thumbnail(snippet.get('thumbnails', {}), video_id),
            })
        token = page.get('nextPageToken')
        if not token:
            return items


def parse_rss(document: bytes):
    ns = {'a': 'http://www.w3.org/2005/Atom', 'yt': 'http://www.youtube.com/xml/schemas/2015',
          'media': 'http://search.yahoo.com/mrss/'}
    items = []
    for entry in ET.fromstring(document).findall('a:entry', ns):
        video_id = entry.findtext('yt:videoId', '', ns)
        thumbnail = entry.find('media:group/media:thumbnail', ns)
        items.append({
            'id': video_id,
            'title': entry.findtext('a:title', '', ns),
            'published': entry.findtext('a:published', '', ns),
            'thumbnail': thumbnail.get('url') if thumbnail is not None
            else f'https://i.ytimg.com/vi/{video_id}/hqdefault.jpg',
        })
    return items


def fetch():
    key = os.environ.get('YOUTUBE_API_KEY', '').strip()
    if not key:
        print('YOUTUBE_API_KEY is not set: reading the RSS feed (newest 15 videos only).')
        return parse_rss(get(RSS + VIDEOS_TAB))
    try:
        return from_api(key, VIDEOS_TAB)
    except urllib.error.HTTPError as error:
        if error.code != 404:
            raise
        # Should YouTube stop serving the Videos-tab list, every upload (Shorts included) is used.
        print('Videos-tab list unavailable through the API; using the full uploads list.')
        return from_api(key, UPLOADS)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    try:
        songs = keep_songs(fetch())
    except (urllib.error.URLError, ET.ParseError, KeyError, ValueError) as error:
        # The API key never appears in the message: HTTPError reports the status, not the URL.
        sys.exit(f'Could not fetch videos: {error}')
    if not songs:
        sys.exit('No covers or original songs found; keeping the cards already in index.html.')
    args.output.write_text(json.dumps(songs, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    covers = sum(song['category'] == 'cover' for song in songs)
    print(f'Saved {len(songs)} songs ({covers} covers, {len(songs) - covers} originals).')
