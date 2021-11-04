/**
 * default
 * @param {string} cmd - command (in this case name of the file)
 * @param {array} args - arguments passed from the cli
 * @param {string} languageExtension - dynamic attribute passed eg .js or js
 * @param {object} languageSelected - loaded language definition
 */

const { is } = require('@nexssp/data')

module.exports = (cmd, args, languageExtension, languageSelected) => {
  // const { isEmpty } = require('@nexssp/data')
  // if (cmd && isEmpty(args)) {
  //   _log.dc(`@language @cli/default no arguments passed for :`, { languageExtension })

  // }
  const { perLanguage } = require('../../../lib/perLanguage')
  perLanguage(languageExtension, cmd, args, languageSelected)

  const _log = require('@nexssp/logdebug')
  _log.dc(`@language @cli/default @default:`, { cmd, args })
  const { nSpawn } = require('@nexssp/system')
  const params = process.argv.includes('--force') || process.argv.includes('-f') ? ` -f` : ''
  const dry = process.argv.includes('--dry')

  const { remove } = require('@nexssp/extend/array')
  args = remove(args, '-f')
  args = remove(args, '--force')
  args = remove(args, '--progress')
  args = remove(args, '--debug')
  args = remove(args, '--dry')

  // Loads quick template creation functions nexss php d for default, h for helloWorld, e for empty
  let commandToRun
  switch (cmd) {
    case 'e':
      commandToRun = `nexss file add empty.${languageExtension} --empty${params}`
      break
    case 'h':
      // Java has HelloWorld as it is required to work as className.
      if (languageExtension !== 'java') {
        commandToRun = `nexss file add helloWorld.${languageExtension} --helloWorld${params}`
      } else {
        commandToRun = `nexss file add HelloWorld.${languageExtension} --HelloWorld${params}`
      }
      break
    case 'd':
      if (languageExtension !== 'java') {
        commandToRun = `nexss file add default.${languageExtension} --default${params}`
      } else {
        commandToRun = `nexss file add Default.${languageExtension} --Default${params}`
      }
      break
  }

  if (!commandToRun) {
    const pm = languageSelected.getPackageManager()
    let existCommand = (!is('function', pm.install) && pm.install) || pm.version || pm.installed

    const compilerOrBuilder = languageSelected.getCompilerOrBuilder().command

    if (existCommand) {
      if (existCommand.indexOf('<currentCommand>') !== -1) {
        existCommand = existCommand.replace('<currentCommand>', compilerOrBuilder)
      }

      // const pmCommand = existCommand.split(' ')[0]
      const action = pm[cmd]

      if (is('function', action)) {
        commandToRun = action(args)
      } else if (action) {
        commandToRun = `${action} ${args.join(' ')}`
      }
    }

    // if (!action) {
    //   _log.warn(`command '${cmd}' is not defined for ${pmCommand}`)
    //   console.log(`Available commands: ${Object.keys(pm)}`)
    //   return
    // }

    if (!commandToRun) {
      commandToRun = languageSelected.getCompiler().shell
    }

    if (!commandToRun) {
      commandToRun = compilerOrBuilder
    }
  }

  if (dry) {
    console.log(commandToRun)
    process.exit()
  }

  if (commandToRun) {
    nSpawn(commandToRun, {
      stdio: 'inherit',
    })
    return
  }

  return true
}
