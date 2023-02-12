// replace the value below with the Telegram token you receive from @BotFather
const token = '6209657165:AAGifVt0gs11dAHGQ2Uz3yAz_s5u0st5arY'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});



// const TelegramBot = require('node-telegram-bot-api')
// const token = '6209657165:AAGifVt0gs11dAHGQ2Uz3yAz_s5u0st5arY'
// const bot = new TelegramBot(token, { polling: true })
// const YOUR_CHAT_ID = 386212074

// import { config } from 'dotenv'
// import express from 'express'
 
// config()
// const app = express()

// app.use(express.json())
// app.use(
//   express.urlencoded({
//     extended: true
//   })
// )

// // Словарь слов
// const dictionary = ['apple', 'banana', 'cherry', 'date', 'elderberry']

// // Отправляет случайное слово из словаря
// function sendRandomWord() {
//     const randomIndex = Math.floor(Math.random() * dictionary.length)
//     const word = dictionary[randomIndex]
//     bot.sendMessage(YOUR_CHAT_ID, word)

//     // bot.getChat(YOUR_CHAT_ID).then(function (msg) {
//     //     console.log('11111')
//     // })
// }

// // Запускает функцию sendRandomWord раз в час
// setInterval(sendRandomWord, 6 * 1 * 1000) //10sec
// // setInterval(sendRandomWord, 60 * 1 * 1000);//minute
// // setInterval(sendRandomWord, 60 * 60 * 1000);//hour


// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })