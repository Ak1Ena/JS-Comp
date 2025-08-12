// JavaScript
const names = ['SIRAPHOP', 'FULLSTACK DEVELOPER'];
const nameEl = document.getElementById('name');

let currentIndex = 0;

function changeName() {
  nameEl.classList.add('fade-out');

  setTimeout(() => {
    let text = names[currentIndex];

    if (currentIndex === 1) {
      // แยก "FULLSTACK" กับ "DEVELOPER" แล้วใส่สี
      const words = text.split(" ");
      const colored = `<span class="blue">${words[0]}</span> ${words[1]}`;
      nameEl.innerHTML = colored;
    } else {
      nameEl.textContent = text;
    }

    currentIndex = (currentIndex + 1) % names.length;
    nameEl.classList.remove('fade-out');
  }, 500);
}


changeName();

// เปลี่ยนชื่อทุก 5 วินาที
setInterval(changeName, 5000);


//card
const card = document.getElementsByClassName('card');

// card.addEventListener('mouseover', (e) => {
//   const rect = card.getBoundingClientRect();
//   const x = e.clientX - rect.left; // mouse X within card
//   const y = e.clientY - rect.top;  // mouse Y within card

//   const centerX = rect.width / 2;
//   const centerY = rect.height / 2;

//   const deltaX = (x - centerX) / centerX;
//   const deltaY = (y - centerY) / centerY;

//   const maxTilt = 15; // degrees

//   const tiltX = maxTilt * deltaY * -1; // invert for natural tilt
//   const tiltY = maxTilt * deltaX;

//   card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
// });

// card.addEventListener('mouseleave', () => {
//   card.style.transform = 'rotateX(0deg) rotateY(0deg)';
// });


//observer
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate');
        }, index * 100);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
  });
}
observeElements();