const axios = require('axios')
const {
    source_language,
    target_language,
} = require('../constants/languages.js')

async function translateText(texts, IAM_TOKEN) {
    const body = {
        sourceLanguageCode: source_language,
        targetLanguageCode: target_language,
        texts: texts,
        folderId: process.env.folder_id,
    }

    // console.log('body', body)
    // console.log('IAM_TOKEN', IAM_TOKEN)

    const headers = { headers: { Authorization: `Bearer ${IAM_TOKEN}` } }

    await axios
        .post(
            'https://translate.api.cloud.yandex.net/translate/v2/translate',
            body,
            headers,
        )
        .then((response) => {
            translate = response.data.translations[0].text
            console.log('translate000', translate)
            return translate
            // resolve(translate)
        })
        .catch((error) => {
            console.log('ERROR_translate: ')
            // console.log('ERROR_translate: ', error.response)
        })

        .finally(function () {
            // always executed
        })
}

module.exports = translateText
