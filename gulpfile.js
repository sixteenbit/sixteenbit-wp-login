// GULP PACKAGES
// Most packages are lazy loaded
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	rimraf = require('rimraf'),
	zip = require('gulp-zip'),
	plugin = require('gulp-load-plugins')();


// GULP VARIABLES
// Modify these variables to match your project needs

// Select Foundation components, remove components project will not use
const SOURCE = {

	// Scss files will be concatenated, minified if ran with --production
	styles: 'src/scss/**/*.scss',

	// Images placed here will be optimized
	images: 'src/img/**/*',

	php: '**/*.php'
};

const ASSETS = {
	styles: 'assets/css/',
	images: 'assets/img/',
	all: 'assets/'
};

// GULP FUNCTIONS

// Delete the "release" folder
// This happens every time a build starts
function clean(done) {
	rimraf('release', done);
}

// Compile Sass, Autoprefix and minify
gulp.task('styles', function () {
	return gulp.src(SOURCE.styles)
		.pipe(plugin.plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit('end');
		}))
		.pipe(plugin.sourcemaps.init())
		.pipe(plugin.sass())
		.pipe(plugin.autoprefixer({
			cascade: false
		}))
		.pipe(plugin.sourcemaps.write('.'))
		.pipe(gulp.dest(ASSETS.styles));
});

// Optimize images, move into assets directory
gulp.task('images', function () {
	return gulp.src(SOURCE.images)
		.pipe(plugin.imagemin())
		.pipe(gulp.dest(ASSETS.images))
});

gulp.task(
	'copy:dist',
	function () {
		return gulp.src(
			[
				'**/*',
				'!.*',
				'!config.yml',
				'!gulpfile.js',
				'!package.json',
				'!yarn.lock',
				'!release',
				'!release/**/*',
				'!node_modules',
				'!node_modules/**/*'
			]
		)
			.pipe(gulp.dest('release/sixteenbit-wp-login'))
	}
);

gulp.task(
	'release:zip',
	function () {
		return gulp.src('release/**')
			.pipe(zip('sixteenbit-wp-login.zip'))
			.pipe(gulp.dest('release'))
	}
);

// Watch files for changes
gulp.task('watch', function () {

	// Watch .scss files
	gulp.watch(SOURCE.styles, gulp.parallel('styles'));

	// Watch images files
	gulp.watch(SOURCE.images, gulp.parallel('images'));

});

// Run styles, scripts and foundation-js
gulp.task('default', gulp.parallel('styles', 'images'));

// Build project and copy to clean directory
gulp.task('release', gulp.series(clean, 'default', 'copy:dist', 'release:zip'));
