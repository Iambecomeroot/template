const path      = require('path')
const imagemin  = require('gulp-imagemin')
const jpegoptim = require('imagemin-jpegoptim')
const pngquant  = require('imagemin-pngquant')

module.exports = gulp => {
  gulp.task('images', () => {
    return gulp.src('./source/images/**')
      .pipe(imagemin([ jpegoptim({ progressive: true, max: 75 }) ], { progressive: true }))
      .pipe(gulp.dest('./public/images/'))
  })
}
