'use strict';

// Content and image links remain usable when JavaScript is unavailable.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
menuButton.hidden = false;
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '開啟導覽選單');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});

const videoGrid = document.querySelector('.video-grid');
const videos = [...videoGrid.querySelectorAll('.video-card')];
document.querySelector('.media-toolbar').hidden = false;
document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((other) => {
      other.setAttribute('aria-pressed', String(other === button));
    });
    videoGrid.classList.toggle('is-filtered', filter !== 'all');
    videos.forEach((video) => {
      const category = video.querySelector('p').textContent.trim() === 'Cover' ? 'cover' : 'original';
      video.hidden = filter !== 'all' && filter !== category;
    });
  });
});

const fanart = [...document.querySelectorAll('.fanart-card')];
const moreButton = document.querySelector('#fanart-toggle');
const galleryStatus = document.querySelector('#gallery-status');
document.querySelector('.gallery-more').hidden = false;
fanart.slice(6).forEach((card) => { card.hidden = true; });
moreButton.addEventListener('click', () => {
  const expanded = moreButton.getAttribute('aria-expanded') !== 'true';
  fanart.slice(6).forEach((card) => { card.hidden = !expanded; });
  moreButton.setAttribute('aria-expanded', String(expanded));
  moreButton.textContent = expanded ? '收起收藏 −' : '看全部 21 件收藏 ＋';
  galleryStatus.textContent = expanded ? '21 件收藏都在這裡，謝謝每一位養樂多。' : '先看看這 6 件，還有 15 件收藏。';
  if (!expanded) document.querySelector('#fanart').scrollIntoView({block: 'start'});
});

const dialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#lightbox-image');
const dialogCaption = document.querySelector('#lightbox-caption');
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('.image-open').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const image = link.querySelector('img');
      const card = link.closest('.fanart-card, .visual-card');
      const author = card.querySelector('.fanart-author');
      dialogImage.src = link.href;
      dialogImage.alt = image.alt;
      dialogCaption.textContent = image.alt + (author ? ' · ' + author.textContent.trim() : ' · 繪製：Rocks 老師');
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialogImage.removeAttribute('src');
  });
}

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach((link) => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin: '-15% 0px -60% 0px'});
  navigation.querySelectorAll('a').forEach((link) => {
    const target = document.querySelector(link.hash);
    if (target) sectionObserver.observe(target);
  });
}
