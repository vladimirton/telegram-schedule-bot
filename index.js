const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

// Переменная для отслеживания текущего состояния чата
let currentChatStatus = 'Неизвестно';

async function setChatPermissions(permissions, statusDescription) {
  const url = `https://api.telegram.org/bot${botToken}/setChatPermissions`;
  const params = {
    chat_id: chatId,
    permissions: permissions
  };

  try {
    const response = await axios.post(url, params);
    console.log('Permissions update response:', response.data);
    currentChatStatus = statusDescription; // Обновление текущего состояния чата
  } catch (error) {
    console.error('Error in setting chat permissions:', error.response ? error.response.data : error.message);
  }
}

const activePermissions = {
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
};

const inactivePermissions = {
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
};

function checkAndSetInitialPermissions() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  // Adjust to 'Europe/Moscow' timezone if the server is not in that timezone
  now.setHours(now.getHours() + (now.getTimezoneOffset() / 60) + 3); // Moscow UTC+3

  if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
    setChatPermissions(activePermissions, 'Включен');
  } else {
    setChatPermissions(inactivePermissions, 'Выключен');
  }
}

app.get('/', (req, res) => {
  const now = new Date();
  res.send(`
    Current date and time: ${now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' })}<br>
    Current chat status: ${currentChatStatus}
  `);
});

cron.schedule('0 9 * * 1-5', () => setChatPermissions(activePermissions, 'Включен'), {
  timezone: 'Europe/Moscow'
});
cron.schedule('0 18 * * 1-5', () => setChatPermissions(inactivePermissions, 'Выключен'), {
  timezone: 'Europe/Moscow'
});

checkAndSetInitialPermissions();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
