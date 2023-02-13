


const TelegramBot = require('node-telegram-bot-api')
const token = '6209657165:AAGifVt0gs11dAHGQ2Uz3yAz_s5u0st5arY'
const bot = new TelegramBot(token, { polling: true })
const YOUR_CHAT_ID = 386212074

import { config } from 'dotenv'
import express from 'express'
 
config()
const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

// Словарь слов
const dictionary = ['apple', 'banana', 'cherry', 'date', 'elderberry']

// Отправляет случайное слово из словаря
function sendRandomWord() {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    const word = dictionary[randomIndex]
    bot.sendMessage(YOUR_CHAT_ID, word)

    // bot.getChat(YOUR_CHAT_ID).then(function (msg) {
    //     console.log('11111')
    // })
}

// Запускает функцию sendRandomWord раз в час
setInterval(sendRandomWord, 6 * 1 * 1000) //10sec
// setInterval(sendRandomWord, 60 * 1 * 1000);//minute
// setInterval(sendRandomWord, 60 * 60 * 1000);//hour


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})