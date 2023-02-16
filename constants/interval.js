const ms = 1000
const sec = 60

const min = 0.1 //10sec
// const min = 1 // 1min
// const min = 10 // 10min
// const min = 30 // 30min

let interval = min * sec * ms

module.exports = [ms, sec, min, interval]
