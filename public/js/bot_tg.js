const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота
const token = '7096864965:AAHwJnrBVKFA_1by0bRRcWx7TgVpjQbJYGw';
const bot = new TelegramBot(token, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username;

    const appUrl = `https://dankrutg.github.io/ton-eggs-nn/?user_id=${userId}&username=${username}`;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Запустить яйца', url: appUrl }]
            ]
        }
    };

    bot.sendMessage(chatId, 'Нажмите кнопку ниже, чтобы запустить приложение:', options);
});

console.log('Telegram bot is running');
