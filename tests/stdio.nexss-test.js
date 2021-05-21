module.exports = {
  nexsstests: [
    {
      type: 'shouldContain',
      params: [
        `node ${__dirname.replace(/\\/g, '/')}/test_stdio.js 'xxx' 'yyyy' 12`,
        /xxx/,
        {
          exitCode: 12
        }
      ]
    }
  ]
}
