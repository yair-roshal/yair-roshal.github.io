const axios = require('axios')
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const prepareMessage = require('./prepareMessage')

const getWordFromDictionary = (dictionary) => {
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    let wordLineDictionary = dictionary[randomIndex]
    const leftEnglishWords = wordLineDictionary.split('-')[0].trim()
    console.log('________________________')
    firstEnglishWord = leftEnglishWords.split(' ')[0]
    // console.log('firstEnglishWord -->', firstEnglishWord)

    let isEnglishLanguage
    if (/[a-zA-Z]/.test(firstEnglishWord)) {
        // console.log('only english char')
        isEnglishLanguage = true
    } else {
        // console.log('not only english char')
        isEnglishLanguage = false
    }

    let isOneWord = true
    if (leftEnglishWords.split(' ').length > 1) {
        isOneWord = false
    }

    isEnglishLanguage &&
        isOneWord &&
        axios
            .get(
                'https://api.dictionaryapi.dev/api/v2/entries/en/' +
                    firstEnglishWord,
            )
            .then(function (response) {
                prepareMessage(
                    response.data,
                    randomIndex,
                    wordLineDictionary,
                    isOneWord,
                    firstEnglishWord,
                ).then((textMessage) => {
                    // console.log('textMessage1111', textMessage)
                    bot.sendMessage(chatIdAdmin, textMessage, {
                        parse_mode: 'HTML',
                    })
                })

                // let textMessage = prepareMessage(
                //     response.data,
                //     randomIndex,
                //     wordLineDictionary,
                //     isOneWord,
                //     firstEnglishWord,
                // )

                // bot.sendMessage(chatIdAdmin, textMessage, {
                //     parse_mode: 'HTML',
                // })
            })
            .catch(function (error) {
                console.log(
                    'error_api.dictionaryapi.dev for word : ' +
                        firstEnglishWord,
                )
                console.log('axios_error_api.dictionaryapi ===', error)
            })
}

console.log(module)

// module.exports = [  getWordFromDictionary ,prepareMessage ]
// module.exports = {  getWordFromDictionary }
module.exports = getWordFromDictionary

console.log(module)
