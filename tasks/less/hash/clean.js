var del = require('del');

module.exports = function (gulp, $, config, callback) {
	return del(config.css.hash);
}
