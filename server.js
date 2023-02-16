const TelegramBot = require('node-telegram-bot-api')
const dotenv = require('dotenv')
dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN

const dictionaryText = require('./data/dictionaryText.js')
const startMenu = require('./constants/constants.js')
const mainMenu = require('./constants/constants.js')
const getWordFromDictionary = require('./utils/utils.js')
// const { getWordFromDictionary, sendRandomWord } = require('./utils/utils.js')
const axios = require('axios')
var _ = require('lodash')

let date = new Date()
const dictionary = dictionaryText.split(/\r?\n/).filter(Boolean)

const jose = require('node-jose')
const private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
const serviceAccountId = process.env.SERVICE_ACCOUNT_ID
const keyId = process.env.KEY_ID
const now = Math.floor(new Date().getTime() / 1000)
// const say = require('say')

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

        .finally(function () {
            // always executed
        })
}

// const say = require('say')

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
