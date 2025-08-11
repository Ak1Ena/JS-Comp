const names = ['SIRAPHOP', 'FULLSTACK DEVELOPER'];
const nameEl = document.getElementById('name');

let currentIndex = 0;

function changeName() {
  nameEl.classList.add('fade-out');
  setTimeout(() => {
    nameEl.textContent = names[currentIndex];
    currentIndex = (currentIndex + 1) % names.length;
    nameEl.classList.remove('fade-out');
  }, 2000);
}

// เริ่มเปลี่ยนชื่อครั้งแรก
changeName();

// เปลี่ยนชื่ออัตโนมัติทุก 3 วินาที
setInterval(changeName, 5000);
