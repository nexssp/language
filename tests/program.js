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

const { cache1 } = require('../src/cli/config/cache')
const languages = require('../src/language')({ cache: cache1 })
const l = languages.start()

// Get config for all installed languages
const listAllConfigs = languages.getLanguages()
// console.log(listAllConfigs)

const listofAllAvailable = languages.list()
// console.log(listofAllAvailable)

// const names = languages.languageNames();
// console.log(names);

const selectedLanguage = languages.byExtension('.py')
const selectedLanguage2 = languages.byExtension('.cpp')
const selectedLanguage3 = languages.byExtension('.exs')

// We have get Compiler selected then getTemplateList will return templates for selected compiler
selectedLanguage.getCompiler('blender')
console.log(selectedLanguage.getTemplatesList()) // Display list of last selected compiler
// console.log(selectedLanguage.getTemplatesList("python2")); // Display list of the templates of the python2 compiler/or builder

// console.log("getCompiler", selectedLanguage.getCompiler("python37"));
// console.log("getBuilder", selectedLanguage2.getBuilder());
// console.log("getCompilerOrBuilder", selectedLanguage2.getCompilerOrBuilder());

// console.log(selectedLanguage2.config()); // Gets while config
// console.log(selectedLanguage2.config()); // Gets logo path (locally)

console.log('done!! program.js')
