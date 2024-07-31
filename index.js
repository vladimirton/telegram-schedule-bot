const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// Получение значений переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;

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

// Запланировать задачи
// Разрешение отправки сообщений каждый будний день с 9:00
cron.schedule('0 9 * * 1-5', enableChat);
// Запрет отправки сообщений каждый будний день в 18:00
cron.schedule('0 18 * * 1-5', disableChat);

// Вывод переменных в консоль для тестирования
console.log("Токен бота:", token);
console.log("ID чата:", chatId);
