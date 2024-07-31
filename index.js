const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// Установка часового пояса (замените на нужный)
process.env.TZ = 'Europe/Moscow';

const app = express();
const port = process.env.PORT || 3000;

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;
const url = process.env.VERCEL_URL;

const bot = new TelegramBot(token, { polling: true });

function enableChat() {
    console.log(`Разрешение чата: ${new Date().toLocaleString()}`);
    bot.setChatPermissions(chatId, { can_send_messages: true }).then(() => {
        console.log("Чат разрешен для отправки сообщений.");
    }).catch((error) => {
        console.error("Ошибка при разрешении чата:", error);
    });
}

function disableChat() {
    console.log(`Запрет чата: ${new Date().toLocaleString()}`);
    bot.setChatPermissions(chatId, { can_send_messages: false }).then(() => {
        console.log("Чат запрещен для отправки сообщений.");
    }).catch((error) => {
        console.error("Ошибка при запрете чата:", error);
    });
}

cron.schedule('0 9 * * 1-5', enableChat);
cron.schedule('0 18 * * 1-5', disableChat);

app.use(bodyParser.json());
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

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
