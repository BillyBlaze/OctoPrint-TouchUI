var gulp = require('gulp');
var less = require('gulp-less');
var del = require('del');
var cssimport = require("gulp-cssimport");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var through = require("through2");
var gulpif = require("gulp-if");
var strip = require('gulp-strip-comments');
var trimlines = require('gulp-trimlines');
var removeEmptyLines = require('gulp-remove-empty-lines');
var concat = require('gulp-concat');

gulp.task('default', ['lessc', 'clean:hash', 'less:concat', 'js:concat:app', 'js:concat:libs', 'js:concat:bootstrap']);
gulp.task('less', ['lessc', 'clean:hash', 'less:concat']);
gulp.task('js', ['js:concat:app', 'js:concat:libs', 'js:concat:bootstrap']);

gulp.task('lessc', function () {
	return gulp.src('source/less/touchui.less')
		.pipe(less({compress: true}))
		.pipe(through.obj(function(file, enc, cb) {
			var contents = file.contents.toString();
			contents = contents.replace(/mixin\:placeholder\;/g, '');

			file.contents = new Buffer(contents);

			cb(null, file);
		}))
		.pipe(gulp.dest('octoprint_touchui/static/css'));
});

gulp.task("less:concat", function() {
	return gulp.src('source/less/touchui.less')
		.pipe(cssimport({
			extensions: ["less"],
			matchPattern: "*.less"
		}))
		.pipe(strip())
		.pipe(rename("touchui.bundled.less"))
		.pipe(trimlines())
		.pipe(through.obj(function(file, enc, cb) {
			var contents = file.contents.toString();
			contents = contents.replace(/\n\s*\n/g, '\n');

			file.contents = new Buffer(contents);

			cb(null, file);
		}))
		.pipe(gulp.dest('octoprint_touchui/static/less/'));
});

gulp.task('clean:hash', function () {
	return del([
		'octoprint_touchui/static/css/hash.touchui',
	]);
});

gulp.task('js:concat:libs', function () {
	return gulp.src([
			'source/vendors/keyboard/dist/js/jquery.keyboard.min.js',
			'source/vendors/jquery-fullscreen/jquery.fullscreen-min.js',
			'source/vendors/iscroll/build/iscroll.js',
			'source/vendors/tinycolorpicker/lib/jquery.tinycolorpicker.min.js'
		])
		.pipe(gulpif("**/iscroll.js", uglify()))
		.pipe(concat('touchui.libraries.js'))
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('js:concat:app', function () {
	return gulp.src([
			'!source/js/bootstrap.js',
			'source/js/constructor.js',
			'source/js/**/*.js',
			'source/js/**/**/*.js'
		])
		.pipe(concat('touchui.bundled.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('js:concat:bootstrap', function () {
	return gulp.src([
			'source/js/bootstrap.js'
		])
		.pipe(rename("touchui.bootstrap.js"))
		.pipe(uglify())
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('watch', function () {
	gulp.watch(
		[
			'source/less/touchui.less',
			'source/less/**/*.less',
			'source/js/**/*.js',
			'source/js/*.js'
		],
		[
			'lessc',
			'clean:hash',
			'less:concat',
			'js:concat:app',
			'js:concat:libs',
			'js:concat:bootstrap'
		]
	);
});
