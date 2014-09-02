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

			// Setup global variables for tests
			var a = asdf.livePropertyObject;

		    describe('ASDF Dom properties', function () {
		        describe('creation of dom properties', function () {
		            it('create a property from an id', function () {
		            	 var temp = asdf.should.exist;
		            	asdf.Dom.should.exist;
		            	asdf.Dom.test_div_1.should.exist;
		            });
		        });
		    });

		    describe('ASDF LiveVar tests', function () {
		    	describe('creation of alive variables', function(){
		        	it('creates an alive variable', function(){
		        			a.liveVar('testVar1', 'Hello');
		        			a.testVar1.should.exist;
		        			a.testVar1().should.equal('Hello');
		        	});
		        });
		        describe('reassignment of value stored in live variable', function(){
		        	it('create and reassign a value in a live variable', function(){
		        		a.liveVar('testVar2', "Hello");
		        		a.testVar2.should.exist;
		        		a.testVar2 = "there";
		        		a.testVar2().should.equal('there');
		        	});
		        });
		        describe('assignment of one liveVar to another', function () {
		        	describe('', function () {
		        		it('liveVar 3 value is set to value of liveVar 4', function () {
		        			a.liveVar('testVar3', "test value 3");
		        			a.liveVar('testVar4', 'test value 4');

		        			a.testVar3.should.exist;
		        			a.testVar4.should.exist;

		        			a.testVar3().should.equal('test value 3');
		        			a.testVar4().should.equal('test value 4');

		        			a.testVar3 = a.testVar4;

		        		});
		        	});
		        });
		        describe('Binding of liveVars to other liveVars', function(){
		        	describe('', function () {
		        		it('value of liveVar is bound to another liveVar', function(){
		        			a.liveVar('testVar5', "test value 5");
		        			a.liveVar('testVar6', 'test value 6');

		        			a.testVar5 = a.testVar6;
							a.testVar6 = "new test value";
		        			a.testVar6().should.equal('new test value');
		        			a.testVar5().should.equal('new test value');

		        		});
		        	});
		        });
		        describe('Creating a variable that is a function', function () {
		        	describe('', function () {
		        		it('create a variable that is a function', function () {
		        			a.liveVar('testVar7', function(){
		        				return 'this is a value of testVar7';
		        			});

		        			var temp = a.testVar7();

		        			temp().should.equal('this is a value of testVar7');
		        		});
		        	});
		        });
		    });
			describe('ASDF liveFunc tests', function () {
				describe('creation of a live function', function () {
					describe('', function () {
		        		it('creates a live function', function () {
		        			a.liveFunc('liveFunction1', function(){
		        				return 'this is the contents of the liveVarFunction1';
		        			});

		        			a.liveFunction1.should.exist;
		        		});
		        	});
				});
				describe('proper return value from liveFunc', function () {
					describe('', function () {
						it('liveFunc returns proper value', function () {
							a.liveFunc('liveFunction2', function(){
								var internalValue = 1 + 2;
								console.log("running test liveVarFunction2");

								return internalValue;
							});

							a.liveFunction2().should.equal(3);
							// console.log(a.liveFunction2();
						});
					});
				});
			});
		}
	};
	return testsObj;
});