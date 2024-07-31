const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// Загрузка переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;

if (!token || !chatId) {
    console.error('Отсутствуют необходимые переменные окружения: TELEGRAM_BOT_TOKEN и TELEGRAM_GROUP_CHAT_ID');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Функция для разрешения отправки сообщений
function enableChat() {
    bot.setChatPermissions(chatId, { can_send_messages: true })
        .then(() => console.log("Чат активирован для отправки сообщений."))
        .catch((error) => console.error("Ошибка активации чата:", error));
}

// Функция для запрета отправки сообщений
function disableChat() {
    bot.setChatPermissions(chatId, { can_send_messages: false })
        .then(() => console.log("Чат деактивирован для отправки сообщений."))
        .catch((error) => console.error("Ошибка деактивации чата:", error));
}

// Настройка cron-задач для управления чатом
cron.schedule('0 9 * * 1-5', enableChat); // Разрешение отправки с 9:00 каждый будний день
cron.schedule('0 18 * * 1-5', disableChat); // Запрет отправки в 18:00 каждый будний день

console.log("Бот запущен. Управление чатом активировано.");
