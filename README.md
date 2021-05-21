# @nexssp/languagess

Programming Languages database, templates, info..

## Note

This Nexss Programmer's plugin is the effect of the refactoring the Nexss Programmer **@nexssp/cli** which development has been started in 2018. This module can be used also _separately_ without the Nexss Programmer.

## Commands

```sh
nexssp-languages list
nexssp-languages [ext] install # install language from over 50 of them, see above list
nexssp-languages installed # installed languages

nexssp-languages update # update languages definition to the latest version
nexssp-languages status # status - handy for dev of the languages
```

### Example: nexssp-languages installed

Over 50 programming languages to choose.

![image](https://user-images.githubusercontent.com/53263666/119171081-63df3300-ba64-11eb-941c-4eda7f428b3c.png)

### Example: nexssp-languages list

List of supported languages

![image](https://user-images.githubusercontent.com/53263666/119171287-a7d23800-ba64-11eb-9ce5-6c590fe1d47f.png)

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
