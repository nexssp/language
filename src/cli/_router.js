// This file routes the dynamic path
// for example plugin dyn command b c where dyn is dynamic
// btw we already checked if the command exists

module.exports = (cmd, args, languageExtension, { through }) => {
  const getCommandPath = (cmd) => `${__dirname}/default/commands/${cmd}.js`

  const _fs = require('fs')
  const _debug = args.includes('--debug')
  args = args.filter((a) => a !== '--debug')
  const _log = require('@nexssp/logdebug')
  _log.dm('@languages @router cmd, args: ', { cmd, args, languageExtension })
  let aliases = {}
  try {
    aliases = require('../../aliases.json')

    _log.dm('@languages @router finding alias ', cmd, aliases[cmd])
    if (aliases[cmd]) {
      cmd = aliases[cmd]
      _log.dg('@languages @router new alias', cmd)
    }
  } catch (e) {}
  // We check if language is by extension
  const { language1 } = require('./config/language')
  language1.start()
  // isImplementedExtension contains . as
  const isImplementedExtension = language1.isImplementedByExtension(languageExtension)

  _log.dg(
    `@languages @router checking if language ${languageExtension} is implemented`,
    isImplementedExtension
  )

  const defaultCommandPath = getCommandPath('default')
  const compileCommandPath = getCommandPath('compile')

  if (isImplementedExtension) {
    language1.start()
    // console.log('====================================================================')
    const selectedLanguage = language1.byExtension(isImplementedExtension)
    _log.dg(`@languages @router selected language: `, isImplementedExtension)
    if (selectedLanguage) {
      cmd = args[0]
      args = args.slice(1)
      const commandPath = getCommandPath(cmd)

      if (_fs.existsSync(commandPath)) {
        _log.dc(`@languages @router trying run command: `, commandPath)
        const command = require(commandPath)
        return command(cmd, args, languageExtension, selectedLanguage)
      } else {
        _log.dr(`@languages '${cmd}' not found. Trying to load default..`, commandPath)

        if (_fs.existsSync(defaultCommandPath)) {
          const defaultCommand = require(defaultCommandPath)
          return defaultCommand(cmd, args, languageExtension, selectedLanguage)
        }
        if (!through) {
          console.error(`Command ${cmd} not found.`)
        }
      }
    } else {
      _log.dr(`@languages @router error getting data about language: `, isImplementedExtension)
    }
  } else {
    if ((languageSelected = language1.byFilename(languageExtension))) {
      if (_fs.existsSync(compileCommandPath)) {
        const compileCommand = require(compileCommandPath)
        return compileCommand(cmd, args, languageExtension, languageSelected)
      }
    } else {
      // As the 4th argument we pass loaded language
      _log.dr(`@languages @router ??? trying to run command ????`, isImplementedExtension)
      try {
        const commandPath = `${__dirname}/commands/${cmd}.js`
        _log.dr(`Trying to run command: `, commandPath)
        const command = require(commandPath)
        return command(cmd, args, languageExtension)
      } catch (e) {
        // console.log(e)
        if (!through) {
          console.log(`Command ${cmd} not found.`)
        }
      }
    }
  }
}
