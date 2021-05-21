// TODDO: Later to add async functions below.
module.exports = () => {
  const { nSpawn } = require('@nexssp/system')
  const _log = require('@nexssp/logdebug')
  const _fs = require('fs')
  const { bold, yellow } = require('@nexssp/ansi')
  const { language1 } = require('../config/language')

  language1.start()
  language1.installDeps()

  const NEXSS_LANGUAGES_PATH = language1.getPath()
  process.chdir(NEXSS_LANGUAGES_PATH)

  const languages = _fs.readdirSync('.')
  languages.forEach((langDir) => {
    _log.info(yellow(`Updating ${langDir}..`))
    const command = `git pull --rebase`
    if (_fs.existsSync(`${langDir}/.git`)) {
      const packageJson = require('path').join(langDir, 'package.json')
      nSpawn(command, { cwd: langDir, stdio: 'inherit' })
      if (_fs.existsSync(packageJson)) {
        nSpawn('npm install', { cwd: langDir, stdio: 'inherit' })
      }

      _log.success(`Language updated`)
      try {
      } catch (er) {
        console.log(`There was an error on command: ${bold(command)}, folder: ${bold(langDir)}`, er)
        // error(er);
        return
      }
    } else {
      _log.warn('it is not git repository, ommiting')
    }
  })
}
