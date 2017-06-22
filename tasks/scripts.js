const browserSync = require('browser-sync')
const webpack = require('webpack')
const gutil = require('gulp-util')
const moment = require('moment')
const chalk = require('chalk')

const handler = (err, stats, options) => {
  options = Object.assign({
    log: true,
  }, options)

  const errors = stats.compilation.errors
  if (errors.length) {
    const err = errors[0].error
    console.log()
    console.log(chalk.red.bold(err.message))
    console.log(chalk.red(err.stack))
    console.log()
    return
  }

  browserSync.reload()

  if (options.log) {
    const time = moment
      .duration(stats.endTime - stats.startTime)
      .asSeconds()
      .toFixed(2)
    gutil.log(`Finished '${chalk.cyan('webpack')}' after ${chalk.magenta(`${time} s`)}`)
  }
}

const config = require(__dirname + '/../webpack.config.js')
const compiler = () => webpack(config())

module.exports = gulp => {
  gulp.task('js', () => compiler().watch({
    aggregateTimeout: 0,
    ignored: /node_modules/,
  }, handler))

  gulp.task('build-js', cb => compiler().run((err, stats) => {
    handler(err, stats, { log: false })
    cb()
  }))
}

