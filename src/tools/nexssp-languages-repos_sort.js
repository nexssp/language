console.log('Order repos by key/language extension.')
const file = '../nexssp-languages-repos.json'
const list = require(file)

const orderedList = Object.keys(list)
  .sort()
  .reduce((obj, key) => {
    obj[key] = list[key]
    return obj
  }, {})

if (JSON.stringify(list) !== JSON.stringify(orderedList)) {
  console.log('Saved list is not sorted.. saving sorted list to file..')
  require('fs').writeFileSync(`${__dirname}/${file}`, JSON.stringify(orderedList, null, 2))
} else {
  console.log('List is already sorted. Nothing to do..')
}
console.log(`Total repositories: ${Object.keys(orderedList).length}`)
