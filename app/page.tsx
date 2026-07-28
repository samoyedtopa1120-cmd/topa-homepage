const videos = [
  ["rabbit-hole.jpg", "ラビットホール", "DECO*27 / Cover", "0lAFji6ZHgo"],
  ["zankyosanka.jpg", "残響散歌", "Aimer / Cover", "-tlTog9WBcI"],
  ["fuyu.jpg", "冬天．我們不說再見", "Original song", "ZlMq4FrpyO8"],
  ["makeinu-doumei.jpg", "負け犬同盟", "Topa × Yuyu", "ipCfbsUQV84"],
  ["happy-lucky-chappy.jpg", "ハッピーラッキーチャッピー", "ano / Cover", "JhQOE7O64cQ"],
];

const visuals = [
  ["2024-debut-visual.webp", "2024 出道主視覺"],
  ["2025-anniversary-visual.webp", "2025 周年主視覺"],
  ["2025-birthday-visual.webp", "2025 生日主視覺"],
  ["original-song-duoyu-visual.webp", "原創曲〈多魚的我們〉"],
  ["happy-lucky-chappy-visual.webp", "ハッピーラッキーチャッピー"],
  ["hanataba-visual.webp", "ハナタバ"],
  ["cherry-pop-visual.webp", "チェリーポップ"],
];

const fanart = [
  ["01.jpg", "毛大福來自深淵", "Guro@暗月の剣"], ["02.jpg", "黑色薩摩耶", "Finis"],
  ["03.jpg", "戀活多帕", "神秘包子"], ["04.jpg", "狗狗祟祟的多帕", "にゃ大福"],
  ["05.png", "脫帕", "Guro@暗月の剣"], ["06.gif", "打太鼓的狗", "にゃ大福"],
  ["07.png", "快把燒肉還給我！", "小黑多帕一生推"], ["08.png", "掌中多帕", "小黑多帕一生推"],
  ["09.png", "多帕跳月", "Guro@暗月の剣"], ["10.png", "嘻嘻，被你發現了", "小黑多帕一生推"],
  ["11.png", "25", "にゃ大福"], ["12.png", "薩摩YA！", "迷子焼き"],
  ["13.png", "topaです！", "FULI"], ["14.gif", "多帕問號", "Edan_艾登"],
  ["15.jpg", "薩摩YA 2", "Guro@暗月の剣"], ["16.png", "禮物耶耶", "斯呱斯特萊"],
  ["17.png", "探頭耶", "_そら"], ["18.png", "草莓甜點快樂小狗", "Rocks"],
  ["19.png", "魔物獵犬：冰原", "迷子焼き"], ["20.png", "say 狗bye~", "雲糰（柒柒）"],
  ["21.png", "金屬徽章摩耶", "雲糰（柒柒）"],
];

