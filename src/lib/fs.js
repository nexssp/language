const getFiles = (source) => {
  const fs = require('fs')
  const { join } = require('path')
  return fs
    .readdirSync(source)
    .filter((name) => !fs.lstatSync(join(source, name)).isDirectory())
}

module.exports = { getFiles }
