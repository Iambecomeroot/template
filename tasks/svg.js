const $ = require('gulp-load-plugins')()

module.exports = gulp => {
  gulp.task('svg', () => {
    return gulp.src('source/svg/*.svg')
      .pipe(gulp.dest('public/svg/'))
      .pipe($.svgSprite({
        mode: {
          symbol: {
            dest: 'svg',
            inline: true,
            sprite: 'sprite.svg'
          }
        }
      }))
      .pipe($.rename('sprite.svg'))
      .pipe(gulp.dest('public'))
  })

  gulp.task('build-svg', () => {
    return gulp.src('source/svg/*.svg')
      .pipe($.svgmin())
      .pipe(gulp.dest('public/svg/'))
      .pipe($.svgSprite({
        mode: {
          symbol: {
            dest: 'svg',
            inline: true,
            sprite: 'sprite.svg'
          }
        }
      }))
      .pipe($.rename('sprite.svg'))
      .pipe($.rev())
      .pipe($.dbust())
      .pipe(gulp.dest('public'))
  })
}

