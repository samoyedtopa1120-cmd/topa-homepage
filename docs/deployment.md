# 正式版與預覽版部署

| 分支 | 公開網址 |
| --- | --- |
| main | https://samoyedtopa1120-cmd.github.io/topa-homepage/ |
| staging | https://samoyedtopa1120-cmd.github.io/topa-homepage/staging/ |

推送到任一分支會觸發 `.github/workflows/deploy-pages.yml`。也可以在 GitHub Actions 的「Deploy main and staging to Pages」手動執行 Run workflow。

每次執行會取得兩個分支當時的最新版本，將 main 放在網站根目錄、staging 放在 staging/，測試通過後一起部署。部署使用同一個 concurrency group，進行中的部署不會被中斷。若短時間內多次推送，最後執行的工作會重新取得兩個分支的最新內容。

GitHub Pages 的 Source 設定為 GitHub Actions。github-pages 環境允許 main、staging 分支部署。這兩個分支都需保留工作流程與 `.github/scripts/`。

預覽版只在部署產物中加上「Staging 預覽版」標記、連到正式版的入口、頁面標題前綴及 robots noindex。原始 index.html 不會被修改，正式版不會帶上這些內容。預覽網址是公開的，noindex 只是搜尋引擎索引設定。

僅發布 HTML、CSS、JavaScript、ICO、robots.txt 和 assets/；Git 記錄、工作流程、內容摘錄與編輯文件不會被放入部署產物。新增其他素材目錄時，需一併更新 `.github/scripts/build_pages.py`。

本地執行打包測試：

```sh
python3 -B .github/scripts/test_build_pages.py
```

要讓預覽版成為正式版，將網站改動合併到 main 即可。部署設定本身不會將 staging 的網頁內容合併進 main。
