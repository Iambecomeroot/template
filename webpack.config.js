'use strict';

const path    = require('path');
const process = require('process');

const q       = require('q');
const del     = require('del');
const webpack = require('webpack');

const debug   = process.env.NODE_ENV !== "production";

function config(debug){
  const plugins = [ new webpack.optimize.CommonsChunkPlugin('main', debug ? 'main.js' : '[name]-[chunkhash].js', ['settings']) ];

  if(!debug) plugins.push( /* Yes, all that just so I can have my trailing comma */ ...[
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    require('dbust').webpack,
  ]);

  return {
    devtool: debug ? "inline-sourcemap" : null,
    entry: {
      'main': [
        './source/js/main.js',
        './source/js/loadsvg.js',
        // './source/js/dropdowns.js',
      ],

      'auth': [
        './source/js/auth.js'
      ],

      // 'settings': [
      //   './source/js/settings.js',
      //   './source/js/loadsvg.js',
      //   './source/js/dropdowns.js',
      // ]
    },
    output: {
      path: './public/js',
      filename: debug ? '[name].js' : '[name]-[chunkhash].js'
    },
    module: debug ? {} : {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        }
      ],
    },
    plugins,
  }
}

// So I can run from terminal and from gulp
if(/webpack\.js$/.test(require.main.filename)){
  module.exports = config(debug);
}else{
  module.exports = config;
}
