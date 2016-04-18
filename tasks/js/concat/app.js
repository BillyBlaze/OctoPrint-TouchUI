module.exports = function (gulp, $, config) {

		return gulp.src(config.js.app.source)
			.pipe($.concat(config.js.app.output))
			.pipe(gulp.dest(config.js.path));

}
