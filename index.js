const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');

// Создаем приложение Express
const app = express();
const port = process.env.PORT || 3000;

// Загружаем переменные окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;
const url = process.env.VERCEL_URL; // Установите это в URL вашего развертывания Vercel

// Проверяем наличие переменных окружения
if (!token || !chatId || !url) {
    console.error('Отсутствуют необходимые переменные окружения');
    process.exit(1);
}

// Настраиваем бота
const bot = new TelegramBot(token);
bot.setWebHook(`${url}/bot${token}`);

// Парсим тело запроса в формате JSON
app.use(bodyParser.json());

// Обрабатываем запросы на вебхук
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

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

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
