# @nexssp/language

Programming Languages database, templates, info..

## Note

This Nexss Programmer's plugin is the effect of the refactoring the Nexss Programmer **@nexssp/cli** which development has been started in 2018. This module can be used also _separately_ without the Nexss Programmer.

## Commands

```
nexssp-language [ext] readme # new - displays README.md for the selected [ext] language
nexssp-language [ext] help

nexssp-language list
nexssp-language [ext] install # install language from over 50 of them, see above list
nexssp-language installed # installed languages

nexssp-language update # update languages definition to the latest version
nexssp-language status # status - handy for dev of the languages
```

# Available commands

Below you can use also like:

- **nexssp-language** (if installed by npm i -g @nexssp/language)
- **nexss language** (if **Nexss Programmer** is installed by @npm i -g @nexssp/cli)
- **nexss l** (installed Nexss Programmer)
- **npx @nexssp/language**

For development very handy is **node ./bin/nexssp-language.js**

```sh
# display help
node ./bin/nexssp-language.js
node ./bin/nexssp-language.js php help # displays extra info about language like founder, year, path to config and much more..
node ./bin/nexssp-language.js php readme # displays README.md for the language

# run repl for the language example of NodeJS
node ./bin/nexssp-language.js js
node ./bin/nexssp-language.js py

# run repl for the language example of NodeJS and python
node ./bin/nexssp-language.js js run "console.log(1+1)"
node ./bin/nexssp-language.js py run "print(1+1)"

# List available languages
node ./bin/nexssp-language.js list

# List installed languages
node ./bin/nexssp-language.js installed

# create empty file from templates
node ./bin/nexssp-language.js js e

# create helloWorld from templates
node ./bin/nexssp-language.js js h

# create default from templates
node ./bin/nexssp-language.js js d

# display all available compilers
node ./bin/nexssp-language.js js compilers

# display all available builders
node ./bin/nexssp-language.js js builders

# display all available language package managers
node ./bin/nexssp-language.js js pm

# set default compiler: node
node ./bin/nexssp-language.js js default compiler node

# unset default compiler
node ./bin/nexssp-language.js js default compiler unset

## Development - display status of the modified languages
node ./bin/nexssp-language.js status

## Development - update to the latest versions through git
node ./bin/nexssp-language.js update

## Development - generate logos and json files with all information (eg for website)
node ./bin/nexssp-language.js format1
```

### Example: nexssp-language installed

Over 50 programming languages to choose.

![image](https://user-images.githubusercontent.com/53263666/119171081-63df3300-ba64-11eb-941c-4eda7f428b3c.png)

### Example: nexssp-language list

List of supported languages

![image](https://user-images.githubusercontent.com/53263666/119171287-a7d23800-ba64-11eb-9ce5-6c590fe1d47f.png)

## Repositories

@nexssp/language usege external repositories for all languages. List of them is located in the `src/nexssp-language-repos.json` file.

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

## Troubleshooting

### Environment variables

- **NEXSS_LANGUAGE_ENABLE_PROJECT_FOLDER** - enable also search in current/project folder

```js
process.env.NEXSS_LANGUAGE_ENABLE_PROJECT_FOLDER = true
```
