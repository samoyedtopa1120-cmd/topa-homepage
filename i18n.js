'use strict';

// Page text stays in Chinese inside index.html; this file holds the English and Japanese versions.
// Elements carry data-i18n="key" (inner HTML) or data-i18n-alt / data-i18n-aria-label (attributes).
// The original Chinese is read from the page itself, so only the zh-Hant UI strings live here.
const TRANSLATIONS = {
  "zh-Hant": {
    "meta.title": "Topa Ch. 多帕 | 薩摩耶 VTuber",
    "meta.description": "Topa Ch. 多帕，薩摩耶 VTuber。ともとも！來聽歌、看直播，翻翻多帕與養樂多的相簿。",
    "ui.menuOpen": "開啟導覽選單",
    "ui.menuClose": "關閉導覽選單",
    "ui.videoAll": "看全部 {n} 首",
    "ui.videoLess": "收起作品",
    "ui.watch": "在 YouTube 觀看 ↗",
    "ui.videoThumb": "{title} 影片縮圖",
    "ui.enlarge": "放大：",
    "ui.byRocks": "繪製：Rocks 老師",
    "ui.fanartAll": "看全部 {n} 件收藏",
    "ui.fanartLess": "收起收藏",
    "ui.fanartSome": "先看看這 {shown} 件，還有 {rest} 件收藏。",
    "ui.fanartEvery": "{n} 件收藏都在這裡，謝謝每一位養樂多。"
  },
  "en": {
    "fanart.artist": "Artist: ",
    "fanart.client": "Commissioned by: ",
    "fanart.no": "No. {n}",
    "skip": "Skip to main content",
    "nav.profile": "About Topa",
    "nav.media": "Songs",
    "nav.visuals": "Gallery",
    "nav.fanart": "Fan Art",
    "nav.links": "Links",
    "header.channel": "Visit channel",
    "hero.title": "I'm <span>Topa</span><i>多帕</i>",
    "hero.intro": "A Samoyed who ran all the way from snow country.<br />I sing, play games, and want to play with you too.",
    "hero.listen": "Hear me sing",
    "hero.meet": "Meet this dog",
    "hero.sticker": "Samoyed!<small>Dog, not cat.</small>",
    "hero.scroll": "Scroll down",
    "ticker.yakult": "Yakult: raising one happy Topa",
    "ticker.dog": "A dog is a dog, not a cat",
    "profile.title": "Get to know this dog",
    "profile.p1": "I'm Topa, a Samoyed VTuber. My birthday is November 20, and I'm 155 cm tall, not counting the ears. My weight? Twelve cans of dog food!<br /><br />My ears are pointy and I once covered “バニー” (Bunny), so people often mistake me for a cat or a rabbit. Once more: a dog is a dog, not a cat!",
    "profile.p2": "I usually stream on YouTube and Twitch: games, chatting, singing, vocal practice, and fitness challenges. Sometimes I read law articles aloud to lull you to sleep.<br /><br />Say “ともとも / 多摩多摩” (tomo tomo) when you come in, and wave “パイパイ” (pai pai) when you leave!",
    "facts.name": "Name",
    "facts.nameValue": "Topa",
    "facts.species": "I am a",
    "facts.speciesValue": "Samoyed (a dog!)",
    "facts.birthday": "Birthday",
    "facts.height": "Height",
    "facts.heightValue": "155 cm (ears not included)",
    "facts.fans": "Fan name",
    "facts.fansValue": "Yakult (養樂多)",
    "facts.tag": "Fan art tag",
    "lore.title": "A few stories about me",
    "lore.secrets": "Want to know more? Topa's secret files (Chinese) ↗",
    "lore.topaz": "The topaz",
    "lore.topazText": "I came from snow country. I swallowed a topaz by mistake, choked a little, and turned into a human. Now I can switch freely between human form and dog form.",
    "lore.flower": "Queen of the night",
    "lore.flowerText": "The flower on the bow on my chest is a queen of the night (epiphyllum), the birth flower for November 20.",
    "lore.pipe": "The water pipe",
    "lore.pipeText": "When I first arrived in the human world, I carried a water pipe for self-defense. It got so handy that it even has its own lyric: “Magic pipe, magic pipe, Topa’s drinking straw.”",
    "activities.title": "Come hang out when I'm live",
    "activities.sing": "Singing",
    "activities.singText": "Mostly covers of Japanese songs, plus older Mandarin songs and some originals. Money's tight, so I often grind out the music videos myself. Covers are coming more often lately: about one new release a month.",
    "activities.game": "Gaming together",
    "activities.gameText": "Monster Hunter and MapleStory Artale are regulars. I also love Zelda, maimai, Muse Dash, Rhythm Doctor and Ratatan. There's always a rhythm game in the mix.",
    "activities.fans": "Yakult",
    "activities.fansText": "You are the “Yakults” (養樂多), which reads as “raising one happy Topa”! There are all kinds of flavors and ranks too. You’ll figure them out as you go.",
    "traits.lang": "Languages",
    "traits.langText": "Dog? &gt; Mandarin &gt; Japanese &gt; English &gt; Taiwanese. I passed JLPT N1, and Japanese songs are what I cover most.",
    "traits.likes": "Likes",
    "traits.likesText": "Sleeping, singing, rhythm games and travel. For food: mint chocolate, strawberries, meat and anything pistachio!",
    "traits.no": "No, thanks",
    "traits.noText": "Scared of spiders, bugs and horror. Bitter things, taro, okra and bitter tea: I'll pass.",
    "media.title": "What do you want to hear today?",
    "media.all": "All",
    "media.covers": "Covers",
    "media.originals": "Originals & collabs",
    "media.playlist": "Songs Topa has sung ↗",
    "visuals.title": "Into the album they go",
    "visuals.note": "All key visuals here are by Rocks.",
    "timeline.title": "The days we've shared",
    "credits.title": "The creators who brought Topa to life",
    "credits.logo": "白樺木",
    "credits.illust": "Rocks (@RocksnotRock)",
    "credits.rigger": "毛大福 (@DaifukuMaow)",
    "fanart.title": "Me, drawn by the Yakults",
    "fanart.note": "Every Topa you drew or commissioned is collected here. Thank you, Yakults!<br />If I missed yours, let me know and I'll add it to the album.",
    "links.title": "Where to find Topa",
    "links.discord": "Come chat with the Yakults",
    "links.playlist": "Songs Topa has sung",
    "links.secrets": "Topa's secret files (Chinese)",
    "links.store": "Samoyed House (merch shop)<em class=\"link-pick\">Recommended</em>",
    "links.merch": "MyACG (買動漫)",
    "links.ecpay": "ECPay (綠界)",
    "links.opay": "O'Pay (歐付寶)",
    "links.deer": "Deer Donate (山羌)",
    "footer.bye": "Thanks for coming to play today. パイパイ (bye-bye)!",
    "footer.credit": "Key visuals by Rocks. Fan art artists and commissioners are credited under each piece.",
    "footer.sources": "Image sources: public channels, profiles, official key visuals and fan art. Please confirm usage rights before the official launch.",
    "footer.top": "Back to top ↑",
    "timeline.1": "YouTube debut stream",
    "timeline.1.text": "Officially debuted on YouTube! I'd been streaming on Twitch before that, and now I stream on both.",
    "timeline.2": "Tsukuyomi maid café collab",
    "timeline.2.text": "Held a Tsukuyomi maid café collab with night-market idol Yuyu (魷魷): my first big offline meetup.",
    "timeline.3": "Little Topa debuts",
    "timeline.3.text": "Little Topa appeared on Taiwan's Children's Day! This special model was a gift commissioned by Yakult member 羊羊.",
    "timeline.4": "A month in the US, wrapped up",
    "timeline.4.text": "Spent a month in the US and made it back! Two days later came the first-anniversary stream.",
    "timeline.5": "Original song series: 不說再見",
    "timeline.5.text": "Released an original song series with Hikari, in Mandarin and Japanese versions.",
    "timeline.6": "Baby Topa is born",
    "timeline.6.text": "Built “Baby Topa” together with the Yakults on stream: everyone's very own ChatGPTopa.",
    "timeline.7": "FF46 wrapped up",
    "timeline.7.text": "Wrapped up exhibiting at FF46 (Fancy Frontier)! In the after-talk stream I slid into an apology and opened everyone's gifts.",
    "timeline.8": "Original song “多魚的我們”",
    "timeline.8.text": "Released an original song series with Yuyu, 舞弦 and Hikari, in Mandarin and Japanese versions.",
    "timeline.9": "1st Golden Dog Cup viewer cooking contest",
    "timeline.9.text": "The first Golden Dog Cup kicked off! On stream, I went through the Yakults' dishes one by one.",
    "timeline.11": "Big Adventure: driving solo",
    "timeline.11.text": "One of the Big Adventures the Yakults submitted: hitting the road alone behind the wheel! The drive became a members-only Short.",
    "timeline.12": "Big Adventure: Mt. Shimen",
    "timeline.12.text": "Took on Mt. Shimen (石門山), one of Taiwan's Top 100 Peaks, as a Big Adventure, and made it back down safe! I told everyone all about it on the Big Adventure report stream.",
    "timeline.10": "2nd anniversary + Yakult model reveal",
    "timeline.10.text": "Two years since my YouTube debut! The Yakult model was revealed on the 2nd-anniversary stream, and my new cover “食虫植物” came out the same day.",
    "visual.1": "2024 debut key visual",
    "visual.2": "2025 anniversary key visual",
    "visual.3": "2025 birthday key visual",
    "visual.4": "Key visual for the original song “多魚的我們”",
    "visual.5": "Key visual for “ハッピーラッキーチャッピー”",
    "visual.6": "Key visual for “ハナタバ”",
    "visual.7": "Key visual for “チェリーポップ”",
    "fanart.1": "毛大福 from the Abyss",
    "fanart.1.note": "The very first fan art I got! Guro caught every little detail of me, and I love it. Just one thing: please don’t stuff weird things into weird places.",
    "fanart.2": "Black Samoyed",
    "fanart.2.note": "A rare black Samoyed. Yes, Taiwan is hot, but this is definitely not a tan!",
    "fanart.3": "Topa on the dating scene",
    "fanart.3.note": "Me, made in a game’s character creator, right down to the bare shoulders and little braids. Amazing!",
    "fanart.4": "Sneaky Topa",
    "fanart.4.note": "With a tail this fluffy, nobody can call me a cat now! Also, stop putting dirty things in your mouth.",
    "fanart.5.note": "Cute as it is, my skirt is not food, and you can’t take it either. I’ll say it again.",
    "fanart.6": "Taiko-drumming dog",
    "fanart.6.note": "I was feeling really down at the time, and 毛毛 and 喵大福 secretly prepared this surprise. I was so surprised, and so happy. Thank you both.",
    "fanart.7": "Give me back my yakiniku!",
    "fanart.7.note": "Nobody steals my yakiniku. If you want my meat, you’ll have to trade yourself for it!",
    "fanart.8": "Topa in your palm",
    "fanart.8.note": "Dogs like chin scratches too. Resting in your palm feels so safe.",
    "fanart.9": "Topa's moon leap",
    "fanart.9.note": "A moon dog for the Mid-Autumn Festival! I love how Guro hid 毛毛 in all the little details, plus that tiny name tag. You can see the tail clearly this time, so stop calling me a cat or a rabbit!",
    "fanart.10": "Hehe, you found me",
    "fanart.10.note": "Smiling this brightly... looks like you’ve found the side of me I usually keep hidden.",
    "fanart.11.note": "喵大福’s promo art for my YouTube debut! The “25” on the hands is the debut date. I love it!",
    "fanart.12.note": "迷子焼き, I grew up with your art! Getting this YouTube debut promo art felt like meeting my idol. So happy and so moved. Samoyed peace sign, YA!",
    "fanart.13.note": "fuliharu’s debut promo art, with a promo written in Japanese, too! So thoughtful. As for 毛毛, well, it still got swiped in the end...",
    "fanart.14": "Puzzled Topa",
    "fanart.14.note": "You can tell it’s Edan’s style at a glance! This birthday art from Edan is also exactly the face I make when you say “Topa, you’re a cat!”",
    "fanart.15.note": "Birthday art from Guro. Thank you! 薩摩 YA means the Samoyed is very “yay.” I love the sky-and-flower-field background, and the rare dog-form Samoyed!",
    "fanart.16": "Presents, yay!",
    "fanart.16.note": "Birthday art by 斯特萊, and it’s not twin tails but a rare hairstyle! The little eyes on the buttons are so cute, and the whole thing is round like a tiny doll.",
    "fanart.17": "Peek-a-Samoyed",
    "fanart.17.note": "“Is that strawberry cake for me?” Birthday art by 空汐: a Samoyed peeking out ever so carefully and sneakily.",
    "fanart.18": "Happy strawberry-dessert pup (untitled file)",
    "fanart.18.note": "Birthday art from my “mama,” Rocks! Thank you for drawing me into being so I could meet everyone. 毛毛 sneakily got smacked, so cute. Besides strawberry cake there’s strawberry daifuku, too, and not a moldy one!",
    "fanart.19": "Monster Hound: Iceborne",
    "fanart.19.note": "The Legiana armor set with “鬆軟天國,” way too cute! Underneath are actually the Fatalis dual blades. My favorite artist drawing my favorite game: Topa can die happy.",
    "fanart.20.note": "Chibi Topa is here! Hi, I’m Topa the Samoyed! (wave wave wave)",
    "fanart.21": "Metal badge Samoyed",
    "fanart.21.note": "The bow, the queen of the night, the Samoyed and the crosses all fit on this badge. The printed one looks really nice, too! It’s just that it has since become the vanished metal badge, so my feelings are a little complicated.",
    "a11y.brand": "Topa Ch. 多帕, back to top",
    "a11y.nav": "Main navigation",
    "a11y.socials": "Social links",
    "a11y.portrait": "Topa the Samoyed, with white hair, blue eyes and a queen-of-the-night bow on the chest",
    "a11y.ticker": "Topa's greetings",
    "a11y.facts": "Basic info",
    "a11y.traits": "More about Topa",
    "a11y.filters": "Video categories",
    "a11y.closeImage": "Close image",
    "a11y.closeVideo": "Close video",
    "meta.title": "Topa Ch. 多帕 | Samoyed VTuber",
    "meta.description": "Topa Ch. 多帕, a Samoyed VTuber. ともとも! Listen to the songs, catch the streams, and browse the album of Topa and the Yakults.",
    "ui.menuOpen": "Open navigation menu",
    "ui.menuClose": "Close navigation menu",
    "ui.videoAll": "See all {n} songs",
    "ui.videoLess": "Show fewer",
    "ui.watch": "Watch on YouTube ↗",
    "ui.videoThumb": "{title} video thumbnail",
    "ui.enlarge": "Enlarge: ",
    "ui.byRocks": "Art: Rocks",
    "ui.fanartAll": "See all {n} pieces",
    "ui.fanartLess": "Show fewer",
    "ui.fanartSome": "Here are {shown} to start, with {rest} more in the collection.",
    "ui.fanartEvery": "All {n} pieces are here. Thank you, every Yakult."
  },
  "ja": {
    "fanart.artist": "作者：",
    "fanart.client": "依頼者：",
    "fanart.no": "作品番号：{n}",
    "skip": "メインコンテンツへ移動",
    "nav.profile": "多帕について",
    "nav.media": "歌を聴く",
    "nav.visuals": "アルバム",
    "nav.fanart": "ファンアート",
    "nav.links": "リンク",
    "header.channel": "チャンネルへ",
    "hero.title": "<span>多帕</span>です<i>Topa</i>",
    "hero.intro": "雪国からやってきたサモエド。<br />歌って、ゲームして、きみとも一緒に遊びたい。",
    "hero.listen": "歌を聴きにきて",
    "hero.meet": "この犬について",
    "hero.sticker": "サモエド！<small>Dog, not cat.</small>",
    "hero.scroll": "下へどうぞ",
    "ticker.yakult": "養樂多＝ハッピーな多帕を育てよう",
    "ticker.dog": "犬は犬、猫じゃない",
    "profile.title": "まずはこの犬を知ってね",
    "profile.p1": "多帕です、サモエドのVTuberです。誕生日は11月20日、身長は耳を除いて155cm。体重？缶詰12個分！<br /><br />耳がとがっているうえに「バニー」を歌ってみたこともあって、よく猫やうさぎに間違えられます。もう一度言うね：犬は犬、猫じゃない！",
    "profile.p2": "普段はYouTubeとTwitchで配信中。ゲーム、雑談、歌、歌の練習、運動企画もやってます。たまに法律の条文を読み上げて寝かしつけることも。<br /><br />来たときは「ともとも／多摩多摩」、帰るときは手をふって「パイパイ」！",
    "facts.name": "名前",
    "facts.nameValue": "多帕",
    "facts.species": "種族",
    "facts.speciesValue": "サモエド（犬！）",
    "facts.birthday": "誕生日",
    "facts.height": "身長",
    "facts.heightValue": "155cm（耳を除く）",
    "facts.fans": "ファンネーム",
    "facts.fansValue": "養樂多（ヤクルト）",
    "facts.tag": "ファンアートタグ",
    "lore.title": "わたしのちょっとしたお話",
    "lore.secrets": "もっと知りたい？多帕のひみつ資料（中国語）↗",
    "lore.topaz": "トパーズ",
    "lore.topazText": "雪国からやってきて、トパーズをうっかり食べてのどに詰まらせたら、人間になっちゃった。今は人の姿と犬の姿を自由に切り替えられます。",
    "lore.flower": "月下美人",
    "lore.flowerText": "胸元のリボンの花は月下美人。11月20日の誕生花でもあります。",
    "lore.pipe": "ホース",
    "lore.pipeText": "人間の世界に来たばかりのころ、身を守るためにホースを持っていました。すっかり手になじんで、自分の歌詞まであります：「ふしぎな魔法のホース、多帕のストロー」。",
    "activities.title": "配信のときは遊びにきてね",
    "activities.sing": "歌のこと",
    "activities.singText": "主に日本語の歌を歌ってみたしていて、中国語の懐メロやオリジナル曲もあります。お財布が厳しいので、MVも自分でがんばって作ることが多いです。最近はペースが上がって、だいたい月に1本新作を出しています。",
    "activities.game": "一緒にゲーム",
    "activities.gameText": "モンハンとメイプルストーリー Artale をよく配信しています。ゼルダ、maimai、Muse Dash、Rhythm Doctor、Ratatan も好き。音ゲーは欠かせません。",
    "activities.fans": "養樂多（ヤクルト）",
    "activities.fansText": "みんなは「養樂多（ヤクルト）」：「ハッピーな多帕を育てる」という意味！いろんな味や階層もあるので、だんだん分かってくるはず。",
    "traits.lang": "話せる言葉",
    "traits.langText": "犬語？ &gt; 中国語 &gt; 日本語 &gt; 英語 &gt; 台湾語。日本語はN1合格、歌ってみたも日本語の曲がいちばん多いです。",
    "traits.likes": "好きなもの",
    "traits.likesText": "寝ること、歌うこと、音ゲー、旅行。食べ物ならチョコミント、いちご、お肉、ピスタチオ系ならなんでも！",
    "traits.no": "ちょっと苦手",
    "traits.noText": "クモ、虫、ホラーが苦手。苦いもの、タロイモ、オクラ、苦茶は遠慮しておきます。",
    "media.title": "今日はどの曲を聴く？",
    "media.all": "すべて",
    "media.covers": "歌ってみた",
    "media.originals": "オリジナル・コラボ",
    "media.playlist": "多帕が歌った曲 ↗",
    "visuals.title": "この姿をアルバムに",
    "visuals.note": "ここのメインビジュアルはすべて Rocks 先生によるものです。",
    "timeline.title": "一緒に歩んできた日々",
    "credits.title": "多帕を生んでくれた先生方",
    "credits.logo": "白樺木先生",
    "credits.illust": "Rocks先生（@RocksnotRock）",
    "credits.rigger": "毛大福先生（@DaifukuMaow）",
    "fanart.title": "養樂多が描いてくれたわたし",
    "fanart.note": "みんなが描いてくれた、依頼してくれた多帕は全部ここにあります。ありがとう、養樂多！<br />もし載っていない作品があったら教えてね。アルバムに追加します。",
    "links.title": "多帕に会うなら、ここから",
    "links.discord": "養樂多とおしゃべりしよう",
    "links.playlist": "多帕が歌った曲",
    "links.secrets": "多帕のひみつ資料（中国語）",
    "links.store": "サモエドの家（グッズ購入）<em class=\"link-pick\">おすすめ</em>",
    "links.merch": "買動漫（MyACG）",
    "links.ecpay": "ECPay（綠界）",
    "links.opay": "O'Pay（歐付寶）",
    "links.deer": "Deer Donate（山羌）",
    "footer.bye": "今日も遊びにきてくれてありがとう。パイパイ！",
    "footer.credit": "メインビジュアル：Rocks先生。ファンアートの作者と依頼者は各作品の下に記載しています。",
    "footer.sources": "画像出典：公開チャンネル、プロフィール、公式メインビジュアル、ファンアート。正式公開前に使用許諾をご確認ください。",
    "footer.top": "トップへ戻る ↑",
    "timeline.1": "YouTube 初配信",
    "timeline.1.text": "YouTubeで正式に初配信！それ以前からTwitchで配信していて、今は両方で配信しています。",
    "timeline.2": "月読メイドカフェコラボ",
    "timeline.2.text": "夜市系アイドルの魷魷（Yuyu）と月読メイドカフェコラボを開催。初めての大きなオフ会でした。",
    "timeline.3": "幼帕デビュー",
    "timeline.3.text": "台湾の児童節に幼帕が登場！この特別企画モデルは、養樂多の羊羊さんが依頼してプレゼントしてくれたものです。",
    "timeline.4": "アメリカ1か月滞在が終了",
    "timeline.4.text": "アメリカで1か月過ごして帰ってきました！その2日後は1周年配信。",
    "timeline.5": "オリジナル曲「不說再見」シリーズ",
    "timeline.5.text": "Hikari と作ったオリジナル曲シリーズを公開。中国語版と日本語版があります。",
    "timeline.6": "Baby Topa 誕生",
    "timeline.6.text": "配信で養樂多のみんなと「Baby Topa」を作りました。みんな専用の ChatGPTopa です。",
    "timeline.7": "FF46 出展終了",
    "timeline.7.text": "FF46（開拓動漫祭）への出展が無事終了！後日談配信ではスライディング土下座で謝りつつ、みんなからのプレゼントを開封しました。",
    "timeline.8": "オリジナル曲〈多魚的我們〉",
    "timeline.8.text": "魷魷、舞弦、Hikari と作ったオリジナル曲シリーズを公開。中国語版と日本語版があります。",
    "timeline.9": "第1回 金狗杯 視聴者料理大会",
    "timeline.9.text": "第1回金狗杯が開幕！配信で養樂多のみんなが作った料理をひとつずつ見ていきました。",
    "timeline.11": "大冒険：ひとりでドライブ",
    "timeline.11.text": "養樂多のみんなが投稿してくれた大冒険のひとつ：ひとりで車を運転してお出かけ！その様子はメンバー限定ショートになりました。",
    "timeline.12": "大冒険：石門山",
    "timeline.12.text": "大冒険で台湾百岳の石門山に挑戦し、無事に下山しました！大冒険発表会の配信でみんなに報告しました。",
    "timeline.10": "2周年＋養樂多モデル公開",
    "timeline.10.text": "YouTubeデビュー2周年！2周年配信で養樂多のモデルを公開し、同じ日に新しい歌ってみた〈食虫植物〉も公開しました。",
    "visual.1": "2024年デビュー メインビジュアル",
    "visual.2": "2025年周年 メインビジュアル",
    "visual.3": "2025年誕生日 メインビジュアル",
    "visual.4": "オリジナル曲〈多魚的我們〉メインビジュアル",
    "visual.5": "〈ハッピーラッキーチャッピー〉メインビジュアル",
    "visual.6": "〈ハナタバ〉メインビジュアル",
    "visual.7": "〈チェリーポップ〉メインビジュアル",
    "fanart.1": "深淵から来た毛大福",
    "fanart.1.note": "初めてもらったファンアート！Guroさんが細かいところまでよく見てくれていて、本当にお気に入り。ひとつだけ：変なものを変なところに詰めないでください。",
    "fanart.2": "黒いサモエド",
    "fanart.2.note": "レアな黒いサモエド。台湾は確かに暑いけど、これは絶対日焼けじゃないから！",
    "fanart.3": "恋活多帕",
    "fanart.3.note": "ゲームのキャラメイクで作ってくれたわたし。肩出しや小さな三つ編みまで再現されていて、すごい！",
    "fanart.4": "こそこそ多帕",
    "fanart.4.note": "しっぽがこんなにふわふわなら、もう猫とは言われないよね！あと、汚いものをなんでも口に入れちゃだめ。",
    "fanart.5.note": "かわいいけど、わたしのスカートは食べられないし、取っちゃだめ。もう一回言うよ。",
    "fanart.6": "太鼓をたたく犬",
    "fanart.6.note": "ちょうど落ち込んでいたときに、毛毛と喵大福先生がこっそり用意してくれたサプライズ。本当にびっくりしたし、うれしかった。ありがとう。",
    "fanart.7": "焼肉返して！",
    "fanart.7.note": "わたしの焼肉は誰にも渡さない。わたしのお肉が食べたいなら、自分と交換してね！",
    "fanart.8": "手のひら多帕",
    "fanart.8.note": "犬だってあごをなでられるのが好き。手のひらにもたれると、すごく安心する。",
    "fanart.9": "月に跳ぶ多帕",
    "fanart.9.note": "中秋節には月の犬も！Guroさんが毛毛をあちこちにこっそり隠してくれたところと、小さな名札がお気に入り。今回はしっぽがはっきり見えるから、もう猫やうさぎって言わないで！",
    "fanart.10": "えへへ、見つかっちゃった",
    "fanart.10.note": "こんなに満面の笑み。いつもは隠している一面を、見つけられちゃったみたい。",
    "fanart.11.note": "喵大福先生が描いてくれたYouTube初配信の告知イラスト！手で示している「25」は初配信の日付。大好き！",
    "fanart.12.note": "迷子焼き先生、子どものころから先生の絵を見て育ちました！このYouTube初配信の告知イラストをもらって、推しに会えたような気持ち。うれしくて感動しました。サモ・ピース、YA！",
    "fanart.13.note": "fuliharuさんの初配信告知イラスト。日本語の告知文まで書いてくれて、すごく丁寧！毛毛はというと、結局取られちゃったんだけど……",
    "fanart.14": "きょとん多帕",
    "fanart.14.note": "ひと目でEdanさんの絵柄だって分かる！誕生日にもらったお祝いイラストで、「多帕は猫！」って言われたときのわたしの表情そのものです。",
    "fanart.15.note": "Guroさんからの誕生日イラスト、ありがとう！薩摩YAは「サモエド、やったー」ってこと。空とお花畑みたいな背景と、めったに出ない犬型サモエドがお気に入り！",
    "fanart.16": "プレゼントやったー",
    "fanart.16.note": "斯特萊さんの誕生日イラスト。まさかのツインテールじゃないレアな髪型！ボタンの小さな目がかわいくて、全体がまるくて小さなお人形みたい。",
    "fanart.17": "ひょっこりサモエド",
    "fanart.17.note": "「それ、わたしのいちごケーキ？」空汐さんの誕生日イラスト。そーっと、こそこそ顔を出すサモエド。",
    "fanart.18": "いちごスイーツのハッピー子犬（無題ファイル）",
    "fanart.18.note": "ママのRocks先生の誕生日イラスト！わたしを描いてくれて、みんなと出会わせてくれてありがとうございます。毛毛がこっそり殴られてるのがかわいい。いちごケーキだけじゃなく、いちご大福もある。カビてない大福！",
    "fanart.19": "モンスターハウンド：アイスボーン",
    "fanart.19.note": "レイギエナ装備に「鬆軟天國」、かわいすぎる！下はじつはミラボレアスの双剣。いちばん好きな絵師さんが、いちばん好きなゲームを描いてくれて、多帕はもう思い残すことはありません。",
    "fanart.20.note": "ちびキャラ多帕、登場！やっほー、サモエドの多帕です！（ふりふり）",
    "fanart.21": "メタルバッジサモエド",
    "fanart.21.note": "リボン、月下美人、サモエド、バツ印が全部このバッジに。実物の仕上がりもすごくいい感じ！ただ今は「消えたメタルバッジ」になってしまって、ちょっと複雑な気持ち。",
    "a11y.brand": "Topa Ch. 多帕、トップへ戻る",
    "a11y.nav": "メインナビゲーション",
    "a11y.socials": "SNSリンク",
    "a11y.portrait": "白い髪に青い瞳、胸元に月下美人のリボンをつけたサモエドの多帕",
    "a11y.ticker": "多帕のあいさつ",
    "a11y.facts": "基本プロフィール",
    "a11y.traits": "多帕の補足設定",
    "a11y.filters": "動画の分類",
    "a11y.closeImage": "画像を閉じる",
    "a11y.closeVideo": "動画を閉じる",
    "meta.title": "Topa Ch. 多帕 | サモエド VTuber",
    "meta.description": "Topa Ch. 多帕、サモエドのVTuber。ともとも！歌を聴いて、配信を見て、多帕と養樂多のアルバムをめくってみてね。",
    "ui.menuOpen": "ナビゲーションを開く",
    "ui.menuClose": "ナビゲーションを閉じる",
    "ui.videoAll": "全{n}曲を見る",
    "ui.videoLess": "閉じる",
    "ui.watch": "YouTubeで見る ↗",
    "ui.videoThumb": "{title} の動画サムネイル",
    "ui.enlarge": "拡大：",
    "ui.byRocks": "イラスト：Rocks先生",
    "ui.fanartAll": "全{n}点を見る",
    "ui.fanartLess": "閉じる",
    "ui.fanartSome": "まずは{shown}点、ほかに{rest}点あります。",
    "ui.fanartEvery": "{n}点すべてここにあります。養樂多のみんな、ありがとう。"
  }
};

