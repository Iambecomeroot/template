const path = require('path')

const $ = require('gulp-load-plugins')()
const bs = require('browser-sync')
const gulp = require('gulp')
const sassGraph = require('sass-graph')

const styles = [ 'global' ]
const tasks = []
const buildTasks = []

styles.map(style => {

  const task = `css-${style}`
  const file = `./source/css/${style}.scss`
  const files = Object.keys(sassGraph.parseFile(file, { globImports: true, exclude: /node_modules/ }).index)

  tasks.push(task)

  gulp.task(`watch-${task}`, () => gulp.watch(files, [ task ]))

  gulp.task(task, () => {
    return gulp.src(file)
      .pipe($.sourcemaps.init())
      .pipe($.sassGlob())
      .pipe($.sass().on('error', $.sass.logError))
      .pipe($.sourcemaps.write('maps/'))
      .pipe(gulp.dest('public/css/'))
      .pipe($.if(
        file => path.extname(file.path) === '.css',
        bs.stream()
      ))
  })

  const buildTask = `build-${task}`
  buildTasks.push(buildTask)

  gulp.task('build-' + style, () => {
    return gulp.src(`./source/css/${style}.scss`)
      .pipe($.sassGlob())
      .pipe($.sass())
      .pipe($.cssnano())
      .pipe($.autoprefixer())
      .pipe($.rev())
      .pipe($.dbust())
      .pipe(gulp.dest('build/css/'))
      .pipe($.gzip())
      .pipe(gulp.dest('build/css/'))
  })
})

gulp.task('css', tasks)
gulp.task('build-css', buildTasks)

