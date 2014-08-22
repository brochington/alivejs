require([
	'spec',
	'vendor/chai/chai',
	'asdf/asdf',
	'vendor/mocha/mocha'
	], function (spec, chai, asdf){
	console.log('testing is here!!!');
	console.dir(mocha);
	mocha.setup('bdd');
	console.log(spec);	

	// var assert = chai.assert;
 //    var expect = chai.expect;
 //    var should = chai.should();


    spec.runTests({asdf: asdf});

    mocha.run();

});