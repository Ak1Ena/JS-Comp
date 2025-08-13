const marker = document.getElementById('marker');
const line = document.getElementById('line');
let isDragging = false;

window.addEventListener('load', () => {
  const lineRect = line.getBoundingClientRect();
  marker.style.left = `${lineRect.left}px`;
  window.scrollTo(0, 0); // เลื่อนกลับไปที่จุดเริ่มต้น
});

marker.addEventListener('mousedown', () => {
  isDragging = true;
  marker.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  marker.style.cursor = 'grab';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const lineRect = line.getBoundingClientRect();
  let newX = e.clientX;

  // จำกัดให้อยู่ในเส้น
  if (newX < lineRect.left) newX = lineRect.left;
  if (newX > lineRect.right) newX = lineRect.right;

  // ขยับจุด
  marker.style.left = `${newX}px`;

  // แปลงตำแหน่งจุดเป็น scroll position
  const percent = (newX - lineRect.left) / lineRect.width;
  const maxScroll = document.body.scrollWidth - window.innerWidth;
  window.scrollTo(percent * maxScroll, 0);
});

window.addEventListener('scroll', updateActiveBox);

function updateActiveBox() {
  const boxes = document.getElementById('box');
  const centerX = window.scrollX + window.innerWidth / 2;

  let currentIndex = 0;

  boxes.forEach((box, i) => {
    const boxStart = box.offsetLeft;
    const boxEnd = box.offsetLeft + box.offsetWidth;
    if (centerX >= boxStart && centerX < boxEnd) {
      currentIndex = i;
    }
  });

  // เอาช่องถัดไป
  let nextIndex = currentIndex + 1;
  if (nextIndex >= boxes.length) nextIndex = boxes.length - 1;

  boxes.forEach((box, i) => {
    if (i === nextIndex) {
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  });
}
const speed = 80;
let i = 0;

const opentext = "Welcome to Naruedon's Profile"
const openTypewriterEl = document.getElementById("opentypewriter");

function openTypeWriter() {
  if (i < opentext.length) {
    openTypewriterEl.innerHTML = opentext.substring(0, i + 1) + '<span class="cursor"></span>';
    i++;
    setTimeout(openTypeWriter, speed);
  } else {
    setTimeout(() => {
      i = 0;
      openTypewriterEl.innerHTML = "";
      openTypeWriter();
    }, 1000);
  }
}
openTypeWriter();
const text = "Student at Chiang Mai University, College of Arts Media and Technology, Digital Industry Integration.";
const typewriterEl = document.getElementById("typewriter");

    function typeWriter() {
      if (i < text.length) {
        typewriterEl.innerHTML = text.substring(0, i + 1) + '<span class="cursor"></span>';
        i++;
        setTimeout(typeWriter, speed);
      } else {
        typewriterEl.innerHTML = text;
      }
}