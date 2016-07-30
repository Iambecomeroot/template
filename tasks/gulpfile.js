const fs               = require('fs')
const gulp             = require('gulp-autoplumb')

fs.readdirSync('./tasks/').forEach(function(file) {
  require('./tasks/' + file)(gulp)
})


gulp.task('default', ['css', 'js', 'svg', 'browser-sync', 'watch'], function(){
  gulp.watch('./source/svg/*.svg', ['svg'])
  gulp.watch('./source/images/**', ['images'])
})

buildTasks = Object.keys(gulp.tasks).filter( task => /build-.*/gi.test(task) )

buildTasks.push('images')

gulp.task('build', buildTasks)
gulp.task('watch', Object.keys(gulp.tasks).filter((task) => {
  return /watch-.*/gi.test(task)
}))
