module.exports = (cmd, args, extension, languageConfig) => {
  const { bold, yellow, green } = require('@nexssp/ansi')
  console.log()
  console.log(yellow('Name: ' + bold(languageConfig.title)))
  console.log(green('Founders: ' + bold(languageConfig.founders.join(', '))))
  console.log(green('Years: ' + bold(languageConfig.years.join(', '))))
  console.log(yellow('Name: ' + languageConfig.description))
  console.log('='.repeat(60))
  const currentCommand = languageConfig.getCompilerOrBuilder(null, true)
  console.log(`Current command: ${bold(currentCommand.command)}`)
  const configPath = require('path').dirname(languageConfig.configFile)
  console.log(`Config path: ${bold(configPath)}`)
  // console.log('extension', a)
  // (null, true) - null - get default compiler, true - continue on error
  const compiler = languageConfig.getCompiler(null, true)
  if (compiler) {
    console.log()
    console.log('='.repeat(60))
    console.log('Compiler:')
    console.table(compiler)
  }

  const builder = languageConfig.getBuilder(null, true)
  if (builder) {
    console.log()
    console.log('='.repeat(60))
    console.log('Builder:')
    console.table(builder)
  }

  const pms = languageConfig.getPackageManager(null, true)
  if (pms) {
    console.log()
    console.log('='.repeat(60))
    delete pms.messageAfterInstallation
    console.log(`commands: nexss ${extension} <command>`)
    Object.keys(pms).forEach((e) => {
      pms[e] = pms[e].replace ? pms[e].replace('<currentCommand>', currentCommand.command) : pms[e]
    })
    console.log(pms)
  }

  console.log(
    `Please use ${bold('help')} and also ${bold('readme')} comamnds to display more info.`
  )

  process.exit(1)
}
