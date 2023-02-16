const axios = require('axios')



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


module.exports = translateText