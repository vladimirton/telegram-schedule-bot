const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Загрузка переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;
const url = process.env.VERCEL_URL;

// Инициализация бота
const bot = new TelegramBot(token, { polling: true });

// Функция для разрешения отправки сообщений
function enableChat() {
    console.log(`Разрешение чата: ${new Date().toLocaleString()}`);
    bot.setChatPermissions(chatId, { can_send_messages: true })
        .then(() => console.log("Чат разрешен для отправки сообщений."))
        .catch((error) => console.error("Ошибка при разрешении чата:", error));
}

// Функция для запрета отправки сообщений
function disableChat() {
    console.log(`Запрет чата: ${new Date().toLocaleString()}`);
    bot.setChatPermissions(chatId, { can_send_messages: false })
        .then(() => console.log("Чат запрещен для отправки сообщений."))
        .catch((error) => console.error("Ошибка при запрете чата:", error));
}

// Настройка cron-задач для управления чатом
cron.schedule('0 9 * * 1-5', enableChat);  // Активация в 9:00 по будням
cron.schedule('0 18 * * 1-5', disableChat);  // Деактивация в 18:00 по будням

// Настройка сервера для приема запросов от Telegram
app.use(bodyParser.json());
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Вывод информации на главную страницу
app.get('/', (req, res) => {
    res.send(`Telegram Schedule Bot активен и работает!<br>
              TOKEN: ${token}<br>
              CHAT ID: ${chatId}<br>
              URL: ${url}<br>
              Текущее время сервера: ${new Date().toLocaleString()}`);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}. Управление доступом к чату активировано.`);
});
