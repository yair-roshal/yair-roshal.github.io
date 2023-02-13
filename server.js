const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(token, { polling: true })
const YOUR_CHAT_ID = 386212074

// const token = '6209657165:AAGifVt0gs11dAHGQ2Uz3yAz_s5u0st5arY'
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TELEGRAM_BOT_TOKEN;
 
 const dictionaryText = require('./data/dictionaryText.js')


// text = [address, city, state, zip].filter(Boolean).join(", ");

// let dic =dictionaryText.split(/\r?\n/).filter(Boolean).join(", ")
let dictionary = dictionary.concat(dictionaryText.split(/\r?\n/)).filter(Boolean)
console.log('dictionary', dictionary)

const addWordsKeyboard = {
  reply_markup: {
    inline_keyboard: [[
      {
        text: 'Add words',
        callback_data: 'add_words'
      }
    ]]
  }
}

bot.on('callback_query', query => {
  if (query.data === 'add_words') {
    bot.sendMessage(YOUR_CHAT_ID, 'Please send me the words, separated by newlines.', addWordsKeyboard)
  }
})

bot.on('message', msg => {
  if (!dictionary.includes(msg.text)) {
    dictionary = dictionary.concat(msg.text.split(/\r?\n/))
    bot.sendMessage(YOUR_CHAT_ID, `Successfully added "${msg.text}" to the dictionary.`)
  }
})

function sendRandomWord() {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    const word = dictionary[randomIndex]
    bot.sendMessage(YOUR_CHAT_ID, word)
}

setInterval(sendRandomWord, 30 * 60 * 1000)