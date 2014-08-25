require([
	'spec',
	'vendor/chai/chai',
	'asdf/asdf',
	'vendor/mocha/mocha'
	], function (spec, chai, asdf){

	mocha.setup('bdd');

    spec.runTests({asdf: asdf});

    mocha.run();
});