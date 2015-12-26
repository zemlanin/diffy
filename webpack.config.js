'use strict';

var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    main: "main",
  },
  output: {
    path: 'dist/',
    publicPath: 'dist/',
    filename: "[name].js",
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules(?!\/tanok)/, loader: 'babel?presets[]=react,presets[]=es2015'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
    ]
  },
  resolve: {
    modulesDirectories: [
      "node_modules",
      "src",
    ],
    extensions: ['.js', '.jsx', ''],
  },
  plugins: [
    new ExtractTextPlugin("[name].css", {allChunks: true}),
    new webpack.optimize.UglifyJsPlugin({warnings: false}),
  ],
};
