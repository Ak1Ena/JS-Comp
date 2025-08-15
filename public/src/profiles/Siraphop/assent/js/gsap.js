const container = document.querySelector("#education"); 
//learn how this was made at https://www.youtube.com/watch?v=ersN5fk8py0 
// function createBox(number, x, y) {
//   const box = document.createElement("div");
//   box.style.position = "absolute";
//   box.style.left = x + "px";
//   box.style.top = y + "px";
//   box.style.width = "40px";
//   box.style.height = "40px";
//   box.style.background = "rgba(0,0,0,0.7)";
//   box.style.color = "#fff";
//   box.style.display = "flex";
//   box.style.justifyContent = "center";
//   box.style.alignItems = "center";
//   box.style.borderRadius = "8px";
//   box.textContent = number;
//   container.appendChild(box);
// }
const school = document.getElementById('school');
const schoolTitle = document.getElementById('school-title')
const grade = document.getElementById('grade')
function updateBox(
    title = "Unknown School", 
    gradeValue = "N/A", 
    visible = "visible", 
    animation = "fadeInUp 0.2s ease-in-out forwards "
) {
    schoolTitle.textContent = title;
    grade.textContent = "GPA : " + gradeValue;
    school.style.visibility = visible;

    // reset animation ก่อน เพื่อให้เรียกซ้ำก็เล่นได้
    school.style.animation = "none";
    void school.offsetWidth; // trigger reflow

    school.style.animation = animation;
}
function hideBox() {
  console.log("hide");
  
        school.style.animation = "none";
    void school.offsetWidth; // trigger reflow
    school.style.animation = "fadeOutDown 0.2s ease-in-out forwards";
}

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, GSDevTools);

gsap.defaults({ease: "none"});

const pulses = gsap.timeline({
  defaults: {
    scale: 2,
    autoAlpha:1,
    transformOrigin: 'center', 
    ease: "elastic(2.5, 1)"
  }})
.to(".ball02, .text01", {
    onStart: () => updateBox("SawanananWitaya School"),
    onReverseComplete: () => updateBox("SawanananWitaya School")
}, 0.84) 
.to(".ball03, .text02", {
    onStart: () => updateBox("SawanananWitaya School","3.85")
    ,onReverseComplete: () => updateBox("SawanananWitaya School","3.85")
}, 1.36)
.to(".ball04, .text03", {
    onStart: () => updateBox("ChiangMai University","3.91")
    ,onReverseComplete: () => updateBox("ChiangMai University","3.91")
}, 1.92)
.to(".ball05, .text04", {
    onStart: () => updateBox("ChiangMai University")
}, 2.48)

const main = gsap.timeline({
  scrollTrigger: {
    trigger: "#svg",
    scrub: true,
    start: "top+=10 center",
    end: "bottom+=10 center",
    onLeave: () => hideBox(), // เรียก hideBox() เมื่อย้ายออกจากพื้นที่
    onLeaveBack: () => hideBox(), // เรียก hideBox() เมื่อย้อนเกินบนสุด
    onEnterBack: () => updateBox("ChaingMai University") // ถ้าต้องการให้ fade in กลับเมื่อเลื่อนลง
  }
})
.to(".ball01", {autoAlpha:1, duration:0.05})
.from(".theLine", {drawSVG:0, duration:4}, 0)
.to(".ball01", {motionPath:{
  path:".theLine",
  align:".theLine",
  alignOrigin:[0.5, 0.5],
}, duration:4}, 0)
.add(pulses, 0)
ScrollTrigger.create({
  trigger: "#svg",
  start: "bottom bottom",
});

document.querySelector('a[href="#app"]').addEventListener('click', (e) => {
  hideBox();
});
document.querySelector('a[href="#about-me"]').addEventListener('click', (e) => {
  hideBox();
});
document.querySelector('a[href="#education"]').addEventListener('click', (e) => {
  hideBox();
  main.seek(0);
});
document.querySelector('a[href="#skills"]').addEventListener('click', (e) => {
  hideBox();
});
document.querySelector('a[href="#projects"]').addEventListener('click', (e) => {
  hideBox();
});
document.querySelector('a[href="#contact"]').addEventListener('click', (e) => {
  hideBox();
});
//GSDevTools.create({animation:main})






















/*const pulses = gsap.timeline({
  defaults: {
    duration: 0.05, 
    autoAlpha: 1, 
    scale: 2, 
    transformOrigin: 'center', 
    ease: "elastic(2.5, 1)"
  }})
.to(".ball02, .text01", {}, 0.2) 
.to(".ball03, .text02", {}, 0.33)
.to(".ball04, .text03", {}, 0.46)

const main = gsap.timeline({defaults: {duration: 1},
  scrollTrigger: {
    trigger: "#svg",
    scrub: true,
    start: "top center",
    end: "bottom center"
  }})
.to(".ball01", {duration: 0.01, autoAlpha: 1})
.from(".theLine", {drawSVG: 0}, 0)
.to(".ball01", {motionPath: {
  path: ".theLine", 
  align:".theLine",
  alignOrigin: [0.5, 0.5],
}}, 0)
.add(pulses, 0);
 */