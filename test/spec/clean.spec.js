'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('promise');
var rewire = require('rewire');

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('task:clean', function() {
	var mockApi;
	var mockDel;
	var task;
	before(function() {
		mockApi = createMockApi();
		mockDel = createMockDel();
		task = rewire('../../lib/tasks/clean');
		task.__set__('del', mockDel);
	});

	afterEach(function() {
		mockDel.reset();
	});

	function createMockApi() {
		return {
			errors: {
				TaskError: createCustomError('TaskError')
			}
		};

		function createCustomError(type) {
			function CustomError(message) {
				this.message = message;
			}

			CustomError.prototype = Object.create(Error.prototype);
			CustomError.prototype.name = type;

			return CustomError;
		}
	}

	function createMockDel() {
		return sinon.spy(function(path, options) {
			return new Promise(function(resolve, reject) {
				if (path === 'error') {
					reject(new Error('Test error'));
				} else {
					var results = Array.isArray(path) ? path : [path];
					resolve(results);
				}
			});
		});
	}

	it('should specify a description', function() {
		expect(task.description).to.be.a('string');
	});

	it('should specify default configuration', function() {
		expect(task.defaults.files).to.equal(null);
		expect(task.defaults.options).to.equal(null);
	});

	it('should throw an error if no path is specified', function() {
		var promises = [
			task.call(mockApi, {}),
			task.call(mockApi, { files: undefined }),
			task.call(mockApi, { files: null }),
			task.call(mockApi, { files: false })
		];
		return Promise.all(promises.map(function(promise) {
			return Promise.all([
				expect(promise).to.be.rejectedWith(mockApi.errors.TaskError),
				expect(promise).to.be.rejectedWith('No files')
			]);
		}));
	});

	it('should delete files and return result (string)', function() {
		return task.call(mockApi, {
			files: 'hello-world'
		})
			.then(function(results) {
				expect(mockDel).to.have.been.calledWith('hello-world');
				expect(results).to.eql(['hello-world']);
			});
	});

	it('should delete files and return result (array)', function() {
		return task.call(mockApi, {
			files: [
				'hello-world',
				'goodbye-world'
			]
		})
			.then(function(results) {
				expect(mockDel).to.have.been.calledWith([
					'hello-world',
					'goodbye-world'
				]);
				expect(results).to.eql([
					'hello-world',
					'goodbye-world'
				]);
			});
	});

	it('should pass options to the mockDel library', function() {
		return task.call(mockApi, {
			files: 'hello-world',
			options: {
				force: true,
				dot: true
			}
		})
			.then(function(results) {
				expect(mockDel).to.have.been.calledWith('hello-world', {
					force: true,
					dot: true
				});
			});
	});

	it('should throw error on library error', function() {
		return expect(
			task.call(mockApi, {
				files: 'error'
			})
		).to.be.rejectedWith('Test error');
	});
});
