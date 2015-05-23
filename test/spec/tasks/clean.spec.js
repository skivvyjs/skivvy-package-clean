'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('promise');
var rewire = require('rewire');

var task = rewire('../../../tasks/clean');
var del = createMockDel();
task.__set__('del', del);

chai.use(chaiAsPromised);
chai.use(sinonChai);

function createMockDel() {
	return sinon.spy(function(path, options, callback) {
		setTimeout(function() {
			if (path === 'error') {
				callback(new Error('Test error'));
			} else {
				var results = Array.isArray(path) ? path : [path];
				callback(null, results);
			}
		});
	});
}

describe('clean', function() {
	afterEach(function() {
		del.reset();
	});

	it('should specify a description', function() {
		expect(task.description).to.be.a('string');
	});

	it('should specify defaults', function() {
		expect(task.defaults.path).to.equal(null);
		expect(task.defaults.options).to.equal(null);
	});

	it('should throw an error if no path is specified', function() {
		var promises = [
			task({}),
			task({ path: undefined }),
			task({ path: null }),
			task({ path: false })
		];
		return Promise.all(promises.map(function(promise) {
			expect(promise).to.be.rejectedWith('No path');
		}));
	});

	it('should delete files and return result (string)', function() {
		return task({
			path: 'hello-world'
		})
			.then(function(results) {
				expect(del).to.have.been.calledWith('hello-world');
				expect(results).to.eql(['hello-world']);
			});
	});

	it('should delete files and return result (array)', function() {
		return task({
			path: [
				'hello-world',
				'goodbye-world'
			]
		})
			.then(function(results) {
				expect(del).to.have.been.calledWith([
					'hello-world',
					'goodbye-world'
				]);
				expect(results).to.eql([
					'hello-world',
					'goodbye-world'
				]);
			});
	});

	it('should pass options to the del library', function() {
		return task({
			path: 'hello-world',
			options: {
				force: true,
				dot: true
			}
		})
			.then(function(results) {
				expect(del).to.have.been.calledWith('hello-world', {
					force: true,
					dot: true
				});
			});
	});

	it('should throw error on library error', function() {
		return expect(
			task({
				path: 'error'
			})
		).to.be.rejectedWith('Test error');
	});
});
