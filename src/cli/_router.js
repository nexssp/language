// This file routes the dynamic path
// for example plugin dyn command b c where dyn is dynamic
// btw we already checked if the command exists

module.exports = (cmd, args, languageExtension, { through }) => {
  if (!cmd) {
    cmd = process.argv[2]
  }
  // We check if language is by extension
  const { language1 } = require('./config/language')
  // isImplementedExtension contains . as
  const isImplementedExtension = language1.isImplementedByExtension(languageExtension)
  if (isImplementedExtension) {
    language1.start()
    console.log('================================')
    const selectedLanguage = language1.byExtension(isImplementedExtension)
    if (selectedLanguage) {
      const commandPath = `${__dirname}/default/commands/${cmd}.js`
      try {
        const command = require(commandPath)
        // As the 4th argument we pass loaded language
        return command(cmd, args, languageExtension, selectedLanguage)
      } catch (e) {
        // console.log(e)
        if (!through) {
          console.log(`Command ${cmd} not found.`)
        }
      }
    }
  } else {
    const commandPath = `${__dirname}/commands/${cmd}.js`

    const command = require(commandPath)
    // As the 4th argument we pass loaded language

    try {
      return command(cmd, args, languageExtension)
    } catch (e) {
      // console.log(e)
      if (!through) {
        console.log(`Command ${cmd} not found.`)
      }
    }
  }
}