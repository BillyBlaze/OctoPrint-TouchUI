module.exports = function (gulp, $, config) {

	return gulp.src(config.js.bootstrap.source)
		.pipe($.rename(config.js.bootstrap.output))
		.pipe($.uglify())
		.pipe(gulp.dest(config.js.path));

}
