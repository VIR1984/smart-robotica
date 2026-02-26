/* =========================================================
   SMART ROBOTICA — cms.js v2
   Data layer, Cart, Rendering, Modals
   ========================================================= */

// ─── STORAGE KEY ──────────────────────────────────────────
const STORAGE = {
    PRODUCTS: 'sr_products',
    NEWS:     'sr_news',
    CART:     'sr_cart',
    SETTINGS: 'sr_settings'
};

// ─── DEFAULT DATA ─────────────────────────────────────────
function getDefaultProducts() {
    return [
        {
            id: 'sr-alpha-1', type: 'robots',
            title: 'SR-Alpha 1',
            price: 'от 1 200 000 ₽',
            badge: 'Хит продаж',
            image: 'https://placehold.co/400x320/09091c/00F0FF?text=SR-Alpha+1',
            shortDescription: 'Многофункциональный робот-ассистент для промышленных предприятий с системой технического зрения.',
            description: '<p>SR-Alpha 1 — флагманский промышленный манипулятор с 6 степенями свободы и встроенной системой машинного зрения.</p>',
            features: ['6-осевой манипулятор', 'Грузоподъёмность до 10 кг', 'Точность ±0.05 мм'],
            specifications: { 'Высота': '1.2 м', 'Масса': '48 кг', 'Питание': '24В DC', 'Гарантия': '3 года' },
            applications: ['Производство', 'Логистика', 'Медицина']
        },
        {
            id: 'sr-sentry-2', type: 'robots',
            title: 'SR-Sentry 2',
            price: 'от 890 000 ₽',
            badge: 'Новинка',
            image: 'https://placehold.co/400x320/09091c/BC13FE?text=SR-Sentry+2',
            shortDescription: 'Автономная охранная платформа с ИИ-распознаванием лиц и периметральным патрулированием.',
            description: '<p>SR-Sentry 2 обеспечивает круглосуточную охрану периметра без участия человека.</p>',
            features: ['360° обзор', 'ИИ-распознавание лиц', 'Автономный патруль'],
            specifications: { 'Скорость': 'до 5 км/ч', 'Батарея': '12 часов', 'Масса': '32 кг' },
            applications: ['Охрана', 'Склады', 'Торговые центры']
        },
        {
            id: 'sr-drone-x3', type: 'robots',
            title: 'SR-Drone X3',
            price: 'от 450 000 ₽',
            badge: null,
            image: 'https://placehold.co/400x320/09091c/00F0FF?text=SR-Drone+X3',
            shortDescription: 'Профессиональный БПЛА для мониторинга, картографирования и доставки грузов до 3 кг.',
            description: '<p>SR-Drone X3 — профессиональная платформа для промышленного применения.</p>',
            features: ['Полёт до 40 мин', 'Дальность 7 км', 'IP54'],
            specifications: { 'Дальность': '7 км', 'Время полёта': '40 мин', 'Нагрузка': '3 кг' },
            applications: ['Мониторинг', 'Картографирование', 'Доставка']
        },
        {
            id: 'sr-home', type: 'robots',
            title: 'SR-Home',
            price: 'от 120 000 ₽',
            badge: null,
            image: 'https://placehold.co/400x320/09091c/BC13FE?text=SR-Home',
            shortDescription: 'Умный домашний помощник с голосовым управлением и интеграцией умного дома.',
            description: '<p>SR-Home — ваш персональный робот-ассистент для дома.</p>',
            features: ['Голосовой интерфейс', 'Навигация SLAM', 'Интеграция IoT'],
            specifications: { 'Высота': '90 см', 'Масса': '14 кг', 'Батарея': '8 часов' },
            applications: ['Быт', 'Пожилые люди', 'Умный дом']
        }
    ];
}

