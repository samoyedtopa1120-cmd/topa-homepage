# 多帕個人首頁

Topa Ch. 多帕的靜態個人首頁，收錄公開簡介、活動資訊、作品連結與社群入口。

## 維護者

- [多帕（@samoyedtopa1120-cmd）](https://github.com/samoyedtopa1120-cmd) — 儲存庫擁有者與內容維護者

## 靜態網站

部署網址：

https://samoyedtopa1120-cmd.github.io/topa-homepage/

## 相關連結

- [YouTube](https://www.youtube.com/@Topa1120.channel)
- [Twitch](https://www.twitch.tv/topa_1120)
- [X / Twitter](https://x.com/topa1120)
- [Discord](https://discord.com/invite/Zx7xM9aJVY)
- [綠界贊助](https://payment.ecpay.com.tw/Broadcaster/Donate/85C7382313C1128C863B7826B020375C)
- [歐付寶贊助](https://payment.opay.tw/Broadcaster/Donate/44319C02C2A8F1C43497ADE37872A1DE)
- [嗨幣贊助](https://deerdonate.herokuapp.com/donation/%E5%A4%9A%E5%B8%95)
- [贊助頁 /donate](https://samoyedtopa1120-cmd.github.io/topa-homepage/donate/)：只有上面三個贊助按鈕的單頁，原始檔在 `donate/index.html`

## 檔案說明

- `index.html` - 網站主頁內容與社群分享中繼資料
- `styles.css` - 藍白色響應式頁面樣式
- `script.js` - 手機導覽、影音分類與彈窗播放、相簿放大與二創展開
- `i18n.js` - 英文、日文翻譯與語言切換（中文直接寫在 `index.html`）
- `.github/scripts/fetch_videos.py` - 每日從 YouTube 同步翻唱與原創曲（見 `docs/deployment.md`）
- `docs/content-inventory.md` - 改版前完整文字、連結與素材摘錄
- `docs/original-content.json` - 改版前結構化內容清單
- `docs/redesign-notes.md` - 設計、文案改寫及驗證紀錄
- `assets/` - 網站使用的圖片素材
- `source-profile.json` - 公開資料整理
- `source-notes.md` - 資料來源與整理筆記

## 多語系（中文／English／日本語）

頁首的開關可切換中文、英文、日文，選擇會記在瀏覽器裡，網址加上 `?lang=en` 或 `?lang=ja` 可以直接分享該語言。

- 中文原文直接寫在 `index.html`，需要翻譯的元素帶有 `data-i18n="key"`（圖片替代文字用 `data-i18n-alt`、無障礙標籤用 `data-i18n-aria-label`）。
- 英文、日文寫在 `i18n.js` 的 `TRANSLATIONS`，以同一個 key 對應。
- 新增或修改內容（例如「一起走過的日子」新增一筆）時，記得幫新元素加上 key，並在 `i18n.js` 的 `en`、`ja` 補上翻譯；沒有翻譯的元素會維持中文。
- YouTube 同步的作品卡片保留原標題，不翻譯。

## 開發與預覽

這是純靜態網站，本機預覽不需要建置步驟。直接開啟 `index.html`，或用任何靜態伺服器提供專案根目錄即可預覽。

## 授權條款

本專案採用 MIT 授權條款，詳見[授權條款檔案](./LICENSE)。
