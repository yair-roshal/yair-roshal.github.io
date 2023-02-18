const axios = require('axios')
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const prepareText = require('./prepareText')

const getWordFromDictionary = (dictionary) => {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    let wordLineDictionary = dictionary[randomIndex]
    const leftEnglishWords = wordLineDictionary.split('-')[0].trim()
    console.log('_______________->')
    firstEnglishWord = leftEnglishWords.split(' ')[0]
    console.log('firstEnglishWord -->', firstEnglishWord)

    let isEnglishLanguage
    if (/[a-zA-Z]/.test(firstEnglishWord)) {
        console.log('only english char')
        isEnglishLanguage = true
    } else {
        console.log('not only english char')
        isEnglishLanguage = false
    }

    let isOneWord = true
    if (leftEnglishWords.split(' ').length > 1) {
        isOneWord = false
    }

    isEnglishLanguage &&
        isOneWord &&
        axios
            .get('https://api.dictionaryapi.dev/api/v2/entries/en/' + firstEnglishWord)
            .then(function (response) {
                // console.log('response.data ', response.data)
                let textMessage = prepareText(
                    response.data,
                    randomIndex,
                    wordLineDictionary,
                    isOneWord,
                )

                bot.sendMessage(chatIdAdmin, textMessage, { parse_mode: 'HTML' })
            })
            .catch(function (error) {
                // handle error
                // console.log('axios_error_api.dictionaryapi')
                // handle error
                console.log('axios_error_api.dictionaryapi===', error)
            })
            .finally(function () {
                // always executed
            })
}

console.log(module)

// module.exports = [  getWordFromDictionary ,prepareText ]
// module.exports = {  getWordFromDictionary }
module.exports = getWordFromDictionary

console.log(module)
