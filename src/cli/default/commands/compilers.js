module.exports = (cmd, args, languageExtension, languageSelected) => {
  const { output } = require('../output')
  output(languageSelected.compilers)
  process.exit(0)
}
