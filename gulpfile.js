const process = require('process')

const _ = require('lodash/fp')
const del = require('del')
const glob = require('glob')
const dbust = require('dbust')
const gulp = require('gulp-autoplumb')
const runSequence = require('run-sequence')

process.env.WEBPACK_SOURCE = 'gulp'

glob.sync(__dirname + '/tasks/*.js')
  .map(require)
  .map(m => m(gulp))

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

