var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('default', ['less']);
gulp.task('less', function () {
	return gulp.src('octoprint_touchui/static/less/touchui.less')
		.pipe(less({compress: true}))
		.pipe(gulp.dest('octoprint_touchui/static/css'));
});
gulp.task('watch', function () {
	gulp.watch(['octoprint_touchui/static/less/touchui.less', 'octoprint_touchui/static/less/**/*.less'], ['less']);
});
