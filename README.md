# @nexssp/languagess

Programming Languages database, templates, info..

## Note

This module is an effect of the refactoring the Nexss Programmer **@nexssp/cli** which development has been started in 2018. This module can be used also _separately_ without the Nexss Programmer.

## Repositories

@nexssp/language usege external repositories for all languages. List of them is located in the `src/nexssp-languages-repos.json` file.

```js
const languages = require('@nexssp/languages')

console.log(languages.list()) // Displays all available languages (extensions and repositories associated)
console.log(languages.languageNames()) // From start, @nexssp/languages has no languages installed. They are installed on demand, so here you will have a lit of installed languages.

// Select language
const selectedLanguage = languages.byFilename('myfile.js') // Gets information by Extension
const selectedLanguage = languages.byExtension('js') // Gets information by Extension

// Compilers
selectedLanguage.compiler() // Gets default compiler
selectedLanguage.compiler('python3') // Gets named compiler
selectedLanguage.compiler('python3', true) // Will continue on error (second parameter true)
selectedLanguage.builder() // Gets builder information, also as above
selectedLanguage.getCompilerOrBuilder() // Will find compiler, if not there will find builder

selectedLanguage.config() // Gets while config
```
