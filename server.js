const TelegramBot = require('node-telegram-bot-api')
// const token = '6209657165:AAGifVt0gs11dAHGQ2Uz3yAz_s5u0st5arY'
const dotenv = require('dotenv')
dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = 386212074

const dictionaryText = require('./data/dictionaryText.js')
let date = new Date()

// const say = require('say')

// text = [address, city, state, zip].filter(Boolean).join(", ");

// let dic =dictionaryText.split(/\r?\n/).filter(Boolean).join(", ")

let dictionary = dictionaryText.split(/\r?\n/).filter(Boolean)
// console.log('dictionary', dictionary)

function openKlava(chatId) {
    bot.sendMessage(chatId, 'Клавиатура открыта', {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: 'Классика',
                    },
                    {
                        text: 'Закрыть',
                    },
                ],
                [
                    {
                        text: 'Заказать разработку бота',
                        request_contact: true,
                    },
                ],
                [
                    {
                        text: 'Про автора',
                    },
                ],
            ],
            one_time_keyboard: true,
        },
    })
}

bot.onText(/\/keyboard/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Alternative keybaord layout', MainMenu)
})

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Приветик, ' + msg.chat.first_name + '!')
    openKlava(chatId)
})

bot.on('callback_query', (query) => {
    if (query.data === 'development') {
        bot.sendMessage(chatIdAdmin, 'development menu', MainMenu)
    }
    if (query.data === 'lifestyle') {
        bot.sendMessage(chatIdAdmin, 'lifestyle menu', MainMenu)
    }
    if (query.data === 'other') {
        bot.sendMessage(chatIdAdmin, 'other menu', MainMenu)
    }
})

const MainMenu = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Development',
                    callback_data: 'development',
                },
                {
                    text: 'Lifestyle',
                    callback_data: 'lifestyle',
                },
                {
                    text: 'Other',
                    callback_data: 'other',
                },
            ],
        ],
        // keyboard: [['Sample text', 'Second sample'], ['Keyboard'], ["I'm robot"]],
        resize_keyboard: true,
        one_time_keyboard: true,
        force_reply: true,
    },
}

//отправив список слов добавляем их в словарь
bot.on('message', (msg) => {
    console.log('msg.text===', msg.text)
    if (msg.text == '/start') {
        bot.sendMessage(chatIdAdmin, `Server-Bot successfully started  `)
    } else if (!dictionary.includes(msg.text) && msg.text !== '/start') {
        dictionary = dictionary.concat(msg.text.split(/\r?\n/))
        bot.sendMessage(chatIdAdmin, `Successfully added "${msg.text}" to the dictionary.`)
    }
})

function sendRandomWord() {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    const word = dictionary[randomIndex]
    const wordEng = word.split('-')[0].trim()
    // say.speak(wordEng)

    bot.sendMessage(chatIdAdmin, `${randomIndex + 1}. ${word}`)

    date = new Date()
    console.log(date.toLocaleTimeString(), `--- ${randomIndex + 1}.${word}`)
}
const ms = 1000
const sec = 60
const min = 1

let interval = min * sec * ms

console.log('server started with interval:', interval / ms / sec, ' min')

// setInterval(sendRandomWord, 30 * 60 * 1000)// 30min
setInterval(sendRandomWord, interval) //10sec
