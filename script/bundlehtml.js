const fs = require('fs')

const js = fs.readFileSync('dist/bundle.js').toString()
const html = fs.readFileSync('src/index.html').toString()

const out = html
  .replace(/(\r|\n|\t)+/g, '')
  .replace(/ +/g, ' ')
  .trim()
  .replace(
    '<script src="a.js"></script>',
    `<script>${js.replace('"use strict";', '')}</script>`
  )

fs.writeFileSync('dist/index.html', out)
