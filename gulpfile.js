var gulp = require('gulp');
var less = require('gulp-less');
var cssimport = require("gulp-cssimport");
var rename = require("gulp-rename");

gulp.task('default', ['less', 'combine']);
gulp.task('less', function () {
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
		.pipe(rename("touchui.generated.less"))
		.pipe(gulp.dest('octoprint_touchui/static/css/'));
});

gulp.task('watch', function () {
	gulp.watch(['octoprint_touchui/static/less/touchui.less', 'octoprint_touchui/static/less/**/*.less'], ['less', 'combine']);
});
