module.exports = async (cmd, args, languageExtension, languageSelected) => {
  const { nSpawn } = require('@nexssp/system')
  const _log = require('@nexssp/logdebug')

  const { spawn } = require('child_process')
  const compiler = languageSelected.getCompiler()

  const compilerCommand = compiler.command
  const compilerArgs = compiler.args.replace('<file>', cmd) + ' ' + args.join(' ')

  console.log({ compilerCommand })
  console.log({ compilerArgs })
  process.exit(1)

  _log.dc(`@language @compile command: ${compilerCommand} ${compilerArgs}`)

  const sleep = require('util').promisify(setTimeout)
  await sleep(3000)

  console.log('Compile!!!!', cmd, args)
  return true
}
