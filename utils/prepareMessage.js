// const translateText = require('./translateText')
// const getIamToken = require('./getIamToken')
const axios = require('axios')

function prepareMessage(
    response,
    randomIndex,
    word,
    isOneWord,
    firstEnglishWord,
) {
    let examples = ''
    for (const key in response[0].meanings[0].definitions) {
        if (response[0].meanings[0].definitions[key].example != undefined) {
            examples += `- ${response[0].meanings[0].definitions[key].example}
`
        }
    }

    // getIamToken().then((token) => {
    //     console.log('token===', token)
    //     // console.log('translateText ', translateText(examples, token))

    //     return translateText(examples, token)
    // })

    let phonetic = ''
    for (const key in response[0].phonetics) {
        if (response[0].phonetics[key].text != undefined) {
            phonetic = response[0].phonetics[key].text
        }
    }

    let audio

    for (const key in response[0].phonetics) {
        if (response[0].phonetics[key].audio != undefined) {
            audio = response[0].phonetics[key].audio
        }
    }

    if (!audio) {
        audio = `https://translate.google.com.vn/translate_tts?ie=UTF-8&q=${firstEnglishWord}&tl=en&client=tw-ob`
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
        `<b>__________________</b>
 <b>${randomIndex + 1}. ${phoneticLine}${word} </b>` +
        '\r\n' +
        '\r\n' +
        `
${exampleLine}
<a href="${audioLine}">.</a>
<b>__________________</b>`)
}

module.exports = prepareMessage
