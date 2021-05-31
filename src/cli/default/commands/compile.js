module.exports = (fileName, args, languageExtension, languageSelected) => {
  const { nSpawn } = require('@nexssp/system')
  const _log = require('@nexssp/logdebug')
  const _path = require('path')

  const exeFile = _path.resolve(`_nexss/${_path.basename(fileName)}.exe`)

  const compilerOrBuilder = languageSelected.getCompilerOrBuilder()

  const compilerOrBuilderCommand = compilerOrBuilder.command
  const compilerOrBuilderArgs = compilerOrBuilder.args
    .replace(/<file>/g, _path.resolve(fileName))
    // .replace(/<destinationPath>/g, dirname(exeFile))
    .replace(/<destinationFile>/g, exeFile)
    .replace(/<destinationDirectory>/g, _path.dirname(exeFile))
    .split(' ')

  const commandToRun = `${compilerOrBuilderCommand} ${compilerOrBuilderArgs.join(' ')}`
  _log.dc(`@language @compile command: ${commandToRun}`)
  nSpawn(commandToRun, { stdio: 'inherit' })

  // const sleep = require('util').promisify(setTimeout)
  // await sleep(3000)

  return true
}
