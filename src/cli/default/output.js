exports.output = (v) => {
  const json = process.argv.includes('--json')
  if (json) {
    console.info(JSON.stringify(v))
  } else {
    console.info(v)
  }
}
