// =======================================================================//
// !Define concat resources                                               //
// =======================================================================//
var scripts = {
	main: [
	]
}

var styles = {
	global: [
	],
}

// =======================================================================//
// !Load plugins and functions                                            //
// =======================================================================//
eval(fs.readFileSync('./functions/gulp.js').toString());
load({
	
});

// =======================================================================//
// !Set up JavaScript tasks                                               //
// =======================================================================//
Object.keys(scripts).forEach(function(key){
	gulp.task('js-' + key, function(){
		del.sync(['./public/js/' + manifest[key + '.js'], './public/js/maps/' + manifest[key + '.js'] + '.map']);
		return gulp.src(scripts[key])
			.pipe(plumber())
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'));
			.pipe(sourcemaps.init())
			.pipe(concat(key+".js"))
			.pipe(uglify())
			.pipe(rev())
			.pipe(sourcemaps.write('maps/'))
			.pipe(gulp.dest('public/js/'))
			.pipe(tap(updateManifest));
	});
});

gulp.task('js', before_each(Object.keys(scripts), 'js-'));

// =======================================================================//
// !Set up CSS tasks                                                      //
// =======================================================================//

Object.keys(styles).forEach(function(key){
	gulp.task('css-' + key, function(){
		del.sync(['./public/css/' + manifest[key + '.css'], './public/css/maps/' + manifest[key + '.css'] + '.map']);
		return gulp.src('./source/css/' + key + '.scss')
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(minifycss())
			.pipe(autoprefixer())
			.pipe(rev())
			.pipe(sourcemaps.write('maps/'))
			.pipe(gulp.dest('public/css/'))
			.pipe(tap(updateManifest));
	});
});

gulp.task('css', before_each(Object.keys(styles), 'css-'));

gulp.task('svg', function(){
	del.sync(['public/svg']);
	return gulp.src('source/svg/*.svg')
		.pipe(svgo())
		.pipe(svgsprite({
			mode: {
				symbol: {
					dest: 'svg',
					inline: true,
					sprite: 'sprite.svg'
				}
			}
		}))
		.pipe(rev())
		.pipe(gulp.dest('public'))
		.pipe(tap(updateManifest));
});

// =======================================================================//
// !Default tasks                                                         //
// =======================================================================//
gulp.task('default', ['js', 'css'], function(){
	Object.keys(scripts).forEach(function(key){
		gulp.watch(scripts[key], function(){
			sequence('js-' + key, 'js-lint');
		});
	});
	Object.keys(styles).forEach(function(key){
		gulp.watch(styles[key], function(){
			gulp.start('css-' + key);
		});
	});
	gulp.watch('./source/svg/*.svg', ['svg']);
});