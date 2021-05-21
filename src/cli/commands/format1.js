'use strict'

/*
 * @description: Produce json with installed languages with logos in one folder
 */
module.exports = async () => {
  const { dirname, join, extname, resolve } = require('path')

  let sharp

  try {
    sharp = require('sharp')
  } catch (e) {
    const { nSpawn } = require('@nexssp/system')
    const installPath = resolve(join(__dirname, '../../../'))

    console.log(`Installing sharp..`)
    nSpawn('npm install sharp', {
      stdio: 'inherit',
      cwd: installPath,
    })
    console.log('Re-run function.')
    process.exit(0)
  }
  if (!sharp) {
    console.error(
      `There was an issue with installing sharp. Try to install it manually 'npm install sharp -D'`
    )
    process.exit(1)
  }
  const { language1 } = require('../config/language')
  const _log = require('@nexssp/logdebug')

  language1.start()
  const languagesList = language1.getLanguages()

  const imageWith = 100

  const {
    readdirSync,
    existsSync,
    mkdirSync,
    // copyFileSync,
    writeFileSync,
  } = require('fs')

  const resultPath = join(process.cwd(), 'result')
  const logosPath = join(resultPath, 'images', 'logos')
  if (!existsSync(resultPath)) {
    mkdirSync(resultPath, '0777', true)
  }

  mkdirSync(logosPath, { recursive: true })

  console.log('Copying logos and create json data...')
  console.log(`Result path: ${resultPath}`)
  console.log(`Logos path: ${logosPath}`)

  _log.info(`Installed languages`)
  let res = []
  for (var key in languagesList) {
    const details = languagesList[key]

    const languagePath = dirname(details.configFile)
    const logoPath = join(languagePath, 'images')
    let logoFileName
    if (existsSync(logoPath)) {
      const logos = readdirSync(logoPath).filter((e) => e.includes('logo'))
      const logo = logos[0] ? logos[0] : null

      if (logo) {
        logoFileName =
          details.title
            .replace(/\+/g, 'p')
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase() + extname(logo)
        const destLogo = `${logosPath}/${logoFileName}`
        // copyFileSync(`${logoPath}/${logo}`, destLogo);

        await sharp(`${logoPath}/${logo}`).resize(imageWith).toFile(destLogo)
      } else {
        console.log(`logo does not exist: ${languagePath}`)
      }
      details.repo = `https://github.com/nexssp/language_${details.title}`

      details.repo = details.repo.replace('Auto Hot Key', 'autohotkey')
      details.repo = details.repo.replace('Windows Scripting Host', 'windowshostscript')
      details.repo = details.repo.replace('TCL/TK', 'tcltk')
      details.repo = details.repo.replace('Python 3', 'python')
      details.repo = details.repo.replace('Pure Data', 'puredata')
      details.repo = details.repo.replace('C++', 'cpp')
      details.repo = details.repo.replace('Coffee Script', 'coffee')

      details.repo = details.repo.toLowerCase()
      console.log(details.repo)
      if (!details.years) {
        console.log(`years does not exist: ${languagePath}`)
      }

      // Language can have multiple extensions and appear few times
      // on the list
      const check = res.filter((e) => e.url === details.url)
      if (check.length) {
        res = res.map((e) => {
          if (e.url === details.url) {
            if (Array.isArray(e.extensions)) {
              e.extensions.push(key)
            } else {
              e.extensions = [e.extensions, key]
            }
          }
          return e
        })
        continue
      }

      res.push({
        alt: details.title,
        url: details.url,
        extensions: [key],
        logo: `${logoFileName}`,
        years: details.years,
        founders: details.founders,
        repo: details.repo,
      })
    } else {
      console.log(`not found: ${logoPath}`)
    }
  }

  writeFileSync(`${resultPath}/languages.json`, JSON.stringify(res, null, 2))
  process.exit(1)
}
