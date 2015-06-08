'use strict';

var Promise = require('promise');
var del = require('del');

module.exports = function(config) {
	var files = config.files;
	var options = config.options || {};
	var api = this;
	return new Promise(function(resolve, reject) {
		if (!files) {
			throw new api.errors.TaskError('No files specified');
		}
		del(files, options, function(error, paths) {
			if (error) {
				return reject(error);
			}
			return resolve(paths);
		});
	});
};

module.exports.defaults = {
	files: null,
	options: null
};

module.exports.description = 'Delete files and folders';
