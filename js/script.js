/* =========================================================
   SMART ROBOTICA — script.js v2
   UI: burger, scroll, stats, particles, modals, FABs
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── BURGER / MOBILE NAV ──────────────────────────────
    const burger = document.getElementById('burger');
    const nav    = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            burger.classList.toggle('active', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
        });

        // Close on nav link click + smooth scroll
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on outside click
        document.addEventListener('click', e => {
            if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('open')) {
                nav.classList.remove('open');
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ─── SMOOTH SCROLL ─────────────────────────────────────
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = document.getElementById('header')?.offsetHeight || 70;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });

    // ─── HEADER SCROLL STATE ───────────────────────────────
    const header = document.getElementById('header');
    const onScroll = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ─── RENT MODAL ────────────────────────────────────────
    const openRentModal = () => openModal('rent-modal');
    document.getElementById('rent-btn')?.addEventListener('click', openRentModal);
    document.getElementById('rent-hero-btn')?.addEventListener('click', openRentModal);
    document.getElementById('about-contact-btn')?.addEventListener('click', openRentModal);

    document.getElementById('rent-modal-close')?.addEventListener('click', () => closeModal('rent-modal'));
    document.getElementById('details-modal-close')?.addEventListener('click', () => closeModal('details-modal'));
    document.getElementById('news-modal-close')?.addEventListener('click', () => closeModal('news-modal'));
    document.getElementById('wip-modal-close')?.addEventListener('click', () => closeModal('wip-modal'));
    document.getElementById('callback-modal-close')?.addEventListener('click', () => closeModal('callback-modal'));

    // ─── RENT FORM SUBMIT ──────────────────────────────────
    document.getElementById('rent-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const name  = document.getElementById('rent-name')?.value.trim();
        const phone = document.getElementById('rent-phone')?.value.trim();
        const email = document.getElementById('rent-email')?.value.trim();
        if (!name || !phone || !email) {
            showToast('Пожалуйста, заполните обязательные поля (*)', 'info');
            return;
        }
        closeModal('rent-modal');
        e.target.reset();
        showToast('Заявка на аренду отправлена! Мы свяжемся с вами в течение 30 минут.', 'success');
    });

    // ─── CALLBACK FORM SUBMIT ──────────────────────────────
    document.getElementById('callback-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const phone = document.getElementById('cb-phone')?.value.trim();
        if (!phone) {
            showToast('Введите номер телефона', 'info');
            return;
        }
        closeModal('callback-modal');
        e.target.reset();
        showToast('Перезвоним вам в течение 5 минут!', 'success');
    });

    // ─── CART BUTTONS ──────────────────────────────────────
    document.getElementById('cart-btn')?.addEventListener('click', openCart);
    document.getElementById('cart-close')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

    // ─── MOBILE FABs ───────────────────────────────────────
    // Callback FAB
    document.getElementById('fab-callback')?.addEventListener('click', () => {
        openModal('callback-modal');
    });

    // Cart FAB
    document.getElementById('fab-cart')?.addEventListener('click', openCart);

    // ─── ANIMATED COUNTERS ─────────────────────────────────
    function animateCounter(el) {
        const target   = parseInt(el.dataset.target) || 0;
        const duration = 1800;
        const step     = target / (duration / 16);
        let current    = 0;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(timer);
        }, 16);
    }

    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .5 });

    document.querySelectorAll('.stat__val[data-target]').forEach(el => statsObserver.observe(el));

    // ─── SCROLL FADE-IN ────────────────────────────────────
    const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });

    const observeAll = () => document.querySelectorAll('.fade-in:not(.visible)').forEach(el => fadeObserver.observe(el));
    observeAll();
    new MutationObserver(observeAll).observe(document.body, { childList: true, subtree: true });

    // ─── ACTIVE NAV ON SCROLL ──────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav__link');

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: .35, rootMargin: `-${header?.offsetHeight || 70}px 0px 0px 0px` });

    sections.forEach(s => navObserver.observe(s));

    // ─── PARTICLE CANVAS ───────────────────────────────────
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [], raf;

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };

        class Particle {
            constructor() { this.reset(true); }
            reset(initial = false) {
                this.x     = Math.random() * canvas.width;
                this.y     = initial ? Math.random() * canvas.height : canvas.height + 10;
                this.vx    = (Math.random() - .5) * .35;
                this.vy    = -(Math.random() * .55 + .25);
                this.r     = Math.random() * 1.4 + .4;
                this.life  = 1;
                this.decay = Math.random() * .003 + .001;
                this.color = Math.random() > .5 ? '0,240,255' : '188,19,254';
            }
            update() {
                this.x += this.vx; this.y += this.vy; this.life -= this.decay;
                if (this.life <= 0 || this.y < -10) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.life * .55})`;
                ctx.fill();
            }
        }

        const initParticles = () => { particles = Array.from({ length: 75 }, () => new Particle()); };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            raf = requestAnimationFrame(animate);
        };

        resize(); initParticles(); animate();

        let resizeT;
        window.addEventListener('resize', () => {
            clearTimeout(resizeT);
            resizeT = setTimeout(() => { resize(); initParticles(); }, 220);
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(raf); else animate();
        });
    }

    // ─── GLITCH FLICKER ────────────────────────────────────
    const glitchEl = document.querySelector('.hero__title .glitch');
    if (glitchEl) {
        setInterval(() => {
            if (Math.random() > .93) {
                glitchEl.style.textShadow = `${(Math.random()-.5)*8}px 0 var(--cyan)`;
                setTimeout(() => { glitchEl.style.textShadow = ''; }, 80);
            }
        }, 500);
    }

    // ─── DATE INPUT MIN ────────────────────────────────────
    const today = new Date().toISOString().split('T')[0];
    ['rent-date-start', 'rent-date-end'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('min', today);
    });
    document.getElementById('rent-date-start')?.addEventListener('change', e => {
        const endEl = document.getElementById('rent-date-end');
        if (endEl) endEl.setAttribute('min', e.target.value || today);
    });

});