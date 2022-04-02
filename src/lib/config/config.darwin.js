const c = require('./config.base')
c.osPackageManagers = {
  brew: {
    installation:
      '/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"',
    installCommand: 'brew install',
  },
}
c.compilerInstallation = 'brew install'

c.dist = 'macOS'
module.exports = c
