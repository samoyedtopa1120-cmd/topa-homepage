"""Check that deployment cannot mix the production and preview sites."""
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
