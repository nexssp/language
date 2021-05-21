/**
 * Command, from _router  otherwise directly
 * @param {string} cmd - command (in this case name of the file)
 * @param {array} args - arguments passed from the cli
 * @param {string} languageExtension - dynamic attribute passed eg .js or js
 * @param {object} languageSelected - loaded language definition
 */

module.exports = (cmd, args, languageExtension, languageSelected) => {
  const _params = require('minimist')(process.argv.slice(2))
  const _log = require('@nexssp/logdebug')
  const { blue, bold } = require('@nexssp/ansi')
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

  const { ensureInstalled } = require('@nexssp/ensure')

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
