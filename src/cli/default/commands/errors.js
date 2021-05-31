module.exports = (cmd, args, languageExtension, languageSelected) => {
  const { output } = require('../output')
  output(languageSelected.errors)
  process.exit(0)
}
