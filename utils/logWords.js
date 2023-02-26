let fs = require('fs')
let dictionaryText = require('../data/dictionaryText')
let appendFile = require('node:fs')
const getPathLogs = require('./getPathLogs')

module.exports = function logWords(wordLine) {
    let nameFileLog = 'log-words.txt'

    let path = getPathLogs()
    fs.appendFile(`${path}${nameFileLog}`, wordLine + '\r\n', (err) => {
        if (!err) {
            console.log(`log for word [ ${wordLine} ] added`)
        } else {
            console.log(err)
        }
    })
}
