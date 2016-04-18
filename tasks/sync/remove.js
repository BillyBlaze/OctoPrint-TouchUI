module.exports = function (gulp, $, config, cb) {

	if(config.ftp && config.pi) {
		config.ftp.delete( config.pi.delete, function() {
			cb();
		});
	} else {
		cb();
	}

}
