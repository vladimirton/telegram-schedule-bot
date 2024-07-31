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

const bot = new TelegramBot(token, { polling: true });

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

// Настройка cron-задач для управления чатом
cron.schedule('0 9 * * 1-5', enableChat);
cron.schedule('0 18 * * 1-5', disableChat);

// Настройка сервера для приема запросов от Telegram
app.use(bodyParser.json());
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Вывод токена, chatId и URL на страницу
app.get('/', (req, res) => {
    res.send(`Telegram Schedule Bot активен и работает!<br>
              TOKEN: ${token}<br>
              CHAT ID: ${chatId}<br>
              URL: ${url}`);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}. Управление доступом к чату активировано.`);
});
