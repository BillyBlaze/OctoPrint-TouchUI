module.exports = function (gulp, $, config) {

	return gulp.src([
			'source/vendors/roboto-webfont-bower/fonts/Roboto-Light-webfont.woff',
			'source/vendors/roboto-webfont-bower/fonts/Roboto-Regular-webfont.woff',
			'source/vendors/roboto-webfont-bower/fonts/Roboto-Bold-webfont.woff',

			'source/vendors/material-design-icons/iconfont/MaterialIcons-Regular.woff',
			'source/vendors/material-design-icons/iconfont/MaterialIcons-Regular.woff2'
		])
		.pipe(gulp.dest(config.font.output));

}
