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

  _log.header('Starting..')
  const languages = _fs.readdirSync('.')

  if (languages.length > 0) {
    languages.forEach((langDir) => {
      if (_fs.existsSync(`${langDir}/.git`)) {
        try {
          checkStatus(langDir)
        } catch (er) {
          _log.error(er)
          process.exit()
        }
      } else {
        _log.info(`${bold(langDir)} is not git repository, ommiting`)
      }
    })
  } else {
    _log.info(`No installed languages has been found.`)
    return
  }

  function checkStatus(cwd) {
    r = nSpawn(`git status`, {
      stdio: 'inherit',
      cwd,
    })
    if (r) {
      r = r.stdout + r.stderr
      if (r.includes('Untracked files') || r.includes('Changes not staged for commit')) {
        console.log(underscore(red(`${bold(cwd)} is not up to date.`)))
        console.log(
          yellow(
            r
              .replace('Untracked files', purple('Untracked files'))
              .replace('Changes not staged for commit', purple('Changes not staged for commit'))
          )
        )
      }
    }
  }
}
