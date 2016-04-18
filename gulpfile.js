var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./tasks/config.json');

try {
	config.pi = require('./tasks/pi.json');
} catch(err) {
	config.pi = false;
	config.ftp = false;
}

if(config.pi && config.pi.host && config.pi.user && config.pi.password) {
	var ftp = require('vinyl-ftp');
	config.ftp = ftp.create( {
		host:		config.pi.host,
		user:		config.pi.user,
		password:	config.pi.password,
		parallel:	50,
		//log:		$.util.log
	} );
}

$.requireTasks({
	path: __dirname + '/tasks',
	arguments: [$, config]
});

gulp.task('default', ['bootstrap']);
gulp.task('js', ['js:concat:app', 'js:concat:libs', 'js:concat:bootstrap']);
gulp.task('less', ['less:compile', 'less:hash:clean', 'less:concat']);
gulp.task('font', ['font:move']);
