'use strict'
/* eslint-disable space-before-function-paren, comma-dangle */

/**
 * Copyright © 2018-2021 Nexss.com / Marcin Polak mapoart@gmail.com. All rights reserved.
 * This source code is governed by MIT license, please check LICENSE file.
 */

// Below is used in the configurations of the implemented languages
// We do that to not have them separate the same deps
// We will removed them in the later stages.
if (!process.distro) {
  // We check if they are loaded.
  const { nConst } = require('@nexssp/const')
  const os = require('@nexssp/os')
  nConst('distro', os.name(), process)
  nConst('distroVersion', os.v(), process)
  nConst('sudo', os.sudo(), process)
  nConst('distros', os.distros, process)
  nConst('replacePMByDistro', os.replacePMByDistro, process)
  const tags = os.tags()
  // Below tags are for distro recognition.
  nConst('distroTag1', tags[0], process)
  nConst('distroTag2', tags[1], process)
}

/**
 * Creates functionality for Nexss Languages.
 * @constructor
 * @param {string} cache
 * @param {string} progress - It will show progress of the installations eg. git
 */

function nexssLanguages({ cache, cacheDuration, progress } = {}) {
  const NEXSS_LANGUAGES_PATH =
    process.env.NEXSS_LANGUAGES_PATH || require('os').homedir() + '/.nexss/languages'
  let _paths = []
  let _fs
  let _path
  let _log
  const _cache = cache
  const _progress = progress
  let _started
  let _cacheDuration = !!cacheDuration || '1y'

  const { bold, red, yellow, green } = require('@nexssp/ansi')

  const getPath = () => {
    return _path.normalize(NEXSS_LANGUAGES_PATH)
  }

  const start = () => {
    if (_started) {
      return _paths
    }
    _fs = require('fs')
    _path = require('path')
    _log = require('@nexssp/logdebug')
    // == We start a cache
    if (_cache) {
      _cache.start()
    }

    if (!_fs.existsSync(NEXSS_LANGUAGES_PATH)) {
      _fs.mkdirSync(NEXSS_LANGUAGES_PATH, { recursive: true })
    }

    const languagePathGlob = ['**', `*.${process.platform}.nexss.config.js`]

    // ../languages/php/win32.nexss.config.js
    _paths.push(_path.join(__dirname, '..', ...languagePathGlob).replace(/\\/g, '/'))
    _paths.push(_path.join(NEXSS_LANGUAGES_PATH, ...languagePathGlob).replace(/\\/g, '/'))

    // Specific for Nexss Programmer Project
    if (process.env.NEXSS_PROJECT_PATH && process.env.NEXSS_LANGUAGES_ENABLE_PROJECT_FOLDER) {
      _paths.push(
        _path
          .join(_path.resolve(process.env.NEXSS_PROJECT_PATH), ...languagePathGlob)
          .replace(/\\/g, '/')
      )
    }
    _started = true

    return _paths
  }

  const getLanguagesConfigFiles = (pathsArray) => {
    return require('fast-glob').sync(pathsArray)
  }

  const setupConfigs = () => {
    const copyIfNotExists = [
      ['./lib/config/config.base.js', NEXSS_LANGUAGES_PATH],
      [`./lib/config/config.${process.platform}.js`, NEXSS_LANGUAGES_PATH],
    ]

    copyIfNotExists.forEach(([src, dest]) => {
      const destination = _path.join(dest, _path.basename(src))
      if (!_fs.existsSync(destination)) {
        _fs.copyFileSync(_path.join(__dirname, src), destination)
      }
    })
  }

  const parseConfigs = (files) => {
    const result = {}
    for (const file of files) {
      const normalizedFile = _path.normalize(file)
      let content
      try {
        content = require(normalizedFile)
      } catch (e) {
        console.error(
          bold(red('! >>> There is an issue with the file:')),
          bold(normalizedFile),
          e.stack
        )
        // console._log(
        //   bold(red(e.stack.split("\n").filter((e) => ~e.indexOf(file))[0]))
        // );
        // process.exit(0);
        process.exit(1)
      }

      if (!content || !content.extensions) {
        console.error('File has no .extensions which should be an array.', normalizedFile)
        process.exitCode = 1
        return
      }
      content.extensions.forEach((languageExtension) => {
        result[languageExtension] = content
        result[languageExtension].configFile = normalizedFile
      })
    }

    return result
  }

  const getLanguages = (recreateCache) => {
    const getLanguagesCacheName = 'nexss_core_getLanguages__.json'

    // Cache L1 - memory
    if (process.languages && !recreateCache) {
      _log.dm('¦ Reading all languages data from cache.')
      return process.languages
    } else {
      _log.dm('¦ making configuration for all language config.')
      _log.dy(`/¦ if you want to use also current/project folder for searching languages config files
please use environment variable NEXSS_LANGUAGES_ENABLE_PROJECT_FOLDER.`)
    }

    // Cache L2 - file
    if (_cache && !recreateCache && _cache.exists(getLanguagesCacheName, _cacheDuration)) {
      _log.dm(`¦ Reading all languages data from FILE cache: ${getLanguagesCacheName}.`)
      process.languages = _cache.readJSON(getLanguagesCacheName)
      return process.languages
    }

    const files = getLanguagesConfigFiles(_paths)

    setupConfigs()

    const configParsedContent = parseConfigs(files) || {}

    // Store only if there is something in the cache
    if (_cache && Object.keys(configParsedContent).length > 0) {
      _cache.writeJSON(getLanguagesCacheName, configParsedContent)
    }

    process.languages = configParsedContent
    return configParsedContent
  }

  const list = () => {
    return require('./nexssp-languages-repos.json')
  }

  const names = (colored) => {
    const languages = getLanguages()
    const keys = Object.keys(languages)
    if (languages) {
      if (colored) {
        return keys
          .map(
            (language) =>
              `${bold(language)} ${yellow(
                bold(languages[language].url.replace('https://', ''))
              )} - ${languages[language].description}`
          )
          .sort()
      } else {
        return keys
          .map(
            (language) =>
              `${language} ${languages[language].url.replace('https://', '')} - ${
                languages[language].description
              }`
          )
          .sort()
      }
    }
  }

  const installDeps = () => {
    const { ensureInstalled } = require('@nexssp/ensure')
    const config = require(`./lib/config/config.${process.platform}`)
    const osPM = config.osPackageManagers[Object.keys(config.osPackageManagers)[0]]
    ensureInstalled(osPM.keyOfItem, osPM.installation, {
      progress: _progress,
    })
    ensureInstalled('git', `${osPM.install ? osPM.install : osPM.installCommand} git`, {
      progress: _progress,
    })
  }

  /**
   * Checks if extension is implemented. It checks with without . and with .
   * so you can pass .php and php and it will check for it.
   * @param {string} extension - eg. .php or php so it checks if the extension exists.
   * @returns extension with the . eg .js, .php if language is implemented.
   */
  const isImplementedByExtension = (extension) => {
    const listImplemented = list()
    for (const [ext, repository] of Object.entries(listImplemented)) {
      if (`${ext}` === `.${extension}` || `${ext}` === `${extension}`) {
        return ext
      }
    }
  }

  const byExtension = (ext, recreateCache) => {
    const { addFunctions } = require('./languageFunctions')
    if (ext) {
      // Cache L1
      if (!recreateCache && process.languages && process.languages[ext]) {
        _log.dm(`¦ Reading language (ext: ${process.languages[ext].title}) data from cache.`)
        const decoratedLanguage = addFunctions(process.languages[ext])
        return decoratedLanguage
      } else {
        _log.dm(`¦ Reading language config (ext: ${ext})`)
      }

      let language
      const getLanguageCacheName = `nexss_core_getLanguages_${ext}_.json`
      if (_cache && !recreateCache && _cache.exists(getLanguageCacheName, _cacheDuration)) {
        language = _cache.readJSON(getLanguageCacheName)

        // _log.dg(`[CACHE] Read JSON`);
      } else {
        language = getLanguages(recreateCache)
        if (!language) {
          _log.error(
            'There was an error with loading languages. Do you see any other errors above?'
          )
          return
        }
        language = language[ext]
      }

      if (!language) {
        _log.dy('[CACHE] recreate cache')
        console.log(
          green(
            bold(`New extension '${bold(ext)}', checking online repository for implementation..`)
          )
        )

        const langRepositories = require('./nexssp-languages-repos.json')

        if (langRepositories[ext]) {
          installDeps()

          const repoName = _path.basename(langRepositories[ext])
          const repoPath = `${NEXSS_LANGUAGES_PATH}/${repoName}`
          const { nSpawn } = require('@nexssp/system')

          const repoPathPackageJson = _path.join(repoPath, 'package.json')
          const repoPathNodeModules = _path.join(repoPath, 'node_modules')
          if (_fs.existsSync(repoPath)) {
            console.log(
              `Language seems to be already there. Updating repo silently at:\n${bold(repoPath)}`
            )
            try {
              // We trying update the repo with the latest version as already there
              nSpawn(`git -C ${repoPath} pull -q`, {
                stdio: 'inherit',
              })

              // This language has extra packages, we install/update them
              if (_fs.existsSync(repoPathPackageJson) && !_fs.existsSync(repoPathNodeModules)) {
                console._log(`Installing packages for ${repoPath}`)
                nSpawn('npm install', {
                  stdio: 'inherit',
                  cwd: repoPath,
                })
              }
            } catch (e) {
              console.error(e)
              process.exit()
            }
          } else {
            try {
              nSpawn(`git clone --depth=1 ${langRepositories[ext]} ${repoPath}`, {
                stdio: 'inherit',
              })

              // This language has extra packages, we install them
              if (_fs.existsSync(repoPathPackageJson) && !_fs.existsSync(repoPathNodeModules)) {
                nSpawn('npm install', {
                  stdio: 'inherit',
                  cwd: repoPath,
                })
              }
            } catch (error) {
              if ((error + '').indexOf('Command failed: git clone') > -1) {
                console.error(`Issue with the repository: ${bold(langRepositories[ext])}`, error)

                process.exit(1)
              }
            }
          }

          _log.info(`Implementation for '${ext}' has been installed.`)

          _cache && _cache.del('nexss_core_getLanguages__.json')
          _cache && _cache.del(`nexss_core_getLanguages_${ext}_.json`)
          const x = getLanguages(true)
          const distName = process.distro
          if (!x[ext]) {
            _log.error(
              'Error:',
              bold(ext),
              'is not implemented for',
              bold(process.platform) + (distName ? ' ' + distName : ''),
              'platform.'
            )
            process.exit(1)
          }

          language = byExtension(ext)
          if (process.platform !== 'win32') {
            if (language.dist !== distName) {
              // This is different distribution probably no setup for other then Ubuntu
              _log.warn(
                `Your linux distribution ${bold(
                  distName
                )} is not configured for the extension ${bold(
                  ext
                )}. Default configuration will be used (It may appears with errors and finally not working properly). To see configuration use 'nexss ${bold(
                  ext.replace('.', '')
                )} config'`
              )
            }
          }
        } else {
          _log.warn(
            `Nexss online Github repository: Support for language with extension ${ext} has not been found. Please consider installing it manually.`
          )
          process.exit(0)
        }
      }

      if (!language) {
        _log.warn(`File with extension ${ext} is not supported.`)
      }

      cache.writeJSON(getLanguageCacheName, language)

      if (!process.languages) process.languages = {}
      process.languages[ext] = language

      const decoratedLanguage = addFunctions(language)

      return decoratedLanguage
    }
  }

  const byFilename = (name, recreateCache) => {
    const ext = require('path').extname(name)
    return byExtension(ext, recreateCache)
  }

  return {
    getPath,
    getLanguages,
    byFilename,
    byExtension,
    isImplementedByExtension,
    names,
    list,
    start,
    installDeps,
  }
}

module.exports = nexssLanguages
