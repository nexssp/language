module.exports = (fileName, args, languageExtension, languageSelected) => {
  const { nSpawn } = require('@nexssp/system')
  const _log = require('@nexssp/logdebug')
  const _path = require('path')
  const _fs = require('fs')

  const exeFile = _path.resolve(`_nexss/${_path.basename(fileName)}.exe`)

  const compilerOrBuilder = languageSelected.getCompilerOrBuilder()
  compilerOrBuilder.command = compilerOrBuilder.command
  compilerOrBuilder.args = compilerOrBuilder.args
    .replace(/<file>/g, _path.resolve(fileName))
    // .replace(/<destinationPath>/g, dirname(exeFile))
    .replace(/<destinationFile>/g, exeFile)
    .replace(/<destinationDirectory>/g, _path.dirname(exeFile))
    .split(' ')

  if (process.platform === 'win32') {
    if (compilerOrBuilder.command === 'bash' || compilerOrBuilder.command === 'wsl') {
      // on Windows it's using the WSL (Windows Subsystem Linux)
      // So we convert the path to from c:\abc to /mnt/c/abc.....
      const { pathWinToLinux } = require('@nexssp/os/legacy')
      try {
        if (!Array.isArray(compilerOrBuilder.args)) {
          compilerOrBuilder.args = pathWinToLinux(compilerOrBuilder.args)
        } else {
          compilerOrBuilder.args = compilerOrBuilder.args.map((e) => pathWinToLinux(e))
        }
      } catch (error) {
        console.error('args on the compiler: ', compilerOrBuilder.args)
      }
    }
  }

  const commandToRun = `${compilerOrBuilder.command} ${compilerOrBuilder.args.join(' ')}`
  if (compilerOrBuilder.command === 'nexss' && !_fs.existsSync(compilerOrBuilder.args[0])) {
    console.error(`File not found: ${bold(compilerOrBuilder.args[0])}`)
    // console.error(`Command failed: ${bold(commandToRun)}`)
  } else {
    _log.dc(`@language @compile command: ${commandToRun}`)
    nSpawn(commandToRun, { stdio: 'inherit' })
  }

  return true
}
