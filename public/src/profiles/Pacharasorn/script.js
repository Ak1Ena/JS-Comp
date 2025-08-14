document.addEventListener('DOMContentLoaded', function () {
    // Game Elements
    const dino = document.getElementById('dino');
    const cactus1 = document.getElementById('cactus1');
    const cactus2 = document.getElementById('cactus2');
    const gameContainer = document.getElementById('game-container');
    const portfolio = document.getElementById('portfolio');
    const jumpSound = document.getElementById('jump-sound');
    const dieSound = document.getElementById('die-sound');
    const scoreElement = document.getElementById('score');
    const game = document.getElementById('game');


    // Game Variables
    let isJumping = false;
    let isGameOver = false;
    let score = 0;
    let cactiPassed = 0;
    let gameSpeed = 5;

    // Portfolio Elements
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('#tabs a');
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.getElementById('tabs');
    const header = document.querySelector('header');

    // Gallery Elements
    const slider = document.querySelector('.gallery-slider');
    const projects = document.querySelectorAll('.project');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentIndex = 0;

    // --- GAME FUNCTIONS ---
    function startGame() {
        isGameOver = false;
        score = 0;
        cactiPassed = 0;
        cactus1.style.right = '-30px';
        cactus2.style.right = '-30px';
        dino.style.transform = 'rotate(0deg)';
        dino.style.bottom = '12px';

        setTimeout(() => moveCactus(cactus1, 600 + Math.random() * 1000), 1000);
        setTimeout(() => moveCactus(cactus2, 600 + Math.random() * 1000), 2500);

        const gameLoop = setInterval(() => {
            if (game) game.classList.add('playing');
            if (isGameOver) {
                clearInterval(gameLoop);
                return;
            }
            score++;
            scoreElement.textContent = `Score: ${score}`;
            if (checkCollision(dino, cactus1) || checkCollision(dino, cactus2)) {
                gameOver();
            }
            if (parseInt(cactus1.style.right) > 650 && !cactus1.dataset.passed) {
                cactus1.dataset.passed = 'true';
                cactiPassed++;
                checkGameComplete();
            }
            if (parseInt(cactus2.style.right) > 650 && !cactus2.dataset.passed) {
                cactus2.dataset.passed = 'true';
                cactiPassed++;
                checkGameComplete();
            }
        }, 20);
    }

    function moveCactus(cactus, delay) {
        if (isGameOver) return;
        let position = -30;
        cactus.style.right = position + 'px';
        cactus.dataset.passed = 'false';
        const moveInterval = setInterval(() => {
            if (isGameOver) {
                clearInterval(moveInterval);
                return;
            }
            position += gameSpeed;
            cactus.style.right = position + 'px';
            if (position > 650) {
                clearInterval(moveInterval);
                setTimeout(() => moveCactus(cactus, delay), delay);
            }
        }, 20);
    }

    function jump() {
        if (isJumping || isGameOver) return;
        isJumping = true;
        if (jumpSound) jumpSound.play();
        let upInterval = setInterval(() => {
            let bottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
            if (bottom >= 133) {
                clearInterval(upInterval);
                let downInterval = setInterval(() => {
                    bottom -= 5;
                    dino.style.bottom = bottom + 'px';
                    if (bottom <= 12) {
                        clearInterval(downInterval);
                        isJumping = false;
                    }
                }, 20);
            }
            bottom += 10;
            dino.style.bottom = bottom + 'px';
        }, 20);
    }

    function checkCollision(dino, cactus) {
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();
        return !(dinoRect.right < cactusRect.left || dinoRect.left > cactusRect.right || dinoRect.bottom < cactusRect.top || dinoRect.top > cactusRect.bottom);
    }

    function gameOver() {
        isGameOver = true;
        if (dieSound) dieSound.play();
        dino.style.transform = 'rotate(-90deg)';
        setTimeout(() => {
            gameContainer.classList.add('hidden');
            portfolio.classList.add('visible');
            initPortfolio();
        }, 1000);
    }

    function checkGameComplete() {
        if (cactiPassed >= 2) {
            isGameOver = true;
            setTimeout(() => {
                gameContainer.classList.add('hidden');
                portfolio.classList.add('visible');
                initPortfolio();
            }, 1000);
        }
    }

    document.addEventListener('keydown', (event) => {
        if (!isGameOver && (event.code === 'Space' || event.key === 'ArrowUp')) {
            event.preventDefault();
            jump();
        }
    });

    document.addEventListener('touchstart', () => {
        if (!isGameOver) jump();
    });

    // --- PORTFOLIO FUNCTIONS ---
    function initPortfolio() {
        // Hamburger Menu Logic
        hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
        navLinks.forEach(link => link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        }));

        // Gallery Slider Logic
        leftArrow.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : projects.length - 1;
            updateSlider();
        });
        rightArrow.addEventListener('click', () => {
            currentIndex = (currentIndex < projects.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // Gallery Touch/Swipe Logic
        let touchStartX = 0;
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        slider.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                rightArrow.click();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                leftArrow.click();
            }
        });

        // Add micro-animation to about section dino
        const aboutDino = document.querySelector('#about .dino-micro');
        if (aboutDino) {
            setInterval(() => {
                aboutDino.classList.add('jump-animation');
                setTimeout(() => aboutDino.classList.remove('jump-animation'), 500);
            }, 3000 + Math.random() * 5000);
        }

        // Trigger initial scroll to run animations on load
        handleScrollAnimations();
    }

    //  Typewriter looping 
    (function () {
        const el = document.querySelector('.welcome-text');
        if (!el) return;
        const text = el.getAttribute('data-text');
        let i = 0;
        let deleting = false;

        function typeEffect() {
            if (!deleting) {
                el.textContent = text.slice(0, i++);
                if (i > text.length) {
                    deleting = true;
                    setTimeout(typeEffect, 1500);
                    return;
                }
            } else {
                el.textContent = text.slice(0, i--);
                if (i < 0) {
                    deleting = false;
                    i = 0;
                }
            }
            setTimeout(typeEffect, deleting ? 60 : 100);
        }

        typeEffect();
    })();


    // Consolidated Scroll Event Handler
    function handleScrollAnimations() {
        // Header style on scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.scrollY;

            // Check for scroll spy
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                currentSectionId = section.getAttribute('id');
            }

            // Check for revealing animations
            const revealPoint = section.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;

            // *** START OF FIX ***
            if (revealPoint < screenHeight * 0.9) {
                section.classList.add('active');
                if (section.id === 'skills') {
                    document.querySelectorAll('.progress').forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
            } else {
                // This part resets the animation when you scroll away
                section.classList.remove('active');
                if (section.id === 'skills') {
                    document.querySelectorAll('.progress').forEach(bar => {
                        bar.style.width = '0%';
                    });
                }
            }
        });

        // Update nav links active state
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScrollAnimations);

    // Custom Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            const targetPosition = target.getBoundingClientRect().top + window.scrollY - 60;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function easeInOutQuad(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Dino Cursor Logic
    const cursorDino = document.getElementById('cursor-dino');
    if (cursorDino) {
        let lastMouseX = 0;
        document.addEventListener('mousemove', function (e) {
            cursorDino.style.left = e.clientX + 'px';
            cursorDino.style.top = e.clientY + 'px';
            if (e.clientX > lastMouseX) {
                cursorDino.style.transform = 'translate(-50%, -50%) scaleX(1)';
            } else if (e.clientX < lastMouseX) {
                cursorDino.style.transform = 'translate(-50%, -50%) scaleX(-1)';
            }
            lastMouseX = e.clientX;
        });
    }

    //  Footprints trail 
    (function () {
        let last = 0;
        const GAP = 16;
        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (Math.hypot(e.movementX, e.movementY) < 2 && now - last < 40) return;
            last = now;

            const fp = document.createElement('div');
            fp.className = 'footprint';
            fp.style.left = (e.clientX - 7) + 'px';
            fp.style.top = (e.clientY + 6) + 'px';
            fp.style.transform += (e.movementX < 0 ? ' scaleX(-1)' : '');
            document.body.appendChild(fp);

            // animate-out
            requestAnimationFrame(() => {
                fp.style.opacity = '0';
                fp.style.transform += ' translateY(6px)';
            });
            setTimeout(() => fp.remove(), 550);
        }, { passive: true });
    })();


    // Scroll Runner 
    (function () {
        const runner = document.querySelector('#scroll-runner-vertical .runner');
        if (!runner) return;

        function updateRunner() {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docH > 0 ? (window.scrollY / docH) : 0; // 0..1
            const trackHeight = window.innerHeight - 48;              // ลดขนาด sprite
            const y = trackHeight * progress;
            runner.style.transform = `translateY(${y}px)`;
            requestAnimationFrame(updateRunner);
        }
        requestAnimationFrame(updateRunner);
    })();

    // === ABOUT EPIC REVEAL (enter/exit only via IntersectionObserver) ===
    (function () {
        const about = document.getElementById('about');
        if (!about) return;

        function boomConfetti(duration = 1200, count = 150) {
            const c = document.createElement('canvas');
            Object.assign(c.style, {
                position: 'fixed', inset: 0, width: '100vw', height: '100vh',
                pointerEvents: 'none', zIndex: 9998
            });
            document.body.appendChild(c);
            const ctx = c.getContext('2d');
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            const W = c.width = Math.floor(innerWidth * dpr);
            const H = c.height = Math.floor(innerHeight * dpr);
            const parts = Array.from({ length: count }).map(() => ({
                x: Math.random() * W,
                y: Math.random() * (-H * 0.1),
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() * 3 + 2) * 0.1,
                size: Math.random() * 6 + 3,
                rot: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * 0.25,
                color: `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`
            }));
            const start = performance.now();
            (function tick(now) {
                const t = now - start;
                ctx.clearRect(0, 0, W, H);
                parts.forEach(p => {
                    p.x += p.vx * dpr;
                    p.y += p.vy * dpr;
                    p.vy += 0.015 * dpr;
                    p.rot += p.vr;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                });
                if (t < duration) requestAnimationFrame(tick); else c.remove();
            })(start);
        }

        let inView = false;
        let lastFired = 0;

        function fireEpic() {
            const now = performance.now();
            if (now - lastFired < 800) return;
            lastFired = now;

            document.body.classList.add('body-shake');
            setTimeout(() => document.body.classList.remove('body-shake'), 450);

            about.classList.remove('about-epic');
            void about.offsetWidth;
            about.classList.add('about-epic');

            boomConfetti(1100, 140);
        }

        const io = new IntersectionObserver(([entry]) => {
            const nowIn = entry.isIntersecting && entry.intersectionRatio >= 0.6;
            if (nowIn && !inView) {
                inView = true;
                fireEpic();
            } else if (!nowIn && inView) {
                inView = false;
                about.classList.remove('about-epic');
            }
        }, { threshold: [0, 0.6] });

        io.observe(about);
    })();






    dieSound.load();
    jumpSound.load();
    startGame();
});