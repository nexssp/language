module.exports = (cmd, args, extension, languageConfig) => {
  const { bold } = require('@nexssp/ansi')

  const { toTerminal } = require('@nexssp/markdown')
  const readmePath = `${require('path').dirname(languageConfig.configFile)}/README.md`

  console.log(toTerminal(require('fs').readFileSync(readmePath).toString()))

  console.log(
    `Please use ${bold('help')} and also ${bold('readme')} comamnds to display more info.`
  )

  process.exit(1)
}
