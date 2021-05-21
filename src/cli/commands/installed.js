'use strict'
const comma = process.argv.includes('--comma')
const list = process.argv.includes('--list')

module.exports = () => {
  const _log = require('@nexssp/logdebug')
  const { green, bold, yellow } = require('@nexssp/ansi')
  const { language1 } = require('../config/language')
  language1.start()
  const languagesList = language1.getLanguages()
  if (list) {
    for (var key in languagesList) {
      const details = languagesList[key]
      console.log(details.title)
    }
    process.exit()
  } else if (comma) {
    const l = []
    for (var key in languagesList) {
      const details = languagesList[key]
      l.push(details.title)
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
    head: [green('ext'), green('name'), green('descr'), green('url')],
    colWidths: [7, 20, 60, 30],
  })

  for (var key in languagesList) {
    const details = languagesList[key]

    table.push([bold(yellow(key)), bold(details.title), details.description, green(details.url)])
  }

  console.log(table.toString())
}
