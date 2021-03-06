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
			var a = asdf.livePropertyObject,
				d = asdf.Dom,
				t = asdf.Template;

			//test classes
			function List(data){
				var self = this;

				this.someClass = data.someClass;
				this.moreClasses = data.moreClasses;
				this.testText = data.testText;
				this.testTextAgain = data.testTextAgain;
				this.something = 'something something.';
				this.named = 'Brochington';

				this.listItems = [];
				if(data.listItems){
					data.listItems.forEach(function (v, i, arr){
						self.listItems.push(new ListItem(v));
					});					
				}

			};

			function ListItem(data){
				var self = this;

				this.text = data.text || null;
				this.btnText = data.btnText;
			};

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

								return internalValue;
							});

							a.liveFunction2().should.equal(3);
							// console.log(a.liveFunction2();
						});
					});
				});
				describe('trigger get of liveVars within liveFunc', function () {
					describe('', function () {
						it('liveFunc creation triggers get of liveVars', function () {

							a.liveVar('testVar8', 1);
							a.liveVar('testVar9', 2);

							a.liveFunc('liveFunction3', function(){
								return a.testVar8() + a.testVar9();
							});

							a.testVar9 = 20;
							a.liveFunction3().should.equal(21);
						});
					});
				});
			});
			describe('framework structure experiments', function () {
				describe('stuff', function () {
					it('more stuff', function(){
						var listData = {
							someClass: ['my-first-class', 'my-second-class'],
							moreClasses: ['another-class'],
							testText: 'This is my first test text',
							testTextAgain: 'This yet some more test text',
							listItems: [{
								text: 'this is some text',
								btnName: "button 1",
								btnText: "button 1"
							},{
								text: 'here is some more text',
								btnName: "button 2",
								btnText: "button 2"
							}]
						};

						// var moreListitems = [{
						// 	text: 'broch',
						// 	btnText: 'Broch'	
						// }];

						var listData2 = {
							testText: 'test Text 2',
							testTextAgain: 'testTextAgain 2',
							someClass: ['some-class-man'],
							moreClasses: ['broccoli', 'hotness']
						}

						// creation of a.list and a.list_2
						a.liveVar('list', new List(listData));
						a.liveVar('list_2', new List(listData2));

						d.list = {
							template: t.t_list_here,
							data: a.list,
							each: {
								insert: d.list_items,
							}
						};

						d.list_2 = {
							template: t.t_list_here,
							data: a.list_2
						};

						// each can be either a single object, or and array
						// of object if there are more than one each loop.

						d.list_items = {
							template: t.t_list_item,
							parentData: 'listItems'
							// sending a click event to btnClick binding
							// the d.list_item_btn.click is scoped to d.list_items.
							// btnClick: d.list_item_btn.click 
						};

						// a.list.listItems = moreListitems;
					});
				});
			});
		}
	};
	return testsObj;
});