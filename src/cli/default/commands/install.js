/**
 * Command, from _router  otherwise directly
 * @param {string} cmd - command (in this case name of the file)
 * @param {array} args - arguments passed from the cli
 * @param {string} languageExtension - dynamic attribute passed eg .js or js
 * @param {object} languageSelected - loaded language definition
 */

const { inherits } = require('util')

module.exports = (cmd, args, languageExtension, languageSelected) => {
  const _params = require('minimist')(process.argv.slice(2))
  const { ensureInstalled } = require('@nexssp/ensure')
  const _log = require('@nexssp/logdebug')
  const { blue, bold } = require('@nexssp/ansi')
  const { isEmpty } = require('@nexssp/data')
  const { nExecTerminal, nExec } = require('@nexssp/system')
  const { remove } = require('@nexssp/extend/array')

  if (!isEmpty(args)) {
    const pm = languageSelected.getPackageManager()
    const existCommand = pm.install || pm.version || pm.installed
    const pmCommand = existCommand.split(' ')[0]

    if (!pm.install) {
      _log.warn(`command 'install' is not defined for ${pmCommand}`)
      console.log(`Available commands: ${Object.keys(pm)}`)
      return
    }

    const dry = args.includes('--dry')

    // get command from install or version. One of them m

    if (pm.installation.indexOf('installed') === -1) {
      ensureInstalled(pmCommand, pm.installation, {
        progress: true /**args.includes('--progress') */,
      })
    }

    args = remove(args, '--progress')
    args = remove(args, '--debug')
    args = remove(args, '--dry')

    const commandToRun = `${pm.install} ${args.join(' ')}`
    if (dry) {
      console.log(commandToRun)
      return commandToRun
    }
    // We use package manager install
    nExecTerminal(pm.install, { stdio: 'inherit' })

    console.log('MESSAGE AFTER INSTALLATION:\n', pm.messageAfterInstallation)

    return true
  }

  const compiler = languageSelected.getCompiler()
  let builder
  if (args.includes('--builder')) {
    builder = languageSelected.getBuilder()
  }

  const installCommand = `${
    compiler && compiler.install ? compiler.install : builder.install
  } ${args.join(' ')}`

  const command = `${compiler && compiler.install ? compiler.command : builder.command} ${args.join(
    ' '
  )}`

  let p = ensureInstalled(command, installCommand, {
    verbose: true,
    progress: _params.progress,
  })
  if (p) {
    _log.info(`${blue(bold(languageSelected.title))} is installed at:\n${p}`)
    process.exitCode = 0
    return true
  } else {
    _log.error(`There was an error during installation and file cannot be found.`)
    _log.error(`command not found: ${command}
installation by: ${installCommand}`)
    process.exitCode = 1
  }
}
