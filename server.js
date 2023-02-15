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

const axios = require('axios')
const jose = require('node-jose')
const private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
const serviceAccountId = process.env.SERVICE_ACCOUNT_ID
const keyId = process.env.KEY_ID
const now = Math.floor(new Date().getTime() / 1000)

const payload = {
    aud: 'https://iam.api.cloud.yandex.net/iam/v1/tokens',
    iss: serviceAccountId,
    iat: now,
    exp: now + 3600,
}

let IAM_TOKEN

jose.JWK.asKey(private_key, 'pem', { kid: keyId, alg: 'PS256' }).then(function (result) {
    jose.JWS.createSign({ format: 'compact' }, result)
        .update(JSON.stringify(payload))
        .final()
        .then(function (result) {
            const jwt_token = result

            const body = {
                //  includes only one of the fields `yandexPassportOauthToken`, `jwt`
                // "yandexPassportOauthToken": process.env.OAUTH_TOKEN,
                jwt: jwt_token,
                // end of the list of possible fields
            }

            axios
                .post('https://iam.api.cloud.yandex.net/iam/v1/tokens', body)
                .then((response) => {
                    // console.log('response.data', response.data)
                    IAM_TOKEN = response.data.iamToken
                })
                .catch((error) => {
                    console.log('AXIOS ERROR_jwt: ', error.response)
                })
        })
})

function translateText(texts) {
    const body = {
        sourceLanguageCode: process.env.source_language,
        targetLanguageCode: process.env.target_language,
        texts: texts,
        folderId: process.env.folder_id,
    }

    const headers = { headers: { Authorization: `Bearer ${IAM_TOKEN}` } }

    axios
        .post('https://translate.api.cloud.yandex.net/translate/v2/translate', body, headers)
        .then((response) => {
            translate = response.data.translations[0].text
            console.log('translate==', translate)
        })
        .catch((error) => {
            console.log('ERROR_translate: ', error.response)
        })
}

function getWord() {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    let wordLineDictionary = dictionary[randomIndex]
    const leftEnglishWords = wordLineDictionary.split('-')[0].trim()
    // say.speak(leftEnglishWords)

    console.log('wordLineDictionary -->', wordLineDictionary)
    firstEnglishWord = leftEnglishWords.split(' ')[0]
    console.log('firstEnglishWord -->', firstEnglishWord)

    let isOneWord = true
    if (leftEnglishWords.split(' ').length > 1) {
        isOneWord = false
    }
    axios
        .get('https://api.dictionaryapi.dev/api/v2/entries/en/' + firstEnglishWord)
        .then(function (response) {
            // console.log('response.data ', response.data)
            sendRandomWord(response.data, randomIndex, wordLineDictionary, isOneWord)
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

    let exampleLine = examples && isOneWord ? `${examples}` : ''

    let audioLine =
        audio && isOneWord
            ? `${audio}`
            : response[0]?.phonetics[1]?.audio
            ? `${response[0]?.phonetics[1]?.audio}`
            : ''

    let textMessage =
        `<b>__________________</b>
        ` +
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
// const min = 1 // 1min
const min = 10 // 10min
// const min = 30 // 30min

let interval = min * sec * ms

console.log('server started with interval:', interval / ms / sec, ' min')

getWord() //первый запуск при  старте сервера
setInterval(getWord, interval) //  запуск getWord по интервалу
