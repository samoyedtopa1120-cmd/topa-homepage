"""Discord fan-art posts are read with fixed rules (no guessing) and become the same cards as index.html."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
from datetime import datetime, timezone  # noqa: E402
from build_pages import render_fanart, sync_stamp  # noqa: E402
from fetch_fanart import collect, known_serials, parse_post  # noqa: E402

POST = """作品序號：21
作品名：金屬徽章摩耶
作者：雲糰<:cloud:1234567890>（柒柒）（ @Bai35461097 ）
委託人：斯特萊
備註：超級可愛的徽章！
很好地把多帕的元素（蝴蝶結、曇花、薩摩耶、叉叉等）融入！
印製出來的實物也是非常有質感！
但現在成為消失的金屬徽章，心情複雜。"""

IMAGE = {'id': '999', 'filename': 'badge.PNG', 'content_type': 'image/png',
         'url': 'https://cdn.discordapp.com/attachments/1/999/badge.PNG?ex=abc'}

GRID = '''<div class="fanart-grid" id="fanart-collection">
          <article class="fanart-card">
            <div>
              <span data-i18n="fanart.no" data-i18n-n="21">作品序號：21</span>
            </div>
          </article>
        </div>
      <div class="gallery-more" hidden></div>'''


def message(id_, content=POST, author='topa', attachments=(IMAGE,)):
    return {'id': id_, 'content': content, 'author': {'id': author},
            'attachments': list(attachments), 'timestamp': '2025-08-24T15:14:00+00:00'}


class FanartSyncTests(unittest.TestCase):
    def test_post_fields(self):
        post = parse_post(POST)
        self.assertEqual(post['serial'], 21)
        self.assertEqual(post['title'], '金屬徽章摩耶')
        self.assertEqual(post['artist'], '雲糰（柒柒）（ @Bai35461097 ）')  # custom emoji removed
        self.assertEqual(post['client'], '斯特萊')
        self.assertEqual(post['note'].splitlines(), [
            '超級可愛的徽章！', '很好地把多帕的元素（蝴蝶結、曇花、薩摩耶、叉叉等）融入！',
            '印製出來的實物也是非常有質感！', '但現在成為消失的金屬徽章，心情複雜。'])

    def test_variants_and_rejects(self):
        post = parse_post('作品序號: #22\n作品名稱：**雪地多帕**\n作者: 某人')
        self.assertEqual((post['serial'], post['title'], post['artist'], post['client'], post['note']),
                         (22, '雪地多帕', '某人', '', ''))
        self.assertIsNone(parse_post('大家晚安～今天也辛苦了'))
        self.assertIsNone(parse_post('作品序號：23\n作品名：沒有作者'))

    def test_collect_filters(self):
        posts = collect([
            message('10', POST.replace('21', '22')),
            message('11', POST.replace('21', '23'), author='viewer'),            # not Topa
            message('12', POST.replace('21', '24'), attachments=()),             # no image
            message('13', POST),                                                 # already on the page
            message('14', POST.replace('金屬徽章摩耶', '更正版').replace('21', '22')),  # newer correction
            message('15', '今天的雜談'),                                          # not a fan-art post
        ], authors={'topa'}, skip={21})
        self.assertEqual([(p['serial'], p['title'], p['extension']) for p in posts], [(22, '更正版', 'png')])
        bad_host = dict(IMAGE, url='https://example.com/badge.png')
        self.assertEqual(collect([message('16', POST, attachments=(bad_host,))]), [])

    def test_cards_join_the_grid(self):
        items = [
            {'serial': 21, 'title': '重複', 'artist': 'x', 'client': '', 'note': '', 'image': 'a.png'},
            {'serial': 23, 'title': '<b>貓</b>', 'artist': 'A & B', 'client': '', 'note': '一行\n兩行', 'image': 'c.gif'},
            {'serial': 22, 'title': '雪地多帕', 'artist': '某人', 'client': '委託者', 'note': '', 'image': 'b.png'},
        ]
        page = render_fanart(GRID, items)
        self.assertEqual(page.count('class="fanart-card"'), 3)                 # 21 is not duplicated
        self.assertLess(page.index('data-i18n-n="22"'), page.index('data-i18n-n="23"'))
        self.assertLess(page.index('data-i18n-n="23"'), page.index('<div class="gallery-more"'))
        self.assertIn('href="./assets/fanart/discord/b.png"', page)
        self.assertIn('<span data-i18n="fanart.client">委託人：</span>委託者', page)
        self.assertIn('&lt;b&gt;貓&lt;/b&gt;', page)
        self.assertIn('A &amp; B', page)
        self.assertIn('<p class="fanart-note">一行<br />兩行</p>', page)
        self.assertEqual(render_fanart(GRID, []), GRID)

    def test_known_serials_and_missing_settings(self):
        with tempfile.TemporaryDirectory() as temp:
            index = Path(temp) / 'index.html'
            index.write_text(GRID, encoding='utf-8')
            self.assertEqual(known_serials(index), {21})
            result = subprocess.run(
                [sys.executable, str(HERE / 'fetch_fanart.py'), str(Path(temp) / 'f.json'), str(Path(temp) / 'img')],
                capture_output=True, text=True, env={'PATH': '/usr/bin:/bin'},
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertFalse((Path(temp) / 'f.json').exists())


    def test_sync_stamp(self):
        page = '<section id="media"><div></div></section><section id="fanart"><p>x</p></section>'
        moment = datetime(2026, 11, 27, 22, 0, tzinfo=timezone.utc)  # 06:00 the next day in Taiwan
        stamped = sync_stamp(page, 'fanart', moment)
        self.assertIn('<p>x</p><p class="sync-stamp"><span data-i18n="sync.label">最後同步</span> '
                      '<time datetime="2026-11-28T06:00+08:00">2026/11/28 06:00</time> (UTC+8)</p></section>', stamped)
        self.assertNotIn('sync-stamp', stamped[:stamped.index('<section id="fanart"')])
        self.assertEqual(sync_stamp(page, 'fanart', None), page)
        self.assertEqual(sync_stamp(page, 'missing', moment), page)

if __name__ == '__main__':
    unittest.main()
