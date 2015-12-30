var gulp = require('gulp');
var less = require('gulp-less');
var cssimport = require("gulp-cssimport");
var rename = require("gulp-rename");
var strip = require('gulp-strip-comments');
var trimlines = require('gulp-trimlines');
var removeEmptyLines = require('gulp-remove-empty-lines');
var concat = require('gulp-concat');

gulp.task('default', ['lessc', 'concatLess', 'concatJs', 'concatJsLibs']);
gulp.task('less', ['lessc', 'concatLess']);
gulp.task('js', ['concatJs', 'concatJsLibs']);

gulp.task('lessc', function () {
	return gulp.src('source/less/touchui.less')
		.pipe(less({compress: true}))
		.pipe(gulp.dest('octoprint_touchui/static/css'));
});

gulp.task("concatLess", function() {
	return gulp.src('source/less/touchui.less')
		.pipe(cssimport({
			extensions: ["less"],
			matchPattern: "*.less"
		}))
		.pipe(strip())
		.pipe(rename("touchui.bundled.less"))
		.pipe(trimlines())
		.pipe(gulp.dest('octoprint_touchui/static/less/'));
});

gulp.task('concatJsLibs', function () {
	return gulp.src([
			'source/vendors/keyboard/dist/js/jquery.keyboard.min.js',
			'source/vendors/jquery-fullscreen/jquery.fullscreen-min.js',
			'source/vendors/iscroll/build/iscroll.js',
			'source/vendors/tinycolorpicker/lib/jquery.tinycolorpicker.min.js'
		])
		.pipe(concat('touchui.libraries.js'))
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('concatJs', function () {
	return gulp.src([
			'source/js/main.js',
			'source/js/**/*.js',
			'source/js/**/**/*.js',
			'source/js/knockout.js'
		])
		.pipe(concat('touchui.bundled.js'))
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('watch', function () {
	gulp.watch(['source/less/touchui.less', 'source/less/**/*.less'], ['lessc', 'concatLess']);
});
