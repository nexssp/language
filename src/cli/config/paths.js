const { homedir } = require('os')
const NEXSS_HOME_PATH = process.env.NEXSS_HOME_PATH || `${homedir}/.nexss`
module.exports = { NEXSS_HOME_PATH }
