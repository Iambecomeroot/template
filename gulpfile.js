const process = require('process')

const _ = require('lodash/fp')
const del = require('del')
const gulp = require('gulp')
const glob = require('glob')
const dbust = require('dbust')
const runSequence = require('run-sequence').use(gulp)

glob.sync('./tasks/*.js').map(require)

process.env.WEBPACK_SOURCE = 'gulp'

glob.sync(__dirname + '/tasks/*.js').map(require)

gulp.task('default', ['css', 'js', 'svg', 'browser-sync', 'watch'])

gulp.task('watch', Object.keys(gulp.tasks).filter(_.startsWith('watch-')))

gulp.task('set-env', () => process.env.NODE_ENV = 'production')
gulp.task('clean', () => del(__dirname + '/build/'))
gulp.task('dbust', dbust.save)

gulp.task('build', cb => runSequence (
  'clean',
  [ 'images', 'build-js', 'build-css' ],
  'dbust',
  cb
))

