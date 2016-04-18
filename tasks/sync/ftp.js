module.exports = function (gulp, $, config, cb) {

	// if dependencies tasks completed then trigger this
	if(config.ftp && config.pi) {
		var globs = ['octoprint_touchui/**', '!octoprint_touchui/__init__.pyc', 'babel.cfg', 'MANIFEST.in', 'README.md', 'requirements.txt', 'setup.py'];
		return gulp.src(globs, { base: '.', buffer: false })
			.pipe(config.ftp.newer( config.pi.path ))
			.pipe(config.ftp.dest( config.pi.path ));
	} else {
		cb();
	}

}
