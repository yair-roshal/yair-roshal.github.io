const axios = require('axios')

function translateText(texts, IAM_TOKEN) {
    
    return new Promise((resolve, reject) => {
        
        
        const body = {
            sourceLanguageCode: process.env.source_language,
            targetLanguageCode: process.env.target_language,
            texts: texts,
            folderId: process.env.folder_id,
        }
    
        console.log('body', body)
        console.log('IAM_TOKEN', IAM_TOKEN)
        
        const headers = { headers: { Authorization: `Bearer ${IAM_TOKEN}` } }
    
        axios
            .post('https://translate.api.cloud.yandex.net/translate/v2/translate', body, headers)
            .then((response) => {
                translate = response.data.translations[0].text
                console.log('translate==', translate)
                resolve(translate)
            })
            .catch((error) => {
                console.log('ERROR_translate: ', error.response)
                console.log('ERROR_translate: ')
            })
    
            .finally(function () {
                // always executed
            }) 
        
        
    })
    

}

module.exports = translateText
