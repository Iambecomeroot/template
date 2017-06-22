const path = require('path')
const process = require('process')

const webpack = require('webpack')
const glob = require('glob')

module.exports = () => {

  const debug = process.env.NODE_ENV === 'development'

  const plugins = [
    new require('hard-source-webpack-plugin')(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: debug ? 'common.js' : 'common-[chunkhash].js' }),
  ]

  if (!debug) plugins.push(...[
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new require('compression-webpack-plugin')(),
    new require('webpack-dbust')({ base: __dirname, autosave: process.env.WEBPACK_SOURCE !== 'gulp' }),
  ])

  if (process.env.WEBPACK_ANALYZE === 'true') {
    plugins.push(new require('webpack-bundle-analyzer').BundleAnalyzerPlugin())
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
            presets: [ 'env' ],
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

