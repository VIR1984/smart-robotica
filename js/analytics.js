/* =========================================================
   SMART ROBOTICA — analytics.js
   Локальная аналитика посещений сайта
   Ежедневный отчёт в Telegram
   ========================================================= */

(function() {
    'use strict';

    const KEY = {
        DAILY:  'sr_analytics_daily',
        MONTH:  'sr_analytics_month',
        UNIQ:   'sr_analytics_uniq',
        REPORT: 'sr_analytics_last_report',
        LEADS:  'sr_analytics_leads_today',
    };

    /* ── Определение устройства ── */
    function getDevice() {
        const ua = navigator.userAgent;
        if (/Mobi|Android/i.test(ua)) return 'mobile';
        if (/Tablet|iPad/i.test(ua))  return 'tablet';
        return 'desktop';
    }

    /* ── Определение источника ── */
    function getSource() {
        const ref = document.referrer;
        if (!ref) return 'direct';
        if (/google|yandex|bing|mail\.ru/i.test(ref))          return 'search';
        if (/vk\.com|t\.me|instagram|facebook|tiktok/i.test(ref)) return 'social';
        return 'referral';
    }

    /* ── Определение «имени страницы» ── */
    function getPage() {
        const hash = window.location.hash || '#hero';
        const map  = {
            '#hero':     'Главная',
            '#products': 'Каталог',
            '#news':     'Новости',
            '#about':    'О нас',
        };
        return map[hash] || hash || 'Главная';
    }

    /* ── Утилиты хранилища ── */
    function load(key, fallback = {}) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    }

    function save(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    }

    /* ── Уникальность посетителя (по sessionStorage) ── */
    function isNewSession() {
        if (sessionStorage.getItem('sr_visited')) return false;
        sessionStorage.setItem('sr_visited', '1');
        return true;
    }

    /* ── Сегодняшняя дата ── */
    function today() {
        return new Date().toISOString().slice(0, 10);
    }

    /* ── Текущий месяц ── */
    function thisMonth() {
        return new Date().toISOString().slice(0, 7);
    }

    /* ── Запись просмотра ── */
    function recordView() {
        const d = today();
        const m = thisMonth();

        // Дневная статистика
        const daily = load(KEY.DAILY, {});
        if (!daily[d]) daily[d] = { views: 0, uniq: 0, pages: {}, sources: {}, devices: {} };
        daily[d].views += 1;

        const page   = getPage();
        const source = getSource();
        const device = getDevice();

        daily[d].pages[page]     = (daily[d].pages[page]     || 0) + 1;
        daily[d].sources[source] = (daily[d].sources[source] || 0) + 1;
        daily[d].devices[device] = (daily[d].devices[device] || 0) + 1;

        // Уникальные сессии за день
        if (isNewSession()) daily[d].uniq += 1;

        // Удаляем данные старше 60 дней
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 60);
        Object.keys(daily).forEach(k => {
            if (new Date(k) < cutoff) delete daily[k];
        });

        save(KEY.DAILY, daily);

        // Месячный счётчик
        const month = load(KEY.MONTH, {});
        month[m] = (month[m] || 0) + 1;
        save(KEY.MONTH, month);
    }

    /* ── Учёт заявки ── */
    window.analyticsTrackLead = function(type) {
        const d = today();
        const daily = load(KEY.DAILY, {});
        if (!daily[d]) daily[d] = { views: 0, uniq: 0, pages: {}, sources: {}, devices: {}, leads: 0 };
        daily[d].leads = (daily[d].leads || 0) + 1;
        save(KEY.DAILY, daily);
    };

    /* ── Получить статистику за сегодня ── */
    function getStatsToday() {
        const d = today();
        const m = thisMonth();
        const daily = load(KEY.DAILY, {});
        const month = load(KEY.MONTH, {});

        const todayData = daily[d] || {};

        // Сумма просмотров за месяц
        const monthViews = Object.entries(daily)
            .filter(([k]) => k.startsWith(m))
            .reduce((s, [, v]) => s + (v.views || 0), 0);

        return {
            todayViews:  todayData.views   || 0,
            todayUniq:   todayData.uniq    || 0,
            monthViews:  monthViews,
            leadsToday:  todayData.leads   || 0,
            pages:       todayData.pages   || {},
            sources:     todayData.sources || {},
            devices:     todayData.devices || {},
        };
    }

    /* ── Публичный доступ к статистике ── */
    window.analyticsGetStats = getStatsToday;

    /* ── Ежедневный отчёт ── */
    function checkDailyReport() {
        // Отчёт уходит в 09:00 МСК
        const nowMsk = new Date(Date.now() + 3 * 60 * 60 * 1000); // UTC+3
        const hour   = nowMsk.getUTCHours();
        if (hour < 9) return; // раньше 9 утра не отправляем

        const lastReport = localStorage.getItem(KEY.REPORT) || '';
        const todayStr   = today();

        if (lastReport === todayStr) return; // уже отправляли сегодня

        // Считаем статистику за вчера, не за сегодня
        const yesterday  = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yd    = yesterday.toISOString().slice(0, 10);
        const ym    = yesterday.toISOString().slice(0, 7);
        const daily = load(KEY.DAILY, {});
        const ydData = daily[yd] || {};

        const monthViews = Object.entries(daily)
            .filter(([k]) => k.startsWith(ym))
            .reduce((s, [, v]) => s + (v.views || 0), 0);

        const stats = {
            todayViews:  ydData.views   || 0,
            todayUniq:   ydData.uniq    || 0,
            monthViews:  monthViews,
            leadsToday:  ydData.leads   || 0,
            pages:       ydData.pages   || {},
            sources:     ydData.sources || {},
            devices:     ydData.devices || {},
        };

        // Отправляем отчёт и ставим отметку
        if (typeof window.tgSendDailyReport === 'function') {
            window.tgSendDailyReport(stats).then(() => {
                localStorage.setItem(KEY.REPORT, todayStr);
            });
        }
    }

    /* ── Инициализация ── */
    function init() {
        recordView();

        // Слушаем хэш для учёта просмотра секций
        window.addEventListener('hashchange', () => {
            const daily = load(KEY.DAILY, {});
            const d     = today();
            if (!daily[d]) daily[d] = { views: 0, uniq: 0, pages: {}, sources: {}, devices: {} };
            const page = getPage();
            daily[d].pages[page] = (daily[d].pages[page] || 0) + 1;
            save(KEY.DAILY, daily);
        });

        // Проверяем отчёт при загрузке и каждые 30 минут
        checkDailyReport();
        setInterval(checkDailyReport, 30 * 60 * 1000);

        console.info('[Analytics] Инициализирован. Просмотров сегодня:', getStatsToday().todayViews);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();