'use strict';

var config = require('./webpack.config.js')

config.module.loaders = [
  {test: /\.jsx?$/, exclude: /node_modules(?!\/tanok)/, loader: 'babel?presets[]=react,presets[]=es2015'},
  {test: /\.css$/, loader: "style-loader!css-loader"},
]
config.plugins = []

module.exports = config;
