// const translateText = require('./translateText')
// const getIamToken = require('./getIamToken')

function prepareText(response, randomIndex, word, isOneWord) {
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

module.exports = prepareText
