// Tabs filter
const tabs = document.querySelectorAll('.tab');
const gallery = document.getElementById('gallery');
const tiles = gallery.querySelectorAll('.tile');
function setFilter(type){
  tabs.forEach(t=>t.classList.toggle('active', t.dataset.filter===type));
  tiles.forEach(el=>{
    const show = type==='all' || el.dataset.type===type;
    el.style.display = show ? 'block' : 'none';
  });
}
tabs.forEach(tab=>tab.addEventListener('click', ()=>setFilter(tab.dataset.filter)));
setFilter('all');

// Follow button
const followBtn = document.getElementById('followBtn');
if (followBtn){
  followBtn.addEventListener('click', ()=>{
    const on = followBtn.dataset.state === 'on';
    followBtn.dataset.state = on ? 'off' : 'on';
    followBtn.textContent = on ? 'Follow' : 'Following';
    followBtn.classList.toggle('on', !on);
  });
}

// Copy email
function copyTextBySelector(sel){
  const el = document.querySelector(sel);
  if(!el) return;
  const text = el.textContent.trim();
  navigator.clipboard.writeText(text).then(()=>{
    const chip = document.querySelector('[data-copy="'+sel+'"]');
    if(chip){ chip.textContent='Copied!'; setTimeout(()=>chip.textContent='Copy', 1200); }
  }).catch(()=>{});
}

document.querySelectorAll('[data-copy]').forEach(chip=>{
  chip.addEventListener('click', ()=>copyTextBySelector(chip.dataset.copy));
});

// Open external (placeholder)
document.querySelectorAll('.chip.open').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    const url = chip.dataset.open || '#';
    window.open(url, '_blank');
  });
});