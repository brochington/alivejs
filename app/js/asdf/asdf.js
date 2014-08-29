define([
	'asdf/classes/pubsub',
	'asdf/classes/template',
	'asdf/classes/dom',
	'asdf/classes/livePropertyObject',
	'asdf/classes/liveVar',
	'asdf/classes/liveFunc',
	'asdf/classes/bindings',
	'lodash'
	], function (ps, tpl, dom, LivePropObj, b, _){
	// Main define function of asdf

	var asdf = {};

	console.log(LivePropObj);

	asdf.livePropertyObject = LivePropObj;
	asdf.Template = tpl;
	asdf.Dom = dom;
	asdf.ps = ps;
	asdf.b = b;

	return asdf;
});