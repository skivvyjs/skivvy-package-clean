'use strict';

var Promise = require('promise');
var del = require('del');

module.exports = function(config) {
	var path = config.path;
	var options = config.options;
	var api = this;
	return new Promise(function(resolve, reject) {
		if (!path) {
			throw new api.errors.TaskError('No path specified');
		}
		del(path, options, function(error, paths) {
			if (error) {
				return reject(error);
			}
			return resolve(paths);
		});
	});
};

module.exports.defaults = {
	path: null,
	options: null
};

module.exports.description = 'Delete files and folders';
