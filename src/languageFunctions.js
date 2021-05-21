// This could be done by Proxies also.
const { getFiles } = require('./lib/fs')
function carryGet (par) {
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
    if (!name) name = allKeys[0]

    if (!continueOnError && !name) {
      return new Error(`${par} seems to be empty for ${this.title}.`)
    }

    this.selected[par] = name

    return name ? this[par] && this[par][name] : false
  }
}

function addFunctions (obj) {
  obj.selected = {}
  obj.getCompiler = carryGet('compilers')
  obj.getBuilder = carryGet('builders')
  obj.getCompilerOrBuilder = function (name) {
    // secont parameter true because we try to find builder as alternative
    return this.getCompiler(name, true) || this.getBuilder(name)
  }

  obj.getTemplatesPath = function (name, customTemplatesPath) {
    const compiler = this.getCompilerOrBuilder(name)
    const templatesFolder =
      customTemplatesPath || compiler.templates || 'templates'

    const templatesPath =
      require('path').dirname(this.configFile) + `/${templatesFolder}`
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
