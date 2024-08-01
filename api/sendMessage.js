// Файл: api/sendMessage.js
const https = require('https');

module.exports = (req, res) => {
    const url = 'https://api.telegram.org/bot7219473862:AAGz1M9qWzdD04Ffh6LhC-IW2aJ8G_QHbcM/sendMessage?chat_id=-1002073752438&parse_mode=html&text=test';

    https.get(url, (telegramRes) => {
        let data = '';
        telegramRes.on('data', (chunk) => {
            data += chunk;
        });
        telegramRes.on('end', () => {
            res.status(200).send(data);
        });
    }).on('error', (err) => {
        console.error(err);
        res.status(500).send('Error sending message');
    });
};
