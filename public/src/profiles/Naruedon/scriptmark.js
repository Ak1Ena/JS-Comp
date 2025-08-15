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
  let nextIndex = currentIndex+1;
  if (nextIndex >= boxes.length) nextIndex = boxes.length - 1;

  boxes.forEach((box, i) => {
    if (i === nextIndex) {
      box.classList.add('active');
    }else if(i === currentIndex) {
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  });
}

//หน้าแรก
const speed = 80;
let i = 0;

const opentext = "Welcome to My Profile."
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
    }, 6000);
  }
}
openTypeWriter();

// หน้า skills
document.addEventListener("DOMContentLoaded", () => {
  const bars = document.querySelectorAll(".progress-bar");
  bars.forEach(bar => {
    const skill = bar.getAttribute("data-skill");
    setTimeout(() => {
      const totalWidth = 500; // ความกว้างเต็มของ progress
      const targetWidth = totalWidth * (skill / 100); // คำนวณตามเปอร์เซ็นต์
      bar.style.width = targetWidth + "px";

    }, 200);
  });
});

// หน้า Experience
const images = [
  { src: "png/exp1.png", caption: "Certificate of Student Poster Contest at the DPSTS." },
  { src: "png/exp2.png", caption: "Certificate of Student Oral Contest at the DPSTS." },
  { src: "png/exp3.jpg", caption: "Presentation at the Science Fair Yupparaj Wittayalai School." }
];

let currentIndex = 0;

const expImage = document.getElementById("exp-image");
const expCaption = document.getElementById("exp-caption");

document.querySelector(".prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateSlider();
});

document.querySelector(".next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateSlider();
});

function updateSlider() {
  expImage.src = images[currentIndex].src;
  expImage.alt = `Experience ${currentIndex + 1}`;
  expCaption.textContent = images[currentIndex].caption;
}


//ระบบสีพื้นหลัง
function interpolateColor(color1, color2, factor) {
    const c1 = color1.match(/\d+/g).map(Number);
    const c2 = color2.match(/\d+/g).map(Number);
    const result = c1.map((v, i) => Math.round(v + (c2[i] - v) * factor));
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

function updateCloudColor(factor) {
    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
        cloud.style.filter = `brightness(${1 - 0.5 * factor}) hue-rotate(${50 * factor}deg)`;
    });
}

function updateBackground() {
    const now = new Date();
    const totalSeconds = now.getMinutes() * 60 + now.getSeconds(); // วินาทีในชั่วโมงปัจจุบัน
    const cycle = 1 * 60; // 12 นาที = 720 วินาที
    let factor = (totalSeconds % cycle) / cycle;

    // ทำให้ factor เป็น ping-pong (0→1→0)
    if (Math.floor(totalSeconds / cycle) % 2 === 1) {
        factor = 1 - factor;
    }

    const topStart = 'rgb(135, 206, 235)';    // skyblue
    const topEnd = 'rgb(25, 25, 112)';        // midnightblue
    const bottomStart = 'rgb(152, 208, 92)';  // green
    const bottomEnd = 'rgb(0, 50, 0)';        // dark green

    const topColor = interpolateColor(topStart, topEnd, factor);
    const bottomColor = interpolateColor(bottomStart, bottomEnd, factor);

    document.body.style.background = `linear-gradient(to bottom, ${topColor} 65%, ${bottomColor} 65%)`;
    document.body.style.backgroundRepeat = 'repeat-x';
    document.body.style.backgroundSize = 'auto 100%';

    updateCloudColor(factor);
}

// อัปเดตทุกวินาที
setInterval(updateBackground, 100);
updateBackground();

// nav-dot
document.addEventListener("DOMContentLoaded", () => {
  const dots = document.querySelectorAll(".nav-dot");
  const boxes = document.querySelectorAll(".box");
  const lineRect = line.getBoundingClientRect();

  // จัดตำแหน่งจุดให้กระจายบนเส้น
  dots.forEach((dot, i) => {
    const percent = i / (boxes.length - 1);
    dot.style.left = `${percent * lineRect.width}px`;
  });

  // คลิกแล้วเลื่อนไป section + ย้าย marker
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      const target = boxes[i];
      if (target) {
        const percent = i / (boxes.length - 1);
        const newX = lineRect.left + percent * lineRect.width;

        // ย้าย marker
        marker.style.left = `${newX}px`;

        // เลื่อนไป section
        window.scrollTo({
          left: target.offsetLeft,
          behavior: "smooth"
        });
      }
    });
  });
});

// เพลง
const audio = new Audio("music/song.mp3");
audio.loop = true;
audio.volume = 0.35;

document.addEventListener("click", () => {
  audio.play();
}, { once: true });