function getDefaultNews() {
    return [
        {
            id: 'news-1', date: '15.02.2026',
            title: 'SR-Alpha 2 установил рекорд производительности',
            excerpt: 'Новейшая модель нашего манипулятора побила мировой рекорд по скорости сборки микросхем.',
            image: 'https://placehold.co/640x360/09091c/00F0FF?text=Record',
            content: '<p>Наша флагманская модель SR-Alpha 2 прошла независимое тестирование в Сколково и показала результат: скорость 2400 операций/час при погрешности менее 0.01 мм.</p><p>SR-Alpha 2 стал самым точным манипулятором в своём ценовом сегменте.</p>',
            tags: ['Достижения', 'Промышленность', 'SR-Alpha']
        },
        {
            id: 'news-2', date: '02.02.2026',
            title: 'Партнёрство с ведущими медицинскими центрами',
            excerpt: 'Smart Robotica подписала соглашения с 15 крупными клиниками для внедрения хирургических ассистентов.',
            image: 'https://placehold.co/640x360/09091c/BC13FE?text=Medical',
            content: '<p>Мы рады сообщить о подписании стратегических соглашений с 15 ведущими медицинскими центрами страны.</p>',
            tags: ['Партнёрство', 'Медицина']
        },
        {
            id: 'news-3', date: '18.01.2026',
            title: 'Smart Robotica на выставке CES 2026',
            excerpt: 'Три новинки и две награды на крупнейшей технологической выставке в Лас-Вегасе.',
            image: 'https://placehold.co/640x360/09091c/00F0FF?text=CES+2026',
            content: '<p>На CES 2026 Smart Robotica представила SR-Home, SR-Sentry 2 и прототип SR-Bio. Получены награды «Best Innovation» и «Editors Choice».</p>',
            tags: ['Выставка', 'CES', 'Награды']
        }
    ];
}

// ─── DATA ACCESS (localStorage as CMS backend) ────────────
// Приоритет источников данных:
// 1. window.CMS_DATA — если на хостинге есть файл cms-data.js (все устройства видят одно)
// 2. localStorage — локальные правки в текущем браузере
// 3. defaultFn() — встроенные дефолтные данные
function getData(key, defaultFn) {
    // Сначала проверяем cms-data.js (глобальный файл на хостинге)
    if (window.CMS_DATA) {
        const keyMap = {
            'sr_products': 'products',
            'sr_news':     'news',
            'sr_sections': 'sections',
            'sr_settings': 'settings',
        };
        const dataKey = keyMap[key];
        if (dataKey && window.CMS_DATA[dataKey]) {
            const val = window.CMS_DATA[dataKey];
            if (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0) {
                return val;
            }
        }
    }
    // Затем localStorage (локальные правки)
    try {
        const raw = localStorage.getItem(key);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch {}
    return defaultFn();
}

function getProducts() { return getData(STORAGE.PRODUCTS, getDefaultProducts); }
function getNews()     { return getData(STORAGE.NEWS,     getDefaultNews); }

// ─── CART ────────────────────────────────────────────────
const Cart = {
    items: [],

    load() {
        try {
            const raw = localStorage.getItem(STORAGE.CART);
            this.items = raw ? JSON.parse(raw) : [];
        } catch { this.items = []; }
        this.updateUI();
    },

    save() {
        try { localStorage.setItem(STORAGE.CART, JSON.stringify(this.items)); } catch {}
    },

    add(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) existing.qty += 1;
        else this.items.push({ ...product, qty: 1 });
        this.save();
        this.updateUI();
        this.renderDrawer();
        showToast(`"${product.title}" добавлен в корзину`, 'success');
    },

    remove(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save(); this.updateUI(); this.renderDrawer();
    },

    changeQty(id, delta) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;
        item.qty = Math.max(1, item.qty + delta);
        this.save(); this.updateUI(); this.renderDrawer();
    },

    total() {
        return this.items.reduce((sum, item) => {
            const price = parseInt((item.price || '').replace(/\D/g, '')) || 0;
            return sum + price * item.qty;
        }, 0);
    },

    count() { return this.items.reduce((n, i) => n + i.qty, 0); },

    updateUI() {
        const n = this.count();
        // desktop count
        const dc = document.getElementById('cart-count');
        if (dc) { dc.textContent = n; dc.style.display = n > 0 ? 'flex' : 'none'; }
        // mobile FAB count
        const fc = document.getElementById('fab-cart-count');
        if (fc) { fc.textContent = n; fc.style.display = n > 0 ? 'flex' : 'none'; }
        // aria
        const btn = document.getElementById('cart-btn');
        if (btn) btn.setAttribute('aria-label', `Корзина (${n} товаров)`);
        const fab = document.getElementById('fab-cart');
        if (fab) fab.setAttribute('aria-label', `Корзина (${n} товаров)`);
    },

    renderDrawer() {
        const body   = document.getElementById('cart-items');
        const footer = document.getElementById('cart-footer');
        const total  = document.getElementById('cart-total');
        if (!body) return;

        if (!this.items.length) {
            body.innerHTML = `<div class="cart-empty">
                <i class="fas fa-robot"></i>
                <p>Корзина пуста</p>
                <span>Добавьте товары из каталога</span>
            </div>`;
            if (footer) footer.style.display = 'none';
            return;
        }

        body.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img class="cart-item__img" src="${item.image || 'https://placehold.co/64x64/09091c/00F0FF?text=SR'}" alt="${item.title}" loading="lazy">
                <div class="cart-item__info">
                    <div class="cart-item__name">${item.title}</div>
                    <div class="cart-item__price">${item.price}</div>
                    <div class="cart-item__qty">
                        <button class="qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Уменьшить количество">−</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" data-id="${item.id}" data-delta="1" aria-label="Увеличить количество">+</button>
                    </div>
                </div>
                <button class="cart-item__remove" data-id="${item.id}" aria-label="Удалить из корзины">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');

        if (footer) footer.style.display = 'flex';
        if (total)  total.textContent = this.total().toLocaleString('ru-RU') + ' ₽';
    }
};

