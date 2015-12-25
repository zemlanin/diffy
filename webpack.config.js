'use strict';

var webpack = require('webpack');

module.exports = {
    entry: {
        main: "main",
    },
    output: {
        path: 'dist/js',
        filename: "[name].js",
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /node_modules(?!\/tanok)/, loader: 'babel?presets[]=react,presets[]=es2015'},
        ]
    },
    resolve: {
        modulesDirectories: [
            "node_modules",
            "src",
        ],
        extensions: ['.js', '.jsx', ''],
    },
};
