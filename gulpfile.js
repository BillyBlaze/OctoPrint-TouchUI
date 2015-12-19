var gulp = require('gulp');
var less = require('gulp-less');
var cssimport = require("gulp-cssimport");
var rename = require("gulp-rename");
var strip = require('gulp-strip-comments');
var trimlines = require('gulp-trimlines');
var removeEmptyLines = require('gulp-remove-empty-lines');

gulp.task('default', ['lessc', 'combine']);
gulp.task('less', ['lessc', 'combine']);

gulp.task('lessc', function () {
	return gulp.src('octoprint_touchui/static/less/touchui.less')
		.pipe(less({compress: true}))
		.pipe(gulp.dest('octoprint_touchui/static/css'));
});

gulp.task("combine", function() {
	return gulp.src('octoprint_touchui/static/less/touchui.less')
		.pipe(cssimport({
			extensions: ["less"],
			matchPattern: "*.less"
		}))
		.pipe(strip())
		.pipe(rename("touchui.generated.less"))
		.pipe(trimlines())
		.pipe(gulp.dest('octoprint_touchui/static/less/_generated/'));
});

gulp.task('watch', function () {
	gulp.watch(['octoprint_touchui/static/less/touchui.less', 'octoprint_touchui/static/less/**/*.less', '!octoprint_touchui/static/less/_generated/*.less'], ['lessc', 'combine']);
});
