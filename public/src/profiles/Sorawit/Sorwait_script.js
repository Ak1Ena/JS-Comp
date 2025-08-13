// Tabs filter with transitions
const tabs = document.querySelectorAll('.tab');
const gallery = document.getElementById('gallery');
const tiles = Array.from(gallery.querySelectorAll('.tile'));

function setFilter(type) {
  tabs.forEach(t => {
    const isActive = t.dataset.filter === type;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', String(isActive));
  });
  tiles.forEach(el => {
    const show = type === 'all' || el.dataset.type === type;
    el.dataset.visible = show ? 'true' : 'false';
  });
}

tabs.forEach(tab => tab.addEventListener('click', () => setFilter(tab.dataset.filter)));
setFilter('all');

// Follow button state (kept simple, can extend with localStorage)
const followBtn = document.getElementById('followBtn');
if (followBtn) {
  followBtn.addEventListener('click', () => {
    const on = followBtn.dataset.state === 'on';
    followBtn.dataset.state = on ? 'off' : 'on';
    followBtn.textContent = on ? 'Follow' : 'Following';
    followBtn.classList.toggle('on', !on);
  });
}

// Copy helper
function copyTextBySelector(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const text = el.textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    const chip = document.querySelector('[data-copy="' + sel + '"]');
    if (chip) { chip.textContent = 'Copied!'; setTimeout(() => chip.textContent = 'Copy', 1200); }
  }).catch(() => { });
}
document.querySelectorAll('[data-copy]').forEach(chip => {
  chip.addEventListener('click', () => copyTextBySelector(chip.dataset.copy));
});

document.querySelectorAll('.chip.open').forEach(chip => {
  chip.addEventListener('click', () => {
    const url = chip.dataset.open || '#';
    window.open(url, '_blank', 'noopener');
  });
});

// ===== Lightbox =====
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const btnPrev = lb.querySelector('.lb-prev');
const btnNext = lb.querySelector('.lb-next');
const btnClose = lb.querySelector('.lb-close');
let currentIndexes = []; // indexes of visible tiles
let current = 0;

function computeVisible() {
  currentIndexes = tiles.map((el, idx) => ({ el, idx }))
    .filter(({ el }) => el.dataset.visible !== 'false')
    .map(({ idx }) => idx);
}

function openLightbox(index) {
  computeVisible();
  const idxInVisible = currentIndexes.indexOf(index);
  current = idxInVisible >= 0 ? idxInVisible : 0;
  showCurrent();
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
}
function closeLightbox() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
function showCurrent() {
  const tileIndex = currentIndexes[current];
  const src = tiles[tileIndex].querySelector('img').src;
  const alt = tiles[tileIndex].querySelector('img').alt || '';
  lbImg.src = src; lbImg.alt = alt;
}
function next() { current = (current + 1) % currentIndexes.length; showCurrent(); }
function prev() { current = (current - 1 + currentIndexes.length) % currentIndexes.length; showCurrent(); }

// click listeners on tiles
tiles.forEach((tile, idx) => {
  tile.addEventListener('click', (e) => { e.preventDefault(); openLightbox(idx); });
});

btnClose.addEventListener('click', closeLightbox);
btnNext.addEventListener('click', next);
btnPrev.addEventListener('click', prev);

// keyboard controls
window.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') next();
  else if (e.key === 'ArrowLeft') prev();
});

// close when backdrop clicked
lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

// ===== Back button =====
const backBtn = document.getElementById('backBtn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();                  // ย้อนประวัติถ้ามี
    } else if (document.referrer) {
      window.location.href = document.referrer; // ถ้ามาจากลิงก์อื่นให้กลับไป
    } else {
      window.location.href = '/';               // สำรองกลับหน้าแรกของเว็บ
    }
  });
}
