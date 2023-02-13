const TelegramBot = require('node-telegram-bot-api')
// const token = '6209657165:AAGifVt0gs11dAHGQ2Uz3yAz_s5u0st5arY'
const dotenv = require('dotenv')
dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token, { polling: true })
const YOUR_CHAT_ID = 386212074

const dictionaryText = require('./data/dictionaryText.js')
const date = new Date()

// const say = require('say')

// text = [address, city, state, zip].filter(Boolean).join(", ");

// let dic =dictionaryText.split(/\r?\n/).filter(Boolean).join(", ")

let dictionary = dictionaryText.split(/\r?\n/).filter(Boolean)
// console.log('dictionary', dictionary)

const addWordsKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Add words',
                    callback_data: 'add_words',
                },
            ],
        ],
    },
}

bot.on('callback_query', (query) => {
    if (query.data === 'add_words') {
        bot.sendMessage(
            YOUR_CHAT_ID,
            'Please send me the words, separated by newlines.',
            addWordsKeyboard,
        )
    }
})

//отправив список слов добавляем их в словарь
bot.on('message', (msg) => {
    console.log('msg.text===', msg.text)
    if (msg.text == '/start') {
        bot.sendMessage(YOUR_CHAT_ID, `Server-Bot successfully started  `)
    } else if (!dictionary.includes(msg.text) && msg.text !== '/start') {
        dictionary = dictionary.concat(msg.text.split(/\r?\n/))
        bot.sendMessage(YOUR_CHAT_ID, `Successfully added "${msg.text}" to the dictionary.`)
    }
})

function sendRandomWord() {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    const word = dictionary[randomIndex]
    const wordEng = word.split('-')[0].trim()
    // say.speak(wordEng)

    bot.sendMessage(YOUR_CHAT_ID, `${randomIndex + 1}. ${word}`)

    date = new Date()
    console.log(date.toLocaleTimeString(), `--- ${randomIndex + 1}.  ${word}`)
}
const ms = 1000
const sec = 60
const min = 1

let interval = min * sec * ms

console.log('interval:', interval / ms / sec, ' min')

// setInterval(sendRandomWord, 30 * 60 * 1000)// 30min
setInterval(sendRandomWord, interval) //10sec
