const config = require('@nexssp/config')
const { NEXSS_HOME_PATH } = require('./paths')
config1 = new config({ type: 'json', configPath: NEXSS_HOME_PATH + '/config.json' })

module.exports = { config1 }
