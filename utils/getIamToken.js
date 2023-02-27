const jose = require('node-jose')
const private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
// var fs = require('fs')
// var key = fs.readFileSync(require.resolve(private_key))
const serviceAccountId = process.env.SERVICE_ACCOUNT_ID
const keyId = process.env.KEY_ID
const now = Math.floor(new Date().getTime() / 1000)
const axios = require('axios')

let IAM_TOKEN

async function changeTokenToIAM(body) {
    try {
        const result = await axios
            .post('https://iam.api.cloud.yandex.net/iam/v1/tokens', body)
            .then((response) => {
                // console.log('response.data', response.data)
                let IAM_TOKEN = response.data.iamToken
                // console.log('new IAM_TOKEN====', IAM_TOKEN)
                return IAM_TOKEN
            })
        return result
    } catch (error) {
        console.log('AXIOS ERROR_jwt: ', error.response)
    }
}

const getIamToken = () => {
    const payload = {
        aud: 'https://iam.api.cloud.yandex.net/iam/v1/tokens',
        iss: serviceAccountId,
        iat: now,
        exp: now + 3600,
    }

    jose.JWK.asKey(private_key, 'pem', { kid: keyId, alg: 'PS256' }).then(
        function (result) {
            jose.JWS.createSign({ format: 'compact' }, result)
                .update(JSON.stringify(payload))
                .final()
                .then(function (result) {
                    const jwt_token = result
                    // console.log('jwt_token', jwt_token)
                    const body = {
                        //  includes only one of the fields `yandexPassportOauthToken`, `jwt`
                        // "yandexPassportOauthToken": process.env.OAUTH_TOKEN,
                        jwt: jwt_token,
                        // end of the list of possible fields
                    }

                    changeTokenToIAM(body).then((res) => {
                        // console.log('res_changeTokenToIAM:', res)
                        IAM_TOKEN = res
                        // console.log('IAM_TOKEN111_changeTokenToIAM:', IAM_TOKEN)
                        // return IAM_TOKEN
                    })
                })
        },
    )
    console.log('IAM_TOKEN4444', IAM_TOKEN)
    return IAM_TOKEN
}

module.exports = getIamToken
