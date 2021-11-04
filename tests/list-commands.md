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
