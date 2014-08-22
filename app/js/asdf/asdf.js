define([
	'asdf/classes/pubsub',
	'asdf/classes/template',
	'asdf/classes/dom',
	'asdf/classes/liveVar',
	'asdf/classes/bindings',
	'lodash'
	], function (ps, tpl, dom, LiveVar, b, _){
	// Main define function of asdf

	var asdf = {};

	asdf.LiveVar = LiveVar;
	asdf.Template = tpl;
	asdf.Dom = dom;
	asdf.ps = ps;
	asdf.b = b;

	return asdf;
});