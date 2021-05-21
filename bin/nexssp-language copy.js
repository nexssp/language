#!/usr/bin/env node
const { ok } = require('@nexssp/logdebug')
const { bold, green } = require('@nexssp/ansi')
const plugin = require('../nexssp_plugin')

const pluginRoot = plugin({ path: __dirname })

console.log(pluginRoot.start())
process.exit(1)
;(() => {
  const _fs = require('fs')
  const _path = require('path')
  const params = require('minimist')(process.argv.slice(2))
  const pkg = require('../package.json')
  console.log(`${pkg.name}@${bold(green(pkg.version))}`)

  console.time(bold(pkg.name))

  // Commands folder
  const NEXSS_COMMANDS_FOLDER = _path.join(__dirname, '../src/cli/commands')

  if (!params._[0] || params._[0] === 'help') {
    console.log('     -- - This will be the option')

    process.exit(0)
  }
  // Check the first parameter for command name
  const command = params._[0]
  const commandFile = `${_path.join(NEXSS_COMMANDS_FOLDER, command)}.js`
  let helpContent = ''
  if (_fs.existsSync(commandFile)) {
    require(commandFile)
  } else {
    const fg = require('fast-glob')
    const files = fg.sync([`${NEXSS_COMMANDS_FOLDER}/*.md`.replace(/\\/g, '/')], {
      ignore: ['!*/**/*.nexss-test.js'],
    })
    const { basename } = require('path')
    const filesList = files.map((f) => basename(f).replace('.md', ''))
    helpContent += `${bold('Commands available')} for nexss-${bold(pkg.name)}

${bold(filesList.join(', '))}
example to display help 'nexss ${pkg.name} ${filesList[0]} help'`
  }
  const { displayMarkdown } = require('../nexssp_plugin')

  displayMarkdown(helpContent.toString())

  // Exists?

  // Check if the second parameter is help

  // const { cache1 } = require('../src/cli/config/cache')
  // const languages = require('../src/language')({ cache: cache1 })
  // const l = languages.start()

  console.timeEnd(bold(pkg.name))
})()

//    const percentage = 100 - (compressed.code.length / code.length) * 100;
// const percentageRounded = Math.round(percentage, 2);
//
