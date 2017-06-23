const path = require('path')
const process = require('process')

const webpack = require('webpack')
const glob = require('glob')

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const Dbust = require('webpack-dbust')

module.exports = () => {

  const debug = process.env.NODE_ENV === 'development'

  const plugins = [
    new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: debug ? 'common.js' : 'common-[chunkhash].js' }),
  ]

  if (debug) {
    plugins.push(...[
      new HardSourceWebpackPlugin(),
    ])
  } else {
    plugins.push(...[
      new CompressionPlugin(),
      new Dbust({ base: __dirname, autosave: process.env.WEBPACK_SOURCE !== 'gulp' }),
      new webpack.optimize.UglifyJsPlugin({ comments: false, sourcemap: false }),
    ])
  }

  if (process.env.WEBPACK_ANALYZE === 'true') {
    plugins.push(new BundleAnalyzerPlugin())
  }

  return {
    devtool: debug ? 'source-map' : false,
    plugins,
    entry: {
      main: glob.sync('./source/js/main/*'),
      common: [
        'regenerator-runtime/runtime',
        'dialog-polyfill',
        './source/js/_loadsvg.js',
      ],
    },
    output: {

      // Set output path to 'public' for debug and 'build' for prod
      path: path.join(__dirname, debug ? 'public' : 'build', 'js'),

      // Don't change filename for debug
      // Cache bust filename for prod
      filename: debug ? '[name].js' : '[name]-[chunkhash].js',
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'babel-plugin-lodash',
              'babel-plugin-transform-class-properties',
            ].map(require.resolve),
            presets: { env: { targets:  { browsers: [ 'last 2 version' ] } } },
          },
        },
      }, {
        test: /\.pug$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        use: {
          loader: 'pug-loader',
        },
      }],
    },
  }
}

