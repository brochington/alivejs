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

			// Setup global variables for tests
			var a = asdf.LiveVar;

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
		        			a.live('testVar1', 'Hello');
		        			a.testVar1.should.exist;
		        			a.testVar1().should.equal('Hello');
		        	});
		        });
		        describe('reassignment of value stored in live variable', function(){
		        	it('create and reassign a value in a live variable', function(){
		        		a.live('testVar2', "Hello");
		        		a.testVar2.should.exist;
		        		a.testVar2 = "there";
		        		a.testVar2().should.equal('there');
		        	});
		        });
		        describe('assignment of one liveVar to another', function () {
		        	describe('', function () {
		        		it('liveVar 3 value is set to value of liveVar 4', function () {
		        			a.live('testVar3', "test value 3");
		        			a.live('testVar4', 'test value 4');

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
		        			a.live('testVar5', "test value 5");
		        			a.live('testVar6', 'test value 6');

		        			a.testVar5 = a.testVar6;
		        			a.testVar6 = "new test value";
		        			a.testVar6().should.equal('new test value');

		        		});
		        	});
		        });
		        describe('creation of live variable that is a function', function () {
		        	describe('', function () {
		        		it('creates a live variable that is a function', function () {
		        			a.live('liveVarFunction1', function(){
		        				return 'this is the contents of the liveVarFunction1';
		        			});

		        			var tempFunc = a.liveVarFunction1();
		        			console.dir(a.liveVarFunction1);
		        			console.log(tempFunc);
		        			tempFunc().should.equal('this is the contents of the liveVarFunction1');
		        			console.log(tempFunc);
		        			// var tempVal = tempFunc();

		        			// console.log(tempVal);

		        			// tempVal.should.equal('this is the contents of the liveVarFunction1');
		        			// });
		        		});
		        	});
		        });
		    });
		}
	};
	return testsObj;
})