'use strict'

const $    = require('gulp-load-plugins')()
const path = require('path')

const styles  = {
  'global.scss': {
    files: [
      './node_modules/normalize-css/normalize.css',
      './node_modules/purecss/build/pure.css',
      'source/css/global.scss',
      'source/css/_components.scss',
      'source/css/_vars.scss',
      'source/css/_base.scss',
    ],
    dir: 'css/'
  },

  'auth.scss': {
    files: [
      'source/css/auth.scss',
      'source/css/_vars.scss',
    ],
    dir: 'css/'
  },

  'settings.scss': {
    files: [
      './source/css/settings.scss',
      'source/css/_vars.scss',
    ],
    dir: 'css/'
  },
}

module.exports = gulp => {
  Object.keys(styles).forEach(mainFile => {

    gulp.task(mainFile, () => {
      return gulp.src('./source/' + styles[mainFile].dir + mainFile)
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.cssnano())
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('maps/'))
        .pipe(gulp.dest('public/' + styles[mainFile].dir))
        .pipe($.if(
          file => path.extname(file.path) === '.css',
          require('browser-sync').stream()
        ))
    })

    gulp.task('build-' + mainFile, () => {
      return gulp.src('./source/' + styles[mainFile].dir + mainFile)
        .pipe($.sass())
        .pipe($.cssnano())
        .pipe($.autoprefixer())
        .pipe($.rev())
        .pipe(require('dbust').gulp())
        .pipe(gulp.dest('public/' + styles[mainFile].dir))
    })

    gulp.task('watch-' + mainFile, () => {
      gulp.watch(styles[mainFile].files, [mainFile])
    })
  })

  gulp.task('css', Object.keys(styles))
}
