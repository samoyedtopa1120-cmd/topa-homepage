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

## 避免改版時混用舊快取

打包程式會為 styles.css 和 script.js 加上各自內容的 SHA-256 前 12 碼，例如 styles.css?v=c8faafeb53ed。檔案內容改變，瀏覽器便會請求新 URL；兩個分支分別計算。這只改變部署產物中的引用，不改動版面或資源內容。

如果 Pages Source 還是「Deploy from a branch」，合併 main 時會同時觸發舊的 pages-build-deployment 和雙版本 Actions。後完成的舊部署會覆蓋完整網站，造成 /staging/ 消失。倉庫擁有者必須將 Source 改成 GitHub Actions；重新執行雙版本 Actions 只能暫時恢復預覽站，不能取代這項設定。

## YouTube 翻唱與原創曲每日同步

部署時會由 `.github/scripts/fetch_videos.py` 讀取頻道「影片」分頁（YouTube 的 `UULF…` 清單，不含 Shorts 和直播），挑出作品後交給打包程式，替換 index.html 中 `<!-- videos:start -->` 與 `<!-- videos:end -->` 之間的卡片：

- 標題含「歌ってみた」→ 翻唱（Cover）
- 標題含「Official Music Video」（也接受 Offical 拼法）→ 原創・合作

除了推送觸發，工作流程每天台灣時間 06:00 會自動執行一次。排程只會從預設分支 main 的工作流程觸發，所以這些改動合併到 main 後才會開始每天同步。

API 金鑰存放在倉庫的 Settings → Secrets and variables → Actions，名稱為 `YOUTUBE_API_KEY`。金鑰只需要開放 YouTube Data API v3，每天約使用 1 點配額（上限 10,000）。沒有設定金鑰時會改讀公開 RSS，只能取得最新 15 部影片。若 YouTube 暫時無法連線，部署仍會繼續，頁面沿用 index.html 裡手寫的卡片。

在頁面上點卡片會用 youtube-nocookie.com 的 iframe 在彈出視窗內播放；按住 Ctrl／⌘ 點擊仍會開新分頁到 YouTube。

## Discord 二創頻道每日同步

部署時 `.github/scripts/fetch_fanart.py` 會用 Discord bot 讀取二創頻道的訊息，以固定規則（不經 LLM）解析下面這種格式：

```text
作品序號：22
作品名：作品名稱
作者：作者名稱（ @帳號 ）
委託人：委託人名稱        ← 可省略
備註：第一行              ← 可省略，可以換很多行
第二行
```

- 冒號用全形「：」或半形「:」都可以；「作品名稱」「繪師」也會被認得。
- 一定要有作品序號、作品名、作者，並附上一張圖片（png、jpg、gif、webp），否則該訊息會被略過。
- 網頁上**已經有的作品序號不會被覆蓋**：手寫卡片的潤飾文字與英日文翻譯都會保留。只有新的序號會自動加到「養樂多創作」最後面，文字照 Discord 原文顯示（中文），之後想翻譯，可把卡片抄進 index.html 並在 `i18n.js` 補上翻譯。
- 同一個序號發了兩次，以較新的那則為準（方便更正）。
- Discord 的圖片網址大約一天就會失效，所以圖片會在部署時下載，放在網站的 `assets/fanart/discord/`。
- Discord 暫時無法連線或設定有誤時，部署仍會繼續，頁面只顯示 index.html 裡的卡片。

### 設定

1. 在 [Discord Developer Portal](https://discord.com/developers/applications) 建立應用程式，到 **Bot** 頁面：
   - 按 **Reset Token** 取得 token（只會顯示一次）。
   - 打開 **Message Content Intent**（沒有它，bot 讀到的訊息內容會是空的）。
   - 關閉 **Public Bot**，只有你自己能邀請它。
2. 到 **OAuth2 → URL Generator**，Scopes 勾 `bot`，Bot Permissions 只勾 **View Channels** 與 **Read Message History**，用產生的網址把 bot 邀進伺服器（需要伺服器管理權限）。私人頻道還要在頻道權限裡加上這個 bot。
3. 在 Discord 的「設定 → 進階」開啟開發者模式，對二創頻道按右鍵「複製頻道 ID」，對多帕按右鍵「複製使用者 ID」。
4. 在終端機執行 `.github/scripts/setup-discord.sh`（需要已登入的 GitHub CLI），依提示貼上 token 與 ID，程式會先向 Discord 確認 token 有效再存進 GitHub；token 輸入時不顯示、不留在歷史紀錄。也可以手動到 GitHub 倉庫的 **Settings → Secrets and variables → Actions**：
   - **Secrets** 新增 `DISCORD_BOT_TOKEN`（bot token）。
   - **Variables** 新增 `DISCORD_FANART_CHANNEL_ID`（頻道 ID）與 `DISCORD_FANART_AUTHOR_IDS`（多帕的使用者 ID，只採用多帕發的訊息；有多位可用逗號分隔）。
5. 到 **Actions → Deploy main and staging to Pages → Run workflow** 手動跑一次，在「Fetch new fan art from the Discord channel」步驟的紀錄確認讀到幾則新作品。
