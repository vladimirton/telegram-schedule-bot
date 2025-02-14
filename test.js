const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const moment = require('moment-timezone');
const app = express();
const port = process.env.PORT || 3000;

const botToken = "7219473862:AAGz1M9qWzdD04Ffh6LhC-IW2aJ8G_QHbcM";
const chatId = "-1002073752438";
let currentChatStatus = 'Неизвестно';

const openTime = process.env.OPEN_TIME || '11:25';  // время открытия чата
const closeTime = process.env.CLOSE_TIME || '18:00'; // время закрытия чата
const activeDays = (process.env.ACTIVE_DAYS || '1,2,3,4,5').split(','); // дни недели, когда чат активен

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
    const response = await axios.post(url, { chat_id: chatId, permissions: perms });
    console.log('Permissions set successfully:', response.data);
    currentChatStatus = status;
  } catch (error) {
    console.error('Error in setting chat permissions:', error.response ? error.response.data : error.message);
  }
}

function getMoscowTime() {
  const moscowMoment = moment().tz("Europe/Moscow");
  return {
    dateTime: moscowMoment.format('HH:mm'),
    weekDay: moscowMoment.format('d')  // 0 for Sunday, 6 for Saturday
  };
}

function dayOfWeek(dayNumber) {
  const days = {
    '1': 'Понедельник',
    '2': 'Вторник',
    '3': 'Среда',
    '4': 'Четверг',
    '5': 'Пятница',
    '6': 'Суббота',
    '0': 'Воскресенье'
  };
  return days[dayNumber] || 'Неизвестный день';
}

function checkAndSetInitialPermissions() {
  const moscowTime = getMoscowTime();
  const currentHour = moscowTime.dateTime;
  const day = moscowTime.weekDay;
  if (activeDays.includes(day)) {
    const isOpen = currentHour >= openTime && currentHour < closeTime;
    setChatPermissions(isOpen ? 'Включен' : 'Выключен');
  } else {
    setChatPermissions('Выключен');
  }
}

app.get('/', (req, res) => {
  const moscowTime = getMoscowTime();
  res.send(`Current date and time in Moscow: ${dayOfWeek(moscowTime.weekDay)}, ${moscowTime.dateTime}<br>
            Current chat status: ${currentChatStatus}<br>
            Open time: ${openTime}<br>
            Close time: ${closeTime}<br>
            Active days: ${activeDays.map(day => dayOfWeek(day)).join(', ')}`);
});

cron.schedule(`${openTime.split(':')[1]} ${openTime.split(':')[0]} * * ${activeDays.join(',')}`, () => {
  console.log('Cron job triggered to enable chat permissions');
  setChatPermissions('Включен');
}, { timezone: 'Europe/Moscow' });

cron.schedule(`${closeTime.split(':')[1]} ${closeTime.split(':')[0]} * * ${activeDays.join(',')}`, () => {
  console.log('Cron job triggered to disable chat permissions');
  setChatPermissions('Выключен');
}, { timezone: 'Europe/Moscow' });

checkAndSetInitialPermissions();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
