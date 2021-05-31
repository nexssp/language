module.exports = (cmd, args, languageExtension, languageSelected) => {
  const { output } = require('../output')
  output(languageSelected.builders)
  process.exit(0)
}
