'use strict';

var through = require('through2');
var replaceExt = require('replace-ext');
var reactJade = require('react-jade');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-react-jade-amd';

function gulpReactJadeAmd(options) {
	return through.obj(function(file, enc, callback) {
		if (file.isNull()) {
			this.push(file);
			return callback();
		}
		if (file.isBuffer()) {
			var templateString = reactJade.compileClient(
				file.contents.toString(),
				options
			).toString();
			file.contents = new Buffer(
				'define([\'react\'], function(React) {return ' + templateString + ';});'
			);
			file.path = replaceExt(file.path, '.js');
			this.push(file);
			return callback();
		}
		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
			return callback();
		}

		return callback();
	});
};

module.exports = gulpReactJadeAmd;
