'use strict'
const comma = process.argv.includes('--comma')
const list = process.argv.includes('--list')

module.exports = () => {
  const { language1 } = require('../config/language')
  const _log = require('@nexssp/logdebug')
  const { green, bold, yellow } = require('@nexssp/ansi')
  language1.start()
  const languagesList = language1.list()
  const cliArgs = require('minimist')(process.argv.slice(2))

  if (cliArgs.repo && !cliArgs.comma && !cliArgs.list) {
    console.error('Specify the --comma or --list.')
    process.exit(1)
  }

  if (list) {
    for (var key in languagesList) {
      console.log(cliArgs.repo ? languagesList[key] : key)
    }
    process.exit()
  } else if (comma) {
    const l = []
    for (var key in languagesList) {
      l.push(cliArgs.repo ? languagesList[key] : key)
    }
    const s = new Set(l)
    const arr = Array.from(s)
    console.log(arr.join(', '))
    console.log(arr.length)
    process.exit()
  }

  _log.info(`Installed languages`)
  const Table = require('cli-table3')
  const table = new Table({
    head: [green('ext'), green('repository')],
    colWidths: [10, 73],
  })
  const extensions = Object.keys(languagesList)
  extensions.forEach((extension) => {
    table.push([bold(yellow(extension)), bold(languagesList[extension])])
  })

  console.log(table.toString())
}
