// This could be done by Proxies also.
const { getFiles } = require('./lib/fs')
const { NEXSS_HOME_PATH } = require('./cli/config/paths')
const fs = require('fs')
function carryGet(par) {
  return function (name, continueOnError) {
    const allKeys = Object.keys(this[par])

    //   If there was used we have name of the compiler already
    if (!name && this.selected[par]) {
      name = this.selected[par]
    }

    if (!continueOnError && name && !this[par][name]) {
      return new Error(
        `${par} => '${name}' has not been setup for ${this.title}.\nAvailable values for ${this.title} => ${par}: ` +
          allKeys.join(', ')
      )
    }

    if (!name) {
      const configPath = NEXSS_HOME_PATH + '/config.json'
      let config

      name = allKeys[0]
      // We check if the compiler, builder or any other exists in the config (NEXSS_HOME_PATH + '/config.json')
      // The compiler can be set by nexss py default compiler 'name' and it is setup in the above path.
      if (fs.existsSync(configPath)) {
        config = require(configPath)
        if (config.languages) {
          const extension = this.extensions[0].slice(1)
          const selectedLang = config.languages[extension]
          const selectedPar = selectedLang && selectedLang[par]
          if (selectedPar) {
            // TODO: Check if selected exists..
            name = selectedPar
          }
        }
        // par
      } else {
        config = { languages: {} }
      }
    }

    if (!continueOnError && !name) {
      return new Error(`${par} seems to be empty for ${this.title}.`)
    }

    this.selected[par] = name

    return name ? this[par] && this[par][name] : false
  }
}

function addFunctions(obj) {
  obj.selected = {}
  obj.getCompiler = carryGet('compilers')
  obj.getBuilder = carryGet('builders')
  obj.getPackageManager = carryGet('languagePackageManagers')
  obj.getCompilerOrBuilder = function (name) {
    // second parameter true because we try to find builder as alternative
    return this.getCompiler(name, true) || this.getBuilder(name)
  }

  obj.getTemplatesPath = function (name, customTemplatesPath) {
    const compiler = this.getCompilerOrBuilder(name)
    const templatesFolder = customTemplatesPath || compiler.templates || 'templates'

    const templatesPath = require('path').dirname(this.configFile) + `/${templatesFolder}`
    return templatesPath
  }

  obj.getTemplatesList = function (name) {
    return getFiles(this.getTemplatesPath(name))
  }

  obj.config = function () {
    return this
  }

  obj.path = function () {
    return path.dirname(this.configFile)
  }

  return obj
}

module.exports = { addFunctions }
