'use strict';

var Promise = require('promise');
var del = require('del');

module.exports = function(config) {
	return new Promise(function(resolve, reject) {
		var path = config.path;
		var options = config.options;
		if (!path) {
			throw new Error('No path specified');
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
