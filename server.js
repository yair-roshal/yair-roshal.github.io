const TelegramBot = require('node-telegram-bot-api')
const dotenv = require('dotenv')
dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = 386212074
const dictionaryText = require('./data/dictionaryText.js')
const startMenu = require('./constants/constants.js')
const mainMenu = require('./constants/constants.js')
const axios = require('axios')
var _ = require('lodash')

let date = new Date()
const dictionary = dictionaryText.split(/\r?\n/).filter(Boolean)

// https://api.dictionaryapi.dev/api/v2/entries/en/hello

function getWord() {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    let word = dictionary[randomIndex]
    const wordEng = word.split('-')[0].trim()
    // say.speak(wordEng)

    console.log('word all ---', word)
    word_first = wordEng.split(' ')[0]
    console.log('word first ---', word_first)
    let isOneWord = true
    if (wordEng.split(' ').length > 1) {
        isOneWord = false
    }
    axios
        .get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word_first)
        .then(function (response) {
            // console.log('response.data ', response.data)
            sendRandomWord(response.data, randomIndex, word, isOneWord)
        })
        .catch(function (error) {
            // handle error
            console.log(error)
        })
        .finally(function () {
            // always executed
        })
}

function sendRandomWord(response, randomIndex, word, isOneWord) {
    // console.log('response[0] ', response[0])
    // console.log('response[0].phonetic ', response[0].phonetic)
    console.log('response[0].phonetics ', response[0].phonetics)
    // console.log('response[0].phonetics.text ', response[0].phonetics[1].text)
    // console.log('response[0].phonetics.audio ', response[0].phonetics[1].audio)
    // console.log('response[0].meanings ', response[0].meanings[0].partOfSpeech)
    // console.log('response[0].meanings ', response[0].meanings[0].definitions)
    // console.log('response[0].meanings ', response[0].meanings[0].definitions[0].example)

    let examples = ''
    for (const key in response[0].meanings[0].definitions) {
        if (response[0].meanings[0].definitions[key].example != undefined) {
            examples += `- ${response[0].meanings[0].definitions[key].example}
`
        }
    }

    let phonetic = ''
    for (const key in response[0].phonetics) {
        if (response[0].phonetics[key].text != undefined) {
            phonetic = response[0].phonetics[key].text
        }
    }
    let audio = ''
    for (const key in response[0].phonetics) {
        if (response[0].phonetics[key].audio != undefined) {
            audio = response[0].phonetics[key].audio
        }
    }
    let phoneticLine = phonetic
        ? `${phonetic} - `
        : response[0]?.phonetic
        ? `${response[0]?.phonetic} - `
        : ''
    phoneticLine = isOneWord ? phoneticLine : ''

    let exampleLine = examples ? `${examples}` : ''
    let audioLine = audio
        ? `${audio}`
        : response[0]?.phonetics[1]?.audio
        ? `${response[0]?.phonetics[1]?.audio}`
        : ''

    let textMessage =
        `<b>${randomIndex + 1}. ${phoneticLine}${word} </b>` +
        `
        
        
        
${exampleLine}
${audioLine}
`

    bot.sendMessage(chatIdAdmin, textMessage, { parse_mode: 'HTML' })

    date = new Date()
    console.log(date.toLocaleTimeString(), `--- ${randomIndex + 1}.${word}`)
}

// const say = require('say')

// https://api.dictionaryapi.dev/api/v2/entries/en/hello

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

// const min = 0.1 //10sec
const min = 1 // 1min
// const min = 30 // 30min

let interval = min * sec * ms

console.log('server started with interval:', interval / ms / sec, ' min')

getWord()//первый запуск при  старте сервера
setInterval(getWord, interval) //  запуск getWord по интервалу
