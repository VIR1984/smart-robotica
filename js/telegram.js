/* =========================================================
   SMART ROBOTICA — telegram.js
   Интеграция с Telegram Bot API
   Отправка заявок и аналитики в Telegram-бот
   =========================================================

   НАСТРОЙКА:
   1. Создайте бота через @BotFather в Telegram → получите BOT_TOKEN
   2. Напишите боту любое сообщение, затем откройте:
      https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
      Найдите "chat":{"id": XXXXXXXX} — это ваш CHAT_ID
   3. Замените BOT_TOKEN и CHAT_ID ниже на свои значения
   4. Подключите этот файл в index.html ПЕРЕД cms.js:
      <script src="js/telegram.js"></script>

   ========================================================= */

window.TG_CONFIG = {
    BOT_TOKEN: '8767872929:AAF65-679V7NsOOnf0UeB7ekxEWRdIvtoKk',   // Пример: 7123456789:AAF...
    CHAT_ID:   '875467667', // Пример: -1001234567890
    ENABLED:   true,   // ← Поменяйте на true после настройки токена и chat_id
};

/* =========================================================
   ОТПРАВКА СООБЩЕНИЙ
   ========================================================= */

async function tgSend(text) {
    const { BOT_TOKEN, CHAT_ID, ENABLED } = window.TG_CONFIG;

    if (!ENABLED) {
        console.info('[TG] Telegram отключён. Включите ENABLED: true в telegram.js');
        return;
    }
    if (!BOT_TOKEN || BOT_TOKEN.includes('ВСТАВЬТЕ') ||
        !CHAT_ID  || String(CHAT_ID).includes('ВСТАВЬТЕ')) {
        console.warn('[TG] Не задан BOT_TOKEN или CHAT_ID');
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id:    CHAT_ID,
                text:       text,
                parse_mode: 'HTML',
            }),
        });
    } catch (err) {
        console.warn('[TG] Ошибка отправки:', err);
    }
}

/* =========================================================
   ФОРМАТИРОВАНИЕ СООБЩЕНИЙ
   ========================================================= */

function tgNow() {
    return new Date().toLocaleString('ru-RU', {
        timeZone:    'Europe/Moscow',
        day:         '2-digit',
        month:       '2-digit',
        year:        'numeric',
        hour:        '2-digit',
        minute:      '2-digit',
    });
}

/**
 * Отправить уведомление о заявке на аренду
 */
window.tgSendRentForm = function(data) {
    const text = [
        '🤖 <b>НОВАЯ ЗАЯВКА НА АРЕНДУ</b>',
        '━━━━━━━━━━━━━━━━━━━━',
        `👤 Имя:      <b>${data.name}</b>`,
        `📞 Телефон:  <b>${data.phone}</b>`,
        `📧 Email:    <b>${data.email}</b>`,
        data.model ? `🔧 Модель:   <b>${data.model}</b>` : null,
        data.dateStart ? `📅 С:        <b>${data.dateStart}</b>` : null,
        data.dateEnd   ? `📅 По:       <b>${data.dateEnd}</b>` : null,
        data.comment   ? `💬 Коммент:  <i>${data.comment}</i>` : null,
        '━━━━━━━━━━━━━━━━━━━━',
        `🕐 ${tgNow()} (МСК)`,
    ].filter(Boolean).join('\n');

    return tgSend(text);
};

/**
 * Отправить уведомление об обратном звонке
 */
window.tgSendCallback = function(data) {
    const text = [
        '📞 <b>ОБРАТНЫЙ ЗВОНОК</b>',
        '━━━━━━━━━━━━━━━━━━━━',
        `👤 Имя:     <b>${data.name || 'не указано'}</b>`,
        `📞 Телефон: <b>${data.phone}</b>`,
        '━━━━━━━━━━━━━━━━━━━━',
        `🕐 ${tgNow()} (МСК)`,
    ].join('\n');

    return tgSend(text);
};

/**
 * Отправить уведомление о заявке из корзины
 */
window.tgSendCartOrder = function(items, total) {
    const itemLines = items.map(i =>
        `  • ${i.title} × ${i.qty} — ${i.price}`
    ).join('\n');

    const text = [
        '🛒 <b>ЗАЯВКА ИЗ КОРЗИНЫ</b>',
        '━━━━━━━━━━━━━━━━━━━━',
        itemLines,
        '━━━━━━━━━━━━━━━━━━━━',
        `💰 Итого: <b>${total}</b>`,
        `🕐 ${tgNow()} (МСК)`,
    ].join('\n');

    return tgSend(text);
};

/**
 * Отправить ежедневный отчёт о посещаемости
 */
window.tgSendDailyReport = function(stats) {
    const bar = (val, max) => {
        const pct  = max > 0 ? Math.round((val / max) * 10) : 0;
        return '█'.repeat(pct) + '░'.repeat(10 - pct);
    };

    // Топ-3 страницы
    const topPages = Object.entries(stats.pages || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([page, cnt], i) => `  ${i + 1}. ${page} — <b>${cnt}</b>`)
        .join('\n') || '  нет данных';

    // Источники
    const srcLines = Object.entries(stats.sources || {})
        .sort((a, b) => b[1] - a[1])
        .map(([src, cnt]) => {
            const ico = { direct: '🔗', search: '🔍', social: '📱', referral: '↗️' }[src] || '❓';
            return `  ${ico} ${src}: <b>${cnt}</b>`;
        })
        .join('\n') || '  нет данных';

    // Устройства
    const devLines = Object.entries(stats.devices || {})
        .map(([dev, cnt]) => {
            const ico = { desktop: '🖥️', mobile: '📱', tablet: '📟' }[dev] || '❓';
            return `  ${ico} ${dev}: <b>${cnt}</b>`;
        })
        .join('\n') || '  нет данных';

    // Отчёт о заявках за день
    const leads = stats.leadsToday || 0;
    const leadsLine = leads > 0
        ? `✅ Заявок за день: <b>${leads}</b>`
        : '📭 Заявок за день: <b>0</b>';

    const text = [
        '📊 <b>ЕЖЕДНЕВНЫЙ ОТЧЁТ</b>',
        `📅 ${new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}`,
        '━━━━━━━━━━━━━━━━━━━━',
        `👁 Просмотров за день: <b>${stats.todayViews || 0}</b>`,
        `👥 Уникальных за день: <b>${stats.todayUniq || 0}</b>`,
        `📈 Всего за месяц:     <b>${stats.monthViews || 0}</b>`,
        leadsLine,
        '',
        '📄 <b>Топ страниц:</b>',
        topPages,
        '',
        '🌐 <b>Источники:</b>',
        srcLines,
        '',
        '💻 <b>Устройства:</b>',
        devLines,
        '━━━━━━━━━━━━━━━━━━━━',
        `⏰ Отчёт сформирован: ${tgNow()}`,
    ].join('\n');

    return tgSend(text);
};

console.info('[TG] telegram.js загружен');