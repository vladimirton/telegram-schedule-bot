const axios = require('axios');

const sendMessage = async () => {
  try {
    const response = await axios.get('https://api.telegram.org/bot7219473862:AAGz1M9qWzdD04Ffh6LhC-IW2aJ8G_QHbcM/sendMessage', {
      params: {
        chat_id: '-1002073752438',
        parse_mode: 'html',
        text: 'test'
      }
    });

    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

sendMessage();
