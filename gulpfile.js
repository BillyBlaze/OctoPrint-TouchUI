var gulp = require('gulp');
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');

gulp.task('default', function () {
});
gulp.task('watch', function () {
	return gulp.src('octoprint_touchui/static/less/touchui.less')
		.pipe(watchLess('octoprint_touchui/static/less/touchui.less'))
		.pipe(less({
			compile: true
		}))
		.pipe(gulp.dest('octoprint_touchui/static/css'));
});
