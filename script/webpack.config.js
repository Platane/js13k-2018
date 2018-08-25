const fs = require('fs')
const path = require('path')

module.exports = {
  entry: {
    index: [
      path.join(__dirname, '../src/index.js'),
      path.join(__dirname, '../src/index.html'),
    ],
  },

  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: 'babel-loader' }],
      },

      {
        test: [/\.html?$/],
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].[ext]' },
          },
        ],
      },

      {
        test: /\.glsl$/,
        use: [{ loader: 'raw-loader' }],
      },
    ],
  },

  devtool: false,
}
