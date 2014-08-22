define([
	'vendor/chai/chai',
	'asdf/asdf',
	'lodash'
	], function (chai, asdf, _){
		window.asdf = asdf;
	var should = chai.should();
	var testsObj = {
		runTests: function(args){
			'use strict';
			console.log('running tests...');
			console.dir(asdf);

		    describe('Asdf Dom properties', function () {
		        describe('creation of dom properties', function () {
		            it('create a property from an id', function () {
		            	 var temp = asdf.should.exist;
		            	asdf.Dom.should.exist;
		            	asdf.Dom.test_div_1.should.exist;
		            });
		        });
		    });
		}
	};
	return testsObj;
})