// ─── TOAST ───────────────────────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: 'fa-check-circle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info} toast__icon"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = '.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}

// ─── RENDERERS ───────────────────────────────────────────
function renderProductCard(p) {
    return `
    <article class="product-card fade-in">
        <div class="product-card__img">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
            ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ''}
        </div>
        <div class="product-card__body">
            <h3 class="product-card__title">${p.title}</h3>
            <div class="product-card__price">${p.price}</div>
            <p class="product-card__desc">${p.shortDescription}</p>
            <div class="product-card__actions">
                <button class="btn btn--small btn--outline js-product-details" data-id="${p.id}">
                    Подробнее
                </button>
                <button class="btn btn--small btn--primary js-add-to-cart" data-id="${p.id}">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
            </div>
        </div>
    </article>`;
}

function renderNewsCard(n) {
    return `
    <article class="news-card fade-in js-news-open" data-id="${n.id}" tabindex="0" role="button" aria-label="Читать новость: ${n.title}">
        ${n.image ? `<div class="news-card__img"><img src="${n.image}" alt="${n.title}" loading="lazy"></div>` : ''}
        <div class="news-card__body">
            <span class="news-card__date">${n.date}</span>
            <h3 class="news-card__title">${n.title}</h3>
            <p class="news-card__excerpt">${n.excerpt}</p>
            <span class="news-card__more">Читать далее <i class="fas fa-arrow-right"></i></span>
        </div>
    </article>`;
}

function renderProductModal(p) {
    const features = p.features?.length ? `
        <p class="product-subsection-title">Характеристики</p>
        <ul class="product-features-list">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>` : '';
    const specs = p.specifications ? `
        <p class="product-subsection-title">Технические данные</p>
        <table class="specs-table">${Object.entries(p.specifications).map(([k,v]) =>
            `<tr><td class="spec-name">${k}</td><td class="spec-value">${v}</td></tr>`).join('')}</table>` : '';
    const apps = p.applications?.length ? `
        <p class="product-subsection-title">Области применения</p>
        <ul class="product-apps-list">${p.applications.map(a => `<li>${a}</li>`).join('')}</ul>` : '';
    return `
    <div class="product-details-grid">
        <div class="product-details-img"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
        <div class="product-details-info">
            <h3>${p.title}</h3>
            <div class="product-details-price">${p.price}</div>
            <div class="product-details-desc">${renderText(p.description || p.shortDescription || '')}</div>
            ${features}${specs}${apps}
            <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap">
                <button class="btn btn--primary btn--small js-add-to-cart" data-id="${p.id}">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
                <button class="btn btn--outline btn--small js-open-rent" data-title="${p.title}">
                    <i class="fas fa-handshake"></i> Арендовать
                </button>
            </div>
        </div>
    </div>`;
}

