const TelegramBot = require('node-telegram-bot-api');
const token = '6209657165:AAGifVt0gs11dAHGQ2Uz3yAz_s5u0st5arY';
const bot = new TelegramBot(token, {polling: true});
const YOUR_CHAT_ID="386212074"

// Словарь слов
const dictionary = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

// Отправляет случайное слово из словаря
function sendRandomWord() {
  const randomIndex = Math.floor(Math.random() * dictionary.length);
  const word = dictionary[randomIndex];
  bot.sendMessage(YOUR_CHAT_ID, word);
}

// Запускает функцию sendRandomWord раз в час
setInterval(sendRandomWord, 6 * 1 * 1000);//10sec
// setInterval(sendRandomWord, 60 * 1 * 1000);//minute
// setInterval(sendRandomWord, 60 * 60 * 1000);//hour