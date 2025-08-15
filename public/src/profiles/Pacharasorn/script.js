document.addEventListener('DOMContentLoaded', () => {
    /* ================================
       CONSTANTS / DOM
    ================================= */
    const SCORE_TO_ENTER = 450;        // ปรับเป็น อยากให้จบ อะไร
    const LOOP_MS = 20;
    const JUMP_PEAK = 133;
    const JUMP_STEP = 10;
    const FALL_STEP = 5;

    const dino = document.getElementById('dino');
    const cactus1 = document.getElementById('cactus1');
    const cactus2 = document.getElementById('cactus2');
    const ground = document.getElementById('ground');
    const game = document.getElementById('game');
    const gameContainer = document.getElementById('game-container');
    const portfolio = document.getElementById('portfolio');
    const scoreEl = document.getElementById('score');
    const jumpSound = document.getElementById('jump-sound');
    const dieSound = document.getElementById('die-sound');

    // Portfolio DOM
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('#tabs a');
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.getElementById('tabs');
    const header = document.querySelector('header');
    // Gallery
    const slider = document.querySelector('.gallery-slider');
    const projects = document.querySelectorAll('.project');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    /* ================================
       GAME STATE
    ================================= */
    let isJumping = false;
    let isGameOver = false;
    let score = 0;
    let cactiPassed = 0;
    let gameSpeed = 5;
    let gameLoop = null;
    let portfolioInitialized = false;

    /* ================================
       GAME: CORE
    ================================= */
    function startGame() {
        isGameOver = false;
        score = 0;
        cactiPassed = 0;
        cactus1.style.right = '-30px';
        cactus2.style.right = '-30px';
        dino.style.transform = 'rotate(0deg)';
        dino.style.bottom = '12px';
        game?.classList.add('playing');

        setTimeout(() => moveCactus(cactus1, 600 + Math.random() * 1000), 1000);
        setTimeout(() => moveCactus(cactus2, 600 + Math.random() * 1000), 2500);

        clearInterval(gameLoop);
        gameLoop = setInterval(() => {
            if (isGameOver) { clearInterval(gameLoop); return; }

            score++;
            scoreEl.textContent = `Score: ${score}`;

            if (score >= SCORE_TO_ENTER && !isGameOver) {
                enterPortfolioFromScore();
                clearInterval(gameLoop);
                return;
            }

            if (checkCollision(dino, cactus1) || checkCollision(dino, cactus2)) {
                gameOver();
            }

            if (parseInt(cactus1.style.right, 10) > 650 && !cactus1.dataset.passed) {
                cactus1.dataset.passed = 'true';
                cactiPassed++;
                checkGameComplete();
            }
            if (parseInt(cactus2.style.right, 10) > 650 && !cactus2.dataset.passed) {
                cactus2.dataset.passed = 'true';
                cactiPassed++;
                checkGameComplete();
            }
        }, LOOP_MS);
    }

    function moveCactus(cactus, delay) {
        if (isGameOver) return;
        let position = -30;
        cactus.style.right = `${position}px`;
        cactus.dataset.passed = 'false';

        const moveInterval = setInterval(() => {
            if (isGameOver) { clearInterval(moveInterval); return; }
            position += gameSpeed;
            cactus.style.right = `${position}px`;
            if (position > 650) {
                clearInterval(moveInterval);
                setTimeout(() => moveCactus(cactus, delay), delay);
            }
        }, LOOP_MS);
    }

    function jump() {
        if (isJumping || isGameOver) return;
        isJumping = true;
        try { jumpSound?.play(); } catch { }
        const up = setInterval(() => {
            let bottom = parseInt(getComputedStyle(dino).getPropertyValue('bottom'), 10);
            if (bottom >= JUMP_PEAK) {
                clearInterval(up);
                const down = setInterval(() => {
                    bottom -= FALL_STEP;
                    dino.style.bottom = `${bottom}px`;
                    if (bottom <= 12) { clearInterval(down); isJumping = false; }
                }, LOOP_MS);
                return;
            }
            bottom += JUMP_STEP;
            dino.style.bottom = `${bottom}px`;
        }, LOOP_MS);
    }

    function checkCollision(a, b) {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return !(ar.right < br.left || ar.left > br.right || ar.bottom < br.top || ar.top > br.bottom);
    }

    function endGameTransition() {
        game?.classList.remove('playing');
        dino.style.transform = 'rotate(0deg)';
        dino.style.bottom = '12px';
    }

    function gameOver() {
        isGameOver = true;
        try { dieSound?.play(); } catch { }
        dino.style.transform = 'rotate(-90deg)';
        setTimeout(() => {
            gameContainer.classList.add('hidden');
            portfolio.classList.add('visible');
            initPortfolio();
            endGameTransition();
        }, 1000);
    }

    function enterPortfolioFromScore() {
        if (isGameOver) return;
        isGameOver = true;
        setTimeout(() => {
            gameContainer.classList.add('hidden');
            portfolio.classList.add('visible');
            initPortfolio();
            endGameTransition();
        }, 400);
    }

    function checkGameComplete() {
        if (cactiPassed >= 2) {
            isGameOver = true;
            setTimeout(() => {
                gameContainer.classList.add('hidden');
                portfolio.classList.add('visible');
                initPortfolio();
                endGameTransition();
            }, 1000);
        }
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.key === 'ArrowUp') && !isGameOver) {
            e.preventDefault();
            jump();
        }
    }, { passive: false });

    document.addEventListener('touchstart', () => { if (!isGameOver) jump(); }, { passive: true });

    /* ================================
       PORTFOLIO INIT (guard once)
    ================================= */
    function initPortfolio() {
        if (portfolioInitialized) return;
        portfolioInitialized = true;

        // Hamburger
        hamburger?.addEventListener('click', () => navMenu.classList.toggle('active'));

        // Close menu (mobile) on nav click
        document.querySelectorAll('#tabs a').forEach(a => {
            a.addEventListener('click', () => { if (innerWidth <= 768) navMenu.classList.remove('active'); });
        });

        // Gallery
        let currentIndex = 0;
        const updateSlider = () => { if (slider) slider.style.transform = `translateX(-${currentIndex * 100}%)`; };

        leftArrow?.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : projects.length - 1;
            updateSlider();
        });
        rightArrow?.addEventListener('click', () => {
            currentIndex = (currentIndex < projects.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });

        // Swipe
        if (slider) {
            let startX = 0;
            slider.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
            slider.addEventListener('touchend', e => {
                const endX = e.changedTouches[0].screenX;
                const dx = endX - startX;
                if (Math.abs(dx) > 50) (dx < 0 ? rightArrow : leftArrow)?.click();
            }, { passive: true });
        }

        // Mini dino jump in About
        const aboutDino = document.querySelector('#about .dino-micro');
        if (aboutDino) {
            setInterval(() => {
                aboutDino.classList.add('jump-animation');
                setTimeout(() => aboutDino.classList.remove('jump-animation'), 500);
            }, 3000 + Math.random() * 5000);
        }

        // First paint animations
        handleScrollAnimations();
    }

    /* ================================
       HOME Typewriter (loop)
    ================================= */
    (() => {
        const el = document.querySelector('.welcome-text');
        if (!el) return;
        const text = el.getAttribute('data-text') || '';
        let i = 0, deleting = false;

        function typeEffect() {
            if (!deleting) {
                el.textContent = text.slice(0, i++);
                if (i > text.length) { deleting = true; setTimeout(typeEffect, 1500); return; }
            } else {
                el.textContent = text.slice(0, i--);
                if (i < 0) { deleting = false; i = 0; }
            }
            setTimeout(typeEffect, deleting ? 60 : 100);
        }
        typeEffect();
    })();

    /* ================================
       SCROLL animations + nav active
    ================================= */
    const progressBars = document.querySelectorAll('.progress');

    function handleScrollAnimations() {
        // Header style
        header?.classList.toggle('scrolled', window.scrollY > 50);

        // Sections
        let currentId = '';
        sections.forEach(section => {
            const top = section.offsetTop;
            const h = section.offsetHeight;
            const y = window.scrollY;

            if (y >= top - 100 && y < top + h - 100) currentId = section.id;

            const revealTop = section.getBoundingClientRect().top;
            const vh = window.innerHeight;

            if (revealTop < vh * 0.9) {
                section.classList.add('active');
                if (section.id === 'skills') {
                    progressBars.forEach(b => b.style.width = b.getAttribute('data-width') || '0%');
                }
            } else {
                section.classList.remove('active');
                if (section.id === 'skills') {
                    progressBars.forEach(b => b.style.width = '0%');
                }
            }
        });

        // Nav
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
        });
    }
    window.addEventListener('scroll', handleScrollAnimations);

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;

            const start = window.scrollY;
            const end = target.getBoundingClientRect().top + window.scrollY - 60;
            const dist = end - start;
            const dur = 1000;
            let t0 = null;

            const easeInOutQuad = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--; return -c / 2 * (t * (t - 2) - 1) + b;
            };

            function anim(ts) {
                if (t0 === null) t0 = ts;
                const elapsed = ts - t0;
                const y = easeInOutQuad(elapsed, start, dist, dur);
                window.scrollTo(0, y);
                if (elapsed < dur) requestAnimationFrame(anim);
            }
            requestAnimationFrame(anim);
        });
    });

    /* ================================
       Cursor dino & footprints
    ================================= */
    const cursorDino = document.getElementById('cursor-dino');
    if (cursorDino) {
        let lastX = 0;
        document.addEventListener('mousemove', (e) => {
            cursorDino.style.left = `${e.clientX}px`;
            cursorDino.style.top = `${e.clientY}px`;
            cursorDino.style.transform = `translate(-50%, -50%) scaleX(${e.clientX >= lastX ? 1 : -1})`;
            lastX = e.clientX;
        });
    }

    // footprints
    (() => {
        let last = 0;
        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (Math.hypot(e.movementX, e.movementY) < 2 && now - last < 40) return;
            last = now;

            const fp = document.createElement('div');
            fp.className = 'footprint';
            fp.style.left = `${e.clientX - 7}px`;
            fp.style.top = `${e.clientY + 6}px`;
            fp.style.transform += (e.movementX < 0 ? ' scaleX(-1)' : '');
            document.body.appendChild(fp);

            requestAnimationFrame(() => {
                fp.style.opacity = '0';
                fp.style.transform += ' translateY(6px)';
            });
            setTimeout(() => fp.remove(), 550);
        }, { passive: true });
    })();

    // Scroll runner 
    (() => {
        const runner = document.querySelector('#scroll-runner-vertical .runner');
        if (!runner) return;
        function updateRunner() {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docH > 0 ? (window.scrollY / docH) : 0;
            const trackH = window.innerHeight - 48;
            runner.style.transform = `translateY(${trackH * progress}px)`;
            requestAnimationFrame(updateRunner);
        }
        requestAnimationFrame(updateRunner);
    })();

    // About epic reveal 
    (() => {
        const about = document.getElementById('about');
        if (!about) return;

        function confetti(duration = 1100, count = 140) {
            const c = document.createElement('canvas');
            Object.assign(c.style, { position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9998 });
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
            const t0 = performance.now();
            (function tick(t) {
                const dt = t - t0;
                ctx.clearRect(0, 0, W, H);
                parts.forEach(p => {
                    p.x += p.vx * dpr; p.y += p.vy * dpr; p.vy += 0.015 * dpr; p.rot += p.vr;
                    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
                    ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                });
                if (dt < duration) requestAnimationFrame(tick); else c.remove();
            })(t0);
        }

        let inView = false, lastFired = 0;
        const io = new IntersectionObserver(([entry]) => {
            const nowIn = entry.isIntersecting && entry.intersectionRatio >= 0.6;
            if (nowIn && !inView) {
                inView = true;
                const now = performance.now();
                if (now - lastFired >= 800) {
                    lastFired = now;
                    document.body.classList.add('body-shake');
                    setTimeout(() => document.body.classList.remove('body-shake'), 450);
                    about.classList.remove('about-epic');
                    void about.offsetWidth;
                    about.classList.add('about-epic');
                    confetti();
                }
            } else if (!nowIn && inView) {
                inView = false;
                about.classList.remove('about-epic');
            }
        }, { threshold: [0, 0.6] });
        io.observe(about);
    })();

    // Ready
    try { dieSound.load(); jumpSound.load(); } catch { }
    startGame();
});
