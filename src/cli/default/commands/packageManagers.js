module.exports = (cmd, args, languageExtension, languageSelected) => {
  const { output } = require('../output')
  output(languageSelected.languagePackageManagers)
  process.exit(0)
}
