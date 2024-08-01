const axios = require('axios');

// Функция для установки разрешений чата
async function setChatPermissions(botToken, chatId, permissions) {
  const url = `https://api.telegram.org/bot${botToken}/setChatPermissions`;
  const params = {
    chat_id: chatId,
    permissions: permissions
  };

  try {
    const response = await axios.post(url, params);
    console.log('Permissions update response:', response.data);
  } catch (error) {
    console.error('Error in setting chat permissions:', error.response ? error.response.data : error.message);
  }
}

const botToken = '7219473862:AAGz1M9qWzdD04Ffh6LhC-IW2aJ8G_QHbcM'; // Токен вашего бота
const chatId = '-1002073752438'; // ID вашего чата

// Параметры разрешений, которые вы хотите установить
const permissions = {
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
  can_manage_topics: false  // Управление темами (если это возможно)
};

// Вызов функции для установки разрешений
setChatPermissions(botToken, chatId, permissions);
