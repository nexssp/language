module.exports = (command, args, a, b) => {
  // Below to implement - default run of compiler. lke `nexss js` or `nexssp-language js`
  console.log({ command, args, a, b })
  process.exit(1)
}
