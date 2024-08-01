const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
let currentChatStatus = 'Неизвестно';

const permissions = {
  active: {
    can_send_messages: true,
    can_send_media_messages: true,
    can_send_audios: true,
    can_send_documents: true,
    can_send_photos: true,
    can_send_videos: true,
    can_send_video_notes: true,
    can_send_voice_notes: true,
    can_send_polls: true,
    can_send_other_messages: true,
    can_add_web_page_previews: true,
    can_change_info: true,
    can_invite_users: true,
    can_pin_messages: true,
    can_manage_topics: false
  },
  inactive: {
    can_send_messages: false,
    can_send_media_messages: false,
    can_send_audios: false,
    can_send_documents: false,
    can_send_photos: false,
    can_send_videos: false,
    can_send_video_notes: false,
    can_send_voice_notes: false,
    can_send_polls: false,
    can_send_other_messages: false,
    can_add_web_page_previews: false,
    can_change_info: false,
    can_invite_users: false,
    can_pin_messages: false,
    can_manage_topics: false
  }
};

async function setChatPermissions(status) {
  const perms = status === 'Включен' ? permissions.active : permissions.inactive;
  const url = `https://api.telegram.org/bot${botToken}/setChatPermissions`;
  try {
    await axios.post(url, { chat_id: chatId, permissions: perms });
    currentChatStatus = status;
  } catch (error) {
    console.error('Error in setting chat permissions:', error.response ? error.response.data : error.message);
  }
}

function getMoscowTime() {
  return new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + (3 * 3600000)); // Moscow UTC+3
}

function checkAndSetInitialPermissions() {
  const moscowTime = getMoscowTime();
  const hour = moscowTime.getHours();
  const day = moscowTime.getDay();
  const status = day >= 1 && day <= 5 && hour >= 9 && hour < 18 ? 'Включен' : 'Выключен';
  setChatPermissions(status);
}

app.get('/', (req, res) => {
  const moscowTime = getMoscowTime();
  res.send(`Current date and time (Moscow): ${moscowTime.toLocaleString('en-US', { timeZone: 'Europe/Moscow' })}<br>Current chat status: ${currentChatStatus}`);
});

cron.schedule('0 9 * * 1-5', () => setChatPermissions('Включен'), { timezone: 'Europe/Moscow' });
cron.schedule('0 18 * * 1-5', () => setChatPermissions('Выключен'), { timezone: 'Europe/Moscow' });

checkAndSetInitialPermissions();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
