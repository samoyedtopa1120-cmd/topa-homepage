"""Check that deployment cannot mix the production and preview sites."""
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('build_pages.py')


class BuildPagesTests(unittest.TestCase):
    def test_separate_sites_and_preview_only_metadata(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for branch in ('main', 'staging'):
                source = root / branch
                (source / 'assets').mkdir(parents=True)
                (source / 'assets/avatar.jpg').write_bytes(branch.encode())
                (source / 'index.html').write_text(
                    '<html><head><title>Topa</title></head><body>'
                    f'{branch}<img src="./assets/avatar.jpg"></body></html>'
                )
                (source / 'styles.css').write_text(f'/* {branch} */')
                (source / 'private-notes.md').write_text('not a website asset')
            (root / 'staging/script.js').write_text('// preview interaction')
            result = subprocess.run(
                [sys.executable, str(SCRIPT), str(root / 'main'),
                 str(root / 'staging'), str(root / 'site')],
                capture_output=True, text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            site = root / 'site'
            self.assertEqual((site / 'index.html').read_bytes(), (root / 'main/index.html').read_bytes())
            self.assertEqual((site / 'assets/avatar.jpg').read_bytes(), b'main')
            self.assertEqual((site / 'staging/assets/avatar.jpg').read_bytes(), b'staging')
            self.assertTrue((site / 'staging/script.js').exists())
            self.assertFalse((site / 'script.js').exists())
            self.assertFalse((site / 'private-notes.md').exists())
            preview = (site / 'staging/index.html').read_text()
            self.assertIn('noindex', preview)
            self.assertIn('Staging 預覽版', preview)
            self.assertIn('href="../"', preview)
            self.assertIn('<title>[Staging] Topa</title>', preview)
            self.assertEqual((root / 'staging/index.html').read_text().count('noindex'), 0)

    def test_asset_urls_change_with_content_and_keep_branches_separate(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            original_html = (
                '<html><head><title>Topa</title>'
                '<link rel="stylesheet" href="./styles.css?v=old" />'
                '<script src="./script.js" defer></script>'
                '</head><body>Topa</body></html>'
            )
            for branch in ('main', 'staging'):
                source = root / branch
                (source / 'assets').mkdir(parents=True)
                (source / 'index.html').write_text(original_html)
                (source / 'styles.css').write_text(f'/* {branch} */')
                (source / 'script.js').write_text('// same script')
            def assemble(name):
                subprocess.run(
                    [sys.executable, str(SCRIPT), str(root / 'main'),
                     str(root / 'staging'), str(root / name)], check=True,
                )
                return [(root / name / path).read_text()
                        for path in ('index.html', 'staging/index.html')]
            first = assemble('first')
            pattern = r'href="(\./styles\.css\?v=[a-f0-9]{12})"'
            first_urls = [re.search(pattern, page) for page in first]
            self.assertTrue(all(first_urls), 'Every branch needs a content-versioned CSS URL')
            self.assertNotEqual(first_urls[0][1], first_urls[1][1])
            self.assertRegex(first[0], r'src="\./script\.js\?v=[a-f0-9]{12}"')
            self.assertEqual(assemble('same'), first, 'Unchanged files must keep stable URLs')
            (root / 'main/styles.css').write_text('/* new production style */')
            changed = assemble('changed')
            self.assertNotEqual(re.search(pattern, changed[0])[1], first_urls[0][1])
            self.assertEqual(changed[1], first[1], 'Production changes must not alter preview URLs')
            self.assertEqual((root / 'main/index.html').read_text(), original_html)

    def test_missing_branch_fails_before_creating_output(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            result = subprocess.run(
                [sys.executable, str(SCRIPT), str(root / 'main'),
                 str(root / 'missing'), str(root / 'site')],
                capture_output=True, text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('index.html', result.stderr)
            self.assertFalse((root / 'site').exists())


if __name__ == '__main__':
    unittest.main()
