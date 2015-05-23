'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('promise');
var rewire = require('rewire');

var clean = rewire('../../tasks/clean');
var del = createMockDel();
clean.__set__('del', del);

chai.use(chaiAsPromised);
chai.use(sinonChai);

function createMockDel() {
	return sinon.spy(function(path, options, callback) {
		setTimeout(function() {
			if (path === 'invalid') {
				callback(new Error('Invalid path'));
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
		expect(clean.description).to.be.a('string');
	});

	it('should specify defaults', function() {
		expect(clean.defaults.path).to.equal(null);
		expect(clean.defaults.options).to.equal(null);
	});

	it('should throw an error if no path is specified', function() {
		var promises = [
			clean({}),
			clean({ path: undefined }),
			clean({ path: null }),
			clean({ path: false })
		];
		return Promise.all(promises.map(function(promise) {
			expect(promise).to.be.rejectedWith('No path');
		}));
	});

	it('should delete files and return result (string)', function() {
		return clean({
			path: 'hello-world'
		})
			.then(function(results) {
				expect(del).to.have.been.calledWith('hello-world');
				expect(results).to.eql(['hello-world']);
			});
	});

	it('should delete files and return result (array)', function() {
		return clean({
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
		return clean({
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
			clean({
				path: 'invalid'
			})
		).to.be.rejectedWith('Invalid path');
	});
});
