const bs = require('browser-sync')

module.exports = gulp => {
  gulp.task('browser-sync', () => {
    bs.init(null, {
      proxy: 'http://localhost:1278',
      open: false,
      port: 4000,
      files: [
        'views/**/*.pug',
        'source/**/*.pug',
        'source/js/*',
        'source/images/*'
      ],
      ghostMode: false
    })
  })
}
