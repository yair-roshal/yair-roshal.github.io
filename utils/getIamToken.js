const jose = require('node-jose')
const private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
const serviceAccountId = process.env.SERVICE_ACCOUNT_ID
const keyId = process.env.KEY_ID
const now = Math.floor(new Date().getTime() / 1000)
const axios = require('axios')

const getIamToken = () => {
    return new Promise((resolve, reject) => {
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
                            console.log('response.data', response.data)
                            IAM_TOKEN = response.data.iamToken
                            resolve(IAM_TOKEN)
                        })
                        .catch((error) => {
                            console.log('AXIOS ERROR_jwt: ', error.response)
                        })
                })
        })
    })
}

module.exports = getIamToken
