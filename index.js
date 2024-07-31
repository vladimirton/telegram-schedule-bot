const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

// Загрузка переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;
const url = process.env.VERCEL_URL;

// Вывод значений переменных в консоль для проверки
console.log("TELEGRAM_BOT_TOKEN:", token);
console.log("TELEGRAM_GROUP_CHAT_ID:", chatId);
console.log("VERCEL_URL:", url);

if (!token || !chatId || !url) {
    console.error('Отсутствуют необходимые переменные окружения: TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID, VERCEL_URL');
    process.exit(1);
}

const bot = new TelegramBot(token);
bot.setWebHook(`${url}/bot${token}`);

app.use(bodyParser.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.status(200).send('Telegram Schedule Bot активен и работает!');
});

function enableChat() {
    bot.setChatPermissions(chatId, { can_send_messages: true })
        .then(() => console.log("Чат разрешен для отправки сообщений."))
        .catch((error) => console.error("Ошибка при разрешении чата:", error));
}

function disableChat() {
    bot.setChatPermissions(chatId, { can_send_messages: false })
        .then(() => console.log("Чат запрещен для отправки сообщений."))
        .catch((error) => console.error("Ошибка при запрете чата:", error));
}

cron.schedule('0 9 * * 1-5', enableChat);
cron.schedule('0 18 * * 1-5', disableChat);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}. Управление доступом к чату активировано.`);
});
