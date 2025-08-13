// JavaScript
const names = ['SIRAPHOP  KHATCHAMAT', 'FULLSTACK DEVELOPER'];
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

// scrolling line
//  const scrollSection = document.getElementById('education');
//   const path = document.getElementById('motionPath');
//   const circle = document.getElementById('movingCircle');
//   const popup = document.getElementById('popup');

//   const triggers = [
//     { x: 200, y: 75, message: 'นี่คือจุดแรก' },
//     { x: 600, y: 75, message: 'นี่คือจุดที่สอง' },
//   ];

//   const pathLength = path.getTotalLength();

//   scrollSection.addEventListener('scroll', () => {
//     const scrollTop = scrollSection.scrollTop;
//     const scrollHeight = scrollSection.scrollHeight - scrollSection.clientHeight;
//     const scrollPercent = Math.min(scrollTop / scrollHeight, 1);

//     const point = path.getPointAtLength(scrollPercent * pathLength);
//     circle.setAttribute('cx', point.x);
//     circle.setAttribute('cy', point.y);

//     const svgRect = path.ownerSVGElement.getBoundingClientRect();

//     const circleScreenX = svgRect.left + (point.x / 800) * svgRect.width;
//     const circleScreenY = svgRect.top + (point.y / 200) * svgRect.height;

//     let foundTrigger = null;
//     for (const trig of triggers) {
//       const trigScreenX = svgRect.left + (trig.x / 800) * svgRect.width;
//       const trigScreenY = svgRect.top + (trig.y / 200) * svgRect.height;

//       const dx = trigScreenX - circleScreenX;
//       const dy = trigScreenY - circleScreenY;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       if (dist < 30) {
//         foundTrigger = { ...trig, screenX: trigScreenX, screenY: trigScreenY };
//         console.log(1)
//         break;
//       }
//     }

//     if (foundTrigger) {
//       popup.style.display = 'block';
//       // ปรับตำแหน่ง popup ให้สัมพันธ์กับ #scroll-section (เพราะ popup เป็น absolute ใน section)
//       const sectionRect = scrollSection.getBoundingClientRect();
//       popup.style.left = `${foundTrigger.screenX - sectionRect.left + 20}px`;
//       popup.style.top = `${foundTrigger.screenY - sectionRect.top - 30}px`;
//       popup.textContent = foundTrigger.message;
//     } else {
//       popup.style.display = 'none';
//     }
//   });

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