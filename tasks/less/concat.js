var through = require("through2");

module.exports = function (gulp, $, config) {

	return gulp.src(config.less.source)
		.pipe($.plumber())
		.pipe($.cssimport({
			extensions: ["less"],
			matchPattern: "*.less"
		}))
		.pipe($.stripComments())
		.pipe($.rename(config.less.output.fileName))
		.pipe($.trimlines())
		.pipe(through.obj(function(file, enc, cb) {
			var contents = file.contents.toString();
			contents = contents.replace(/\n\s*\n/g, '\n');

			file.contents = new Buffer(contents);

			cb(null, file);
		}))
		.pipe($.autoprefixer(config.autoprefixer))
		.pipe(gulp.dest(config.less.output.path));

}