window.TopaI18n = (() => {
  const languages = ['zh-Hant', 'en', 'ja'];
  const storageKey = 'topa-lang';
  const original = new WeakMap();
  let current = 'zh-Hant';

  function format(text, values) {
    return text.replace(/\{(\w+)\}/g, (match, name) => (name in values ? values[name] : match));
  }
  function t(key, values = {}) {
    const text = TRANSLATIONS[current][key] ?? TRANSLATIONS['zh-Hant'][key] ?? key;
    return format(text, values);
  }
  function remember(element, name, value) {
    if (!original.has(element)) original.set(element, {});
    const saved = original.get(element);
    if (!(name in saved)) saved[name] = value;
    return saved[name];
  }
  function translateText(element) {
    const chinese = remember(element, 'html', element.innerHTML);
    const text = TRANSLATIONS[current][element.dataset.i18n];
    element.innerHTML = current === 'zh-Hant' || text === undefined ? chinese : format(text, {n: element.dataset.i18nN});
  }
  function translateAttribute(element, attribute) {
    const chinese = remember(element, attribute, element.getAttribute(attribute));
    const text = TRANSLATIONS[current][element.getAttribute(`data-i18n-${attribute}`)];
    element.setAttribute(attribute, current === 'zh-Hant' || text === undefined ? chinese : text);
  }

  function apply(language) {
    current = languages.includes(language) ? language : 'zh-Hant';
    document.documentElement.lang = current;
    document.querySelectorAll('[data-i18n]').forEach(translateText);
    ['alt', 'aria-label'].forEach((attribute) => {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => translateAttribute(element, attribute));
    });
    // Enlarge links read as "放大：<image name>" in every language.
    document.querySelectorAll('.image-open').forEach((link) => {
      remember(link, 'aria-label', link.getAttribute('aria-label'));
      link.setAttribute('aria-label', t('ui.enlarge') + link.querySelector('img').alt);
    });
    // Synced video thumbnails are written in Chinese at build time.
    document.querySelectorAll('.video-card img').forEach((image) => {
      const chinese = remember(image, 'alt', image.alt);
      const title = image.closest('.video-card').querySelector('h3').textContent.trim();
      image.alt = current === 'zh-Hant' ? chinese : t('ui.videoThumb', {title});
    });
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]').setAttribute('content', t('meta.description'));
    document.querySelectorAll('[data-lang]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === current));
    });
    document.dispatchEvent(new CustomEvent('topa:language', {detail: current}));
  }

  function choose(language) {
    apply(language);
    try { localStorage.setItem(storageKey, current); } catch (error) { /* private mode */ }
    // Keep ?lang= in the address so a shared link opens in the same language.
    const url = new URL(location.href);
    if (current === 'zh-Hant') url.searchParams.delete('lang');
    else url.searchParams.set('lang', current);
    history.replaceState(null, '', url);
  }

  const buttons = [...document.querySelectorAll('[data-lang]')];
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      // On narrow headers only the current language is visible, so clicking it cycles to the next.
      const collapsed = buttons.every((other) => other === button || other.offsetParent === null);
      if (button.dataset.lang !== current || !collapsed) return choose(button.dataset.lang);
      choose(languages[(languages.indexOf(current) + 1) % languages.length]);
      buttons.find((other) => other.dataset.lang === current).focus();
    });
  });
  document.querySelector('.lang-switch').hidden = false;
  apply(window.topaInitialLanguage || 'zh-Hant');
  document.documentElement.classList.remove('lang-pending');

  return {t, choose, get language() { return current; }};
})();
