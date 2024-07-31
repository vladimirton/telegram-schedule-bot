const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');

// Инициализируем приложение Express
const app = express();
const port = process.env.PORT || 3000;  // Порт по умолчанию или тот, что указан в переменных окружения

// Загрузка переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;  // Токен вашего Telegram бота
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;  // ID чата Telegram
const url = process.env.VERCEL_URL;  // URL вашего деплоя на Vercel

if (!token || !chatId || !url) {
    console.error('Отсутствуют необходимые переменные окружения: TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID, VERCEL_URL');
    process.exit(1);
}

// Создаем бота
const bot = new TelegramBot(token);
bot.setWebHook(`${url}/bot${token}`);

// Middleware для разбора JSON
app.use(bodyParser.json());

// Обработчик вебхука
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Добавляем простой GET маршрут для корня
app.get('/', (req, res) => {
  res.status(200).send('Telegram Schedule Bot активен и работает!');
});

// Функция для разрешения отправки сообщений
function enableChat() {
    bot.setChatPermissions(chatId, { can_send_messages: true })
        .then(() => console.log("Чат разрешен для отправки сообщений."))
        .catch((error) => console.error("Ошибка при разрешении чата:", error));
}

// Функция для запрета отправки сообщений
function disableChat() {
    bot.setChatPermissions(chatId, { can_send_messages: false })
        .then(() => console.log("Чат запрещен для отправки сообщений."))
        .catch((error) => console.error("Ошибка при запрете чата:", error));
}

// Настройка cron задач
cron.schedule('0 9 * * 1-5', enableChat);  // Разрешение отправки сообщений с 9:00 каждый будний день
cron.schedule('0 18 * * 1-5', disableChat);  // Запрет отправки сообщений с 18:00 каждый будний день

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}. Управление доступом к чату активировано.`);
});
