var fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
var del = require('del');
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var through = require("through2");
var gulpif = require("gulp-if");
var trimlines = require('gulp-trimlines');
var concat = require('gulp-concat');
var stripCssComments = require('gulp-strip-css-comments');

gulp.task('lessc', function () {
	return gulp.src('source/less/touchui.less')
		.pipe(less({compress: true}))
		.pipe(through.obj(function(file, enc, cb) {
			var contents = file.contents.toString();
			contents = contents.replace(/mixin\:placeholder\;/g, '');

			file.contents = Buffer.from(contents);

			cb(null, file);
		}))
		.pipe(gulp.dest('octoprint_touchui/static/css'));
});

gulp.task("less:concat", function() {
	return gulp.src('source/less/touchui.less')
		.pipe(through.obj(function(file, enc, cb) {
			var contents = file.contents.toString();
			var regex = /@import \"(.*)\"\;/gm;

			while ((m = regex.exec(contents)) !== null) {
				if (m.index === regex.lastIndex) {
					regex.lastIndex++;
				}

				var replaceString = m[0];
				var fileName = m[1];

				var importContents = fs.readFileSync(__dirname + '/source/less/' + fileName);

				contents = contents.replace(replaceString, importContents);
			}

			file.contents = Buffer.from(contents);

			cb(null, file);
		}))
		.pipe(stripCssComments())
		.pipe(rename("touchui.bundled.less"))
		.pipe(trimlines())
		.pipe(through.obj(function(file, enc, cb) {
			var contents = file.contents.toString();
			contents = contents.replace(/\n\s*\n/g, '\n');

			file.contents = Buffer.from(contents);

			cb(null, file);
		}))
		.pipe(gulp.dest('octoprint_touchui/static/less/'));
});

gulp.task('clean:hash', function () {
	return del([
		'octoprint_touchui/static/css/hash.*.touchui',
	]);
});

gulp.task('js:concat:libs', function () {
	return gulp.src([
			'node_modules/keyboard/dist/js/jquery.keyboard.min.js',
			'node_modules/jquery-fullscreen-kayahr/jquery.fullscreen-min.js',
			'node_modules/iscroll/build/iscroll.js',
			'source/vendors/tinycolorpicker/lib/jquery.tinycolorpicker.min.js'
		])
		.pipe(gulpif("**/iscroll.js", uglify()))
		.pipe(concat('touchui.libraries.js'))
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('js:concat:app', function () {
	return gulp.src([
			'source/js/constructor.js',
			'source/js/**/*.js',
			'source/js/**/**/*.js',
			'!source/js/bootstrap.js'
		])
		.pipe(concat('touchui.bundled.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('js:concat:bootstrap', function () {
	return gulp.src([
			'source/js/bootstrap.js'
		])
		.pipe(rename("touchui.bootstrap.js"))
		.pipe(uglify())
		.pipe(gulp.dest('octoprint_touchui/static/js/'));
});

gulp.task('watch', function () {
	gulp.watch(
		['source/js/**/*.js', 'source/js/*.js'],
		gulp.series('js')
	);
	gulp.watch(
		['source/less/touchui.less', 'source/less/**/*.less'],
		gulp.series('less')
	);
});

gulp.task('default', gulp.series('lessc', 'clean:hash', 'less:concat', 'js:concat:app', 'js:concat:libs', 'js:concat:bootstrap'));
gulp.task('less', gulp.series('lessc', 'clean:hash', 'less:concat'));
gulp.task('js', gulp.series('js:concat:app', 'js:concat:libs', 'js:concat:bootstrap'));
