/*
thoughts: 
	1) should rename project to 'alive', and as in a.live('varName', 'value');
*/

require([
	'asdf/asdf',
	'lodash'
	], function (asdf, _){

	window.asdf = asdf;
	var a = asdf.LiveVar,
		d = asdf.Dom,
		t = asdf.Template
		testFlag = false;

	a.live('myFirstVar', 'Hello');
	a.live('mySecondVar', 'SecondVar');
	a.live('myThird', 'third');

	// test 1

	a.myFirstVar = 'there';
	if(a.myFirstVar() == 'there' && testFlag){
		console.log('test 1 pass');
	}else{
		console.log('test 1 fail');
	};

	// test 2

	a.myFirstVar = 'update in test 2';
	a.mySecondVar = a.myFirstVar;
	a.myFirstVar = 'update in test again';

	if(testFlag && a.mySecondVar() == 'update in test again'){
		console.log('test 2 pass');
	}else{
		console.log('test 2 fail');
	}

	// test 3

	var test3Function = function(text){
		// console.log('test 3 print: ' + text);
		return 'test 3 return: ' + text;
	};

	a.live('testFunction', test3Function, {myarg1: 'starting value'});

	if(testFlag && a.testFunction() == 'test 3 return: starting value'){
		console.log('test 3 pass');
	}else{
		console.log('test 3 fail');
		console.log(a.testFunction());
	};

	// test 4 

	var testFunction4 = function(arg1, arg2){
		return arg1 + arg2;
	};

	a.live('testFuncFour', testFunction4, {arg1: 10, arg2: 20});

	if(testFlag && a.testFuncFour() == 30){
		console.log('test 4 pass');
	} else{
		console.log('test 4 fail');
		a.testFuncFour();
	};

	// test 5

	a.myFirstVar = 'first';
	a.mySecondVar = 'second';

	console.log(a.mySecondVar.asdfType);

	a.live('testFuncWithInternalLiveVars', function (stuff){
		console.log('run testFuncWithInternalLiveVars');

		return a.myFirstVar() + ' ' + a.mySecondVar();

	}, {arg1: 'detect liveVars in args...'});

	if(testFlag && a.testFuncWithInternalLiveVars() == 'first second'){
		console.log('test 5 pass');
	} else {
		console.log('test 5 fail');
		console.log(a.testFuncWithInternalLiveVars());
	}

	// test 6

	a.mySecondVar = 'change';

	console.log(a.testFuncWithInternalLiveVars());

	if(testFlag && a.testFuncWithInternalLiveVars() == 'first change'){
		console.log('test 6 pass');
	} else {
		console.log('test 6 fail');
		console.log(a.testFuncWithInternalLiveVars());
	};
	
	// template tests

	// d.content_list.render(t.line_item, {mykey: 'Brochington', myvalue: 'Stilley'});

	a.live('contentListArr', [
		{first: 'Broch', last: 'Stilley'},
		{first: 'Elmo', last: 'Dude'},
		{first: 'Brad', last: 'Howard'}
	]);

	// d.content_list.render(t.line_item, a.contentListArr);

	// d.content_list.render({
	// 	template: t.line_item, // this should be a liveVar too, able to be changed.
	// 	foreach: a.contentListArr
	// });	

	


// loop test

});

