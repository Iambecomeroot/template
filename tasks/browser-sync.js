const gulp = require('gulp')
const bs = require('browser-sync')

const CONFIG = require('../config.js')

const ReloadTimeout = 250

gulp.task('browser-sync', () => {
  bs.init(null, {
    proxy: `http://localhost:${CONFIG.PORT}`,
    ghostMode: false,
    browser: 'firefox',
    open: false,
    port: 4000,
    files: [
      'views/**/*.pug',
      'source/images/*'
    ],
  })
  gulp.watch('./routes/**/*.js', () => setTimeout(bs.reload, ReloadTimeout))
})

