const $ = require('gulp-load-plugins')()
const gulp = require('gulp')
const jpegoptim = require('imagemin-jpegoptim')

gulp.task('images', () => {
  return gulp.src('./source/images/**')
    .pipe($.imagemin([
      jpegoptim({ progressive: true, max: 75 }),
      $.imagemin.svgo(),
    ], { progressive: true }))
    .pipe(gulp.dest('./build/images/'))
})

