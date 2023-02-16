const axios = require('axios')

const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN

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
                let textMessage = sendRandomWord(
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

function sendRandomWord(response, randomIndex, word, isOneWord) {
    let examples = ''
    for (const key in response[0].meanings[0].definitions) {
        if (response[0].meanings[0].definitions[key].example != undefined) {
            examples += `- ${response[0].meanings[0].definitions[key].example}
`
        }
    }
    // console.log('translateText(examples)', translateText(examples))

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

    date = new Date()
    console.log(date.toLocaleTimeString(), `--- ${randomIndex + 1}.${word}`)

    return (textMessage =
        // let textMessage =
        `<b>__________________</b>
 <b>${randomIndex + 1}. ${phoneticLine}${word} </b>` +
        '\r\n' +
        '\r\n' +
        `
${exampleLine}
${audioLine}
`)
}

console.log(module)

module.exports = getWordFromDictionary
// module.exports = [  getWordFromDictionary ,sendRandomWord ]

// module.exports = {  getWordFromDictionary }
console.log(module)
