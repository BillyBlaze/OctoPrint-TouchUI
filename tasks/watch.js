module.exports = function (gulp, $, config) {
	gulp.watch(config.watch, ['bootstrap']);
}
