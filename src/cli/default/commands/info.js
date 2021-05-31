module.exports = (cmd, args, languageExtension, languageSelected) => {
  const json = process.argv.includes('--json')
  const info = {
    title: languageSelected.title,
    url: languageSelected.url,
    description: languageSelected.description,
    extensions: languageSelected.extensions,
    configFile: languageSelected.configFile,
  }
  const { output } = require('../output')
  output(info)
  process.exit(0)

  process.exit(0)
}
