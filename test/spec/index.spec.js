'use strict';

var chai = require('chai');
var expect = chai.expect;

var packageModule = require('../..');

describe('package', function() {
	it('should export the correct tasks', function() {
		expect(packageModule.tasks['clean']).to.be.a('function');
	});

	it('should specify default package configuration', function() {
		expect(packageModule.defaults).to.eql({});
	});
});
