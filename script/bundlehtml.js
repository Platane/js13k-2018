const fs = require('fs')

const js = fs.readFileSync('dist/bundle.js').toString()
const html = fs.readFileSync('src/index.html').toString()

const out = html
  .replace(/(\r|\n|\t)+/g, '')
  .replace(/ +/g, ' ')
  .trim()

const [before, after] = out.split('<script src="a.js"></script>')

const inde =
  before + `<script>${js.replace('"use strict";', '')}</script>` + after

fs.writeFileSync('dist/index.html', inde)