// ─── SMART TEXT RENDERER ─────────────────────────────────
// Если в тексте есть HTML-теги — убираем лишние \n и рендерим как HTML.
// Если нет — конвертируем переносы строк в <p>/<br>.
function renderText(raw) {
    if (!raw) return '';
    const str = raw.trim();
    if (/<[a-z][\s\S]*>/i.test(str)) {
        // HTML-режим: убираем \n между тегами и внутри текста
        return str
            .replace(/\n+/g, ' ')    // все переносы → пробел
            .replace(/>\s+</g, '><')  // убираем пробелы между тегами
            .trim();
    }
    // Обычный текст: двойной перенос → новый абзац, одиночный → <br>
    return str
        .split(/\n{2,}/)
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

function renderNewsModal(n) {
    return `
    <span class="news-modal-date">${n.date}</span>
    ${n.image ? `<img src="${n.image}" alt="${n.title}" class="news-modal-img" loading="lazy">` : ''}
    <div class="news-modal-text">${renderText(n.content)}</div>
    ${n.tags?.length ? `<div class="news-tags">${n.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}`;
}

// ─── WIP SECTION CONFIGS ─────────────────────────────────
const WIP_SECTIONS = {
    career: {
        title: 'КАРЬЕРА',
        desc: 'Раздел с вакансиями и условиями работы находится в разработке. Скоро здесь появятся актуальные позиции.',
        meta: '🚀 Планируемый запуск: Q2 2026'
    },
    partners: {
        title: 'ПАРТНЁРЫ',
        desc: 'Раздел для партнёров и дистрибьюторов находится в разработке.',
        meta: '🤝 Для срочных запросов: info@smartrobotica.ru'
    },
    privacy: {
        title: 'ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ',
        desc: 'Документ находится на согласовании у юридического отдела и будет опубликован в ближайшее время.',
        meta: '📋 Ожидаемая дата: март 2026'
    },
    terms: {
        title: 'УСЛОВИЯ ИСПОЛЬЗОВАНИЯ',
        desc: 'Пользовательское соглашение находится на подготовке.',
        meta: '📋 Ожидаемая дата: март 2026'
    }
};

function openWipModal(section) {
    const cfg = WIP_SECTIONS[section] || {
        title: 'РАЗДЕЛ В РАЗРАБОТКЕ',
        desc: 'Этот раздел находится в разработке. Мы работаем над ним и скоро он появится.',
        meta: ''
    };
    const titleEl = document.getElementById('wip-modal-title');
    const descEl  = document.getElementById('wip-modal-desc');
    const metaEl  = document.getElementById('wip-modal-meta');
    if (titleEl) titleEl.innerHTML = `${cfg.title} <span class="gradient-text">В РАЗРАБОТКЕ</span>`;
    if (descEl)  descEl.textContent = cfg.desc;
    if (metaEl)  metaEl.textContent = cfg.meta;
    openModal('wip-modal');
}

// ─── MODAL HELPERS ────────────────────────────────────────
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        const focusable = modal.querySelector('input, select, textarea, button.modal-close');
        if (focusable) focusable.focus();
    }, 120);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('active');
    const anyOpen = document.querySelector('.modal.active') || document.querySelector('.cart-drawer.open');
    if (!anyOpen) document.body.style.overflow = '';
}

// ─── CART DRAWER ─────────────────────────────────────────
function openCart() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    Cart.renderDrawer();
    drawer.classList.add('open');
    drawer.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.active')) document.body.style.overflow = '';
}

// ─── POPULATE MODEL SELECT ────────────────────────────────
function populateModelSelect(products) {
    const sel = document.getElementById('rent-model');
    if (!sel) return;
    // Remove existing dynamic options (keep default)
    const opts = sel.querySelectorAll('option[data-dynamic]');
    opts.forEach(o => o.remove());
    products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.title;
        opt.textContent = p.title;
        opt.setAttribute('data-dynamic', '1');
        sel.appendChild(opt);
    });
}

// ─── MAIN CMS INIT ───────────────────────────────────────
const CMS = {
    _products: [],
    _news: [],

    init() {
        Cart.load();
        this._products = getProducts();
        this._news     = getNews();

        // Применяем настройки из CMS-админки
        this._applySettings();
        // Применяем состояние секций (WIP или активные)
        this._applySections();

        // Render products
        const prodEl = document.querySelector('[data-cms="products"]');
        if (prodEl) {
            if (this._products.length) {
                prodEl.innerHTML = this._products.map(renderProductCard).join('');
            } else {
                prodEl.innerHTML = '<p class="content-error">Продукты не найдены</p>';
            }
        }

        // Render news
        const newsEl = document.querySelector('[data-cms="news"]');
        if (newsEl) {
            const sorted = [...this._news].sort((a, b) => this._parseDate(b.date) - this._parseDate(a.date));
            if (sorted.length) {
                newsEl.innerHTML = sorted.map(renderNewsCard).join('');
            } else {
                newsEl.innerHTML = '<p class="content-error">Новости не найдены</p>';
            }
        }

        populateModelSelect(this._products);
        this._bindEvents();

        // Trigger fade-ins
        requestAnimationFrame(() => {
            document.querySelectorAll('.fade-in').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 70);
            });
        });
    },

    // ─── Применяем настройки из sr_settings ─────────────────
    _applySettings() {
        let s = {};
        // Сначала CMS_DATA (файл на хостинге), затем localStorage
        try {
            if (window.CMS_DATA?.settings && Object.keys(window.CMS_DATA.settings).length) {
                s = window.CMS_DATA.settings;
            } else {
                const raw = localStorage.getItem('sr_settings');
                if (raw) s = JSON.parse(raw);
            }
        } catch {}
        if (!Object.keys(s).length) return;

        // Email
        if (s.email) {
            document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
                el.href        = `mailto:${s.email}`;
                el.textContent = s.email;
            });
        }

        // Phone
        if (s.phone) {
            const digits = s.phone.replace(/\D/g, '');
            document.querySelectorAll('a[href^="tel:"]').forEach(el => {
                el.href        = `tel:+${digits}`;
                el.textContent = s.phone;
            });
        }

        // Address
        if (s.address) {
            document.querySelectorAll('.footer__contacts li').forEach(li => {
                if (li.querySelector('.fa-map-marker-alt')) {
                    const icon = li.querySelector('i')?.cloneNode(true);
                    li.textContent = '';
                    if (icon) li.appendChild(icon);
                    li.appendChild(document.createTextNode('\u00A0' + s.address));
                }
            });
        }

        // Социальные сети (по порядку ссылок .social-link: Telegram, VK, YouTube)
        const socialMap = ['tg', 'vk', 'yt'];
        document.querySelectorAll('.social-link').forEach((el, i) => {
            const key = socialMap[i];
            if (key && s[key]) {
                el.href   = s[key];
                el.target = '_blank';
                el.rel    = 'noopener noreferrer';
            }
        });

        // Статистика (data-target на счётчиках)
        const statEls = document.querySelectorAll('.stat__val[data-target]');
        const statMap = ['stat1', 'stat2', 'stat3'];
        statEls.forEach((el, i) => {
            const key = statMap[i];
            if (key && s[key]) el.setAttribute('data-target', String(s[key]));
        });

        // Название компании (title страницы)
        if (s.name) {
            document.title = `${s.name} | Будущее уже здесь`;
        }
    },

    // ─── Применяем состояние разделов из sr_sections ────────
    _applySections() {
        let sections = [];
        try {
            if (window.CMS_DATA?.sections?.length) {
                sections = window.CMS_DATA.sections;
            } else {
                const raw = localStorage.getItem('sr_sections');
                if (raw) sections = JSON.parse(raw);
            }
        } catch {}

        const sectionMap = {};
        sections.forEach(s => { sectionMap[s.id] = s.active; });

        document.querySelectorAll('.js-wip[data-section]').forEach(el => {
            const id = el.dataset.section;
            if (sectionMap[id]) {
                el.dataset.sectionActive = '1';
            }
        });
    },

    _parseDate(str) {
        if (!str) return 0;
        const [d, m, y] = str.split('.');
        return new Date(+y, +m - 1, +d).getTime();
    },

    // Всегда читаем свежие данные из localStorage, не из кеша в памяти
    _getProduct(id) { return getProducts().find(p => p.id === id); },
    _getNews(id)    { return getNews().find(n => n.id === id); },

    _bindEvents() {
        // ── Delegated clicks ──
        document.addEventListener('click', e => {

            // Add to cart
            const addBtn = e.target.closest('.js-add-to-cart');
            if (addBtn) {
                const p = this._getProduct(addBtn.dataset.id);
                if (p) Cart.add(p);
                return;
            }

            // Product details
            const detailBtn = e.target.closest('.js-product-details');
            if (detailBtn) {
                const p = this._getProduct(detailBtn.dataset.id);
                if (p) {
                    document.getElementById('details-modal-title').textContent = p.title.toUpperCase();
                    document.getElementById('details-modal-content').innerHTML = renderProductModal(p);
                    openModal('details-modal');
                }
                return;
            }

            // Open rent from product modal
            const rentBtn = e.target.closest('.js-open-rent');
            if (rentBtn) {
                closeModal('details-modal');
                if (rentBtn.dataset.title) {
                    const sel = document.getElementById('rent-model');
                    if (sel) sel.value = rentBtn.dataset.title;
                }
                openModal('rent-modal');
                return;
            }

            // News open
            const newsCard = e.target.closest('.js-news-open');
            if (newsCard) {
                const n = this._getNews(newsCard.dataset.id);
                if (n) {
                    document.getElementById('news-modal-title').textContent = n.title.toUpperCase();
                    document.getElementById('news-modal-content').innerHTML = renderNewsModal(n);
                    openModal('news-modal');
                }
                return;
            }

            // WIP links — проверяем активна ли секция в CMS
            const wipLink = e.target.closest('.js-wip');
            if (wipLink) {
                e.preventDefault();
                // Если секция включена в CMS, показываем «скоро появится» вместо WIP-модала
                if (wipLink.dataset.sectionActive === '1') {
                    showToast('Раздел запущен и скоро будет доступен по ссылке!', 'info');
                } else {
                    openWipModal(wipLink.dataset.section);
                }
                return;
            }

            // Cart qty
            const qtyBtn = e.target.closest('.qty-btn');
            if (qtyBtn) {
                Cart.changeQty(qtyBtn.dataset.id, parseInt(qtyBtn.dataset.delta));
                return;
            }

            // Cart remove
            const removeBtn = e.target.closest('.cart-item__remove');
            if (removeBtn) {
                Cart.remove(removeBtn.dataset.id);
                return;
            }

            // Modal close button
            const closeBtn = e.target.closest('.modal-close');
            if (closeBtn) {
                const modal = closeBtn.closest('.modal');
                if (modal) closeModal(modal.id);
                return;
            }

            // Backdrop click
            const backdrop = e.target.closest('.modal__backdrop');
            if (backdrop) {
                const modal = backdrop.closest('.modal');
                if (modal) closeModal(modal.id);
                return;
            }
        });

        // News card keyboard support
        document.addEventListener('keydown', e => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.js-news-open')) {
                e.preventDefault();
                e.target.click();
            }
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(m => closeModal(m.id));
                closeCart();
            }
        });

        // Cart checkout
        document.getElementById('cart-checkout')?.addEventListener('click', () => {
            // Отправляем содержимое корзины в Telegram
            if (typeof window.tgSendCartOrder === 'function' && Cart.items.length) {
                const total = Cart.total().toLocaleString('ru-RU') + ' ₽';
                window.tgSendCartOrder(Cart.items, total);
            }
            if (typeof window.analyticsTrackLead === 'function') window.analyticsTrackLead('cart');
            closeCart();
            openModal('rent-modal');
        });

        // WIP notify button
        document.getElementById('wip-notify-btn')?.addEventListener('click', () => {
            closeModal('wip-modal');
            openModal('callback-modal');
            showToast('Мы уведомим вас о запуске раздела', 'info');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => CMS.init());