const $ = require('gulp-load-plugins')()
const jpegoptim = require('imagemin-jpegoptim')

module.exports = gulp => {
  gulp.task('images', () => {
    return gulp.src('./source/images/**')
      .pipe($.imagemin([
        jpegoptim({ progressive: true, max: 75 }),
        $.imagemin.svgo(),
      ], { progressive: true }))
      .pipe(gulp.dest('./build/images/'))
  })
}

