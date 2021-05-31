module.exports = (cmd, args, languageExtension, languageSelected) => {
  const { output } = require('../output')
  output(languageSelected)
  process.exit(0)
}
