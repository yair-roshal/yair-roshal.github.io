const TelegramBot = require('node-telegram-bot-api');
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, {polling: true});

// Словарь слов
const dictionary = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

// Отправляет случайное слово из словаря
function sendRandomWord() {
  const randomIndex = Math.floor(Math.random() * dictionary.length);
  const word = dictionary[randomIndex];
  bot.sendMessage('YOUR_CHAT_ID', word);
}

// Запускает функцию sendRandomWord раз в час
setInterval(sendRandomWord, 60 * 60 * 1000);