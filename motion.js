'use strict';

// Decorative motion only: the page reads the same without this file or with reduced motion.
(() => {
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const colors = ['#5aaee6', '#ff8fb1', '#7fcfa8', '#ffc65c', '#9cc8ec'];
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const icon = (shape) => `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${shape}"></use></svg>`;

  // Header gets a soft shadow once the page scrolls.
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  // A burst of hearts, paws and stars from a point.
  function burst(x, y, amount = 12, palette = colors) {
    if (calm || !document.body.animate) return;
    for (let n = 0; n < amount; n++) {
      const bit = document.createElement('span');
      bit.className = 'burst';
      bit.innerHTML = icon(pick(['p-heart', 'icon-paw', 'p-star', 'p-heart']));
      bit.style.left = `${x}px`;
      bit.style.top = `${y}px`;
      bit.style.color = pick(palette);
      document.body.appendChild(bit);
      const angle = Math.random() * Math.PI * 2;
      const distance = 45 + Math.random() * 70;
      const scale = 0.6 + Math.random() * 0.8;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      bit.animate([
        {transform: 'translate(0,0) scale(0)', opacity: 1},
        {transform: `translate(${dx * 0.7}px,${dy * 0.7}px) scale(${scale}) rotate(${Math.random() * 60 - 30}deg)`, opacity: 1, offset: 0.55},
        {transform: `translate(${dx}px,${dy + 30}px) scale(${scale * 0.8}) rotate(${Math.random() * 120 - 60}deg)`, opacity: 0},
      ], {duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)'}).onfinish = () => bit.remove();
    }
  }
  const burstFrom = (element, event, amount, palette) => {
    const box = element.getBoundingClientRect();
    burst(event.clientX || box.left + box.width / 2, event.clientY || box.top + box.height / 2, amount, palette);
  };

  // The ticker scrolls; the copy is for looks only and follows language switches.
  const ticker = document.querySelector('.ticker');
  if (ticker && !calm) {
    const track = document.createElement('div');
    track.className = 'ticker-track';
    track.append(...ticker.childNodes);
    const copy = document.createElement('div');
    copy.className = 'ticker-track';
    copy.setAttribute('aria-hidden', 'true');
    const syncCopy = () => {
      copy.innerHTML = track.innerHTML;
      copy.querySelectorAll('[data-i18n]').forEach((element) => element.removeAttribute('data-i18n'));
    };
    syncCopy();
    ticker.append(track, copy);
    ticker.classList.add('is-marquee');
    document.addEventListener('topa:language', syncCopy);
  }

  // Hero: drifting blobs and little things floating up.
  const hero = document.querySelector('.hero');
  if (hero && !calm) {
    const sky = document.createElement('div');
    sky.className = 'hero-sky';
    sky.setAttribute('aria-hidden', 'true');
    sky.innerHTML = '<span class="hero-blob"></span><span class="hero-blob"></span><span class="hero-blob"></span>';
    const count = window.innerWidth < 700 ? 8 : 16;
    for (let n = 0; n < count; n++) {
      const bit = document.createElement('span');
      const size = 10 + Math.random() * 16;
      bit.className = 'floaty';
      bit.innerHTML = icon(pick(['p-heart', 'icon-paw', 'p-flake', 'p-star']));
      bit.style.cssText = [
        `left:${Math.random() * 100}%`, `width:${size}px`, `height:${size}px`, `color:${pick(colors)}`,
        `animation-duration:${12 + Math.random() * 14}s`, `animation-delay:${-Math.random() * 26}s`,
        `--sway:${Math.random() * 80 - 40}px`, `--spin:${Math.random() * 180 - 90}deg`, `--alpha:${0.3 + Math.random() * 0.3}`,
      ].join(';');
      sky.appendChild(bit);
    }
    hero.prepend(sky);
  }

  // Pet the portrait: it wiggles, says something and sprinkles hearts.
  const portrait = document.querySelector('.portrait');
  const art = document.querySelector('.hero-art');
  if (portrait && art) {
    const bubble = document.createElement('span');
    bubble.className = 'hero-bubble';
    bubble.setAttribute('aria-hidden', 'true');
    art.appendChild(bubble);
    const lines = ['汪！', '汪汪汪！', 'ともとも！', '摸摸頭～', '(っ´ω`c)', '嗷嗚～', 'Woof!'];
    let last = -1;
    let hide;
    const say = (text) => {
      bubble.textContent = text;
      bubble.classList.add('show');
      clearTimeout(hide);
      hide = setTimeout(() => bubble.classList.remove('show'), 1600);
    };
    portrait.addEventListener('click', (event) => {
      let next;
      do { next = Math.floor(Math.random() * lines.length); } while (next === last);
      last = next;
      say(lines[next]);
      portrait.classList.remove('wiggle');
      void portrait.offsetWidth;
      portrait.classList.add('wiggle');
      burstFrom(portrait, event, 14);
    });
    if (!calm) setTimeout(() => say('ともとも！'), 1400);
  }

  // Bursts on the main buttons and link cards; link cards also get a glow that follows the pointer.
  document.querySelectorAll('.hero-actions .button, .gallery-more .button, .video-more .button, .hero-socials a')
    .forEach((element) => element.addEventListener('click', (event) => burstFrom(element, event, 10)));
  document.querySelectorAll('.link-list > a').forEach((link) => {
    const accent = getComputedStyle(link).getPropertyValue('--accent').trim() || '#5aaee6';
    link.addEventListener('click', (event) => burstFrom(link, event, 12, [accent, '#ff8fb1', '#ffc65c', '#5aaee6']));
    if (!fine) return;
    link.addEventListener('pointermove', (event) => {
      const box = link.getBoundingClientRect();
      link.style.setProperty('--mx', `${event.clientX - box.left}px`);
      link.style.setProperty('--my', `${event.clientY - box.top}px`);
    });
  });

  // Content slides up as it scrolls into view, a few items at a time.
  if (calm || !('IntersectionObserver' in window)) return;
  const groups = [
    '.section-head', '.profile-prose > p', '.facts > *', '.lore-grid > article', '.activity-grid > article',
    '.traits-panel > *', '.video-grid > .video-card', '.visual-grid > *', '.timeline > article',
    '.credit-list > *', '.fanart-grid > .fanart-card', '.link-list > a', '.gallery-more', '.video-more',
  ];
  const targets = document.querySelectorAll(groups.join(','));
  const observer = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      .forEach((entry, index) => {
        entry.target.style.setProperty('--d', Math.min(index, 6));
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
  }, {rootMargin: '0px 0px -8% 0px', threshold: 0.08});
  targets.forEach((target) => {
    target.classList.add('reveal');
    observer.observe(target);
  });
  document.documentElement.classList.add('reveal-ready');
})();
