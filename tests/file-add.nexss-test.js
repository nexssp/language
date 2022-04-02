const nexsspLangCmd = `node ${require('path').resolve(
  __dirname.replace(/\\/g, '/'),
  '../bin/nexssp-language'
)}`

module.exports = {
  defaultTestFunction: 'nSpawn',
  nexsstests: [
    {
      params: [`${nexsspLangCmd} js e`, /File empty.js has been created./],
    },
    {
      params: [`${nexsspLangCmd} js d`, /File default.js has been created./],
    },
    {
      params: [`${nexsspLangCmd} js h`, /File helloWorld.js has been created./],
    },
    // {
    //   params: [`${nexsspLangCmd} f a my1.js --default`, /File my1.js has been created./],
    // },
    // {
    //   params: [`${nexsspLangCmd} f a my2.js --empty`, /File my2.js has been created./],
    // },
    // {
    //   params: [`${nexsspLangCmd} f a my3.js --helloWorld`, /File my3.js has been created./],
    // },
  ],
}
