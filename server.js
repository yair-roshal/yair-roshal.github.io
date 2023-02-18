const TelegramBot = require('node-telegram-bot-api')
const dotenv = require('dotenv')
dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN

const dictionaryText = require('./data/dictionaryText.js')
const startMenu = require('./constants/constants.js')
const mainMenu = require('./constants/constants.js')
// const { ms, sec, interval } = require('./constants/interval.js')

// const { getWordFromDictionary, prepareText } = require('./utils/utils.js')
const axios = require('axios')
var _ = require('lodash')
const getWordFromDictionary = require('./utils/getWordFromDictionary.js')
// const getIamToken = require('./utils/getIamToken.js')

 const dictionary = dictionaryText.split(/\r?\n/).filter(Boolean)

function openStartMenu(chatId) {
    bot.sendMessage(chatId, 'Клавиатура открыта', startMenu)
}

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Приветик, ' + msg.chat.first_name + '!', mainMenu)
    openStartMenu(chatId)
})

bot.onText(/\/keyboard/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Alternative keyboard layout', mainMenu)
})

bot.on('callback_query', (query) => {
    if (query.data === 'development') {
        bot.sendMessage(chatIdAdmin, 'development menu', mainMenu)
    }
    if (query.data === 'lifestyle') {
        bot.sendMessage(chatIdAdmin, 'lifestyle menu', mainMenu)
    }
    if (query.data === 'other') {
        bot.sendMessage(chatIdAdmin, 'other menu', mainMenu)
    }
})

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

const ms = 1000
const sec = 60

const min = 0.1 //10sec
// const min = 1 // 1min
// const min = 10 // 10min
// const min = 30 // 30min

let interval = min * sec * ms

console.log('server started with interval:', interval / ms / sec, ' min')

getWordFromDictionary(dictionary) //first run at the start of the server

setInterval(() => getWordFromDictionary(dictionary), interval) //  start function by interval
