const { cache1 } = require('./cache')
const language = require('../../language')
const language1 = language({ cache: cache1 })

module.exports = { language1 }
