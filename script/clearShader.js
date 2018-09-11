const fs = require('fs')

const buffer = fs.readFileSync('dist/bundle.js').toString()

const out = buffer.replace(/\"([^"]+)\"/g, x =>
  x
    .replace(/(\\r|\\n|\\t)+/g, '')
    .replace(/ +/g, ' ')
    .trim()
)

fs.writeFileSync('dist/bundle0.js', out)
