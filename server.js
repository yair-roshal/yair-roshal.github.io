const TelegramBot = require('node-telegram-bot-api')
const token = '6209657165:AAGifVt0gs11dAHGQ2Uz3yAz_s5u0st5arY'
const bot = new TelegramBot(token, { polling: true })
const YOUR_CHAT_ID = 386212074

let dictionary = ['apple', 'banana', 'cherry', 'date', 'elderberry']

bot.onText(/\/add (.+)/, (msg, match) => {
  const words = match[1].split(/\r?\n/)
  dictionary = dictionary.concat(words)
  bot.sendMessage(YOUR_CHAT_ID, `Successfully added "${words}" to the dictionary.`)
})

function sendRandomWord() {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    const word = dictionary[randomIndex]
    bot.sendMessage(YOUR_CHAT_ID, word)
}

setInterval(sendRandomWord, 6 * 1 * 1000)