'use strict';

var Promise = require('promise');
var del = require('del');

module.exports = function(config) {
	var files = config.files;
	var options = config.options || {};
	var api = this;
	if (!files) {
		return Promise.reject(new api.errors.TaskError('No files specified'));
	}
	return del(files, options);
};

module.exports.defaults = {
	files: null,
	options: null
};

module.exports.description = 'Delete files and folders';