const socials = [
  ["YouTube", "Topa Ch. 多帕", "https://www.youtube.com/@Topa1120.channel"],
  ["Twitch", "topa_1120", "https://www.twitch.tv/topa_1120"],
  ["X / Twitter", "@topa1120", "https://x.com/topa1120"],
  ["Discord", "加入養樂多們", "https://discord.com/invite/Zx7xM9aJVY"],
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <a className="wordmark" href="#top"><i /> TOPA <span>多帕</span></a>
        <div className="navlinks"><a href="#about">關於</a><a href="#music">作品</a><a href="#gallery">相簿</a><a href="#fanart">二創</a></div>
        <a className="nav-cta" href="https://www.youtube.com/@Topa1120.channel" target="_blank">一起玩 ↗</a>
      </nav>

      <section className="hero" id="top">
        <div className="snow snow-one" /><div className="snow snow-two" />
        <div className="hero-copy">
          <p className="kicker">SAMOYED VTUBER · VIRTUAL SINGER</p>
          <h1><span>多帕</span><br />TOPA</h1>
          <p className="hero-lead">來自雪國的白色薩摩耶。<br />誤食托帕石後，變成人型。</p>
          <div className="hero-actions">
            <a className="button primary" href="https://www.youtube.com/@Topa1120.channel" target="_blank">前往 YouTube <b>↗</b></a>
            <a className="button secondary" href="#about">認識多帕 <b>↓</b></a>
          </div>
        </div>
        <div className="hero-art">
          <div className="sun" /><img src="/assets/topa-avatar.jpg" alt="多帕 Topa" />
          <p className="scribble">DOG, NOT CAT!</p>
          <div className="birth"><span>Birthday</span><strong>11.20</strong></div>
        </div>
        <div className="marquee"><span>ともとも ✦ 狗即狗，不是貓 ✦ 養樂多，養一隻快樂的多帕 ✦ パイパイ ✦ </span></div>
      </section>

      <section className="about section" id="about">
        <div className="section-title"><p>01 · PROFILE</p><h2>雪國來的<br /><em>笨狗系偶像</em></h2></div>
        <div className="about-copy">
          <p className="big-copy">尖尖的耳朵、蓬鬆的尾巴，偶爾被認成貓或兔子。但本犬鄭重聲明——<strong>狗即狗，不是貓。</strong></p>
          <p>平常在 YouTube 與 Twitch 開台，唱歌、打遊戲、雜談，偶爾還會用法條哄睡。開場記得說「ともとも」，離開時要說「パイパイ」。</p>
          <dl className="facts">
            <div><dt>SPECIES</dt><dd>薩摩耶（狗！）</dd></div><div><dt>HEIGHT</dt><dd>155 cm <small>不含耳朵</small></dd></div>
            <div><dt>FAN NAME</dt><dd>養樂多</dd></div><div><dt>FANART</dt><dd>#小笨狗看這裡</dd></div>
          </dl>
        </div>
      </section>

      <section className="lore">
        <div className="lore-card"><span>01</span><b>TOPAZ</b><h3>托帕石</h3><p>在雪國噎到誤食後變成人型，從此可以在人型與狗型之間自由切換。</p></div>
        <div className="lore-card flower"><span>02</span><b>FLOWER</b><h3>曇花</h3><p>11/20 的生日花，也是胸前蝴蝶結上那朵悄悄盛開的花。</p></div>
        <div className="lore-card pipe"><span>03</span><b>MAGIC PIPE</b><h3>水管</h3><p>原本是來人類世界的防身武器，後來成為趁手道具，兼任吸管。</p></div>
      </section>

      <section className="music section" id="music">
        <div className="music-head"><div className="section-title light"><p>02 · LISTEN</p><h2>唱給你聽，<br /><em>也唱給雪聽</em></h2></div><p>日文翻唱、原創曲與合作作品。<br />戴上耳機，按下播放。</p></div>
        <div className="video-list">{videos.map((v, i) => <a className="video-row" key={v[1]} href={`https://www.youtube.com/watch?v=${v[3]}`} target="_blank"><span>0{i+1}</span><img src={`/assets/${v[0]}`} alt="" /><div><small>{v[2]}</small><h3>{v[1]}</h3></div><b>PLAY ↗</b></a>)}</div>
      </section>

      <section className="gallery section" id="gallery">
        <div className="section-title"><p>03 · OFFICIAL VISUALS</p><h2>每一次登場，<br /><em>都是新模樣</em></h2><small>All official visuals illustrated by Rocks.</small></div>
        <div className="visual-grid">{visuals.map((v, i) => <figure className={`visual v${i+1}`} key={v[0]}><img src={`/assets/key-visuals/${v[0]}`} alt={v[1]} loading="lazy"/><figcaption><span>0{i+1}</span>{v[1]}</figcaption></figure>)}</div>
      </section>

      <section className="milestones section">
        <div className="section-title light"><p>04 · MILESTONES</p><h2>腳印留在<br /><em>每一場相遇</em></h2></div>
        <div className="timeline">{[["2024.10.25","YouTube 初配信"],["2025.03.15","月讀女僕咖啡廳連動"],["2025.04.04","幼帕出道"],["2026.01.01","原創曲不說再見系列"],["2026.03.22","原創曲〈多魚的我們〉"]].map((x,i)=><div key={x[0]}><span>0{i+1}</span><time>{x[0]}</time><h3>{x[1]}</h3></div>)}</div>
      </section>

      <section className="fan-section section" id="fanart">
        <div className="fan-head"><div className="section-title"><p>05 · FANART</p><h2>養樂多的<br /><em>珍貴收藏</em></h2></div><p>謝謝每一位用創作留下多帕模樣的養樂多。<br /><b>#小笨狗看這裡</b></p></div>
        <div className="fan-grid">{fanart.map((f,i)=><figure key={f[0]}><img src={`/assets/fanart/fanart-${f[0]}`} alt={f[1]} loading="lazy"/><figcaption><span>NO.{String(i+1).padStart(2,"0")}</span><b>{f[1]}</b><small>by {f[2]}</small></figcaption></figure>)}</div>
      </section>

      <section className="connect section">
        <p className="kicker">FOLLOW THE PAW PRINTS</p><h2>來找多帕玩！</h2>
        <div className="socials">{socials.map(s=><a href={s[2]} target="_blank" key={s[0]}><span>{s[0]}</span><b>{s[1]}</b><i>↗</i></a>)}</div>
        <a className="mail" href="mailto:samoyed.topa1120@gmail.com">WORK / COLLABORATION — samoyed.topa1120@gmail.com ↗</a>
      </section>

      <footer><a className="wordmark" href="#top"><i /> TOPA <span>多帕</span></a><p>Dog, not cat. · © Topa Ch.</p><a href="#top">BACK TO TOP ↑</a></footer>
    </main>
  );
}
