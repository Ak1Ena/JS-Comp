// ================= Tabs filter with transitions =================
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

// ================= Follow button (simple) =================
const followBtn = document.getElementById('followBtn');
if (followBtn) {
  followBtn.addEventListener('click', () => {
    const on = followBtn.dataset.state === 'on';
    followBtn.dataset.state = on ? 'off' : 'on';
    followBtn.textContent = on ? 'Follow' : 'Following';
    followBtn.classList.toggle('on', !on);
  });
}

// ================= Copy helper =================
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

// ================= Lightbox =================
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
  const img = tiles[tileIndex].querySelector('img');
  lbImg.src = img.src; lbImg.alt = img.alt || '';
}
function next() { current = (current + 1) % currentIndexes.length; showCurrent(); }
function prev() { current = (current - 1 + currentIndexes.length) % currentIndexes.length; showCurrent(); }

tiles.forEach((tile, idx) => tile.addEventListener('click', (e) => { e.preventDefault(); openLightbox(idx); }));
btnClose.addEventListener('click', closeLightbox);
btnNext.addEventListener('click', next);
btnPrev.addEventListener('click', prev);
window.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') next();
  else if (e.key === 'ArrowLeft') prev();
});
lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

// ================= Back button (ไปหน้า index ที่อยู่นอกโฟลเดอร์) =================
const backBtn = document.getElementById('backBtn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}

// ================= Advanced Hover Effects =================
// (1) Parallax tilt (เฉพาะอุปกรณ์ที่ pointer: fine เช่น เมาส์)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (!prefersReducedMotion && isFinePointer) {
  const tiltEls = document.querySelectorAll('.tilt');
  const MAX_TILT = 8; // องศา

  tiltEls.forEach(el => {
    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const px = (e.clientX - cx) / (rect.width / 2);  // -1 .. 1
      const py = (e.clientY - cy) / (rect.height / 2); // -1 .. 1
      const rx = (-py) * MAX_TILT;
      const ry = (px) * MAX_TILT;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function reset() { el.style.transform = ''; }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
    // ป้องกันกระตุกตอนสกรอลล์
    window.addEventListener('scroll', () => { el.style.transform = ''; }, { passive: true });
  });
}

// (2) Ripple on click
document.querySelectorAll('.ripple-button').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.left = (e.clientX - rect.left) + 'px';
    span.style.top = (e.clientY - rect.top) + 'px';
    this.appendChild(span);
    setTimeout(() => span.remove(), 600);
  });
});
