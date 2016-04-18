module.exports = function (gulp, $, config) {

	return gulp.src(config.less.source)
		.pipe($.plumber())
		.pipe($.less(config.less.config))
		.pipe($.autoprefixer(config.autoprefixer))
		.pipe(gulp.dest(config.css.output));

}
