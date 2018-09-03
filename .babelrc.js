const domprops = require('babel-plugin-minify-mangle-properties/domprops.json')

const plugins = [['babel-plugin-module-resolver', { alias: { '~': './src' } }]]

const presets = ['@babel/preset-flow']

if (process.env.NODE_ENV === 'production') {
  presets.push('@babel/preset-env')
}
if (process.env.NODE_ENV === 'mangle-properties') {
  presets.length = 0
  plugins.length = 0

  const whitelist = [
    //
    'navigation',
    'rotation',
    'command',
    'target',
    'update',
  ]

  plugins.push([
    'babel-plugin-minify-mangle-properties',
    { reservedNames: domprops.props.filter(x => !whitelist.includes(x)) },
  ])
}
if (process.env.NODE_ENV === 'minify') {
  presets.length = 0
  plugins.length = 0
  presets.push([
    'babel-preset-minify',
    {
      mangle: {
        topLevel: true,
      },
      keepClassName: false,
      keepFnName: false,
    },
  ])
}
if (process.env.NODE_ENV === 'test') {
  plugins.push('@babel/plugin-transform-modules-commonjs')
}

module.exports = { plugins, presets }
