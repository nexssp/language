module.exports = (cmd, args, languageExtension, languageSelected) => {
  const spawnOptions = require('../../../lib/config/spawnOptions')
  const compiler = languageSelected.getCompiler()
  const builder = languageSelected.getBuilder()

  const installCommand = `${compiler && compiler.install ? compiler.install : builder.install}`

  const command = `${compiler && compiler.install ? compiler.command : builder.command}`

  const { ensureInstalled } = require('@nexssp/ensure')
  ensureInstalled(command, installCommand, {
    verbose: true,
    progress: cliArgs.progress,
  })

  // Below runs like:
  // Per compiler run command if not exists main run command else display error that is not specified.
  const configPath2 = process.env.NEXSS_HOME_PATH + '/config.json'
  let config2
  if (fs.existsSync(configPath2)) {
    config2 = require(configPath2)
  } else {
    config2 = { languages: {} }
  }

  // First we take from compiler, builder
  let runCommand = (compiler && compiler.run) || (builder && builder.run) || languageSelected['run']

  if (!runCommand) {
    log.error(
      bold(
        `Run command is not setup in the configuration for ${languageSelected.title} and os: ${process.distro}`
      )
    )
    log.info(
      bold(
        `Try to add your own run function. (eg add to the file languageConfig.run='your command to run')`
      )
    )
    log.info(bold(`Config file: ${languageSelected.configFile}`))
    log.info(bold(`Please remember to use --nocache if you change the language config file.`))
    process.exit(1)
  }

  if (Object.prototype.toString.call(runCommand) === `[object Function]`) {
    log.dg(`Running FUNCTION ${argument}(${cliArgs._.join(',')})`)
    runCommand(...cliArgs._)
  } else {
    const pmArguments = process.argv.filter((e) => e !== '--debug').slice(4)

    //   We replace with current compiler exec
    runCommand =
      runCommand && runCommand.replace('<currentCommand>', compiler.command || builder.command)

    const argsEscaped = pmArguments.map((arg) => `"${arg}"`).join(' ')

    const command = `${runCommand} ${argsEscaped}`

    log.dg(`RUN: ${bold(command)}, cwd: ${process.cwd()}`)

    const { nExec } = require('@nexssp/system')
    const result = nExec(command, spawnOptions())

    if (result.exitCode !== 0) {
      if (cliArgs.debug && result.stderr) {
        console.error('There was an error:')
        console.error(result.stderr)
      }
    } else {
      process.stdout.write(result.stdout)
    }
  }
  return true
}
